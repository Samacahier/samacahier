-- Mode maintenance : interrupteur global piloté depuis le dashboard admin.
-- Quand il est actif, tout visiteur non-admin voit la page /maintenance
-- (HTTP 503) ; les admins continuent d'accéder à tout le site.
--
-- Table à ligne unique (id = 1).
create table public.parametres_plateforme (
  id smallint primary key default 1 check (id = 1),
  maintenance_active boolean not null default false,
  maintenance_message text,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id) on delete set null
);

insert into public.parametres_plateforme (id) values (1);

alter table public.parametres_plateforme enable row level security;

-- Lecture publique : le proxy doit connaître l'état avant toute connexion.
create policy "parametres_plateforme_select"
  on public.parametres_plateforme for select
  to anon, authenticated
  using (true);

-- Seul un admin peut basculer le mode maintenance.
create policy "parametres_plateforme_update"
  on public.parametres_plateforme for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select on public.parametres_plateforme to anon, authenticated;
grant update on public.parametres_plateforme to authenticated;
