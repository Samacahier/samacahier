-- Distingue les deux poches (caisse principale / poche personnelle) sur
-- chaque mouvement. Le solde par poche = solde_initial_{caisse|poche} sur
-- commercants + somme des entrées − somme des sorties filtrées par type_poche.
alter table public.caisse
  add column type_poche text not null default 'caisse'
    check (type_poche in ('caisse', 'poche'));
