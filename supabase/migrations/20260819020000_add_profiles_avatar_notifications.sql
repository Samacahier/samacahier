-- Photo de profil et préférences de notifications e-mail (Mon compte
-- admin) : avatar_url suit le même principe que commercants.logo_url,
-- notif_* pilotent l'envoi d'e-mails via Resend (nouveau commerçant
-- fonctionnel dès cette phase, les deux autres nécessitent une tâche
-- planifiée à venir — cf. src/lib/admin/notifications.ts).
alter table public.profiles
  add column avatar_url text,
  add column notif_nouveau_commercant boolean not null default true,
  add column notif_commercant_inactif boolean not null default true,
  add column notif_resume_hebdo boolean not null default false;
