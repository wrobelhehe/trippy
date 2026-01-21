alter table profiles enable row level security;
alter table trips enable row level security;
alter table moments enable row level security;
alter table media enable row level security;
alter table trip_media enable row level security;
alter table moment_media enable row level security;
alter table trip_highlights enable row level security;
alter table share_links enable row level security;
alter table share_assets enable row level security;
alter table ai_jobs enable row level security;
alter table subscriptions enable row level security;
alter table stripe_events enable row level security;
alter table audit_log enable row level security;

create policy "Profiles are viewable by owner"
  on profiles for select
  using (auth.uid() = id);

create policy "Profiles can be inserted by owner"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Profiles can be updated by owner"
  on profiles for update
  using (auth.uid() = id);

create policy "Trips are viewable by owner"
  on trips for select
  using (auth.uid() = owner_id);

create policy "Trips can be inserted by owner"
  on trips for insert
  with check (auth.uid() = owner_id);

create policy "Trips can be updated by owner"
  on trips for update
  using (auth.uid() = owner_id);

create policy "Trips can be deleted by owner"
  on trips for delete
  using (auth.uid() = owner_id);

create policy "Moments are viewable by owner"
  on moments for select
  using (auth.uid() = owner_id);

create policy "Moments can be inserted by owner"
  on moments for insert
  with check (auth.uid() = owner_id);

create policy "Moments can be updated by owner"
  on moments for update
  using (auth.uid() = owner_id);

create policy "Moments can be deleted by owner"
  on moments for delete
  using (auth.uid() = owner_id);

create policy "Media are viewable by owner"
  on media for select
  using (auth.uid() = owner_id);

create policy "Media can be inserted by owner"
  on media for insert
  with check (auth.uid() = owner_id);

create policy "Media can be updated by owner"
  on media for update
  using (auth.uid() = owner_id);

create policy "Media can be deleted by owner"
  on media for delete
  using (auth.uid() = owner_id);

create policy "Trip media are viewable by owner"
  on trip_media for select
  using (auth.uid() = owner_id);

create policy "Trip media can be inserted by owner"
  on trip_media for insert
  with check (auth.uid() = owner_id);

create policy "Trip media can be deleted by owner"
  on trip_media for delete
  using (auth.uid() = owner_id);

create policy "Moment media are viewable by owner"
  on moment_media for select
  using (auth.uid() = owner_id);

create policy "Moment media can be inserted by owner"
  on moment_media for insert
  with check (auth.uid() = owner_id);

create policy "Moment media can be deleted by owner"
  on moment_media for delete
  using (auth.uid() = owner_id);

create policy "Trip highlights are viewable by owner"
  on trip_highlights for select
  using (auth.uid() = owner_id);

create policy "Trip highlights can be inserted by owner"
  on trip_highlights for insert
  with check (auth.uid() = owner_id);

create policy "Trip highlights can be updated by owner"
  on trip_highlights for update
  using (auth.uid() = owner_id);

create policy "Share links are viewable by owner"
  on share_links for select
  using (auth.uid() = owner_id);

create policy "Share links can be inserted by owner"
  on share_links for insert
  with check (auth.uid() = owner_id);

create policy "Share links can be updated by owner"
  on share_links for update
  using (auth.uid() = owner_id);

create policy "Share links can be deleted by owner"
  on share_links for delete
  using (auth.uid() = owner_id);

create policy "Share assets are viewable by owner"
  on share_assets for select
  using (auth.uid() = owner_id);

create policy "Share assets can be inserted by owner"
  on share_assets for insert
  with check (auth.uid() = owner_id);

create policy "Share assets can be updated by owner"
  on share_assets for update
  using (auth.uid() = owner_id);

create policy "Share assets can be deleted by owner"
  on share_assets for delete
  using (auth.uid() = owner_id);

create policy "AI jobs are viewable by owner"
  on ai_jobs for select
  using (auth.uid() = owner_id);

create policy "AI jobs can be inserted by owner"
  on ai_jobs for insert
  with check (auth.uid() = owner_id);

create policy "AI jobs can be updated by owner"
  on ai_jobs for update
  using (auth.uid() = owner_id);

create policy "Subscriptions are viewable by owner"
  on subscriptions for select
  using (auth.uid() = owner_id);

create policy "Audit log is viewable by owner"
  on audit_log for select
  using (auth.uid() = owner_id);

create policy "Audit log can be inserted by owner"
  on audit_log for insert
  with check (auth.uid() = owner_id);