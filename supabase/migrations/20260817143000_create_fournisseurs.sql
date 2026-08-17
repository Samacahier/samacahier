-- Référentiel fournisseurs, réutilisable depuis Stock et Dépenses.
create table public.fournisseurs (
  id uuid primary key default gen_random_uuid(),
  commercant_id uuid not null references public.commercants (id) on delete cascade,
  nom text not null,
  contact text,
  created_at timestamptz not null default now()
);

create index fournisseurs_commercant_id_idx on public.fournisseurs (commercant_id);

alter table public.fournisseurs enable row level security;

create policy "fournisseurs_select"
  on public.fournisseurs for select
  using (commercant_id = auth.uid() or public.is_admin());

create policy "fournisseurs_insert"
  on public.fournisseurs for insert
  with check (commercant_id = auth.uid());

create policy "fournisseurs_update"
  on public.fournisseurs for update
  using (commercant_id = auth.uid() or public.is_admin())
  with check (commercant_id = auth.uid() or public.is_admin());

create policy "fournisseurs_delete"
  on public.fournisseurs for delete
  using (commercant_id = auth.uid() or public.is_admin());
