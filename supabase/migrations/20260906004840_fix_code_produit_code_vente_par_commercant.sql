-- Bug bloquant : "duplicate key value violates unique constraint
-- stocks_code_produit_key" à l'enregistrement d'un produit.
--
-- Cause confirmée : code_produit (et code_vente, même mécanisme) était
-- généré via une séquence Postgres UNIQUE À TOUTE LA PLATEFORME
-- (stocks_code_produit_seq / ventes_code_vente_seq), avec une contrainte
-- unique globale sur la seule colonne code_produit/code_vente — alors que
-- ces codes doivent seulement être uniques PAR commerçant (chaque commerçant
-- voit sa propre numérotation PRD001, PRD002...). Reproduit en conditions
-- réelles : une insertion directe en base a échoué sur un code déjà utilisé
-- par un autre commerçant.
--
-- Correctif : le prochain numéro est désormais calculé à partir du MAX
-- existant pour CE commerçant précis (verrou advisory transactionnel par
-- commerçant pour éviter une course entre deux insertions concurrentes du
-- même commerçant), et la contrainte unique devient composite
-- (commercant_id, code). Aucune donnée existante ne peut violer la nouvelle
-- contrainte : elle est strictement plus permissive que l'ancienne unicité
-- globale déjà respectée par les lignes en place.

-- === stocks.code_produit ===

alter table public.stocks
  drop constraint stocks_code_produit_key,
  add constraint stocks_code_produit_key unique (commercant_id, code_produit);

create or replace function public.set_stock_code_produit()
returns trigger
language plpgsql
as $$
declare
  prochain_numero int;
begin
  if new.code_produit is null then
    perform pg_advisory_xact_lock(hashtextextended('stocks_code_produit:' || new.commercant_id::text, 0));

    select coalesce(max(substring(code_produit from '\d+$')::int), 0) + 1
      into prochain_numero
      from public.stocks
      where commercant_id = new.commercant_id;

    new.code_produit := 'PRD' || lpad(prochain_numero::text, 3, '0');
  end if;
  return new;
end;
$$;

drop sequence if exists public.stocks_code_produit_seq;

-- === ventes.code_vente (même défaut, même correctif) ===

alter table public.ventes
  drop constraint ventes_code_vente_key,
  add constraint ventes_code_vente_key unique (commercant_id, code_vente);

create or replace function public.set_vente_code_vente()
returns trigger
language plpgsql
as $$
declare
  prochain_numero int;
begin
  if new.code_vente is null then
    perform pg_advisory_xact_lock(hashtextextended('ventes_code_vente:' || new.commercant_id::text, 0));

    select coalesce(max(substring(code_vente from '\d+$')::int), 0) + 1
      into prochain_numero
      from public.ventes
      where commercant_id = new.commercant_id;

    new.code_vente := 'VTE' || lpad(prochain_numero::text, 5, '0');
  end if;
  return new;
end;
$$;

drop sequence if exists public.ventes_code_vente_seq;
