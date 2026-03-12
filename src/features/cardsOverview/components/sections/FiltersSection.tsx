import type { TransactionFilters as TransactionFiltersState } from "../../types/transactionFilters";
import { TransactionFilters } from "../filters/TransactionFilters";
import { OverviewPanel } from "./OverviewPanel";

interface FiltersSectionProps {
  values: TransactionFiltersState;
  scopeKey: string | null;
  disabled: boolean;
  onChange: (next: Partial<TransactionFiltersState>) => void;
  onReset: () => void;
}

export function FiltersSection({
  values,
  scopeKey,
  disabled,
  onChange,
  onReset,
}: FiltersSectionProps) {
  return (
    <OverviewPanel aria-labelledby="co-filters-heading">
      <h2 id="co-filters-heading" className="sr-only">
        Transaction filters
      </h2>

      <TransactionFilters
        values={values}
        // Scope ensures draft sync logic in the form controller reacts to card-context changes.
        scopeKey={scopeKey}
        disabled={disabled}
        onChange={onChange}
        onReset={onReset}
      />
    </OverviewPanel>
  );
}
