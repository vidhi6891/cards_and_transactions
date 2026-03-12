# Accessibility

Accessibility highlights:

- Semantic regions and headings for cards, filters, and transactions.
- Keyboard-accessible card selection and filter controls.
- `aria-pressed` on selected card button to communicate selection state.
- Clear labels for form controls (`FormField` + `Input`/`Select`).
- Live announcements for transaction-result updates via `LiveAnnouncer`.
- Status and error messaging uses meaningful roles (`status`/`alert`) where appropriate.
- Focus-visible styles are preserved for keyboard users.
- Disabled states are explicit for non-actionable controls.

Validation:

- Accessibility checks are covered through manual screen-reader flows and automated e2e interactions.
