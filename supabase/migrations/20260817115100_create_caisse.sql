-- Mouvements de caisse (entrées / sorties) d'un commerçant.
create table public.caisse (
  id uuid primary key default gen_random_uuid(),
  commercant_id uuid not null references public.commercants (id) on delete cascade,
  type_mouvement text not null check (type_mouvement in ('entree', 'sortie')),
  montant numeric not null,
  motif text,
  date_mouvement timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index caisse_commercant_id_idx on public.caisse (commercant_id);

alter table public.caisse enable row level security;

create policy "caisse_select"
  on public.caisse for select
  using (commercant_id = auth.uid() or public.is_admin());

create policy "caisse_insert"
  on public.caisse for insert
  with check (commercant_id = auth.uid());

create policy "caisse_update"
  on public.caisse for update
  using (commercant_id = auth.uid() or public.is_admin())
  with check (commercant_id = auth.uid() or public.is_admin());

create policy "caisse_delete"
  on public.caisse for delete
  using (commercant_id = auth.uid() or public.is_admin());
