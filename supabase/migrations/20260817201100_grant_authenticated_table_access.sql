-- Corrige un bug bloquant présent depuis la Phase 1 : aucune migration
-- n'accordait les privilèges de table nécessaires au rôle "authenticated".
-- RLS filtre les LIGNES visibles, mais Postgres exige en plus un GRANT au
-- niveau de la TABLE pour que le rôle puisse ne serait-ce que tenter la
-- requête — sans lui, PostgREST renvoie "permission denied" avant même
-- d'évaluer les policies RLS. Passé inaperçu jusqu'ici car toutes les
-- vérifications précédentes utilisaient une connexion SQL directe
-- (contournant PostgREST), jamais le vrai chemin API que l'app emprunte.
grant select, insert, update, delete on
  public.profiles,
  public.commercants,
  public.ventes,
  public.depenses,
  public.stocks,
  public.creances,
  public.caisse,
  public.clients,
  public.fournisseurs
to authenticated;
