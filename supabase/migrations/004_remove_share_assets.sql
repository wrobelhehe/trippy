-- Remove Share Studio assets storage + table.

drop policy if exists "Share assets public read" on storage.objects;
drop policy if exists "Share assets write access" on storage.objects;
drop policy if exists "Share assets update access" on storage.objects;
drop policy if exists "Share assets delete access" on storage.objects;

delete from storage.objects where bucket_id = 'share-assets';
delete from storage.buckets where id = 'share-assets';

drop table if exists public.share_assets;
