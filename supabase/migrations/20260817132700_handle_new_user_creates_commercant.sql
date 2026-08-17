-- Corrige un bug bloquant : handle_new_user() ne créait que profiles, jamais
-- commercants. Or ventes/depenses/stocks/creances/caisse référencent
-- commercants(id) en clé étrangère stricte : sans cette ligne, tout insert
-- métier échouait pour un commerçant fraîchement inscrit.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text;
begin
  v_role := coalesce(new.raw_user_meta_data ->> 'role', 'commercant');

  insert into public.profiles (id, role, nom)
  values (
    new.id,
    v_role,
    coalesce(new.raw_user_meta_data ->> 'nom', '')
  );

  if v_role = 'commercant' then
    insert into public.commercants (id, nom_commerce)
    values (
      new.id,
      coalesce(new.raw_user_meta_data ->> 'nom_commerce', '')
    );
  end if;

  return new;
end;
$$;
