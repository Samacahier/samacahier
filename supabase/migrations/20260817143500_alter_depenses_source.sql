-- Source de la dépense (caisse/poche), mode de paiement et fournisseur lié.
alter table public.depenses
  add column source text not null default 'caisse'
    check (source in ('caisse', 'poche')),
  add column mode_paiement text,
  add column fournisseur_id uuid references public.fournisseurs (id) on delete set null;
