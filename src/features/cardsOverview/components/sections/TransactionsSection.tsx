import { useCallback, useMemo } from "react";
import { Badge, Button } from "../../../../shared/ui";
import { downloadTransactionsCsv } from "../../utils/transactionExport";
import type { TransactionFilters as TransactionFiltersState } from "../../types/transactionFilters";
import { getTransactionSummary } from "../../utils/transactionSummary";
import type { CardTheme } from "../../utils/theme";
import {
  getSelectedCardBadgeVars,
  getTransactionsPanelVars,
} from "../../utils/themeStyles";
import type { Card, Transaction } from "../../types/types";
import { ActiveTransactionFilters } from "../filters/ActiveTransactionFilters";
import { TransactionsList } from "../transactions/TransactionsList";
import { TransactionsSummary } from "../transactions/TransactionsSummary";
import { OverviewPanel } from "./OverviewPanel";

interface TransactionsSectionProps {
  selectedCard: Card | null;
  selectedTheme: CardTheme;
  transactions: Transaction[];
  totalTransactionsCount: number;
  hasActiveTransactionFilters: boolean;
  transactionFilters: TransactionFiltersState;
  hasSelectedCard: boolean;
  isLoadingTransactions: boolean;
  onUpdateTransactionFilters: (next: Partial<TransactionFiltersState>) => void;
  onResetTransactionFilters: () => void;
}

export function TransactionsSection({
  selectedCard,
  selectedTheme,
  transactions,
  totalTransactionsCount,
  hasActiveTransactionFilters,
  transactionFilters,
  hasSelectedCard,
  isLoadingTransactions,
  onUpdateTransactionFilters,
  onResetTransactionFilters,
}: TransactionsSectionProps) {
  const filteredTransactionsCount = transactions.length;
  const selectedCardDescription = selectedCard?.description ?? null;

  const transactionSummary = useMemo(
    () => getTransactionSummary(transactions),
    [transactions],
  );

  const transactionsPanelVars = getTransactionsPanelVars(selectedTheme);
  const selectedBadgeVars = getSelectedCardBadgeVars(selectedTheme);

  const handleExportTransactions = useCallback(() => {
    downloadTransactionsCsv(transactions, {
      cardDescription: selectedCardDescription,
      filenamePrefix: "transactions",
    });
  }, [selectedCardDescription, transactions]);

  return (
    <OverviewPanel
      variant="themed"
      style={transactionsPanelVars}
      aria-labelledby="co-transactions-heading"
      aria-busy={isLoadingTransactions}
    >
      <h2
        id="co-transactions-heading"
        className="mb-3 flex flex-wrap items-center justify-between gap-2 text-base font-semibold text-slate-900"
      >
        <span>Transactions</span>

        <div className="flex flex-wrap items-center gap-2">
          {selectedCard ? (
            <Badge
              className="co-selected-card-badge uppercase tracking-wide"
              style={selectedBadgeVars}
            >
              {selectedCard.description}
            </Badge>
          ) : null}

          <Button
            type="button"
            className="rounded-md border border-sky-700 bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-200 disabled:text-slate-500 disabled:opacity-60"
            disabled={isLoadingTransactions || filteredTransactionsCount === 0}
            aria-label={
              selectedCard
                ? `Export filtered results for ${selectedCard.description}`
                : "Export filtered results"
            }
            onClick={handleExportTransactions}
          >
            Export filtered results
          </Button>
        </div>
      </h2>

      <ActiveTransactionFilters
        filters={transactionFilters}
        resultsCount={filteredTransactionsCount}
        onChange={onUpdateTransactionFilters}
        onReset={onResetTransactionFilters}
      />

      <TransactionsSummary
        summary={transactionSummary}
        isLoading={isLoadingTransactions}
      />

      <TransactionsList
        transactions={transactions}
        filteredTransactionsCount={filteredTransactionsCount}
        totalTransactionsCount={totalTransactionsCount}
        hasActiveFilters={hasActiveTransactionFilters}
        hasSelectedCard={hasSelectedCard}
        isLoading={isLoadingTransactions}
        onClearFilters={onResetTransactionFilters}
        theme={selectedTheme}
      />
    </OverviewPanel>
  );
}
