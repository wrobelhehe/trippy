<!--
Sync Impact Report
- Version change: N/A (template) -> 1.0.0
- Modified principles: Template principle 1 -> I. Code Quality First; Template
  principle 2 -> II. Test Discipline (Non-Negotiable); Template principle 3 ->
  III. UX Consistency & Accessibility; Template principle 4 -> IV. Performance
  Budgets; Template principle 5 -> V. Quality Gates for Reviews
- Added sections: Quality & Testing Standards; UX & Performance Requirements
- Removed sections: None
- Templates requiring updates: .specify/templates/plan-template.md (updated),
  .specify/templates/spec-template.md (updated), .specify/templates/tasks-template.md
  (updated), .specify/templates/commands/*.md (not found)
- Follow-up TODOs: None
-->

# Trippy.io Web Constitution

## Core Principles

### I. Code Quality First
- All changes MUST keep the codebase readable and maintainable: clear naming, small
  functions, and no dead code or commented-out blocks.
- Type safety is required; unchecked casts or `any` usage MUST be explicitly justified.
- Linting, formatting, and build checks MUST pass before merge.

Rationale: clean code reduces defects and speeds iteration.

### II. Test Discipline (Non-Negotiable)
- Behavior changes MUST include automated tests that fail before the fix and pass
  after.
- Coverage MUST include unit tests for logic, integration tests for boundaries, and
  UI or flow tests for critical user journeys.
- Exceptions require an explicit waiver in the spec and plan with risk assessment.

Rationale: tests prevent regressions and document expected behavior.

### III. UX Consistency & Accessibility
- UI changes MUST use the approved component library and design tokens; new patterns
  require documented rationale and review.
- All flows MUST define loading, empty, and error states.
- Accessibility is required: keyboard navigation, visible focus states, and contrast
  compliance for new or updated UI.

Rationale: consistent UX builds trust and reduces support costs.

### IV. Performance Budgets
- Each feature MUST define measurable budgets (for example LCP, interaction latency,
  or bundle size) in its spec or plan.
- Performance regressions are blocking; changes MUST include before and after
  measurement or an approved justification.
- Prefer efficient data loading, memoization, and caching to meet budgets.

Rationale: performance is a user-visible requirement.

### V. Quality Gates for Reviews
- PRs MUST include test evidence, a UX impact summary, and a performance impact
  summary.
- Code review MUST verify adherence to linting, typing, tests, UX standards, and
  budgets.
- High-risk changes require a rollback plan or feature flag.

Rationale: formal gates enforce consistent quality.

## Quality & Testing Standards

- Lint, typecheck, and build MUST pass in CI for every change.
- New behavior MUST include regression tests in the same change set.
- Test data MUST be deterministic; flaky tests must be fixed or quarantined with a
  documented follow-up.

## UX & Performance Requirements

- Use existing design system components by default; deviations require a documented
  decision in the spec.
- Accessibility checks are required for affected flows (keyboard, focus, contrast).
- Performance budgets and measurement approach MUST be captured in the spec or plan.

## Governance

- This constitution is the highest authority; specs, plans, and tasks MUST comply.
- Amendments require a documented proposal, updated templates, an updated Sync Impact
  Report, and maintainer approval.
- Versioning follows semantic versioning: MAJOR for breaking governance changes,
  MINOR for new or expanded principles, PATCH for clarifications.
- Every plan MUST include a Constitution Check, and every PR MUST document compliance
  or an approved exception.

**Version**: 1.0.0 | **Ratified**: 2026-01-20 | **Last Amended**: 2026-01-20
