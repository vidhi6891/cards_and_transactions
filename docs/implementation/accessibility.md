# Accessibility

Accessibility is treated as a core architecture requirement, not a late checklist.

## Accessibility model

- Perceivable:
  - Information structure is exposed through semantic regions, headings, and state labels.
- Operable:
  - All primary interactions are keyboard reachable with visible focus indicators.
- Understandable:
  - Form controls and state changes are clearly labeled and communicated.
- Robust:
  - Dynamic updates are announced through live-region patterns for assistive technology.

## Architecture decisions

- Accessibility semantics are built into reusable UI primitives and section components.
- Interactive state is communicated explicitly (selected/disabled/loading/error).
- Dynamic updates use centralized announcements so screen-reader output stays consistent.
- Focus handling is preserved across all interactive elements and breakpoints.
- Transaction selection state is exposed with button semantics and selected-state attributes.

## Screen-reader announcements

- Live-region announcements are used for dynamic, non-focus-driven state changes.
- Announcements explicitly cover:
  - transaction results loading/refresh start,
  - filter application results (result count changed),
  - empty results after filtering,
  - failed data loads.
- This gives screen-reader users the same feedback sighted users get from visual state changes.
- Announcements are limited to meaningful transitions to avoid noise.
- Announcement transport:
  - centralized live-region host component + announcement hook, so messages stay consistent across sections.

## Verification strategy

- Automated checks in integration/e2e flows for core keyboard and interaction contracts.
- Manual screen-reader checks for key journeys (card selection, filtering, result updates, export).
- Lighthouse/a11y scans are used as a quick regression signal, followed by manual assistive-tech checks.

## Ongoing priorities

- Continue expanding automated accessibility assertions as new interactions are added.
- Re-check contrast and focus visibility when theme tokens change.
