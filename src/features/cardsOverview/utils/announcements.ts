import type { TransactionFilters } from "../types/transactionFilters";

interface BuildCardsOverviewAnnouncementArgs {
  hasSelectedCard: boolean;
  selectedCardDescription: string | null;
  isLoadingTransactions: boolean;
  filteredTransactionsCount: number;
  totalTransactionsCount: number;
  hasActiveFilters: boolean;
  filters: TransactionFilters;
}

function getSortAnnouncement(sortBy: TransactionFilters["sortBy"]): string {
  return sortBy === "highest"
    ? "Sorted by highest amount."
    : "Sorted by newest first.";
}

function getFiltersAnnouncement(filters: TransactionFilters): string {
  const parts: string[] = [];

  const query = filters.query.trim();
  if (query.length > 0) {
    parts.push(`search "${query}"`);
  }

  const min = filters.minAmountInput.trim();
  if (min.length > 0) {
    parts.push(`minimum amount ${min}`);
  }

  const max = filters.maxAmountInput.trim();
  if (max.length > 0) {
    parts.push(`maximum amount ${max}`);
  }

  if (parts.length === 0) {
    return "No text or amount filters applied.";
  }

  return `Filters applied: ${parts.join(", ")}.`;
}

export function buildCardsOverviewAnnouncement({
  hasSelectedCard,
  selectedCardDescription,
  isLoadingTransactions,
  filteredTransactionsCount,
  totalTransactionsCount,
  hasActiveFilters,
  filters,
}: BuildCardsOverviewAnnouncementArgs): string {
  const cardLabel = selectedCardDescription?.trim() || "the selected card";
  const sortAnnouncement = getSortAnnouncement(filters.sortBy);
  const filtersAnnouncement = getFiltersAnnouncement(filters);

  if (!hasSelectedCard) {
    return "Select a card to view transactions.";
  }

  if (isLoadingTransactions) {
    return `Loading transactions for ${cardLabel}. ${sortAnnouncement}`;
  }

  if (totalTransactionsCount === 0) {
    return `No transactions available for ${cardLabel}. ${sortAnnouncement}`;
  }

  if (filteredTransactionsCount === 0 && hasActiveFilters) {
    return `No transactions match the current filters for ${cardLabel}. ${filtersAnnouncement} ${sortAnnouncement}`;
  }

  const noun = filteredTransactionsCount === 1 ? "transaction" : "transactions";

  return `Showing ${filteredTransactionsCount} ${noun} for ${cardLabel}. ${filtersAnnouncement} ${sortAnnouncement}`;
}
