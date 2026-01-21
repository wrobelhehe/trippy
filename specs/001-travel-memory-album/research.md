# Phase 0 Research: Travel Memory Album

## Decision 1: 3D Globe Rendering Stack

- **Decision**: Use `three.js` with `@react-three/fiber` (R3F) and instanced meshes for pins; lazy-load the globe with `next/dynamic`.
- **Rationale**: R3F integrates cleanly with React while allowing low-level control for instancing, clustering, and requestAnimationFrame loops; dynamic import keeps the initial bundle small.
- **Alternatives considered**: `globe.gl` (fast setup but less control), `deck.gl` (excellent for large datasets but heavier integration), custom canvas renderer (more effort, less ecosystem).

## Decision 2: AI Job Queue Orchestration

- **Decision**: Use `ai_jobs` as the queue table and a scheduled Supabase Edge Function (`ai-job-runner`) that claims jobs via `SELECT ... FOR UPDATE SKIP LOCKED`, with concurrency limits and retry/backoff.
- **Rationale**: Keeps infra minimal while providing reliable background processing; avoids introducing another queue service.
- **Alternatives considered**: Supabase PGMQ (more queue features but extra setup), external queue (e.g., SQS) with more ops overhead.

## Decision 3: Share Token Validation & Data Access

- **Decision**: Validate share tokens server-side (Route Handler or Edge Function) and return sanitized payloads; no direct public RLS access to base tables. Store only SHA-256 token hashes in `share_links`.
- **Rationale**: Prevents token enumeration and accidental data exposure while keeping public pages fast and private by default.
- **Alternatives considered**: Public read on base tables with RLS (higher risk), view-based access using SECURITY DEFINER (viable but more complex to reason about).

## Decision 4: Stripe Subscription Integration

- **Decision**: Use Stripe Checkout Sessions for subscription upgrades and Billing Portal for self-serve management; handle webhooks in a Supabase Edge Function and store event IDs for idempotency.
- **Rationale**: Checkout reduces PCI scope and improves conversion; webhooks keep DB as source of truth for entitlements.
- **Alternatives considered**: Payment Element + Payment Intents (more UI control, more implementation effort).

## Decision 5: Observability Tooling

- **Decision**: Use Sentry for Next.js + Edge Function error monitoring; add structured audit logs in `audit_log` table and capture AI job cost/latency in `ai_jobs`.
- **Rationale**: Provides cross-runtime visibility and aligns with privacy requirements (no raw tokens stored).
- **Alternatives considered**: Log-only monitoring (insufficient alerting), custom dashboards (too much effort initially).

## Decision 6: Testing Stack

- **Decision**: Add Vitest + React Testing Library for unit/integration tests and Playwright for E2E smoke tests.
- **Rationale**: Matches Next.js ecosystem and supports required coverage (unit + integration + E2E).
- **Alternatives considered**: Jest (slower, legacy config), Cypress (E2E only).

## Decision 7: Share Page Caching

- **Decision**: Use server rendering with `cache: no-store` for token-protected share routes; allow CDN caching only for static assets (share images, widgets).
- **Rationale**: Eliminates cross-token caching risk while still meeting performance targets via fast server + CDN media.
- **Alternatives considered**: ISR for share routes (risk of token leakage and privacy bugs).
