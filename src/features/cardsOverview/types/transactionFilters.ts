export type TransactionSort = "newest" | "highest";

export interface TransactionFilters {
  query: string;
  minAmountInput: string;
  maxAmountInput: string;
  sortBy: TransactionSort;
}

export const DEFAULT_TRANSACTION_FILTERS: Readonly<TransactionFilters> = {
  query: "",
  minAmountInput: "",
  maxAmountInput: "",
  sortBy: "newest",
};
