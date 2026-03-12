# Code Structure

Feature-oriented organization:

- `src/features/cardsOverview/api`
  - Data access and request simulation adapters.
- `src/features/cardsOverview/hooks`
  - State orchestration hooks (`useCardsOverview`, `useTransactionFilterForm`).
- `src/features/cardsOverview/components`
  - UI split by concern:
    - `page` for top-level feature entry.
    - `sections` for cards/filters/transactions composition.
    - `cards`, `filters`, `transactions` for focused UI parts.
- `src/features/cardsOverview/types`
  - Domain and filter type definitions.
- `src/features/cardsOverview/utils`
  - Pure helpers, formatters, theming, summaries, exports.

Shared layer:

- `src/shared/ui` for reusable primitives/patterns.
- `src/shared/hooks` for cross-feature hooks.
- `src/shared/utils` for global utilities.

Reasoning:

- Keeps domain logic close to feature code.
- Keeps generic UI and utility pieces reusable and isolated.
- Supports scaling by adding new features without coupling unrelated areas.
