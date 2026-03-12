# Design Decisions

This document lists the main architecture choices for the feature.
It focuses on decisions and tradeoffs, not low-level code details.

## Decision criteria

- Easy to maintain and extend.
- Clear path from mock data to real backend.
- Stable and predictable UX.
- Accessibility, responsiveness, and testing treated as core quality needs.

## D1. Feature-oriented modular architecture

- Decision:
  - Organize code by feature, with a small shared layer for common parts.
- Rationale:
  - Keeps feature logic, UI, and tests close together.
  - Reduces coupling between unrelated areas.
- Tradeoffs:
  - Needs team conventions so features stay consistent.
  - Shared abstractions must be added carefully.

## D2. Stable data contract boundary

- Decision:
  - Keep data access separate from UI state and rendering logic.
- Rationale:
  - Makes moving from local JSON to real APIs easier.
  - Keeps transport concerns (fetch, errors, latency) out of UI components.
- Tradeoffs:
  - Adds extra layers in a small project.
  - Requires clear API contract ownership.

## D3. Tailwind for layout + CSS variables for dynamic theme values

- Decision:
  - Use Tailwind utilities for layout/responsiveness, and CSS variables for dynamic theme tokens.
- Rationale:
  - Fast updates for spacing, grid, and breakpoints.
  - Better consistency across screens.
  - Dynamic card colors can be applied without creating dynamic class names.
- Tradeoffs:
  - Markup can get class-heavy.
  - Styling is split between JSX classes and feature CSS variables.

## D4. Deterministic card theming

- Decision:
  - Generate card theme tokens deterministically from card identity.
- Rationale:
  - Helps users quickly connect cards with related transactions.
  - Avoids index-based color mapping that breaks when order changes.
- Tradeoffs:
  - Similar-looking colors can still happen as cards increase.
  - Theme generation logic in frontend adds complexity.
- Future direction:
  - Move theme tokens to the backend so color identity is canonical across web/mobile clients.

## D5. Debounced filter interaction model

- Decision:
  - Keep local draft inputs and apply query/min/max filters with debounce (`250ms`).
- Rationale:
  - Reduces request bursts while typing.
  - Keeps typing smooth under latency.
- Tradeoffs:
  - Results update with a small delay.
  - Requires sync logic between draft values and applied filter state.

## D6. Async safety + perceived performance strategy

- Decision:
  - Use cancelable requests and keep current results visible during refresh.
- Rationale:
  - Prevents stale responses from overwriting newer state.
  - Reduces layout jumps and preserves user context during frequent changes.
- Tradeoffs:
  - Users briefly see old data while refresh is in progress.
  - Requires clear loading signals to avoid confusion.

## D7. Accessibility and responsiveness as architecture constraints

- Decision:
  - Treat accessibility, responsiveness, and testing as required architecture constraints.
- Rationale:
  - Avoids expensive retrofit work later.
  - Increases confidence across devices, input methods, and release cycles.
- Tradeoffs:
  - Higher upfront effort.
  - More ongoing QA and documentation maintenance.
