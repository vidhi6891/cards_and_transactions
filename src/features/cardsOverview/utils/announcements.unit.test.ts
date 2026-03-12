import { describe, expect, test } from "vitest";
import { buildCardsOverviewAnnouncement } from "./announcements";
import type { TransactionFilters } from "../types/transactionFilters";

const baseFilters: TransactionFilters = {
  query: "",
  minAmountInput: "",
  maxAmountInput: "",
  sortBy: "newest",
};

describe("buildCardsOverviewAnnouncement", () => {
  test("asks for card selection when none is selected", () => {
    const message = buildCardsOverviewAnnouncement({
      hasSelectedCard: false,
      selectedCardDescription: null,
      isLoadingTransactions: false,
      filteredTransactionsCount: 0,
      totalTransactionsCount: 0,
      hasActiveFilters: false,
      filters: baseFilters,
    });

    expect(message).toBe("Select a card to view transactions.");
  });

  test("announces loading with selected card name and sort", () => {
    const message = buildCardsOverviewAnnouncement({
      hasSelectedCard: true,
      selectedCardDescription: "Business Operations",
      isLoadingTransactions: true,
      filteredTransactionsCount: 0,
      totalTransactionsCount: 20,
      hasActiveFilters: false,
      filters: { ...baseFilters, sortBy: "highest" },
    });

    expect(message).toContain("Loading transactions for Business Operations.");
    expect(message).toContain("Sorted by highest amount.");
  });

  test("announces no matching filtered results", () => {
    const message = buildCardsOverviewAnnouncement({
      hasSelectedCard: true,
      selectedCardDescription: "Personal Essentials",
      isLoadingTransactions: false,
      filteredTransactionsCount: 0,
      totalTransactionsCount: 12,
      hasActiveFilters: true,
      filters: { ...baseFilters, query: "xyz" },
    });

    expect(message).toContain("No transactions match the current filters");
    expect(message).toContain('Filters applied: search "xyz".');
  });

  test("announces result count and active filters", () => {
    const message = buildCardsOverviewAnnouncement({
      hasSelectedCard: true,
      selectedCardDescription: "Travel & Leisure",
      isLoadingTransactions: false,
      filteredTransactionsCount: 2,
      totalTransactionsCount: 12,
      hasActiveFilters: true,
      filters: { ...baseFilters, minAmountInput: "50" },
    });

    expect(message).toContain("Showing 2 transactions for Travel & Leisure.");
    expect(message).toContain("Filters applied: minimum amount 50.");
  });
});

