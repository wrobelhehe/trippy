# Data Model: Travel Memory Album

## Entities

### profiles
- **Fields**: id (uuid, pk, = auth.uid), display_name, avatar_url, bio, created_at, updated_at
- **Relationships**: 1:many with trips, moments, media, share_links, ai_jobs
- **Validation**: display_name required; avatar_url optional

### trips
- **Fields**: id (uuid, pk), owner_id (uuid, fk profiles.id), title, place_name, country_code?, lat?, lng?, start_date?, end_date?, short_description?, cover_media_id?, tags (text[]), privacy_mode (enum: private|link|public), hide_exact_dates (bool, default true), moments_count, media_count, created_at, updated_at, deleted_at?
- **Relationships**: belongs to profile; has many moments, trip_highlights, share_links, share_assets, trip_media
- **Validation**: title + place_name required; start_date <= end_date when both present; deleted_at drives soft delete

### moments
- **Fields**: id, trip_id, owner_id, content_text, moment_timestamp?, order_index, lat?, lng?, created_at, updated_at, deleted_at?
- **Relationships**: belongs to trip + profile; has many moment_media
- **Validation**: content_text required; order_index required if moment_timestamp null

### media
- **Fields**: id, owner_id, media_type (image|video), storage_bucket, storage_path, thumb_path, width, height, duration_seconds?, size_bytes, created_at
- **Relationships**: belongs to profile; many-to-many with trips and moments via join tables
- **Validation**: enforce owner_id on all attachments; media_type required

### trip_media (join)
- **Fields**: id, trip_id, media_id, owner_id, created_at
- **Relationships**: join between trips and media
- **Validation**: owner_id matches trip.owner_id and media.owner_id

### moment_media (join)
- **Fields**: id, moment_id, media_id, owner_id, created_at
- **Relationships**: join between moments and media
- **Validation**: owner_id matches moment.owner_id and media.owner_id

### trip_highlights
- **Fields**: id, trip_id, owner_id, highlight_items (jsonb), created_at, updated_at
- **Relationships**: belongs to trip + profile
- **Validation**: 3-7 highlight items

### share_links
- **Fields**: id, owner_id, scope (trip|profile), trip_id?, token_hash, privacy_overrides (jsonb), created_at, revoked_at?, expires_at?
- **Relationships**: belongs to profile; optionally to trip
- **Validation**: token_hash stored only; expires_at default 30 days; revocation immediate

### share_assets
- **Fields**: id, owner_id, scope (trip|profile), trip_id?, asset_type (story|square|widget), template_key, storage_path, watermark (bool), created_at
- **Relationships**: belongs to profile; optionally to trip
- **Validation**: entitlements enforce template and watermark rules

### ai_jobs
- **Fields**: id, owner_id, job_type (trip_from_photos|ticket_import), status (queued|processing|succeeded|failed), input (jsonb), output (jsonb), error (jsonb), cost_usd (numeric), created_at, updated_at
- **Relationships**: belongs to profile
- **Validation**: server-side gating; only safe fields in output

### subscriptions
- **Fields**: id, owner_id, stripe_customer_id, stripe_subscription_id, plan_key, status, current_period_end, cancel_at_period_end, created_at, updated_at
- **Relationships**: belongs to profile
- **Validation**: state managed by webhooks; UI reads from DB

### stripe_events
- **Fields**: id, stripe_event_id (unique), event_type, payload (jsonb), created_at
- **Relationships**: none
- **Validation**: unique stripe_event_id enforces idempotency

### audit_log
- **Fields**: id, owner_id, event_type, entity_type, entity_id, metadata (jsonb), created_at
- **Relationships**: belongs to profile
- **Validation**: no sensitive tokens or private ticket fields

## Relationships (summary)

- profiles 1:many trips, moments, media, share_links, ai_jobs, subscriptions
- trips 1:many moments, trip_highlights, share_assets, trip_media
- moments 1:many moment_media
- media many:many trips/moments via join tables

## Validation Rules & Defaults

- Share links: default expires_at = created_at + 30 days; downloads off by default.
- Soft delete: trips/moments use deleted_at; share links revoked immediately on trip deletion.
- Privacy: hide_exact_dates defaults true; share views must respect redactions.
- Counts: moments_count/media_count maintained by triggers or server-side updates.

## State Transitions

- **ai_jobs.status**: queued â†’ processing â†’ succeeded|failed (retries allowed on failed).
- **share_links**: active â†’ revoked (revoked_at set) or expired (expires_at reached).
- **trips**: active â†’ soft-deleted (deleted_at set) â†’ restored (deleted_at cleared).
