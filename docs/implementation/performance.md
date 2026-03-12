# Performance Considerations

Performance is treated as a core product quality concern.

## Architecture objectives

- Keep filtering interactions smooth.
- Reduce layout shifts during loading and updates.
- Prevent stale async responses from overwriting newer state.
- Keep a clear path to scale beyond in-memory data.

## Current strategy

- Controlled request cadence:
  - Filter input uses a draft model and `250ms` debounce to avoid request bursts while typing.
- Safe async orchestration:
  - In-flight requests use `AbortController`, so old responses cannot overwrite new state.
- Perceived latency optimization:
  - Existing results stay visible during refresh to avoid flashes and jumpiness.
- Computational discipline:
  - Derived state is memoized only where it gives clear value (selected card, summaries, theme maps).

## Known constraints

- Querying is client-side against static in-memory data.
- Large datasets will increase client CPU and data transfer costs.
- Sorting/filtering logic currently runs per request path on the client.

## Scale roadmap

- Move filtering/sorting/pagination to backend query endpoints.
- Add virtualization/windowing for long transaction lists.
- Add performance guardrails in CI (for example render and interaction budgets).
- Add telemetry for request latency and client render hotspots.
