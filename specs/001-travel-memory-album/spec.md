# Feature Specification: Travel Memory Album

**Feature Branch**: `001-travel-memory-album`  
**Created**: 2026-01-20  
**Status**: Draft  
**Input**: User description: "Build a production-grade web application that functions as a Travel Album + Travel Diary (memories-first), explicitly NOT a trip planner. The product helps users capture and revisit past travel memories (photos, videos, diary moments, and highlights) and share them in a premium, privacy-first way via read-only links and one-click sharing assets (IG Story + embeddable widgets). The experience must feel premium (glass design, performance, fast media browsing). It is a memory album/diary for past trips only, with no planning, booking, schedules, or future trip language. Core objects include Profile, Trip, Moment, Media, Highlights, Share Links, and AI Jobs. Key modules: auth, globe dashboard, trips, sharing, share studio, subscriptions, and premium AI features." 

## Clarifications

### Session 2026-01-20
- Q: What should the default lifetime for share links be? → A: 30 days by default; owner can extend/renew or set a shorter expiry.
- Q: Should guests be able to download media from share links? → A: View-only by default; owner toggle per share link to enable downloads.
- Q: How should media ownership and reuse work across trips? → A: Media belongs to the owner and can attach to multiple trips and/or moments.
- Q: What should happen when an owner deletes a trip? → A: Soft delete to Trash for 30 days; owner can restore; share links revoked immediately.
- Q: How should share link tokens be stored and rotated? → A: Store hashed tokens only; rotate only on explicit owner request.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Capture a past trip memory (Priority: P1)

As a signed-in owner, I create a past trip, add moments and media, and browse my memories in a fast, premium album + diary experience.

**Why this priority**: This is the core value of the product and unlocks every other feature.

**Independent Test**: Can be fully tested by creating one trip with at least one moment and media, then viewing the trip page and gallery.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they create a trip with title/place and optional dates, **Then** the trip appears on the dashboard and in the trips list.
2. **Given** an existing trip, **When** the user adds a moment with text and media, **Then** the moment appears in chronological order and the media is visible in the gallery.
3. **Given** a trip, **When** the user edits highlights or trip metadata, **Then** the updates are reflected across the trip view and dashboard tooltip.

---

### User Story 2 - Share a trip or profile safely (Priority: P2)

As an owner, I generate a read-only share link for a trip or my profile and control privacy redactions.

**Why this priority**: Sharing is a core outcome and must be safe and privacy-first.

**Independent Test**: Can be fully tested by creating a share link with redactions, then verifying link access and revocation.

**Acceptance Scenarios**:

1. **Given** an existing trip, **When** the owner creates a share link and hides exact dates, **Then** the share page shows only the allowed date granularity.
2. **Given** an active share link, **When** the owner revokes or rotates it, **Then** the previous link no longer grants access.

---

### User Story 3 - View shared memories as a guest (Priority: P2)

As a guest without an account, I open a shared trip or profile link and view only the allowed content quickly and safely.

**Why this priority**: Guests are a primary persona and the product must be trustworthy and fast for read-only sharing.

**Independent Test**: Can be fully tested by opening a valid link, then validating content scope and privacy behavior.

**Acceptance Scenarios**:

1. **Given** a valid trip share link, **When** a guest opens it, **Then** they see the trip, highlights, and media allowed by the link scope.
2. **Given** a revoked or invalid token, **When** a guest opens the link, **Then** they see a safe error state with no data leakage.

---

### User Story 4 - Generate premium share assets (Priority: P3)

As an owner, I generate designed assets (IG Story, square post, embed widget) from a trip or profile, with plan-based limits.

**Why this priority**: Premium share assets are a differentiator and a key upgrade driver.

**Independent Test**: Can be fully tested by generating assets for one trip under free and premium entitlements.

**Acceptance Scenarios**:

1. **Given** a premium account, **When** the owner generates an IG Story asset, **Then** the asset is saved and reusable without watermark.
2. **Given** a free account at its export limit, **When** the owner attempts another export, **Then** they see an upgrade CTA and no asset is created.

---

### User Story 5 - Use AI-assisted memory tools (Priority: P3)

As a premium owner, I can create a draft trip from photos or import a ticket image to enrich a trip without exposing sensitive details.

**Why this priority**: AI is a premium accelerator that improves speed while maintaining privacy.

**Independent Test**: Can be fully tested by starting an AI job and reviewing the draft before publishing.

**Acceptance Scenarios**:

1. **Given** a batch of photos, **When** a premium user starts AI trip creation, **Then** they receive a draft trip with proposed place, dates (if inferred), and highlights for review.
2. **Given** a ticket image upload, **When** the AI parses it, **Then** only safe fields appear in the trip draft and sensitive fields remain hidden in shares by default.

---

### Edge Cases

- What happens when a free user exceeds per-trip media limits or export limits?
- How does the system handle a share link that is revoked or rotated while a guest is viewing it?
- What happens when a trip has no dates or no moments?
- How does the system handle corrupt or oversized media uploads?
- What happens when an AI job fails or returns low-confidence results?
- How does the globe behave with many trips in the same location (clustering)?
- What happens when privacy settings change after a share link is distributed?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support account creation and sign-in with Google sign-in and email + password, including email verification and password reset.
- **FR-002**: System MUST require authenticated sessions for all owner features; guests may access content only via share links.
- **FR-003**: System MUST provide onboarding to set display name, with optional avatar and bio, and a path to create the first trip (manual or AI based on plan).
- **FR-004**: Dashboard MUST display a 3D globe with trip pins supporting rotate, zoom, inertia, pin click to open trip, and hover mini-card details (title, place, dates per privacy, cover thumbnail, moment count).
- **FR-005**: Dashboard MUST show stats for total trips, unique countries, total moments, and newest trip.
- **FR-006**: Navigation MUST include Dashboard, Trips, Share Studio, Settings, Billing/Premium, plus a user menu for profile, billing, and logout.
- **FR-007**: Users MUST be able to create trips with title, place, optional dates, cover, tags, and a privacy setting.
- **FR-008**: Users MUST be able to edit trip metadata and highlights (3-7 items), and delete trips with explicit confirmation; deleted trips are soft-deleted to Trash for 30 days, share links revoked immediately, and owners can restore during the retention window.
- **FR-009**: Users MUST be able to add, edit, and delete moments with text, optional media, optional location, and timestamp or manual order.
- **FR-010**: Media MUST be owner-scoped, stored once, and attachable to multiple trips and moments, with thumbnails and basic metadata.
- **FR-011**: Media browsing MUST be thumbnail-first with on-demand full viewing for photos and videos.
- **FR-012**: Optional mini-map or mini-globe MAY display moment locations as memory context only, without any planning features.
- **FR-013**: Users MUST be able to create share links for trip or profile, each with its own privacy redactions, and revoke or rotate tokens.
- **FR-013b**: Share link tokens MUST be stored as hashes only; rotation occurs only on explicit owner request.
- **FR-013a**: Share links MUST default to a 30-day expiration; owners can extend/renew or set a shorter expiry at creation.
- **FR-014**: Share pages MUST be read-only, require no login, and expose only the data allowed by link scope and redaction settings.
- **FR-014a**: Share links MUST default to view-only media; owners can enable downloads per link.
- **FR-015**: Privacy redactions MUST support hiding exact dates (month/year or hidden), hiding sensitive ticket details, and hiding internal metadata and costs.
- **FR-016**: Public share routes MUST be `/s/trip/[token]` and `/s/profile/[token]` and return safe error states for invalid or revoked tokens.
- **FR-017**: Share Studio MUST generate IG Story (9:16), square post (1:1), and embeddable widget assets for trips or profiles; assets are saved and reusable.
- **FR-018**: Plan entitlements MUST enforce media limits, AI access, template access, export limits, and watermark rules, with clear upgrade CTAs at gating points.
- **FR-019**: AI jobs MUST allow premium users to draft trips from photo batches and import ticket images, with visible progress and a review step before publishing.
- **FR-020**: Sensitive AI-extracted ticket fields MUST be hidden by default in all share views; only safe highlights are shown.
- **FR-021**: System MUST record audit events for share link create/revoke, subscription status changes, and AI job lifecycle; critical errors MUST be observable.
- **FR-022**: Share endpoints MUST be protected against token enumeration and abuse via rate limiting and unguessable tokens.
- **FR-023**: The product MUST support separate dev and prod environments with isolated data and billing.
- **FR-024**: The product MUST NOT include future trip planning, booking, reservations, schedules, or route optimization; all dates and moments represent past trips only.

### UX Consistency Requirements

- **UX-001**: UI MUST present a premium, glass-inspired experience with clear hierarchy and readable contrast.
- **UX-002**: All copy and labels MUST be memory-first and past-trip oriented; no planning or future-trip language is permitted.
- **UX-003**: Each primary screen MUST have a single primary call to action, and fast moment creation uses a modal or bottom sheet.
- **UX-004**: All core flows MUST include loading, empty, and error states (globe, trips, media, share, AI jobs, assets).
- **UX-005**: Accessibility MUST include keyboard navigation, visible focus, ARIA for interactive elements, and adequate contrast.

### Performance Requirements

- **PERF-001**: Globe interactions MUST feel smooth with 200 trips, maintaining 55-60 fps on a modern laptop and input response within 100 ms.
- **PERF-002**: Share pages MUST show first meaningful content within 2 seconds on broadband and within 4 seconds on 4G at the 90th percentile.
- **PERF-003**: Trip media galleries MUST load initial thumbnails within 2 seconds and continue loading additional items without blocking interaction.
- **PERF-004**: The team MUST define baseline performance measurements for the above targets and monitor regressions before release.

### Key Entities *(include if feature involves data)*

- **Profile**: Owner identity, display name, avatar, bio, share settings, and public presentation.
- **Trip**: Past trip with title, place, optional dates, cover, tags, privacy, highlights, moments, and media references.
- **Moment**: Diary entry within a trip, with text, timestamp or order, optional location, and attached media.
- **Media**: Owner-scoped photo or video with thumbnails, metadata, and references to one or more trips or moments.
- **Highlight**: Short curated bullet for a trip, including optional route-style highlight from ticket import.
- **ShareLink**: Tokenized link with scope (trip or profile), redaction settings, status, and rotation history.
- **ShareAsset**: Generated asset (story, post, widget) tied to a trip or profile, with template and watermark rules.
- **AIJob**: Background analysis task with type, status, input batch, draft outputs, and review state.
- **Entitlement**: Plan rules for limits, AI access, template access, and export rights.

### Assumptions

- New trips are private by default and only become shareable when a link is created.
- Free plan limits default to 3 photos and 1 video per trip unless configured otherwise.
- Date display on shares defaults to month/year when exact dates are hidden.
- Moments are ordered chronologically by timestamp when present, otherwise by manual order.

### Dependencies

- Identity provider support for Google sign-in and verified email flows.
- Media storage and delivery capable of handling photos and videos at scale.
- Subscription billing and entitlement management service.
- Background processing capacity for AI job execution.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 90% of owners can create a trip with at least one moment and media in under 5 minutes on first use.
- **SC-002**: 95% of share link views render first meaningful content within 2 seconds on broadband and within 4 seconds on 4G.
- **SC-003**: Globe interactions sustain 55+ fps with 200 trips and 500 moments on reference devices in lab tests.
- **SC-004**: 100% of attempts to exceed free plan limits are blocked with an upgrade CTA, and 0% of premium entitlements are blocked incorrectly in tests.
- **SC-005**: 90% of guests can view a shared trip/profile without errors and see only redacted content specified by link settings.
- **SC-006**: 80% of users who generate share assets complete export without support tickets or manual intervention.
