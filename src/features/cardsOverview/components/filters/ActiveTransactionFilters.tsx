import { Button, Chip } from "../../../../shared/ui";
import type { TransactionFilters } from "../../types/transactionFilters";

interface ActiveTransactionFiltersProps {
  filters: TransactionFilters;
  resultsCount: number;
  disabled?: boolean;
  onChange: (next: Partial<TransactionFilters>) => void;
  onReset: () => void;
}

interface ActiveFilterChip {
  key: string;
  label: string;
  onRemove: () => void;
}

function buildActiveFilterChips(
  filters: TransactionFilters,
  onChange: (next: Partial<TransactionFilters>) => void,
): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];

  const query = filters.query.trim();
  if (query.length > 0) {
    chips.push({
      key: "query",
      label: `Search: ${query}`,
      onRemove: () => onChange({ query: "" }),
    });
  }

  const minAmount = filters.minAmountInput.trim();
  if (minAmount.length > 0) {
    chips.push({
      key: "minAmountInput",
      label: `Min: ${minAmount}`,
      onRemove: () => onChange({ minAmountInput: "" }),
    });
  }

  const maxAmount = filters.maxAmountInput.trim();
  if (maxAmount.length > 0) {
    chips.push({
      key: "maxAmountInput",
      label: `Max: ${maxAmount}`,
      onRemove: () => onChange({ maxAmountInput: "" }),
    });
  }

  return chips;
}

export function ActiveTransactionFilters({
  filters,
  resultsCount,
  disabled = false,
  onChange,
  onReset,
}: ActiveTransactionFiltersProps) {
  const activeChips = buildActiveFilterChips(filters, onChange);

  return (
    <div className="mb-3 flex flex-wrap items-center gap-2.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
        {resultsCount} {resultsCount === 1 ? "result" : "results"}
      </span>

      {activeChips.map((chip) => (
        <Chip
          key={chip.key}
          className="border-slate-300 bg-white text-slate-700"
          onRemove={chip.onRemove}
          removeLabel={`Remove ${chip.label}`}
          disabled={disabled}
        >
          {chip.label}
        </Chip>
      ))}

      {activeChips.length > 0 ? (
        <Button
          type="button"
          className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          disabled={disabled}
          onClick={onReset}
        >
          Clear all
        </Button>
      ) : null}
    </div>
  );
}
