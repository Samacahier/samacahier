-- Permet à l'admin d'activer/désactiver un compte commerçant (Phase 7).
-- Le blocage réel se fait au moment de la connexion (vérifié côté app),
-- les données du commerçant restent intactes.
alter table public.commercants
  add column actif boolean not null default true;
