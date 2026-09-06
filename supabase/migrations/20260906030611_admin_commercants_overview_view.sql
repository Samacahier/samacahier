-- Pagination serveur pour /admin/dashboard (page "Commerçants") : le tri par
-- CA ou par dernière activité porte sur des valeurs calculées (pas des
-- colonnes de commercants), ce qui empêchait un ORDER BY + LIMIT/OFFSET SQL
-- direct. Cette vue précalcule ces valeurs par commerçant, pour permettre un
-- filtrage/tri/pagination entièrement côté base de données.
--
-- security_invoker = true : la vue applique les policies RLS de l'appelant
-- sur les tables sous-jacentes (commercants/ventes/caisse/depenses), pas
-- celles du propriétaire de la vue — un admin (is_admin()) voit toutes les
-- lignes, un commerçant ne verrait (en théorie) que la sienne.
create or replace view public.admin_commercants_overview
with (security_invoker = true) as
select
  c.id,
  c.nom_commerce,
  c.adresse,
  c.telephone,
  c.created_at,
  c.logo_url,
  c.activite,
  c.ninea,
  c.rccm,
  c.telephone_pro,
  c.email_pro,
  c.ville_region,
  c.devise,
  c.solde_initial_caisse,
  c.solde_initial_poche,
  c.actif,
  coalesce(ca_mois.montant, 0) as chiffre_affaires,
  c.solde_initial_caisse + coalesce(mvt.solde_caisse, 0)
    + c.solde_initial_poche + coalesce(mvt.solde_poche, 0) as solde_caisse,
  greatest(act.derniere_vente, act.derniere_depense, act.derniere_caisse) as derniere_activite
from public.commercants c
left join lateral (
  select sum(v.montant_total) as montant
  from public.ventes v
  where v.commercant_id = c.id
    and v.date_vente >= date_trunc('month', current_date)::date
    and v.date_vente < (date_trunc('month', current_date) + interval '1 month')::date
) ca_mois on true
left join lateral (
  select
    sum(case when m.type_poche = 'caisse'
      then (case when m.type_mouvement = 'entree' then m.montant else -m.montant end)
      else 0 end) as solde_caisse,
    sum(case when m.type_poche = 'poche'
      then (case when m.type_mouvement = 'entree' then m.montant else -m.montant end)
      else 0 end) as solde_poche
  from public.caisse m
  where m.commercant_id = c.id
) mvt on true
left join lateral (
  select
    (select max(created_at) from public.ventes where commercant_id = c.id) as derniere_vente,
    (select max(created_at) from public.depenses where commercant_id = c.id) as derniere_depense,
    (select max(created_at) from public.caisse where commercant_id = c.id) as derniere_caisse
) act on true;

grant select on public.admin_commercants_overview to authenticated;
