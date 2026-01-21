# Implementation Plan: Travel Memory Album

**Branch**: `001-travel-memory-album` | **Date**: 2026-01-20 | **Spec**: /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/specs/001-travel-memory-album/spec.md
**Input**: Feature specification from /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/specs/001-travel-memory-album/spec.md

## Summary

Deliver a memory-first travel album built on Next.js App Router with Supabase (Auth, Postgres, Storage, Edge Functions) and Stripe subscriptions. The app ships a premium glassmorphism UI (shadcn/ui + Tailwind), a high-performance client-rendered 3D globe dashboard, share-link privacy controls, and Gemini 3 Pro AI jobs executed as background tasks with strict plan gating and cost controls.

## Technical Context

**Language/Version**: TypeScript 5.x, Next.js 16.1.4, React 19.2.3, Node.js 20.x (Vercel runtime)  
**Primary Dependencies**: Next.js App Router, Supabase JS/Auth/Storage, Stripe SDK, shadcn/ui + Radix + Tailwind, three.js + @react-three/fiber, Sentry  
**Storage**: Supabase Postgres + Supabase Storage (private user-media, public share-assets)  
**Testing**: Vitest + React Testing Library (unit/integration), Playwright (E2E)  
**Target Platform**: Web-only, Vercel deployments (preview/dev/prod)  
**Project Type**: Web app (Next.js App Router with route handlers + Edge Functions)  
**Performance Goals**: 55-60 fps globe at 200 trips; share pages FMP <2s broadband / <4s 4G p90; media thumbs <2s  
**Constraints**: Privacy-first defaults, hashed share tokens only, RLS on all user tables, no future-trip language, server-only secrets for Stripe/Gemini  
**Scale/Scope**: 200 trips + 500 moments reference dataset; public share reads with rate limiting; background AI jobs with retry/backoff

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Code Quality: lint/build gates enforced in CI; avoid `any`, prefer typed schemas. PASS
- Testing: unit/integration/E2E coverage defined; no waivers planned. PASS
- UX Consistency: shadcn/ui + Tailwind tokens; loading/empty/error states enumerated. PASS
- Performance: budgets listed; measurement plan in Phase 2. PASS

Post-Design Recheck: PASS (artifacts generated, no new violations introduced).

## Project Structure

### Documentation (this feature)

```text
/mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/specs/001-travel-memory-album/
â”śâ”€â”€ plan.md
â”śâ”€â”€ research.md
â”śâ”€â”€ data-model.md
â”śâ”€â”€ quickstart.md
â”śâ”€â”€ contracts/
â””â”€â”€ tasks.md
```

### Source Code (repository root)

```text
/mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/
app/
â”śâ”€â”€ (auth)/
â”śâ”€â”€ (app)/
â”śâ”€â”€ s/
â””â”€â”€ api/

components/
â”śâ”€â”€ ui/
â””â”€â”€ globe/

lib/
â”śâ”€â”€ ai/
â”śâ”€â”€ entitlements/
â”śâ”€â”€ observability/
â”śâ”€â”€ share/
â”śâ”€â”€ stripe/
â””â”€â”€ supabase/

public/
supabase/
â”śâ”€â”€ functions/
â””â”€â”€ migrations/

tests/
â”śâ”€â”€ unit/
â”śâ”€â”€ integration/
â””â”€â”€ e2e/
```

**Structure Decision**: Single Next.js App Router project with route handlers under `app/api` and Supabase Edge Functions in `supabase/functions`. Shared domain logic lives in `lib/`, UI in `components/`, and 3D globe components isolated under `components/globe`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|

## Phase 0: Research (complete)

Artifacts:
- /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/specs/001-travel-memory-album/research.md

## Phase 1: Design & Contracts (complete)

Artifacts:
- /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/specs/001-travel-memory-album/data-model.md
- /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/specs/001-travel-memory-album/contracts/openapi.yaml
- /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/specs/001-travel-memory-album/quickstart.md

## Phase 2: Implementation Plan (ordered)

1. Auth + schema + RLS + storage buckets (Supabase projects + migrations).
2. Trips/moments/media CRUD, media upload finalization, and gallery performance.
3. Dashboard 3D globe (client-rendered, perf instrumentation).
4. Share links + public pages + privacy redactions + rate limiting.
5. Stripe billing + entitlements + paywall gates.
6. Share Studio asset generation + storage + management.
7. AI jobs + Gemini integration + queue runner + cost controls.
8. Hardening: observability, security review, perf budgets, and CI gates.
