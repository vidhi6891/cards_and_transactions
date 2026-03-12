import { describe, expect, test } from "vitest";
import { DEFAULT_TRANSACTION_FILTERS } from "../types/transactionFilters";
import {
  buildDebouncedFilterPatch,
  hasFilterPatch,
} from "./transactionFilterFormHelpers";

describe("transactionFilterFormHelpers", () => {
  test("buildDebouncedFilterPatch only includes changed debounced fields", () => {
    const values = {
      ...DEFAULT_TRANSACTION_FILTERS,
      query: "coffee",
      minAmountInput: "10",
      maxAmountInput: "50",
    };

    const patch = buildDebouncedFilterPatch({
      debounced: {
        query: "coffee beans",
        minAmountInput: "10",
        maxAmountInput: "70",
      },
      values,
    });

    expect(patch).toEqual({
      query: "coffee beans",
      maxAmountInput: "70",
    });
  });

  test("buildDebouncedFilterPatch returns empty object when nothing changed", () => {
    const values = {
      ...DEFAULT_TRANSACTION_FILTERS,
      query: "rent",
      minAmountInput: "100",
      maxAmountInput: "400",
    };

    const patch = buildDebouncedFilterPatch({
      debounced: {
        query: "rent",
        minAmountInput: "100",
        maxAmountInput: "400",
      },
      values,
    });

    expect(patch).toEqual({});
  });

  test("hasFilterPatch detects relevant filter keys only", () => {
    expect(hasFilterPatch({})).toBe(false);
    expect(hasFilterPatch({ query: "coffee" })).toBe(true);
    expect(hasFilterPatch({ minAmountInput: "10" })).toBe(true);
    expect(hasFilterPatch({ maxAmountInput: "20" })).toBe(true);
    expect(hasFilterPatch({ sortBy: "highest" })).toBe(true);
  });
});
