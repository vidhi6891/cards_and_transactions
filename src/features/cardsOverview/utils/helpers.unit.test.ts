import { describe, expect, test } from "vitest";
import type { TransactionFilters } from "../types/transactionFilters";
import type { Transaction } from "../types/types";
import {
  applyTransactionFilters,
  formatMaskedLast4,
  parseAmountInput,
} from "./helpers";

const baseFilters: TransactionFilters = {
  query: "",
  minAmountInput: "",
  maxAmountInput: "",
  sortBy: "newest",
};

const transactions: Transaction[] = [
  { id: "t1", description: "Coffee Beans", amount: 15.5, date: "2026-01-01" },
  {
    id: "t2",
    description: "Office Coffee Machine",
    amount: 120,
    date: "2026-01-04",
  },
  { id: "t3", description: "Groceries", amount: 80, date: "2026-01-03" },
  { id: "t4", description: "Refund Credit", amount: -20, date: "2026-01-02" },
  { id: "t5", description: "Taxi", amount: 120, date: "2026-01-05" },
];

describe("parseAmountInput", () => {
  test("returns null for blank input", () => {
    expect(parseAmountInput("   ")).toBeNull();
  });

  test("supports comma decimal inputs", () => {
    expect(parseAmountInput("12,75")).toBeCloseTo(12.75);
  });

  test("returns null for invalid numbers", () => {
    expect(parseAmountInput("abc")).toBeNull();
  });
});

describe("applyTransactionFilters", () => {
  test("filters by query case-insensitively", () => {
    const result = applyTransactionFilters(transactions, {
      ...baseFilters,
      query: "coffee",
    });

    expect(result.map((item) => item.id)).toEqual(["t2", "t1"]);
  });

  test("treats min and max as an unordered range", () => {
    const result = applyTransactionFilters(transactions, {
      ...baseFilters,
      minAmountInput: "100",
      maxAmountInput: "50",
    });

    expect(result.map((item) => item.id)).toEqual(["t3"]);
  });

  test("sorts by highest amount and breaks ties by newest", () => {
    const result = applyTransactionFilters(transactions, {
      ...baseFilters,
      sortBy: "highest",
    });

    expect(result.map((item) => item.id)).toEqual(["t5", "t2", "t3", "t1", "t4"]);
  });
});

describe("formatMaskedLast4", () => {
  test("normalizes and masks the last 4 digits", () => {
    expect(formatMaskedLast4("12a3 45")).toBe("**** **** **** 2345");
  });
});
