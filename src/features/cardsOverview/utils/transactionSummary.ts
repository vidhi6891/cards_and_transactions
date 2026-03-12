import type { Transaction } from "../types/types";

export interface TransactionSummary {
  count: number;
  totalSpent: number;
  totalRefunds: number;
  netAmount: number;
}

function toMinorUnits(amount: number): number {
  return Math.round(amount * 100);
}

function fromMinorUnits(amountInMinorUnits: number): number {
  return amountInMinorUnits / 100;
}

export function getTransactionSummary(
  transactions: readonly Transaction[],
): TransactionSummary {
  let totalSpentMinorUnits = 0;
  let totalRefundsMinorUnits = 0;
  let netAmountMinorUnits = 0;

  for (const transaction of transactions) {
    const amountMinorUnits = toMinorUnits(transaction.amount);
    netAmountMinorUnits += amountMinorUnits;

    if (amountMinorUnits >= 0) {
      totalSpentMinorUnits += amountMinorUnits;
    } else {
      totalRefundsMinorUnits += Math.abs(amountMinorUnits);
    }
  }

  return {
    count: transactions.length,
    totalSpent: fromMinorUnits(totalSpentMinorUnits),
    totalRefunds: fromMinorUnits(totalRefundsMinorUnits),
    netAmount: fromMinorUnits(netAmountMinorUnits),
  };
}
