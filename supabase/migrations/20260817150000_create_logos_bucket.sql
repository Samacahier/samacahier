-- Bucket public pour les logos de commerce (onboarding étape 2).
-- Chemin attendu : logos/{commercant_id}/{fichier} — le premier segment du
-- chemin doit correspondre à auth.uid() pour écrire/modifier/supprimer.
insert into storage.buckets (id, name, public)
values ('logos', 'logos', true)
on conflict (id) do nothing;

create policy "logos_public_read"
  on storage.objects for select
  using (bucket_id = 'logos');

create policy "logos_owner_insert"
  on storage.objects for insert
  with check (
    bucket_id = 'logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "logos_owner_update"
  on storage.objects for update
  using (
    bucket_id = 'logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "logos_owner_delete"
  on storage.objects for delete
  using (
    bucket_id = 'logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
