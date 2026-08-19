-- admin_id était NOT NULL avec ON DELETE NO ACTION : la suppression d'un
-- compte qui s'auto-journalise (admin_id = son propre id, Phase 10 —
-- suppression de compte commerçant) échouerait avec une violation de FK.
-- Aligné sur commercant_id : nullable + ON DELETE SET NULL, la ligne de
-- log survit à la suppression du compte qu'elle référence.
alter table public.admin_logs
  alter column admin_id drop not null;

alter table public.admin_logs
  drop constraint admin_logs_admin_id_fkey,
  add constraint admin_logs_admin_id_fkey
    foreign key (admin_id) references public.profiles (id) on delete set null;
