insert into storage.buckets (id, name, public)
values ('user-media', 'user-media', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('share-assets', 'share-assets', true)
on conflict (id) do nothing;

create policy "User media read access"
  on storage.objects for select
  using (bucket_id = 'user-media' and auth.uid() = owner);

create policy "User media write access"
  on storage.objects for insert
  with check (bucket_id = 'user-media' and auth.uid() = owner);

create policy "User media update access"
  on storage.objects for update
  using (bucket_id = 'user-media' and auth.uid() = owner);

create policy "User media delete access"
  on storage.objects for delete
  using (bucket_id = 'user-media' and auth.uid() = owner);

create policy "Share assets public read"
  on storage.objects for select
  using (bucket_id = 'share-assets');

create policy "Share assets write access"
  on storage.objects for insert
  with check (bucket_id = 'share-assets' and auth.uid() = owner);

create policy "Share assets update access"
  on storage.objects for update
  using (bucket_id = 'share-assets' and auth.uid() = owner);

create policy "Share assets delete access"
  on storage.objects for delete
  using (bucket_id = 'share-assets' and auth.uid() = owner);