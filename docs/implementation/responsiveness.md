# Responsiveness

The layout is mobile-first and stays usable from small screens to desktop.

## Responsive architecture

- Mobile-first composition:
  - Default layout is optimized for narrow screens and touch interaction.
- Progressive enhancement:
  - More columns and spacing are added at larger breakpoints (`sm`, `lg`, `xl`).
- Stable containers:
  - Key sections keep stable dimensions to reduce jumpiness during state changes.
- Overflow strategy:
  - Dense lists are scrollable instead of being compressed until unreadable.

## Interaction considerations

- Touch targets and spacing remain usable at smaller sizes.
- Keyboard navigation and focus visibility remain consistent across breakpoints.
- Information hierarchy (cards, filters, transactions) is preserved as layout changes.

## Validation approach

- Manual checks across mobile, tablet, and desktop viewports.
- Visual snapshots for key states to catch layout regressions over time.
- Keyboard and focus behavior is re-checked across breakpoints to confirm accessibility does not regress with layout changes.
