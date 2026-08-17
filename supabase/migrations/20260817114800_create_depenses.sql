-- Dépenses enregistrées par un commerçant.
create table public.depenses (
  id uuid primary key default gen_random_uuid(),
  commercant_id uuid not null references public.commercants (id) on delete cascade,
  libelle text not null,
  categorie text,
  montant numeric not null,
  date_depense date not null default current_date,
  created_at timestamptz not null default now()
);

create index depenses_commercant_id_idx on public.depenses (commercant_id);

alter table public.depenses enable row level security;

create policy "depenses_select"
  on public.depenses for select
  using (commercant_id = auth.uid() or public.is_admin());

create policy "depenses_insert"
  on public.depenses for insert
  with check (commercant_id = auth.uid());

create policy "depenses_update"
  on public.depenses for update
  using (commercant_id = auth.uid() or public.is_admin())
  with check (commercant_id = auth.uid() or public.is_admin());

create policy "depenses_delete"
  on public.depenses for delete
  using (commercant_id = auth.uid() or public.is_admin());
