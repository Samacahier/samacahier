-- Traçabilité des mouvements de caisse auto-générés par les ventes encaissées
-- et les dépenses, et de la créance générée par une vente à crédit/impayée.
-- Contrainte unique : au plus une ligne caisse par vente, une par dépense, et
-- une créance par vente — permet un upsert fiable à chaque édition.
-- on delete cascade : supprimer la vente/dépense source supprime son
-- mouvement de caisse (ou sa créance) généré automatiquement.
alter table public.caisse
  add column vente_id uuid references public.ventes (id) on delete cascade,
  add column depense_id uuid references public.depenses (id) on delete cascade,
  add constraint caisse_vente_id_key unique (vente_id),
  add constraint caisse_depense_id_key unique (depense_id);

alter table public.creances
  add column vente_id uuid references public.ventes (id) on delete cascade,
  add constraint creances_vente_id_key unique (vente_id);
