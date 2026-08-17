-- Référentiel clients, réutilisable depuis Ventes et Créances.
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  commercant_id uuid not null references public.commercants (id) on delete cascade,
  nom text not null,
  telephone text,
  created_at timestamptz not null default now()
);

create index clients_commercant_id_idx on public.clients (commercant_id);

alter table public.clients enable row level security;

create policy "clients_select"
  on public.clients for select
  using (commercant_id = auth.uid() or public.is_admin());

create policy "clients_insert"
  on public.clients for insert
  with check (commercant_id = auth.uid());

create policy "clients_update"
  on public.clients for update
  using (commercant_id = auth.uid() or public.is_admin())
  with check (commercant_id = auth.uid() or public.is_admin());

create policy "clients_delete"
  on public.clients for delete
  using (commercant_id = auth.uid() or public.is_admin());
