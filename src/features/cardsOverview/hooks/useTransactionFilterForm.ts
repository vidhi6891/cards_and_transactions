import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounceValue } from "../../../shared/hooks/useDebounceValue";
import {
  type DraftFilters,
  EMPTY_DRAFT,
  areDraftFiltersEqual,
  buildDebouncedFilterPatch,
  hasFilterPatch,
  toDraftFilters,
} from "../utils/transactionFilterFormHelpers";
import type { TransactionFilters } from "../types/transactionFilters";

interface useTransactionFilterFormArgs {
  values: TransactionFilters;
  onChange: (next: Partial<TransactionFilters>) => void;
  onReset: () => void;
  debounceMs?: number;
  scopeKey?: string | null;
}

interface useTransactionFilterFormResult {
  query: string;
  minAmountInput: string;
  maxAmountInput: string;
  sortBy: TransactionFilters["sortBy"];
  setQuery: (value: string) => void;
  handleMinAmountInputChange: (value: string) => void;
  handleMaxAmountInputChange: (value: string) => void;
  handleSortByChange: (sortBy: TransactionFilters["sortBy"]) => void;
  handleReset: () => void;
}

export function useTransactionFilterForm({
  values,
  onChange,
  onReset,
  debounceMs = 250,
  scopeKey,
}: useTransactionFilterFormArgs): useTransactionFilterFormResult {
  // Local draft keeps typing immediate; parent `values` are the applied filters.
  const [draft, setDraft] = useState<DraftFilters>(() =>
    toDraftFilters(values),
  );
  // Tracks latest draft for scope/value sync checks without expanding effect deps.
  const draftRef = useRef<DraftFilters>(draft);

  // Prevent stale debounced values from being committed after external resets/scope changes.
  const skipDebouncedCommitRef = useRef(false);

  const debouncedQuery = useDebounceValue(draft.query, debounceMs);
  const debouncedMinAmountInput = useDebounceValue(
    draft.minAmountInput,
    debounceMs,
  );
  const debouncedMaxAmountInput = useDebounceValue(
    draft.maxAmountInput,
    debounceMs,
  );

  useEffect(() => {
    draftRef.current = draft;
  }, [draft.query, draft.minAmountInput, draft.maxAmountInput]);

  useEffect(() => {
    // External updates (card switch/reset/parent changes) should win over local draft.
    const nextDraft = toDraftFilters(values);
    if (areDraftFiltersEqual(draftRef.current, nextDraft)) {
      return;
    }

    skipDebouncedCommitRef.current = true;
    setDraft(nextDraft);
  }, [scopeKey, values.query, values.minAmountInput, values.maxAmountInput]);

  useEffect(() => {
    // Guard against old debounced values being re-committed after an external reset/scope change.
    const debouncedMatchesValues =
      debouncedQuery === values.query &&
      debouncedMinAmountInput === values.minAmountInput &&
      debouncedMaxAmountInput === values.maxAmountInput;

    if (skipDebouncedCommitRef.current && !debouncedMatchesValues) {
      return;
    }

    if (skipDebouncedCommitRef.current && debouncedMatchesValues) {
      skipDebouncedCommitRef.current = false;
      return;
    }

    const patch = buildDebouncedFilterPatch({
      debounced: {
        query: debouncedQuery,
        minAmountInput: debouncedMinAmountInput,
        maxAmountInput: debouncedMaxAmountInput,
      },
      values,
    });

    if (!hasFilterPatch(patch)) {
      return;
    }

    onChange(patch);
  }, [
    debouncedQuery,
    debouncedMinAmountInput,
    debouncedMaxAmountInput,
    values.query,
    values.minAmountInput,
    values.maxAmountInput,
    onChange,
  ]);

  const setQuery = useCallback((value: string) => {
    setDraft((current) =>
      current.query === value ? current : { ...current, query: value },
    );
  }, []);

  const handleMinAmountInputChange = useCallback((value: string) => {
    setDraft((current) =>
      current.minAmountInput === value
        ? current
        : { ...current, minAmountInput: value },
    );
  }, []);

  const handleMaxAmountInputChange = useCallback((value: string) => {
    setDraft((current) =>
      current.maxAmountInput === value
        ? current
        : { ...current, maxAmountInput: value },
    );
  }, []);

  const handleSortByChange = useCallback(
    (sortBy: TransactionFilters["sortBy"]) => {
      if (sortBy !== values.sortBy) {
        onChange({ sortBy });
      }
    },
    [onChange, values.sortBy],
  );

  const handleReset = useCallback(() => {
    // Reset both local draft and applied values, while blocking stale pending commits.
    skipDebouncedCommitRef.current = true;
    setDraft(EMPTY_DRAFT);
    onReset();
  }, [onReset]);

  return {
    query: draft.query,
    minAmountInput: draft.minAmountInput,
    maxAmountInput: draft.maxAmountInput,
    sortBy: values.sortBy,
    setQuery,
    handleMinAmountInputChange,
    handleMaxAmountInputChange,
    handleSortByChange,
    handleReset,
  };
}
