-- Étoffe le profil du commerce.
-- `adresse` existe déjà (migration create_commercants) : non redéfinie ici.
alter table public.commercants
  add column logo_url text,
  add column activite text,
  add column ninea text,
  add column rccm text,
  add column telephone_pro text,
  add column email_pro text,
  add column ville_region text,
  add column devise text not null default 'FCFA',
  add column solde_initial_caisse numeric not null default 0,
  add column solde_initial_poche numeric not null default 0;
