import type { TransactionFilters } from "../types/transactionFilters";

export type DraftFilters = Pick<
  TransactionFilters,
  "query" | "minAmountInput" | "maxAmountInput"
>;

export const EMPTY_DRAFT: DraftFilters = {
  query: "",
  minAmountInput: "",
  maxAmountInput: "",
};

export function toDraftFilters(values: TransactionFilters): DraftFilters {
  return {
    query: values.query,
    minAmountInput: values.minAmountInput,
    maxAmountInput: values.maxAmountInput,
  };
}

export function areDraftFiltersEqual(
  a: DraftFilters,
  b: DraftFilters,
): boolean {
  return (
    a.query === b.query &&
    a.minAmountInput === b.minAmountInput &&
    a.maxAmountInput === b.maxAmountInput
  );
}

export function buildDebouncedFilterPatch(args: {
  debounced: DraftFilters;
  values: TransactionFilters;
}): Partial<TransactionFilters> {
  const { debounced, values } = args;

  const patch: Partial<TransactionFilters> = {};

  if (debounced.query !== values.query) {
    patch.query = debounced.query;
  }

  if (debounced.minAmountInput !== values.minAmountInput) {
    patch.minAmountInput = debounced.minAmountInput;
  }

  if (debounced.maxAmountInput !== values.maxAmountInput) {
    patch.maxAmountInput = debounced.maxAmountInput;
  }

  return patch;
}

export function hasFilterPatch(patch: Partial<TransactionFilters>): boolean {
  return (
    patch.query !== undefined ||
    patch.minAmountInput !== undefined ||
    patch.maxAmountInput !== undefined ||
    patch.sortBy !== undefined
  );
}
