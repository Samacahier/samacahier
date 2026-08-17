-- Articles en stock d'un commerçant.
create table public.stocks (
  id uuid primary key default gen_random_uuid(),
  commercant_id uuid not null references public.commercants (id) on delete cascade,
  nom_article text not null,
  quantite numeric not null default 0,
  unite text not null default 'unité',
  prix_unitaire numeric,
  seuil_alerte numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index stocks_commercant_id_idx on public.stocks (commercant_id);

alter table public.stocks enable row level security;

create policy "stocks_select"
  on public.stocks for select
  using (commercant_id = auth.uid() or public.is_admin());

create policy "stocks_insert"
  on public.stocks for insert
  with check (commercant_id = auth.uid());

create policy "stocks_update"
  on public.stocks for update
  using (commercant_id = auth.uid() or public.is_admin())
  with check (commercant_id = auth.uid() or public.is_admin());

create policy "stocks_delete"
  on public.stocks for delete
  using (commercant_id = auth.uid() or public.is_admin());
