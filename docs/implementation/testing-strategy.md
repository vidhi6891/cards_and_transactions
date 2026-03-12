# Testing Strategy

The test suite is layered by risk and feedback speed.

## Unit (Vitest)

- Scope:
  - Pure helpers/formatters/filter logic in `src/features/cardsOverview/utils/*.unit.test.ts`.
  - Filter form behavior in `src/features/cardsOverview/hooks/useTransactionFilterForm.unit.test.ts`.
- Why:
  - Fast, deterministic coverage for business logic and edge cases.

## Integration (Testing Library + Vitest)

- Scope:
  - `src/features/cardsOverview/components/page/CardsOverview.integration.test.tsx`.
- Why:
  - Validates composed behavior across async loading, filtering, and UI state transitions.

## E2E (Playwright)

- Scope:
  - Functional flows: `tests/e2e/cards-overview.spec.ts`.
  - Visual baselines: `tests/e2e/cards-overview.visual.spec.ts`.
- Why:
  - Confirms browser-level behavior (keyboard interaction, CSV export flow, key layout states).

## Tradeoffs

- Integration/E2E prioritize user-visible behavior over implementation details.
- Visual snapshots are intentionally limited to key states to reduce baseline churn.
