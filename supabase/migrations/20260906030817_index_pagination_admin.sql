-- Sans ces index, un ORDER BY + LIMIT/OFFSET sur ces colonnes force Postgres
-- à trier l'intégralité de la table avant d'appliquer la limite (Sort puis
-- Limit) au lieu de s'arrêter dès que la page voulue est atteinte (Limit sur
-- un Index Scan qui respecte déjà l'ordre demandé) — la pagination serait
-- alors "bornée" côté résultat renvoyé, mais pas côté travail réellement
-- effectué par la requête.
create index if not exists commercants_created_at_idx on public.commercants (created_at desc);
create index if not exists commercants_nom_commerce_idx on public.commercants (nom_commerce);
create index if not exists admin_logs_created_at_idx on public.admin_logs (created_at desc);
