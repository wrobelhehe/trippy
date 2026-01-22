alter table profiles add column if not exists first_name text;
alter table profiles add column if not exists last_name text;
alter table profiles add column if not exists birth_date date;

insert into storage.buckets (id, name, public)
values ('profile-avatars', 'profile-avatars', true)
on conflict (id) do nothing;

create policy "Profile avatars public read"
  on storage.objects for select
  using (bucket_id = 'profile-avatars');

create policy "Profile avatars insert"
  on storage.objects for insert
  with check (bucket_id = 'profile-avatars' and auth.uid() = owner);

create policy "Profile avatars update"
  on storage.objects for update
  using (bucket_id = 'profile-avatars' and auth.uid() = owner);

create policy "Profile avatars delete"
  on storage.objects for delete
  using (bucket_id = 'profile-avatars' and auth.uid() = owner);
