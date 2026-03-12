import { Button, FormField, Input, Select } from "../../../../shared/ui";
import type { TransactionSort } from "../../types/transactionFilters";

interface TransactionFilterFieldsProps {
  query: string;
  minAmountInput: string;
  maxAmountInput: string;
  sortBy: TransactionSort;
  disabled?: boolean;
  onQueryChange: (value: string) => void;
  onMinAmountChange: (value: string) => void;
  onMaxAmountChange: (value: string) => void;
  onSortChange: (value: TransactionSort) => void;
  onReset: () => void;
}

const controlClassName =
  "w-full min-w-0 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 overflow-hidden text-ellipsis whitespace-nowrap placeholder:text-slate-400 [&::placeholder]:overflow-hidden [&::placeholder]:text-ellipsis [&::placeholder]:whitespace-nowrap";

const sortOptions: ReadonlyArray<{ value: TransactionSort; label: string }> = [
  { value: "newest", label: "Newest first" },
  { value: "highest", label: "Highest amount" },
];

export function TransactionFilterFields({
  query,
  minAmountInput,
  maxAmountInput,
  sortBy,
  disabled = false,
  onQueryChange,
  onMinAmountChange,
  onMaxAmountChange,
  onSortChange,
  onReset,
}: TransactionFilterFieldsProps) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <FormField label="Search" htmlFor="co-search">
          <Input
            id="co-search"
            className={controlClassName}
            type="text"
            value={query}
            placeholder="Search description"
            disabled={disabled}
            onChange={(event) => onQueryChange(event.currentTarget.value)}
          />
        </FormField>

        <FormField label="Minimum amount" htmlFor="co-min-amount">
          <Input
            id="co-min-amount"
            className={controlClassName}
            type="number"
            inputMode="decimal"
            step="0.01"
            value={minAmountInput}
            placeholder="No minimum"
            disabled={disabled}
            onChange={(event) => onMinAmountChange(event.currentTarget.value)}
          />
        </FormField>

        <FormField label="Maximum amount" htmlFor="co-max-amount">
          <Input
            id="co-max-amount"
            className={controlClassName}
            type="number"
            inputMode="decimal"
            step="0.01"
            value={maxAmountInput}
            placeholder="No maximum"
            disabled={disabled}
            onChange={(event) => onMaxAmountChange(event.currentTarget.value)}
          />
        </FormField>

        <FormField label="Sort" htmlFor="co-sort">
          <Select
            id="co-sort"
            className={controlClassName}
            value={sortBy}
            disabled={disabled}
            onChange={(event) =>
              onSortChange(event.currentTarget.value as TransactionSort)
            }
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormField>
      </div>

      <div className="mt-3 flex justify-end">
        <Button
          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={disabled}
          onClick={onReset}
        >
          Reset
        </Button>
      </div>
    </>
  );
}
