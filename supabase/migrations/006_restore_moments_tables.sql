create table if not exists public.moments (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  content_text text not null,
  moment_timestamp timestamptz,
  order_index integer,
  lat numeric,
  lng numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.moment_media (
  id uuid primary key default gen_random_uuid(),
  moment_id uuid not null references public.moments(id) on delete cascade,
  media_id uuid not null references public.media(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.trip_highlights (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  highlight_items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint trip_highlights_count check (
    jsonb_typeof(highlight_items) = 'array'
    and jsonb_array_length(highlight_items) between 3 and 7
  )
);

create index if not exists moments_trip_idx on public.moments(trip_id);

alter table public.moments enable row level security;
alter table public.moment_media enable row level security;
alter table public.trip_highlights enable row level security;

drop trigger if exists set_moments_updated_at on public.moments;
create trigger set_moments_updated_at
before update on public.moments
for each row execute function public.set_updated_at();

drop trigger if exists set_trip_highlights_updated_at on public.trip_highlights;
create trigger set_trip_highlights_updated_at
before update on public.trip_highlights
for each row execute function public.set_updated_at();

drop policy if exists "Moments are viewable by owner" on public.moments;
create policy "Moments are viewable by owner"
  on public.moments for select
  using (auth.uid() = owner_id);

drop policy if exists "Moments can be inserted by owner" on public.moments;
create policy "Moments can be inserted by owner"
  on public.moments for insert
  with check (auth.uid() = owner_id);

drop policy if exists "Moments can be updated by owner" on public.moments;
create policy "Moments can be updated by owner"
  on public.moments for update
  using (auth.uid() = owner_id);

drop policy if exists "Moments can be deleted by owner" on public.moments;
create policy "Moments can be deleted by owner"
  on public.moments for delete
  using (auth.uid() = owner_id);

drop policy if exists "Moment media are viewable by owner" on public.moment_media;
create policy "Moment media are viewable by owner"
  on public.moment_media for select
  using (auth.uid() = owner_id);

drop policy if exists "Moment media can be inserted by owner" on public.moment_media;
create policy "Moment media can be inserted by owner"
  on public.moment_media for insert
  with check (auth.uid() = owner_id);

drop policy if exists "Moment media can be deleted by owner" on public.moment_media;
create policy "Moment media can be deleted by owner"
  on public.moment_media for delete
  using (auth.uid() = owner_id);

drop policy if exists "Trip highlights are viewable by owner" on public.trip_highlights;
create policy "Trip highlights are viewable by owner"
  on public.trip_highlights for select
  using (auth.uid() = owner_id);

drop policy if exists "Trip highlights can be inserted by owner" on public.trip_highlights;
create policy "Trip highlights can be inserted by owner"
  on public.trip_highlights for insert
  with check (auth.uid() = owner_id);

drop policy if exists "Trip highlights can be updated by owner" on public.trip_highlights;
create policy "Trip highlights can be updated by owner"
  on public.trip_highlights for update
  using (auth.uid() = owner_id);
