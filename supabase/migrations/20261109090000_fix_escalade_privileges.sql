-- Correctif CRITIQUE : escalade de privilèges vers le rôle admin.
-- (audit de sécurité run-1, 2026-11-08 — deux failles reproduites en local)
--
-- 1) L'inscription publique (supabase.auth.signUp, clé anon) laissait le
--    client choisir son rôle : handle_new_user copiait
--    raw_user_meta_data->>'role' dans profiles.role. Un signUp avec
--    { role: 'admin' } créait directement un administrateur de la
--    plateforme (accès en lecture/écriture à tous les commerçants).
--    → Le rôle n'est plus jamais lu depuis les métadonnées : toute
--      inscription crée un 'commercant'. Un admin ne se crée que par SQL
--      (service_role / tableau de bord Supabase).
--
-- 2) La policy profiles_update (id = auth.uid()) et le GRANT UPDATE sans
--    restriction de colonne laissaient tout commerçant connecté faire
--    PATCH /rest/v1/profiles {"role":"admin"} sur sa propre ligne.
--    → Trigger BEFORE UPDATE : seul un admin (ou le service_role / SQL
--      direct) peut changer profiles.role.
--
-- 3) Même défaut sur commercants.actif : un commerçant désactivé par l'admin
--    pouvait se réactiver lui-même (PATCH {"actif": true}).
--    → Trigger BEFORE UPDATE : seul un admin peut changer actif.
--
-- Les triggers s'appliquent quel que soit le chemin (PostgREST direct,
-- server actions updateProfile / updateCommercant) car ils sont dans la base.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, nom, telephone)
  values (
    new.id,
    'commercant',
    coalesce(new.raw_user_meta_data ->> 'nom', ''),
    new.raw_user_meta_data ->> 'telephone'
  );

  insert into public.commercants (
    id,
    nom_commerce,
    activite,
    ninea,
    rccm,
    telephone_pro,
    email_pro,
    adresse,
    ville_region,
    devise
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nom_commerce', ''),
    new.raw_user_meta_data ->> 'activite',
    new.raw_user_meta_data ->> 'ninea',
    new.raw_user_meta_data ->> 'rccm',
    new.raw_user_meta_data ->> 'telephone_pro',
    new.raw_user_meta_data ->> 'email_pro',
    new.raw_user_meta_data ->> 'adresse',
    new.raw_user_meta_data ->> 'ville_region',
    coalesce(new.raw_user_meta_data ->> 'devise', 'FCFA')
  );

  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- Les deux triggers ci-dessous sont SECURITY INVOKER : current_user y vaut
-- le rôle de l'appelant ('authenticated' / 'anon' via l'API). Un appel en
-- SQL direct, depuis le tableau de bord ou avec la clé service_role n'est
-- pas restreint (chemins déjà de confiance). is_admin() reste SECURITY
-- DEFINER et lit le rôle de auth.uid().

create or replace function public.proteger_role_profil()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if new.role is distinct from old.role
     and current_user in ('anon', 'authenticated')
     and not public.is_admin() then
    raise exception 'Le rôle d''un compte ne peut être modifié que par un administrateur'
      using errcode = '42501';
  end if;
  return new;
end;
$$;


drop trigger if exists profiles_proteger_role on public.profiles;
create trigger profiles_proteger_role
  before update on public.profiles
  for each row execute function public.proteger_role_profil();

create or replace function public.proteger_actif_commercant()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if new.actif is distinct from old.actif
     and current_user in ('anon', 'authenticated')
     and not public.is_admin() then
    raise exception 'L''activation d''un compte ne peut être modifiée que par un administrateur'
      using errcode = '42501';
  end if;
  return new;
end;
$$;


drop trigger if exists commercants_proteger_actif on public.commercants;
create trigger commercants_proteger_actif
  before update on public.commercants
  for each row execute function public.proteger_actif_commercant();
