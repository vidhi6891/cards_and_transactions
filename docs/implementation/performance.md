# Performance Considerations

## Current decisions

- Debounced filter commits (`useDebounceValue`) to reduce request churn during typing.
- Request cancellation (`AbortController` in `useCardsOverview`) to prevent stale response commits.
- Targeted memoization for derived values (selected card lookup, active filters, summary/theme maps).
- Stale-while-refresh rendering to keep previous rows visible while next results are loading.

## UX impact

- Reduces perceived latency and avoids large layout shifts on frequent filter updates.

## Limits and next step

- Current filtering/sorting is client-side over in-memory data.
- For scale, move filtering/sorting/pagination server-side and add list virtualization.
