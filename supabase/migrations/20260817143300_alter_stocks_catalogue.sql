-- Aligne stocks sur le prototype : catégorie, prix d'achat/vente, fournisseur,
-- code produit auto-généré. `unite`, `quantite` et `seuil_alerte` existent déjà.
alter table public.stocks
  add column categorie text,
  add column prix_achat numeric,
  add column prix_vente numeric,
  add column fournisseur_id uuid references public.fournisseurs (id) on delete set null;

-- code_produit (ex. PRD004) : généré automatiquement à la création.
create sequence if not exists public.stocks_code_produit_seq;

alter table public.stocks
  add column code_produit text;

create or replace function public.set_stock_code_produit()
returns trigger
language plpgsql
as $$
begin
  if new.code_produit is null then
    new.code_produit := 'PRD' || lpad(nextval('public.stocks_code_produit_seq')::text, 3, '0');
  end if;
  return new;
end;
$$;

create trigger stocks_set_code_produit
  before insert on public.stocks
  for each row execute function public.set_stock_code_produit();

alter table public.stocks
  alter column code_produit set not null,
  add constraint stocks_code_produit_key unique (code_produit);

-- prix_achat/prix_vente remplacent l'ancien champ prix_unitaire unique.
alter table public.stocks
  drop column prix_unitaire;
