-- Un enregistrement par commerçant, en extension 1:1 de profiles.
-- id = profiles.id = auth.uid(), ce qui permet aux tables métier de comparer
-- directement commercant_id à auth.uid().
create table public.commercants (
  id uuid primary key references public.profiles (id) on delete cascade,
  nom_commerce text not null,
  adresse text,
  telephone text,
  created_at timestamptz not null default now()
);

alter table public.commercants enable row level security;

create policy "commercants_select"
  on public.commercants for select
  using (id = auth.uid() or public.is_admin());

create policy "commercants_insert"
  on public.commercants for insert
  with check (id = auth.uid());

create policy "commercants_update"
  on public.commercants for update
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

create policy "commercants_delete"
  on public.commercants for delete
  using (public.is_admin());
