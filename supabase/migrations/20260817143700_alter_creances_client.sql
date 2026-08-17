-- Lien vers le référentiel clients. Les champs existants (montant dû,
-- montant remboursé, statut, échéance, client_nom/telephone) sont conservés.
alter table public.creances
  add column client_id uuid references public.clients (id) on delete set null;
