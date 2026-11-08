-- 1) KPIs de la Vue d'ensemble admin calculés en SQL.
--
-- Bug corrigé : "Commerçants actifs" plafonnait à 1000. La page chargeait
-- toutes les lignes de commercants / ventes / caisse / depenses côté Next.js,
-- or PostgREST (API Supabase) ne renvoie jamais plus de 1000 lignes par
-- requête (max_rows). Tous les indicateurs étaient donc tronqués : nombre de
-- commerçants, CA du mois (somme de 1000 ventes max), nouveaux inscrits, et
-- "Inactifs (14j)" — surestimé, car la dernière activité n'était connue que
-- pour les auteurs des 1000 opérations les plus récentes de la plateforme.
--
-- Une seule fonction renvoie tous les compteurs, agrégés par Postgres.
-- security invoker : les policies RLS de l'appelant s'appliquent (un admin
-- voit tout via is_admin()) ; le contrôle explicite ci-dessous refuse en plus
-- tout appel non-admin.
create or replace function public.admin_kpis()
returns json
language plpgsql
stable
security invoker
set search_path = public
as $$
declare
  resultat json;
begin
  if not public.is_admin() then
    raise exception 'Accès réservé aux administrateurs' using errcode = '42501';
  end if;

  with
  derniere_activite as (
    select commercant_id, max(created_at) as derniere
    from (
      select commercant_id, max(created_at) as created_at from public.ventes group by commercant_id
      union all
      select commercant_id, max(created_at) from public.depenses group by commercant_id
      union all
      select commercant_id, max(created_at) from public.caisse group by commercant_id
    ) t
    group by commercant_id
  ),
  jours as (
    select generate_series(
      (now() at time zone 'utc')::date - 29,
      (now() at time zone 'utc')::date,
      interval '1 day'
    )::date as jour
  )
  select json_build_object(
    'total_commercants', (select count(*) from public.commercants),
    'commercants_actifs', (select count(*) from public.commercants where actif),
    'ca_cumule_mois', (
      select coalesce(sum(montant_total), 0)
      from public.ventes
      where date_vente >= date_trunc('month', current_date)::date
        and date_vente < (date_trunc('month', current_date) + interval '1 month')::date
    ),
    'nouveaux_inscrits_7j', (
      select count(*) from public.commercants where created_at >= now() - interval '7 days'
    ),
    'inactifs_14j', (
      select count(*)
      from public.commercants c
      left join derniere_activite d on d.commercant_id = c.id
      where coalesce(d.derniere, c.created_at) < now() - interval '14 days'
    ),
    'inscriptions_par_jour', (
      select json_agg(json_build_object('date', j.jour, 'count', coalesce(n.nb, 0)) order by j.jour)
      from jours j
      left join (
        select (created_at at time zone 'utc')::date as jour, count(*) as nb
        from public.commercants
        where created_at >= now() - interval '31 days'
        group by 1
      ) n on n.jour = j.jour
    )
  )
  into resultat;

  return resultat;
end;
$$;

revoke execute on function public.admin_kpis() from public, anon;
grant execute on function public.admin_kpis() to authenticated;

-- 2) Ajustement atomique du stock lors d'une vente.
--
-- Bug corrigé : "parfois problème sur les stocks". Le code lisait la
-- quantité puis écrivait (quantité lue + delta) en deux requêtes séparées :
-- deux ventes simultanées du même produit (double-clic, deux vendeurs,
-- requête renvoyée par un réseau lent) lisaient la même valeur et l'une des
-- deux déductions était perdue. Ici l'opération se fait en une seule
-- instruction UPDATE, verrouillée ligne par ligne par Postgres.
--
-- security invoker : la policy RLS stocks_update s'applique (un commerçant
-- ne peut ajuster que ses propres produits).
create or replace function public.ajuster_stock_quantite(p_produit_id uuid, p_delta numeric)
returns void
language sql
security invoker
set search_path = public
as $$
  update public.stocks
     set quantite = quantite + p_delta,
         updated_at = now()
   where id = p_produit_id;
$$;

revoke execute on function public.ajuster_stock_quantite(uuid, numeric) from public, anon;
grant execute on function public.ajuster_stock_quantite(uuid, numeric) to authenticated;
