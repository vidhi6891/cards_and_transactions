# Design Decisions

This document captures intentional design choices and their tradeoffs.

## 1) API adapter layer over direct fetch in components/hooks

- Decision:
  - All data access goes through `src/features/cardsOverview/api/cardsApi.ts` (`getCards`, `getTransactions`).
- Why:
  - Keeps React hooks/components focused on UI state, not transport details.
  - Preserves a clean seam for switching from static JSON to real backend endpoints.
- Tradeoffs:
  - Adds an extra abstraction layer for a small app.
  - Requires adapter tests to avoid regressions in filter/sort behavior.

## 2) Debounced filter commit model (draft vs committed state)

- Decision:
  - `useTransactionFilterForm` keeps immediate local draft input and commits query/min/max after a debounce window (`250ms`).
- Why:
  - Prevents a request on every keystroke.
  - Keeps typing responsive even when transaction requests are simulated with latency.
- Tradeoffs:
  - Slight code complexity (draft synchronization + debounced commit guard).
  - User-visible delay before results update.
  - Needs clear reset behavior so draft and committed values cannot diverge.

## 3) Keep previous results visible while refreshing filters

- Decision:
  - On filter changes, existing rows stay rendered while new data loads.
- Why:
  - Reduces visual jitter and large layout shifts.
  - Preserves interaction continuity for keyboard and assistive-tech users.
- Tradeoffs:
  - UI can briefly show stale results while request is in flight.
  - Requires explicit loading affordance to avoid ambiguity.

## 4) Deterministic per-card color system (hash-based theme mapping)

- Decision:
  - Card colors are generated from `themeKey`/`id` via hash + slot allocation in `utils/theme.ts`, then exposed as CSS variables via `utils/themeStyles.ts`.
- Why:
  - Produces stable colors across sessions without manually curating palette entries.
  - Scales better than index-based color assignment when cards are added/removed/reordered.
  - Keeps cards and related transaction panels visually linked.
- Tradeoffs:
  - Generated hues can still feel close as card count grows.
  - Algorithm complexity is higher than a static palette.
  - True global uniqueness is bounded by theme slot capacity.

## 5) Tailwind + feature CSS variables hybrid styling

- Decision:
  - Layout and spacing rely on utility classes; feature-specific visual tokens/rings/surfaces are implemented via CSS variables in `cardsOverview.css`.
- Why:
  - Utility classes keep responsive structure fast to iterate.
  - CSS variables make dynamic theming practical without runtime class generation.
- Tradeoffs:
  - Styling responsibility is split across JSX + CSS file.
  - Requires stronger naming discipline for custom CSS variables.

## 6) Abortable async flows in hooks

- Decision:
  - `AbortController` is used for cards/transactions requests in `useCardsOverview`.
- Why:
  - Prevents obsolete responses from overwriting newer state.
  - Avoids React state updates after effect cleanup/unmount.
- Tradeoffs:
  - Additional guard code around aborted states.
  - More edge cases in tests for loading/error transitions.
