-- Correctifs des failles moyennes/faibles de l'audit de sécurité (2026-11-08).

-- 1) Liens caisse / créances liés au BON commerçant.
--
-- caisse.vente_id, caisse.depense_id et creances.vente_id pointaient vers
-- ventes(id) / depenses(id) sans vérifier que la vente appartient au même
-- commerçant. Un commerçant pouvait donc créer une ligne liée à la vente
-- d'un autre (les contraintes d'intégrité ignorent la RLS) et occuper son
-- « emplacement » UNIQUE : l'entrée de caisse ou la créance de la victime
-- n'était alors jamais créée, sans erreur visible.
-- → Clés étrangères composites (vente_id, commercant_id) → ventes(id,
--   commercant_id) : le lien n'est accepté que vers une vente du même
--   commerçant. (Vérifié avant migration : aucun lien croisé en production.)
--   Une colonne de lien NULL (mouvement manuel) n'est pas contrainte.

alter table public.ventes
  add constraint ventes_id_commercant_key unique (id, commercant_id);
alter table public.depenses
  add constraint depenses_id_commercant_key unique (id, commercant_id);

alter table public.caisse
  drop constraint caisse_vente_id_fkey,
  drop constraint caisse_depense_id_fkey,
  add constraint caisse_vente_meme_commercant_fkey
    foreign key (vente_id, commercant_id) references public.ventes (id, commercant_id) on delete cascade,
  add constraint caisse_depense_meme_commercant_fkey
    foreign key (depense_id, commercant_id) references public.depenses (id, commercant_id) on delete cascade;

alter table public.creances
  drop constraint creances_vente_id_fkey,
  add constraint creances_vente_meme_commercant_fkey
    foreign key (vente_id, commercant_id) references public.ventes (id, commercant_id) on delete cascade;

-- 2) Notification admin « nouveau commerçant » : un seul envoi par compte.
--
-- L'action serveur notifierAdminNouveauCommercant était appelable sans
-- authentification, en boucle, avec un nom de commerce arbitraire (HTML
-- injecté dans l'email admin, inondation des boîtes admin et du quota
-- Resend). Désormais elle « réserve » l'envoi par cette fonction : au plus
-- une fois par compte, uniquement dans les 30 minutes après sa création, et
-- elle renvoie le nom/activité STOCKÉS (jamais ceux fournis par l'appelant).
-- Les comptes existants sont marqués comme déjà notifiés.

alter table public.commercants
  add column admin_notifie boolean not null default true;
alter table public.commercants
  alter column admin_notifie set default false;

create or replace function public.reserver_notification_inscription(p_id uuid)
returns table (nom_commerce text, activite text)
language sql
security definer
set search_path = public
as $$
  update public.commercants c
     set admin_notifie = true
   where c.id = p_id
     and not c.admin_notifie
     and c.created_at > now() - interval '30 minutes'
  returning c.nom_commerce, c.activite;
$$;

revoke execute on function public.reserver_notification_inscription(uuid) from public, anon, authenticated;
grant execute on function public.reserver_notification_inscription(uuid) to service_role;

-- Les colonnes de cycle de vie d'une fiche commerçant ne sont modifiables
-- que par un admin (ou SQL direct / service_role) : actif (déjà protégé),
-- admin_notifie et created_at (sinon un commerçant pourrait se « rajeunir »
-- et redéclencher la notification).
create or replace function public.proteger_actif_commercant()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if current_user in ('anon', 'authenticated')
     and not public.is_admin()
     and (new.actif is distinct from old.actif
          or new.admin_notifie is distinct from old.admin_notifie
          or new.created_at is distinct from old.created_at) then
    raise exception 'Ces informations du compte ne peuvent être modifiées que par un administrateur'
      using errcode = '42501';
  end if;
  return new;
end;
$$;

-- 3) Comptes désactivés : blocage côté serveur.
--
-- La désactivation n'était vérifiée que dans le navigateur, à la connexion.
-- Désormais toggleCommercantActif bannit aussi le compte dans Supabase Auth
-- (plus de nouvelle connexion ni de renouvellement de session) et le proxy
-- refuse les pages commerçant d'un compte inactif. On applique ici le
-- bannissement aux comptes déjà désactivés.
update auth.users
   set banned_until = now() + interval '100 years'
 where id in (select id from public.commercants where not actif);
