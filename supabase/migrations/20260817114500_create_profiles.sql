-- Profils utilisateurs, liés 1:1 à auth.users. Porte le rôle (commercant / admin).
create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'commercant' check (role in ('commercant', 'admin')),
  nom text not null default '',
  telephone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Fonction security definer : vérifie le rôle sans déclencher de récursion RLS
-- sur profiles, et sert de base aux politiques des autres tables.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Crée automatiquement le profil à l'inscription (rôle et nom optionnels
-- passés dans les métadonnées auth.users).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, nom)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'role', 'commercant'),
    coalesce(new.raw_user_meta_data ->> 'nom', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;

create policy "profiles_select"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

create policy "profiles_update"
  on public.profiles for update
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());
