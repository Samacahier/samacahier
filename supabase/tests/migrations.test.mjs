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
} catch (e) {
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

console.log(echecs === 0 ? "\nTOUS LES TESTS PASSENT" : `\n${echecs} TEST(S) EN ÉCHEC`);
process.exit(echecs === 0 ? 0 : 1);
