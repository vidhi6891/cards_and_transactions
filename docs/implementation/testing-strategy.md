# Testing Strategy

Testing is layered so we get fast feedback and strong confidence.

## Quality goals

- Catch logic regressions early.
- Verify feature behavior across real async flows.
- Validate key user journeys in a real browser.
- Catch unintended UI changes in important screens.

## Layered strategy

### Unit layer

- Purpose:
  - Validate pure logic and edge cases.
- Benefits:
  - Fastest feedback and low maintenance.
- Typical targets:
  - Filtering, summaries, formatting, and export rules.
- Tools:
  - `Vitest` (direct function and hook-focused tests).

### Integration layer

- Purpose:
  - Validate behavior across composed UI and async state transitions.
- Benefits:
  - Catches bugs that unit tests often miss.
- Typical targets:
  - Load/error states, filter apply/reset, section interaction behavior.
- Tools:
  - `Vitest` + `@testing-library/react`.
- Main scope:
  - `CardsOverview.integration.test.tsx` for end-to-end feature composition inside React.

### E2E layer

- Purpose:
  - Validate critical user flows in a real browser.
- Benefits:
  - Catches real interaction and environment issues.
- Typical targets:
  - Card selection, filtering flows, export, keyboard paths.
- Tools:
  - `Playwright`.
- Main specs:
  - `tests/e2e/cards-overview.spec.ts`.

### Visual regression layer

- Purpose:
  - Protect key screens from unintended visual drift.
- Benefits:
  - Fast signal for UI regressions when kept focused.
- Typical targets:
  - Default state plus one or two important filtered states.
- Tools:
  - `Playwright` screenshot assertions.
- Main specs:
  - `tests/e2e/cards-overview.visual.spec.ts`.

## Tradeoffs and policy

- Unit tests give speed; integration and e2e give confidence.
- Visual snapshots are intentionally limited to reduce noisy baseline churn.
- Assertions focus on user-visible outcomes, not internal implementation details.
