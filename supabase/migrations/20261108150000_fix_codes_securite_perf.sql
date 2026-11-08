-- 1) Bug "duplicate key value violates unique constraint stocks_code_produit_key"
--
-- Cause confirmée en production (4 commerçants bloqués, 30 autres au-delà
-- de PRD900) : lpad(texte, 3, '0') TRONQUE un texte plus long que 3
-- caractères. Après PRD999, le numéro 1000 devenait '100' → PRD100, déjà
-- existant → toute création de produit échouait définitivement.
-- Même défaut latent sur code_vente (VTE, 5 chiffres) au-delà de 99999.
--
-- Correctif : on ne complète avec des zéros que si le nombre est plus court
-- que la largeur minimale (PRD001 … PRD999, puis PRD1000, PRD1001 …).
-- Le calcul du MAX reste correct : PRD100 vaut 100, PRD1000 vaut 1000.
-- Ajout de search_path fixe (alerte sécurité Supabase 0011).

create or replace function public.set_stock_code_produit()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  prochain_numero int;
begin
  if new.code_produit is null then
    perform pg_advisory_xact_lock(hashtextextended('stocks_code_produit:' || new.commercant_id::text, 0));

    select coalesce(max(substring(code_produit from '\d+$')::int), 0) + 1
      into prochain_numero
      from public.stocks
      where commercant_id = new.commercant_id;

    new.code_produit := 'PRD' || lpad(prochain_numero::text, greatest(3, length(prochain_numero::text)), '0');
  end if;
  return new;
end;
$$;

create or replace function public.set_vente_code_vente()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  prochain_numero int;
begin
  if new.code_vente is null then
    perform pg_advisory_xact_lock(hashtextextended('ventes_code_vente:' || new.commercant_id::text, 0));

    select coalesce(max(substring(code_vente from '\d+$')::int), 0) + 1
      into prochain_numero
      from public.ventes
      where commercant_id = new.commercant_id;

    new.code_vente := 'VTE' || lpad(prochain_numero::text, greatest(5, length(prochain_numero::text)), '0');
  end if;
  return new;
end;
$$;

-- 2) Sécurité (alertes Supabase 0028/0029) : handle_new_user est une
-- fonction de trigger SECURITY DEFINER exposée en RPC à anon/authenticated.
-- Un trigger n'a pas besoin de ce droit pour s'exécuter : on le retire.
-- (is_admin() reste exécutable : les policies RLS l'appellent.)
revoke execute on function public.handle_new_user() from public, anon, authenticated;

do $$
begin
  -- rls_auto_enable() existe en production (créée hors migrations) : même
  -- traitement, seulement si elle est présente.
  if to_regprocedure('public.rls_auto_enable()') is not null then
    execute 'revoke execute on function public.rls_auto_enable() from public, anon, authenticated';
  end if;
end;
$$;

-- 3) Performance RLS (alerte Supabase 0003, 34 policies) : auth.uid() et
-- is_admin() étaient réévalués pour CHAQUE ligne. Encapsulés dans un
-- (select …), Postgres les évalue une seule fois par requête. Réécriture
-- automatique de toutes les policies du schéma public, sans en changer le
-- sens.
do $$
declare
  p record;
  nouvelle_qual text;
  nouveau_check text;
  sql text;
begin
  for p in
    select schemaname, tablename, policyname, qual, with_check
    from pg_policies
    where schemaname = 'public'
      and (coalesce(qual, '') ~ '(auth\.uid\(\)|is_admin\(\))'
        or coalesce(with_check, '') ~ '(auth\.uid\(\)|is_admin\(\))')
  loop
    nouvelle_qual := p.qual;
    nouveau_check := p.with_check;

    -- Déjà optimisée : ne pas encapsuler deux fois.
    if coalesce(nouvelle_qual, '') ~* '\(\s*select\s+(auth\.uid|is_admin|public\.is_admin)'
       or coalesce(nouveau_check, '') ~* '\(\s*select\s+(auth\.uid|is_admin|public\.is_admin)' then
      continue;
    end if;

    nouvelle_qual := regexp_replace(nouvelle_qual, '(public\.)?is_admin\(\)', '(select public.is_admin())', 'g');
    nouvelle_qual := replace(nouvelle_qual, 'auth.uid()', '(select auth.uid())');
    nouveau_check := regexp_replace(nouveau_check, '(public\.)?is_admin\(\)', '(select public.is_admin())', 'g');
    nouveau_check := replace(nouveau_check, 'auth.uid()', '(select auth.uid())');

    sql := format('alter policy %I on %I.%I', p.policyname, p.schemaname, p.tablename);
    if nouvelle_qual is not null then
      sql := sql || format(' using (%s)', nouvelle_qual);
    end if;
    if nouveau_check is not null then
      sql := sql || format(' with check (%s)', nouveau_check);
    end if;
    execute sql;
  end loop;
end;
$$;

-- 4) Performance : index sur les clés étrangères non indexées (alerte 0001).
create index if not exists admin_logs_admin_id_idx on public.admin_logs (admin_id);
create index if not exists admin_logs_commercant_id_idx on public.admin_logs (commercant_id);
create index if not exists creances_client_id_idx on public.creances (client_id);
create index if not exists depenses_fournisseur_id_idx on public.depenses (fournisseur_id);
create index if not exists stocks_fournisseur_id_idx on public.stocks (fournisseur_id);
create index if not exists ventes_client_id_idx on public.ventes (client_id);
create index if not exists ventes_produit_id_idx on public.ventes (produit_id);
