import { useTransactionFilterForm } from "../../hooks/useTransactionFilterForm";
import type { TransactionFilters as TransactionFiltersState } from "../../types/transactionFilters";
import { TransactionFilterFields } from "./TransactionFilterFields";

interface TransactionFiltersProps {
  values: TransactionFiltersState;
  disabled?: boolean;
  scopeKey?: string | null;
  onChange: (next: Partial<TransactionFiltersState>) => void;
  onReset: () => void;
}

export function TransactionFilters({
  values,
  disabled = false,
  scopeKey,
  onChange,
  onReset,
}: TransactionFiltersProps) {
  const controller = useTransactionFilterForm({
    values,
    onChange,
    onReset,
    debounceMs: 250,
    scopeKey,
  });

  return (
    <div>
      <h2 className="mb-3 text-base font-semibold text-slate-900">Filters</h2>

      <TransactionFilterFields
        query={controller.query}
        minAmountInput={controller.minAmountInput}
        maxAmountInput={controller.maxAmountInput}
        sortBy={controller.sortBy}
        disabled={disabled}
        onQueryChange={controller.setQuery}
        onMinAmountChange={controller.handleMinAmountInputChange}
        onMaxAmountChange={controller.handleMaxAmountInputChange}
        onSortChange={controller.handleSortByChange}
        onReset={controller.handleReset}
      />
    </div>
  );
}
