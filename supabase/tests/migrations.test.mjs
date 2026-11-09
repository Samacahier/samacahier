// Rejoue toutes les migrations sur PGlite (stub du schéma auth/storage de
// Supabase), puis vérifie admin_kpis() et ajuster_stock_quantite().
import { PGlite } from "@electric-sql/pglite";
import { pgcrypto } from "@electric-sql/pglite/contrib/pgcrypto";
import fs from "node:fs";
import path from "node:path";

const dir = process.argv[2];
const db = new PGlite({ extensions: { pgcrypto } });

await db.exec(`
  create role anon nologin; create role authenticated nologin; create role service_role nologin;
  create schema auth; create schema storage;
  create table auth.users (id uuid primary key, email text, raw_user_meta_data jsonb default '{}'::jsonb, created_at timestamptz default now());
  create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('test.uid', true), '')::uuid $$;
  grant usage on schema auth to authenticated, anon;
  grant execute on function auth.uid() to authenticated, anon;
  create table storage.buckets (id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
  create table storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text, owner uuid);
  alter table storage.objects enable row level security;
  create function storage.foldername(name text) returns text[] language sql immutable as $$ select string_to_array(name, '/') $$;
`);

const fichiers = fs.readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();
for (const f of fichiers) {
  try {
    await db.exec(fs.readFileSync(path.join(dir, f), "utf8"));
  } catch (e) {
    console.error(`ÉCHEC migration ${f}: ${e.message}`);
    process.exit(1);
  }
}
console.log(`OK ${fichiers.length} migrations appliquées`);

let echecs = 0;
const verifier = (nom, obtenu, attendu) => {
  const ok = JSON.stringify(obtenu) === JSON.stringify(attendu);
  if (!ok) echecs++;
  console.log(`${ok ? "OK " : "KO "} ${nom}: obtenu=${JSON.stringify(obtenu)} attendu=${JSON.stringify(attendu)}`);
};

// --- Données : 1 admin + 1500 commerçants (> limite de 1000 de l'API) ---
const ADMIN = "00000000-0000-0000-0000-000000000001";
await db.exec(`
  insert into auth.users (id, email) values ('${ADMIN}', 'admin@test');
  insert into auth.users (id, email)
    select ('10000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid, 'c' || i || '@test'
    from generate_series(1, 1500) i;
`);
await db.exec(`
  insert into public.profiles (id, role, nom) values ('${ADMIN}', 'admin', 'Admin')
    on conflict (id) do update set role = 'admin';
  delete from public.commercants where id = '${ADMIN}';
`);
const nbCommercants = (await db.query(`select count(*)::int n from public.commercants`)).rows[0].n;
if (nbCommercants !== 1500) {
  // Le trigger handle_new_user n'a pas créé les commerçants : on les insère.
  await db.exec(`
    insert into public.commercants (id, nom_commerce)
      select id, 'Boutique ' || email from auth.users where id <> '${ADMIN}'
      on conflict do nothing;
  `);
}
// Inscriptions : 20 récents (3 jours), le reste il y a 60 jours.
// 1200 actifs, 300 désactivés. 1100 commerçants ont une vente il y a 2 jours
// (1 vente de 1000 FCFA chacun, + 400 ventes supplémentaires pour dépasser
// 1000 lignes) ; les 400 autres n'ont aucune activité → inactifs sauf les 20
// récents s'ils en font partie.
await db.exec(`
  with c as (select id, row_number() over (order by id) rn from public.commercants)
  update public.commercants m set
    created_at = case when c.rn <= 20 then now() - interval '3 days' else now() - interval '60 days' end,
    actif = c.rn <= 1200
  from c where c.id = m.id;

  with c as (select id, row_number() over (order by id) rn from public.commercants)
  insert into public.ventes (commercant_id, description, montant_total, prix_unitaire, date_vente, created_at)
    select id, 'v', 1000, 1000, current_date, now() - interval '2 days' from c where rn between 401 and 1500
    union all
    select id, 'v2', 500, 500, current_date, now() - interval '2 days' from c where rn between 401 and 800;
`);

// --- admin_kpis() en tant qu'admin ---
await db.exec(`set role authenticated; select set_config('test.uid', '${ADMIN}', false);`);
const k = (await db.query(`select public.admin_kpis() k`)).rows[0].k;
verifier("total_commercants", k.total_commercants, 1500);
verifier("commercants_actifs", k.commercants_actifs, 1200);
verifier("ca_cumule_mois", Number(k.ca_cumule_mois), 1100 * 1000 + 400 * 500);
verifier("nouveaux_inscrits_7j", k.nouveaux_inscrits_7j, 20);
// Sans activité : rn 1..400 ; parmi eux rn 1..20 inscrits il y a 3 jours.
verifier("inactifs_14j", k.inactifs_14j, 380);
verifier("inscriptions_par_jour (30 jours)", k.inscriptions_par_jour.length, 30);
verifier(
  "inscriptions il y a 3 jours",
  k.inscriptions_par_jour.reduce((s, j) => s + j.count, 0),
  20,
);

// --- admin_kpis() refusé à un commerçant ---
const C1 = "10000000-0000-0000-0000-000000000001";
const C2 = "10000000-0000-0000-0000-000000000002";
await db.exec(`select set_config('test.uid', '${C1}', false);`);
try {
  await db.query(`select public.admin_kpis()`);
  verifier("admin_kpis refusé au commerçant", "autorisé", "refusé");
} catch {
  verifier("admin_kpis refusé au commerçant", "refusé", "refusé");
}

// --- ajuster_stock_quantite ---
await db.exec(`reset role;`);
const pid = (
  await db.query(
    `insert into public.stocks (commercant_id, nom_article, quantite) values ('${C1}', 'Riz', 10) returning id`,
  )
).rows[0].id;
await db.exec(`set role authenticated; select set_config('test.uid', '${C1}', false);`);
await db.query(`select public.ajuster_stock_quantite($1, -3)`, [pid]);
await db.query(`select public.ajuster_stock_quantite($1, -2.5)`, [pid]);
let q = (await db.query(`select quantite from public.stocks where id = $1`, [pid])).rows[0].quantite;
verifier("stock après -3 et -2.5", Number(q), 4.5);

// Un autre commerçant ne peut pas modifier ce stock (RLS).
await db.exec(`select set_config('test.uid', '${C2}', false);`);
await db.query(`select public.ajuster_stock_quantite($1, -100)`, [pid]);
await db.exec(`reset role;`);
q = (await db.query(`select quantite from public.stocks where id = $1`, [pid])).rows[0].quantite;
verifier("stock protégé contre un autre commerçant", Number(q), 4.5);

// anon ne peut pas exécuter les fonctions.
await db.exec(`set role anon;`);
try {
  await db.query(`select public.ajuster_stock_quantite($1, -1)`, [pid]);
  verifier("anon bloqué", "autorisé", "refusé");
} catch {
  verifier("anon bloqué", "refusé", "refusé");
}

await db.exec(`reset role;`);

// --- Codes produit : chaque commerçant a sa propre numérotation ---------
// (erreur signalée en prod : duplicate key "stocks_code_produit_key")
await db.exec(`set role authenticated; select set_config('test.uid', '${C2}', false);`);
await db.query(`insert into public.stocks (commercant_id, nom_article) values ('${C2}', 'Assiette')`);
await db.query(`insert into public.stocks (commercant_id, nom_article) values ('${C2}', 'Verre')`);
await db.exec(`select set_config('test.uid', '${C1}', false);`);
await db.query(`insert into public.stocks (commercant_id, nom_article) values ('${C1}', 'Sucre')`);
await db.exec(`reset role;`);
const codes = (
  await db.query(
    `select commercant_id, code_produit from public.stocks where commercant_id in ('${C1}', '${C2}') order by commercant_id, code_produit`,
  )
).rows.map((r) => `${r.commercant_id.slice(-1)}:${r.code_produit}`);
verifier("codes produit par commerçant", codes, ["1:PRD001", "1:PRD002", "2:PRD001", "2:PRD002"]);

// --- Après PRD999 : PRD1000 (et non PRD100 tronqué → doublon) ---------
// Reproduit le cas réel de "House of Rahma Vaisselles" (PRD100 + PRD999).
await db.query(`insert into public.stocks (commercant_id, nom_article, code_produit) values ('${C2}', 'A', 'PRD100'), ('${C2}', 'B', 'PRD999')`);
await db.exec(`set role authenticated; select set_config('test.uid', '${C2}', false);`);
let nouveauCode;
try {
  nouveauCode = (
    await db.query(`insert into public.stocks (commercant_id, nom_article) values ('${C2}', 'Plat') returning code_produit`)
  ).rows[0].code_produit;
} catch (e) {
  nouveauCode = `ERREUR: ${e.message}`;
}
verifier("code après PRD999", nouveauCode, "PRD1000");
const suivant = (
  await db.query(`insert into public.stocks (commercant_id, nom_article) values ('${C2}', 'Bol') returning code_produit`)
).rows[0].code_produit;
verifier("code suivant", suivant, "PRD1001");
await db.exec(`reset role;`);

// --- Policies réécrites avec (select auth.uid()) ------------------------
const nonOptimisees = (
  await db.query(`select count(*)::int n from pg_policies where schemaname = 'public'
    and (coalesce(qual,'') ~ '[^t] ?auth\\.uid\\(\\)' and coalesce(qual,'') !~* 'select auth\\.uid')`)
).rows[0].n;
verifier("policies RLS optimisées", nonOptimisees, 0);

// --- Escalade de privilèges (audit 2026-11-08) ---------------------------
// 1) Inscription avec { role: 'admin' } dans les métadonnées → commerçant.
const PIRATE = "20000000-0000-0000-0000-000000000001";
await db.query(
  `insert into auth.users (id, email, raw_user_meta_data) values ($1, 'pirate@test', '{"role":"admin","nom_commerce":"Pirate"}'::jsonb)`,
  [PIRATE],
);
const rolePirate = (await db.query(`select role from public.profiles where id = $1`, [PIRATE])).rows[0].role;
verifier("inscription role=admin → commercant", rolePirate, "commercant");
const commercePirate = (await db.query(`select count(*)::int n from public.commercants where id = $1`, [PIRATE])).rows[0].n;
verifier("inscription crée bien la ligne commercants", commercePirate, 1);

// 2) Un commerçant ne peut pas se promouvoir admin.
const tenter = async (sql, params = []) => {
  try { await db.query(sql, params); return "autorisé"; } catch { return "refusé"; }
};
await db.exec(`set role authenticated; select set_config('test.uid', '${C1}', false);`);
verifier("commerçant → role admin sur son profil", await tenter(`update public.profiles set role = 'admin' where id = '${C1}'`), "refusé");
verifier("commerçant modifie son nom de profil", await tenter(`update public.profiles set nom = 'Awa' where id = '${C1}'`), "autorisé");
verifier("is_admin() reste faux", (await db.query(`select public.is_admin() a`)).rows[0].a, false);

// 3) Un commerçant ne peut pas changer son propre statut actif.
verifier("commerçant → actif sur sa fiche", await tenter(`update public.commercants set actif = not actif where id = '${C1}'`), "refusé");
verifier("commerçant modifie le nom de son commerce", await tenter(`update public.commercants set nom_commerce = 'Boutique Awa' where id = '${C1}'`), "autorisé");

// L'admin garde la main sur les deux.
await db.exec(`select set_config('test.uid', '${ADMIN}', false);`);
verifier("admin désactive un commerçant", await tenter(`update public.commercants set actif = false where id = '${C1}'`), "autorisé");
verifier("admin réactive un commerçant", await tenter(`update public.commercants set actif = true where id = '${C1}'`), "autorisé");
await db.exec(`reset role;`);

// --- Mode maintenance ---------------------------------------------------
await db.exec(`set role anon;`);
const lectureAnon = (await db.query(`select maintenance_active from public.parametres_plateforme`)).rows;
verifier("maintenance lisible par anon", lectureAnon, [{ maintenance_active: false }]);

await db.exec(`set role authenticated; select set_config('test.uid', '${C1}', false);`);
await db.query(`update public.parametres_plateforme set maintenance_active = true where id = 1`);
await db.exec(`reset role;`);
let etat = (await db.query(`select maintenance_active from public.parametres_plateforme`)).rows[0];
verifier("commerçant ne peut pas activer la maintenance", etat.maintenance_active, false);

await db.exec(`set role authenticated; select set_config('test.uid', '${ADMIN}', false);`);
await db.query(`update public.parametres_plateforme set maintenance_active = true, maintenance_message = 'MAJ' where id = 1`);
await db.exec(`reset role;`);
etat = (await db.query(`select maintenance_active from public.parametres_plateforme`)).rows[0];
verifier("admin active la maintenance", etat.maintenance_active, true);

// --- Rapports admin agrégés ---------------------------------------------
await db.exec(`set role authenticated; select set_config('test.uid', '${ADMIN}', false);`);
const parMois = (await db.query(`select mois, ca from public.admin_ca_par_mois(6)`)).rows;
verifier("admin_ca_par_mois : 6 mois", parMois.length, 6);
verifier("admin_ca_par_mois : CA du mois en cours", Number(parMois[5].ca), 1300000);
const parCommercant = (
  await db.query(`select count(*)::int n, sum(ca)::int ca, sum(nombre_ventes)::int nb
    from public.admin_ca_par_commercant(date_trunc('month', current_date)::date, (date_trunc('month', current_date) + interval '1 month')::date)`)
).rows[0];
verifier("admin_ca_par_commercant : tous", parCommercant, { n: 1100, ca: 1300000, nb: 1500 });
const unSeul = (
  await db.query(
    `select ca, nombre_ventes from public.admin_ca_par_commercant(date_trunc('month', current_date)::date, (date_trunc('month', current_date) + interval '1 month')::date, array['10000000-0000-0000-0000-000000000500']::uuid[])`,
  )
).rows.map((r) => [Number(r.ca), Number(r.nombre_ventes)]);
verifier("admin_ca_par_commercant : filtre", unSeul, [[1500, 2]]);

await db.exec(`select set_config('test.uid', '${C1}', false);`);
try {
  await db.query(`select * from public.admin_ca_par_mois(6)`);
  verifier("rapports admin refusés au commerçant", "autorisé", "refusé");
} catch {
  verifier("rapports admin refusés au commerçant", "refusé", "refusé");
}
await db.exec(`reset role;`);

console.log(echecs === 0 ? "\nTOUS LES TESTS PASSENT" : `\n${echecs} TEST(S) EN ÉCHEC`);
process.exit(echecs === 0 ? 0 : 1);
