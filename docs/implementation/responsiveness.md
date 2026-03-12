# Responsiveness

The UI is implemented mobile-first and scales progressively.

## Layout approach

- Responsive utility classes (`sm`, `lg`, `xl`) drive spacing, grids, and section composition.
- Card and transaction areas are scrollable with stable gutters for dense datasets.
- Sections use minimum heights to reduce jumpiness across loading/empty/content states.
- Filter controls switch between compact and multi-column layouts by viewport width.

## Validation

- Manually verified at mobile, tablet, and desktop viewports.
- Keyboard navigation and visible focus indicators were checked across breakpoints.
