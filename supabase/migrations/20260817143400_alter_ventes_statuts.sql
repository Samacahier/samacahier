-- Statuts et liaisons catalogue/client.
-- `mode_paiement` existe déjà (migration create_ventes) : non redéfini ici.
alter table public.ventes
  add column produit_id uuid references public.stocks (id) on delete set null,
  add column client_id uuid references public.clients (id) on delete set null,
  add column remise numeric not null default 0,
  add column statut text not null default 'paye'
    check (statut in ('paye', 'credit', 'impaye')),
  add column montant_encaisse numeric;
