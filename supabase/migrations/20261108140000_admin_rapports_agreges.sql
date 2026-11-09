-- Rapports admin agrégés en SQL.
--
-- Les pages /admin/rapports chargeaient toutes les ventes de la plateforme
-- (6 mois, ou le mois en cours) pour les additionner dans Next.js : résultat
-- tronqué à 1000 lignes par l'API Supabase, et transfert inutile de milliers
-- de lignes. Ces fonctions renvoient directement les totaux.

-- CA de la plateforme par mois (mois en cours inclus), du plus ancien au
-- plus récent. Mois sans vente → 0.
create or replace function public.admin_ca_par_mois(p_nombre_mois int default 6)
returns table (mois text, ca numeric)
language plpgsql
stable
security invoker
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Accès réservé aux administrateurs' using errcode = '42501';
  end if;

  return query
  with mois as (
    select generate_series(
      date_trunc('month', current_date) - make_interval(months => p_nombre_mois - 1),
      date_trunc('month', current_date),
      interval '1 month'
    )::date as debut
  )
  select to_char(m.debut, 'YYYY-MM'), coalesce(sum(v.montant_total), 0)
  from mois m
  left join public.ventes v
    on v.date_vente >= m.debut
   and v.date_vente < (m.debut + interval '1 month')::date
  group by m.debut
  order by m.debut;
end;
$$;

-- CA et nombre de ventes par commerçant sur [p_debut, p_fin), pour une
-- liste de commerçants (page affichée) ou tous si p_commercant_ids est null.
create or replace function public.admin_ca_par_commercant(
  p_debut date,
  p_fin date,
  p_commercant_ids uuid[] default null
)
returns table (commercant_id uuid, ca numeric, nombre_ventes bigint)
language plpgsql
stable
security invoker
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Accès réservé aux administrateurs' using errcode = '42501';
  end if;

  return query
  select v.commercant_id, sum(v.montant_total), count(*)
  from public.ventes v
  where v.date_vente >= p_debut
    and v.date_vente < p_fin
    and (p_commercant_ids is null or v.commercant_id = any (p_commercant_ids))
  group by v.commercant_id;
end;
$$;

revoke execute on function public.admin_ca_par_mois(int) from public, anon;
grant execute on function public.admin_ca_par_mois(int) to authenticated;
revoke execute on function public.admin_ca_par_commercant(date, date, uuid[]) from public, anon;
grant execute on function public.admin_ca_par_commercant(date, date, uuid[]) to authenticated;

-- Index pour les filtres par date (rapports, KPIs du mois) et pour les
-- listes paginées triées par date de chaque commerçant.
create index if not exists ventes_date_vente_idx on public.ventes (date_vente);
create index if not exists ventes_commercant_date_idx on public.ventes (commercant_id, date_vente desc);
create index if not exists depenses_commercant_date_idx on public.depenses (commercant_id, date_depense desc);
create index if not exists caisse_commercant_date_idx on public.caisse (commercant_id, date_mouvement desc);
