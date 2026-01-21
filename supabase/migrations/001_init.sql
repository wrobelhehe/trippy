create extension if not exists "pgcrypto";

create type privacy_mode as enum ('private', 'link', 'public');
create type media_type as enum ('image', 'video');
create type share_scope as enum ('trip', 'profile');
create type share_asset_type as enum ('story', 'square', 'widget');
create type ai_job_status as enum ('queued', 'processing', 'succeeded', 'failed');
create type ai_job_type as enum ('trip_from_photos', 'ticket_import');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_url text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table trips (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  place_name text not null,
  country_code text,
  lat numeric,
  lng numeric,
  start_date date,
  end_date date,
  short_description text,
  cover_media_id uuid,
  tags text[] not null default '{}'::text[],
  privacy_mode privacy_mode not null default 'private',
  hide_exact_dates boolean not null default true,
  moments_count integer not null default 0,
  media_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint trips_date_range check (
    start_date is null
    or end_date is null
    or start_date <= end_date
  )
);

create table moments (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  owner_id uuid not null references profiles(id) on delete cascade,
  content_text text not null,
  moment_timestamp timestamptz,
  order_index integer,
  lat numeric,
  lng numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table media (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  media_type media_type not null,
  storage_bucket text not null,
  storage_path text not null,
  thumb_path text,
  width integer,
  height integer,
  duration_seconds numeric,
  size_bytes bigint,
  created_at timestamptz not null default now()
);

create table trip_media (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  media_id uuid not null references media(id) on delete cascade,
  owner_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table moment_media (
  id uuid primary key default gen_random_uuid(),
  moment_id uuid not null references moments(id) on delete cascade,
  media_id uuid not null references media(id) on delete cascade,
  owner_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table trip_highlights (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  owner_id uuid not null references profiles(id) on delete cascade,
  highlight_items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint trip_highlights_count check (
    jsonb_typeof(highlight_items) = 'array'
    and jsonb_array_length(highlight_items) between 3 and 7
  )
);

create table share_links (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  scope share_scope not null,
  trip_id uuid references trips(id) on delete cascade,
  token_hash text not null unique,
  privacy_overrides jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  revoked_at timestamptz,
  expires_at timestamptz not null default now() + interval '30 days'
);

create table share_assets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  scope share_scope not null,
  trip_id uuid references trips(id) on delete cascade,
  asset_type share_asset_type not null,
  template_key text not null,
  storage_path text not null,
  watermark boolean not null default true,
  created_at timestamptz not null default now()
);

create table ai_jobs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  job_type ai_job_type not null,
  status ai_job_status not null default 'queued',
  input jsonb not null,
  output jsonb,
  error jsonb,
  cost_usd numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan_key text,
  status text,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint subscriptions_owner_unique unique (owner_id)
);

create table stripe_events (
  id uuid primary key default gen_random_uuid(),
  stripe_event_id text not null unique,
  event_type text not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create table audit_log (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  event_type text not null,
  entity_type text,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index trips_owner_idx on trips(owner_id);
create index moments_trip_idx on moments(trip_id);
create index media_owner_idx on media(owner_id);
create index share_links_owner_idx on share_links(owner_id);
create index share_assets_owner_idx on share_assets(owner_id);
create index ai_jobs_owner_idx on ai_jobs(owner_id);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
before update on profiles
for each row execute function set_updated_at();

create trigger set_trips_updated_at
before update on trips
for each row execute function set_updated_at();

create trigger set_moments_updated_at
before update on moments
for each row execute function set_updated_at();

create trigger set_trip_highlights_updated_at
before update on trip_highlights
for each row execute function set_updated_at();

create trigger set_ai_jobs_updated_at
before update on ai_jobs
for each row execute function set_updated_at();

create trigger set_subscriptions_updated_at
before update on subscriptions
for each row execute function set_updated_at();

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', new.email));
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function handle_new_user();