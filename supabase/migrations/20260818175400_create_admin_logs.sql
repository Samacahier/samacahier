-- Journal d'activité admin (Phase 8, Section 4) : une ligne à chaque
-- activation, désactivation, réinitialisation de mot de passe ou
-- correction d'infos depuis une fiche commerçant.
create table public.admin_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.profiles (id),
  action text not null,
  commercant_id uuid references public.commercants (id) on delete set null,
  detail text,
  created_at timestamptz not null default now()
);

alter table public.admin_logs enable row level security;

-- Journal réservé à l'admin : ni RLS ni grant ne sont ouverts à
-- "commercant" (cf. le bug de grants manquants corrigé précédemment).
create policy "admin_logs_select"
  on public.admin_logs for select
  using (public.is_admin());

create policy "admin_logs_insert"
  on public.admin_logs for insert
  with check (public.is_admin() and admin_id = auth.uid());

grant select, insert on public.admin_logs to authenticated;
