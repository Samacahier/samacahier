-- Ventes enregistrées par un commerçant.
create table public.ventes (
  id uuid primary key default gen_random_uuid(),
  commercant_id uuid not null references public.commercants (id) on delete cascade,
  description text not null,
  quantite numeric not null default 1,
  prix_unitaire numeric not null,
  montant_total numeric not null,
  mode_paiement text not null default 'especes'
    check (mode_paiement in ('especes', 'mobile_money', 'virement', 'autre')),
  date_vente date not null default current_date,
  created_at timestamptz not null default now()
);

create index ventes_commercant_id_idx on public.ventes (commercant_id);

alter table public.ventes enable row level security;

create policy "ventes_select"
  on public.ventes for select
  using (commercant_id = auth.uid() or public.is_admin());

create policy "ventes_insert"
  on public.ventes for insert
  with check (commercant_id = auth.uid());

create policy "ventes_update"
  on public.ventes for update
  using (commercant_id = auth.uid() or public.is_admin())
  with check (commercant_id = auth.uid() or public.is_admin());

create policy "ventes_delete"
  on public.ventes for delete
  using (commercant_id = auth.uid() or public.is_admin());
