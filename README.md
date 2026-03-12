# Cards & Transactions Overview (Frontend)

React + TypeScript application for rendering mocked cards and transactions, with client-side filtering, theming, accessibility support, and automated testing.

## Tech Stack

- Framework: React 19 (function components + hooks)
- Language: TypeScript
- Styling: Tailwind utility classes + feature CSS (`src/features/cardsOverview/cardsOverview.css`)
- Data source: static JSON (`public/data`) accessed through API adapters
- Testing: Vitest + Testing Library + Playwright (including visual snapshots)

## Why This Architecture

- API-first frontend shape: static JSON is accessed through `api/cardsApi.ts`, so swapping to real HTTP endpoints is straightforward.
- Feature-first module: `src/features/cardsOverview` keeps domain logic cohesive and discoverable.
- Shared UI primitives: `src/shared/ui` avoids duplicating behavior and keeps interactions consistent.
- Mobile-first and accessible by design: responsive section composition, keyboard support, and live announcements are built into core flows.
- Layered testing strategy: unit, integration, e2e, and visual tests provide balanced confidence.

## Folder Overview

- `src/features/cardsOverview/`
  - `api/` API adapter layer
  - `hooks/` state and filter orchestration
  - `components/` page/section/domain components
  - `types/` feature type definitions
  - `utils/` pure helpers and formatters
- `src/shared/ui/` reusable UI primitives and patterns
- `src/shared/hooks/` shared composables
- `src/shared/utils/` shared utilities
- `tests/e2e/` Playwright flows + visual regression tests
- `docs/implementation/` design/testing/performance/a11y/responsiveness/code-structure docs

## Data Endpoints

The app intentionally uses static, mocked endpoints:

- `GET /data/cards.json`
- `GET /data/transactions.json`

## Project Run Guide

### Prerequisites

- Node.js `>= 20`
- npm `>= 10`

### Install

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

Open the app at: `http://localhost:5173` (or the URL shown by Vite).

### Build

```bash
npm run build
```

### Test Commands

```bash
npm run test:unit
npm run test:integration
npm run test:run
npm run test:e2e -- tests/e2e/cards-overview.spec.ts
npm run test:e2e -- tests/e2e/cards-overview.visual.spec.ts
npm run test:e2e:ui
```

### Update Visual Snapshots

```bash
npm run test:e2e -- tests/e2e/cards-overview.visual.spec.ts --update-snapshots
```

## Assumptions and Tradeoffs

- Data source boundary:
  - Local JSON is consumed through an API adapter (`cardsApi.ts`) to preserve a backend-compatible contract.
  - Tradeoff: adds abstraction overhead for a small assignment.
- Filtering strategy:
  - Filtering/sorting is client-side to keep the feature self-contained and fast to iterate.
  - Tradeoff: this does not represent production-scale behavior for large datasets.
- Input responsiveness vs immediacy:
  - Text/amount filters use debounced commits to prevent request churn and reduce UI jank while typing.
  - Tradeoff: results are intentionally not instantaneous on every keystroke.
- Theming model:
  - Card/transaction colors are generated deterministically from card identity instead of manually curated per-card palettes.
  - Tradeoff: near-color collisions are still possible as card count grows.
- Test depth:
  - Visual regression coverage focuses on critical states only.
  - Tradeoff: edge-case layout regressions outside those baselines may not be caught automatically.

## What I Would Improve With More Time

- Move filtering/sorting/pagination to the backend for large datasets and predictable latency.
- Add URL-synced filter state for shareable views and better back/forward navigation.
- Extend filtering with date range + transaction type + saved filter presets.
- Improve export for larger datasets (server-generated CSV, background job, status feedback).
- Add richer transaction insights (categories, recurring detection, spend trends).
- Harden reliability with structured error taxonomy, retries/backoff, and request telemetry.
- Add CI quality gates for performance and visual regressions (budget thresholds + snapshot policy).

## Implementation Documentation

Detailed design and engineering notes:

- [Implementation index](./docs/implementation/README.md)
- [Design decisions](./docs/implementation/design-decisions.md)
- [Testing strategy](./docs/implementation/testing-strategy.md)
- [Performance considerations](./docs/implementation/performance.md)
- [Accessibility](./docs/implementation/accessibility.md)
- [Responsiveness](./docs/implementation/responsiveness.md)
- [Code structure](./docs/implementation/code-structure.md)
