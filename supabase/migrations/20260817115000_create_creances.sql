-- Créances (dettes clients) suivies par un commerçant.
create table public.creances (
  id uuid primary key default gen_random_uuid(),
  commercant_id uuid not null references public.commercants (id) on delete cascade,
  client_nom text not null,
  client_telephone text,
  montant numeric not null,
  montant_rembourse numeric not null default 0,
  statut text not null default 'en_cours'
    check (statut in ('en_cours', 'soldee', 'en_retard')),
  date_echeance date,
  created_at timestamptz not null default now()
);

create index creances_commercant_id_idx on public.creances (commercant_id);

alter table public.creances enable row level security;

create policy "creances_select"
  on public.creances for select
  using (commercant_id = auth.uid() or public.is_admin());

create policy "creances_insert"
  on public.creances for insert
  with check (commercant_id = auth.uid());

create policy "creances_update"
  on public.creances for update
  using (commercant_id = auth.uid() or public.is_admin())
  with check (commercant_id = auth.uid() or public.is_admin());

create policy "creances_delete"
  on public.creances for delete
  using (commercant_id = auth.uid() or public.is_admin());
