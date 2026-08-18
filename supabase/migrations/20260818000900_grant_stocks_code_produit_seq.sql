-- La séquence stocks_code_produit_seq (20260817143300) n'a jamais été
-- accordée au rôle "authenticated". Le trigger qui l'utilise (nextval)
-- n'est pas SECURITY DEFINER : il s'exécute avec les privilèges de
-- l'appelant PostgREST, donc "permission denied for sequence" à chaque
-- création de produit. Même classe de bug que la migration des GRANT de
-- table (20260817201100), cette fois sur une séquence.
grant usage, select on sequence public.stocks_code_produit_seq to authenticated;
