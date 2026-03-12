import type { Transaction } from "../types/types";
import type { TransactionFilters } from "../types/transactionFilters";

export function parseAmountInput(input: string): number | null {
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return null;
  }

  const parsed = Number(trimmed.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

function getTransactionTimestamp(transaction: Transaction): number | null {
  const parsed = Date.parse(transaction.date);
  return Number.isFinite(parsed) ? parsed : null;
}

function compareByNewest(a: Transaction, b: Transaction): number {
  const aTimestamp = getTransactionTimestamp(a) ?? Number.NEGATIVE_INFINITY;
  const bTimestamp = getTransactionTimestamp(b) ?? Number.NEGATIVE_INFINITY;

  if (aTimestamp !== bTimestamp) {
    return bTimestamp - aTimestamp;
  }

  return b.amount - a.amount;
}

function compareByHighest(a: Transaction, b: Transaction): number {
  if (a.amount !== b.amount) {
    return b.amount - a.amount;
  }

  return compareByNewest(a, b);
}

export function applyTransactionFilters(
  transactions: Transaction[],
  filters: TransactionFilters,
): Transaction[] {
  const query = filters.query.trim().toLowerCase();

  const parsedMin = parseAmountInput(filters.minAmountInput);
  const parsedMax = parseAmountInput(filters.maxAmountInput);

  const minAmount =
    parsedMin !== null && parsedMax !== null
      ? Math.min(parsedMin, parsedMax)
      : parsedMin;

  const maxAmount =
    parsedMin !== null && parsedMax !== null
      ? Math.max(parsedMin, parsedMax)
      : parsedMax;

  const filtered = transactions.filter((transaction) => {
    if (
      query.length > 0 &&
      !transaction.description.toLowerCase().includes(query)
    ) {
      return false;
    }

    if (minAmount !== null && transaction.amount < minAmount) {
      return false;
    }

    if (maxAmount !== null && transaction.amount > maxAmount) {
      return false;
    }

    return true;
  });

  return filtered.sort(
    filters.sortBy === "highest" ? compareByHighest : compareByNewest,
  );
}

export function formatMaskedLast4(last4: string): string {
  const clean = last4.replace(/\D/g, "").slice(-4).padStart(4, "0");
  return `**** **** **** ${clean}`;
}
