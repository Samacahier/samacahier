-- Étend handle_new_user() pour créer la ligne commercants avec tous les
-- champs de l'étape 2 de l'onboarding (Phase 2), au lieu de nom_commerce
-- seul. Récupère aussi le téléphone du responsable sur profiles.
-- logo_url n'est pas géré ici (upload de fichier impossible via les
-- métadonnées d'inscription) : il est mis à jour après coup côté client,
-- une fois le fichier envoyé dans le bucket "logos".
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text;
begin
  v_role := coalesce(new.raw_user_meta_data ->> 'role', 'commercant');

  insert into public.profiles (id, role, nom, telephone)
  values (
    new.id,
    v_role,
    coalesce(new.raw_user_meta_data ->> 'nom', ''),
    new.raw_user_meta_data ->> 'telephone'
  );

  if v_role = 'commercant' then
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
  end if;

  return new;
end;
$$;
