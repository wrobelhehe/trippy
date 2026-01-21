# Tasks: Travel Memory Album

**Input**: Design documents from `/mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/specs/001-travel-memory-album/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED by the constitution. No waivers recorded.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create env template in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/.env.example
- [X] T002 Update runtime and SDK dependencies in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/package.json
- [X] T003 [P] Add Vitest config in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/vitest.config.ts
- [X] T004 [P] Add Playwright config in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/playwright.config.ts
- [X] T005 [P] Add test setup utilities in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/tests/setup.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**Checkpoint**: Foundation ready - user story implementation can now begin

- [X] T006 [P] Implement browser Supabase client in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/lib/supabase/client.ts
- [X] T007 [P] Implement server Supabase client in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/lib/supabase/server.ts
- [X] T008 [P] Implement Supabase middleware helper in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/lib/supabase/middleware.ts
- [X] T009 Implement auth gating in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/middleware.ts
- [X] T010 [P] Implement auth actions in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/lib/supabase/auth.ts
- [X] T011 Implement sign-in UI in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/app/(auth)/sign-in/page.tsx
- [X] T012 Implement sign-up UI in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/app/(auth)/sign-up/page.tsx
- [X] T013 Implement verify UI in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/app/(auth)/verify/page.tsx
- [X] T014 Implement forgot-password UI in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/app/(auth)/forgot-password/page.tsx
- [X] T015 Implement reset-password UI in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/app/(auth)/reset-password/page.tsx
- [X] T016 Implement authenticated app shell layout in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/app/(app)/layout.tsx
- [X] T017 [P] Create core schema migration in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/supabase/migrations/001_init.sql
- [X] T018 [P] Create RLS policies migration in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/supabase/migrations/002_rls.sql
- [X] T019 [P] Create storage policies migration in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/supabase/migrations/003_storage.sql
- [X] T020 [P] Implement entitlements helper in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/lib/entitlements/entitlements.ts
- [X] T021 [P] Implement audit logging helper in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/lib/observability/audit.ts
- [X] T022 [P] Implement Stripe server helpers in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/lib/stripe/server.ts
- [X] T023 Implement Stripe Checkout endpoint in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/app/api/stripe/checkout/route.ts
- [X] T024 Implement Stripe portal endpoint in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/app/api/stripe/portal/route.ts
- [X] T025 Implement Stripe webhook endpoint in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/app/api/stripe/webhook/route.ts
- [X] T026 Implement Stripe webhook Edge Function in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/supabase/functions/stripe-webhook/index.ts
- [X] T027 Implement billing page UI in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/app/(app)/billing/page.tsx

---

## Phase 3: User Story 1 - Capture a past trip memory (Priority: P1) MVP

**Goal**: Owners can create past trips, add moments/media, and browse an album + diary experience.

**Independent Test**: Create a trip with at least one moment and media, then view the trip page and gallery.

### Tests for User Story 1 (REQUIRED)

- [X] T028 [P] [US1] Contract tests for trips endpoints in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/tests/contract/trips.spec.ts
- [X] T029 [P] [US1] Contract tests for moments endpoints in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/tests/contract/moments.spec.ts
- [X] T030 [P] [US1] Integration test for trip + moment flow in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/tests/integration/trip-moment-flow.spec.ts
- [X] T031 [P] [US1] E2E test for trip creation + media upload in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/tests/e2e/trip-flow.spec.ts

### Implementation for User Story 1

- [X] T032 [P] [US1] Implement trips data access in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/lib/supabase/trips.ts
- [X] T033 [P] [US1] Implement moments data access in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/lib/supabase/moments.ts
- [X] T034 [P] [US1] Implement media data access in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/lib/supabase/media.ts
- [X] T035 [US1] Implement trips endpoint in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/app/api/trips/route.ts
- [X] T036 [US1] Implement trip detail endpoint in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/app/api/trips/[tripId]/route.ts
- [X] T037 [US1] Implement trip restore endpoint in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/app/api/trips/[tripId]/restore/route.ts
- [X] T038 [US1] Implement trip moments endpoint in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/app/api/trips/[tripId]/moments/route.ts
- [X] T039 [US1] Implement moment update/delete endpoint in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/app/api/moments/[momentId]/route.ts
- [X] T040 [US1] Implement media upload URL endpoint in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/app/api/media/upload-url/route.ts
- [X] T041 [US1] Implement media finalize endpoint in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/app/api/media/complete/route.ts
- [X] T042 [US1] Implement dashboard page shell in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/app/(app)/dashboard/page.tsx
- [X] T043 [P] [US1] Build globe component (R3F + dynamic import) in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/components/globe/Globe.tsx
- [X] T044 [P] [US1] Build globe pins layer in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/components/globe/GlobePins.tsx
- [X] T045 [P] [US1] Add FPS/perf monitor hook in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/components/globe/useFpsMonitor.ts
- [X] T046 [US1] Implement trips list page in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/app/(app)/trips/page.tsx
- [X] T047 [US1] Implement trip detail page in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/app/(app)/trips/[id]/page.tsx
- [X] T048 [P] [US1] Build trip form component in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/components/trips/TripForm.tsx
- [X] T049 [P] [US1] Build moment form component in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/components/trips/MomentForm.tsx
- [X] T050 [P] [US1] Build highlights editor in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/components/trips/HighlightsEditor.tsx
- [X] T051 [P] [US1] Build media gallery in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/components/media/MediaGallery.tsx
- [X] T052 [P] [US1] Build media upload UI in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/components/media/UploadDropzone.tsx
- [X] T053 [P] [US1] Build trip stats cards in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/components/trips/TripStats.tsx

---

## Phase 4: User Story 2 - Share a trip or profile safely (Priority: P2)

**Goal**: Owners can create share links with privacy redactions and manage rotation/revocation.

**Independent Test**: Create a share link with redactions and verify link access + revocation.

### Tests for User Story 2 (REQUIRED)

- [ ] T054 [P] [US2] Contract tests for share link endpoints in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/tests/contract/share-links.spec.ts
- [ ] T055 [P] [US2] Integration test for share link creation/redactions in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/tests/integration/share-links.spec.ts
- [ ] T056 [P] [US2] E2E test for share link management in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/tests/e2e/share-links.spec.ts

### Implementation for User Story 2

- [ ] T057 [P] [US2] Implement token hashing utilities in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/lib/share/tokens.ts
- [ ] T058 [P] [US2] Implement share link data access in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/lib/share/share-links.ts
- [ ] T059 [US2] Implement share link create endpoint in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/app/api/share-links/route.ts
- [ ] T060 [US2] Implement share link revoke endpoint in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/app/api/share-links/[shareLinkId]/revoke/route.ts
- [ ] T061 [US2] Implement share link rotate endpoint in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/app/api/share-links/[shareLinkId]/rotate/route.ts
- [ ] T062 [P] [US2] Build trip share panel in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/components/trips/SharePanel.tsx
- [ ] T063 [US2] Build profile share settings page in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/app/(app)/settings/page.tsx
- [ ] T064 [P] [US2] Build share link list component in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/components/share/ShareLinkList.tsx
- [ ] T065 [P] [US2] Build share link form component in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/components/share/ShareLinkForm.tsx

---

## Phase 5: User Story 3 - View shared memories as a guest (Priority: P2)

**Goal**: Guests can open a shared link and see only permitted content with safe errors.

**Independent Test**: Open a valid share link and verify content scope + safe error for invalid tokens.

### Tests for User Story 3 (REQUIRED)

- [ ] T066 [P] [US3] Contract test for share payload endpoint in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/tests/contract/share-payload.spec.ts
- [ ] T067 [P] [US3] Integration test for guest share view in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/tests/integration/share-guest.spec.ts
- [ ] T068 [P] [US3] E2E test for public share pages in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/tests/e2e/share-guest.spec.ts

### Implementation for User Story 3

- [ ] T069 [P] [US3] Implement share payload sanitizer in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/lib/share/serializer.ts
- [ ] T070 [P] [US3] Implement share rate limiting helper in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/lib/share/rate-limit.ts
- [ ] T071 [US3] Implement share payload endpoint in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/app/api/share/[token]/route.ts
- [ ] T072 [US3] Implement public trip share page in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/app/s/trip/[token]/page.tsx
- [ ] T073 [US3] Implement public profile share page in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/app/s/profile/[token]/page.tsx
- [ ] T074 [P] [US3] Build shared media gallery in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/components/share/SharedMediaGallery.tsx
- [ ] T075 [P] [US3] Build share error/empty state UI in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/components/share/ShareErrorState.tsx

---

## Phase 6: User Story 4 - Generate premium share assets (Priority: P3)

**Goal**: Owners can generate IG Story, square post, and widget assets within plan limits.

**Independent Test**: Generate assets for a trip under free and premium entitlements.

### Tests for User Story 4 (REQUIRED)

- [ ] T076 [P] [US4] Contract test for share assets endpoint in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/tests/contract/share-assets.spec.ts
- [ ] T077 [P] [US4] Integration test for asset generation gating in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/tests/integration/share-assets.spec.ts

### Implementation for User Story 4

- [ ] T078 [P] [US4] Implement share asset templates in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/lib/share/templates/index.ts
- [ ] T079 [P] [US4] Implement asset generator service in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/lib/share/assets.ts
- [ ] T080 [US4] Implement share assets endpoint in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/app/api/share-assets/route.ts
- [ ] T081 [US4] Implement Share Studio page in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/app/(app)/share-studio/page.tsx
- [ ] T082 [US4] Implement Share Studio UI in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/components/share/ShareStudio.tsx
- [ ] T083 [P] [US4] Implement share assets data access in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/lib/share/share-assets.ts

---

## Phase 7: User Story 5 - Use AI-assisted memory tools (Priority: P3)

**Goal**: Premium owners can create AI draft trips or ticket imports with privacy-safe outputs.

**Independent Test**: Start an AI job, observe status, review draft, and confirm safe fields.

### Tests for User Story 5 (REQUIRED)

- [ ] T084 [P] [US5] Contract test for AI jobs endpoints in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/tests/contract/ai-jobs.spec.ts
- [ ] T085 [P] [US5] Integration test for AI job lifecycle in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/tests/integration/ai-jobs.spec.ts
- [ ] T086 [P] [US5] E2E test for AI draft flow in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/tests/e2e/ai-jobs.spec.ts

### Implementation for User Story 5

- [ ] T087 [P] [US5] Implement Gemini client wrapper in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/lib/ai/gemini.ts
- [ ] T088 [P] [US5] Implement AI jobs data access in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/lib/ai/jobs.ts
- [ ] T089 [US5] Implement AI jobs endpoint in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/app/api/ai-jobs/route.ts
- [ ] T090 [US5] Implement AI job status endpoint in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/app/api/ai-jobs/[jobId]/route.ts
- [ ] T091 [US5] Implement AI job retry endpoint in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/app/api/ai-jobs/[jobId]/retry/route.ts
- [ ] T092 [US5] Implement AI job runner Edge Function in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/supabase/functions/ai-job-runner/index.ts
- [ ] T093 [P] [US5] Build AI job launcher UI in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/components/ai/AiJobLauncher.tsx
- [ ] T094 [P] [US5] Build AI trip draft review UI in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/components/ai/TripDraftReview.tsx
- [ ] T095 [P] [US5] Build ticket import UI in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/components/ai/TicketImport.tsx

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T096 [P] Add Sentry client config in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/sentry.client.config.ts
- [ ] T097 [P] Add Sentry server config in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/sentry.server.config.ts
- [ ] T098 [P] Add Sentry edge config in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/sentry.edge.config.ts
- [ ] T099 [P] Add CI workflow in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/.github/workflows/ci.yml
- [ ] T100 [P] Add deploy workflow in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/.github/workflows/deploy.yml
- [ ] T101 [P] Add performance budget checklist in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/specs/001-travel-memory-album/checklists/perf-budget.md
- [ ] T102 [P] Add UX/accessibility checklist in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/specs/001-travel-memory-album/checklists/ux-a11y.md
- [ ] T103 [P] Add security checklist in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/specs/001-travel-memory-album/checklists/security.md
- [ ] T104 Update quickstart validation steps in /mnt/c/Users/wiktor/desktop/Trippy.io web/trippy/specs/001-travel-memory-album/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: No dependencies on other stories
- **US2 (P2)**: No dependencies on other stories
- **US3 (P2)**: Depends on US2 for share link creation and token format
- **US4 (P3)**: Depends on US1 and entitlements (Phase 2)
- **US5 (P3)**: Depends on US1 and entitlements (Phase 2)

---

## Parallel Execution Examples

### User Story 1

```text
T028 + T029 + T030 + T031
T032 + T033 + T034
T043 + T044 + T045
T048 + T049 + T050 + T051 + T052 + T053
```

### User Story 2

```text
T054 + T055 + T056
T057 + T058
T062 + T064 + T065
```

### User Story 3

```text
T066 + T067 + T068
T069 + T070
T074 + T075
```

### User Story 4

```text
T076 + T077
T078 + T079 + T083
```

### User Story 5

```text
T084 + T085 + T086
T087 + T088
T093 + T094 + T095
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate US1 independently (tests + manual walkthrough)

### Incremental Delivery

1. Setup + Foundational
2. US1 → Test → Deploy/Demo
3. US2 + US3 → Test → Deploy/Demo
4. US4 + US5 → Test → Deploy/Demo
5. Polish & cross-cutting checks
