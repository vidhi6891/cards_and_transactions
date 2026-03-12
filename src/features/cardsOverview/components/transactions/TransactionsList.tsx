import { type ReactNode, useMemo } from "react";
import { Button, StatusPanel } from "../../../../shared/ui";
import type { CardTheme } from "../../utils/theme";
import { getTransactionItemVars } from "../../utils/themeStyles";
import type { Transaction } from "../../types/types";
import { TransactionRow } from "./TransactionRow";

interface TransactionsListProps {
  transactions: Transaction[];
  filteredTransactionsCount: number;
  totalTransactionsCount: number;
  hasActiveFilters: boolean;
  hasSelectedCard: boolean;
  isLoading: boolean;
  onClearFilters: () => void;
  theme: CardTheme;
}

export function TransactionsList({
  transactions,
  filteredTransactionsCount,
  totalTransactionsCount,
  hasActiveFilters,
  hasSelectedCard,
  isLoading,
  onClearFilters,
  theme,
}: TransactionsListProps) {
  const transactionVars = useMemo(() => getTransactionItemVars(theme), [theme]);
  const hasTransactions = transactions.length > 0;
  const isInitialLoading = isLoading && !hasTransactions;

  let content: ReactNode;

  if (isInitialLoading) {
    content = (
      <StatusPanel
        loading
        announce
        title="Loading transactions"
        description="Applying latest filters..."
      />
    );
  } else if (!hasSelectedCard) {
    content = (
      <StatusPanel
        title="No card selected"
        description="Select a card to view its transactions."
      />
    );
  } else if (totalTransactionsCount === 0) {
    content = (
      <StatusPanel
        title="No transactions yet"
        description="This card does not have any transactions."
      />
    );
  } else if (filteredTransactionsCount === 0 && hasActiveFilters) {
    content = (
      <StatusPanel
        title="No matching transactions"
        description="Try broadening your filters."
      >
        <Button
          type="button"
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          onClick={onClearFilters}
        >
          Clear filters
        </Button>
      </StatusPanel>
    );
  } else if (transactions.length === 0) {
    content = (
      <StatusPanel
        title="No transactions available"
        description="There is no data to display right now."
      />
    );
  } else {
    content = (
      <div className="co-scroll-region co-transactions-scroll">
        {isLoading ? (
          <div
            className="co-transactions-updating"
            role="status"
            aria-live="polite"
          >
            <span className="co-loading-spinner" aria-hidden="true" />
            <span>Updating results...</span>
          </div>
        ) : null}

        <ul
          id="co-transactions-list"
          className="grid list-none gap-2.5 p-2"
          aria-label="Filtered transactions"
          aria-busy={isLoading}
        >
          {transactions.map((transaction) => (
            <TransactionRow
              key={transaction.id}
              transaction={transaction}
              style={transactionVars}
            />
          ))}
        </ul>
      </div>
    );
  }

  return <div className="co-transactions-viewport">{content}</div>;
}
