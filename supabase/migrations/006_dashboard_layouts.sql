create table if not exists dashboard_layouts (
  user_id uuid primary key references auth.users (id) on delete cascade,
  layout jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table dashboard_layouts enable row level security;

create policy "Dashboard layouts read own"
  on dashboard_layouts for select
  using (auth.uid() = user_id);

create policy "Dashboard layouts insert own"
  on dashboard_layouts for insert
  with check (auth.uid() = user_id);

create policy "Dashboard layouts update own"
  on dashboard_layouts for update
  using (auth.uid() = user_id);
