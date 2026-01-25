alter table trips
  add column if not exists moments_count integer not null default 0;

alter table trips
  add column if not exists media_count integer not null default 0;
