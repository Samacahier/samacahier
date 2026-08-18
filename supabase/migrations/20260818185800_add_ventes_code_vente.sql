-- code_vente (ex. VTE00001) : généré automatiquement à la création, même
-- mécanisme que code_produit sur stocks. Le GRANT sur la séquence est fait
-- ici dès le départ (cf. bug corrigé précédemment sur stocks_code_produit_seq
-- : sans lui, "permission denied for sequence" à chaque vente).
create sequence if not exists public.ventes_code_vente_seq;
grant usage, select on sequence public.ventes_code_vente_seq to authenticated;

alter table public.ventes
  add column code_vente text;

create or replace function public.set_vente_code_vente()
returns trigger
language plpgsql
as $$
begin
  if new.code_vente is null then
    new.code_vente := 'VTE' || lpad(nextval('public.ventes_code_vente_seq')::text, 5, '0');
  end if;
  return new;
end;
$$;

create trigger ventes_set_code_vente
  before insert on public.ventes
  for each row execute function public.set_vente_code_vente();

-- Backfill des ventes existantes avant de rendre la colonne obligatoire.
update public.ventes
set code_vente = 'VTE' || lpad(nextval('public.ventes_code_vente_seq')::text, 5, '0')
where code_vente is null;

alter table public.ventes
  alter column code_vente set not null,
  add constraint ventes_code_vente_key unique (code_vente);
