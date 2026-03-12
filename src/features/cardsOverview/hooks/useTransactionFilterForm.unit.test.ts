import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { DEFAULT_TRANSACTION_FILTERS } from "../types/transactionFilters";
import { useTransactionFilterForm } from "./useTransactionFilterForm";

describe("useTransactionFilterForm", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("commits search query only after debounce", () => {
    const onChange = vi.fn();
    const onReset = vi.fn();

    const { result } = renderHook(() =>
      useTransactionFilterForm({
        values: { ...DEFAULT_TRANSACTION_FILTERS },
        onChange,
        onReset,
        debounceMs: 250,
      }),
    );

    act(() => {
      result.current.setQuery("coffee");
    });

    expect(onChange).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(249);
    });
    expect(onChange).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onChange).toHaveBeenCalledWith({ query: "coffee" });
  });

  test("does not commit stale query after reset", () => {
    const onChange = vi.fn();
    const onReset = vi.fn();

    const { result } = renderHook(() =>
      useTransactionFilterForm({
        values: { ...DEFAULT_TRANSACTION_FILTERS },
        onChange,
        onReset,
        debounceMs: 250,
      }),
    );

    act(() => {
      result.current.setQuery("coffee");
      result.current.handleReset();
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(onReset).toHaveBeenCalledTimes(1);
    expect(onChange).not.toHaveBeenCalledWith(
      expect.objectContaining({ query: "coffee" }),
    );
  });

  test("resets draft immediately when scopeKey changes even if values are unchanged", () => {
    const onChange = vi.fn();
    const onReset = vi.fn();

    const { result, rerender } = renderHook(
      ({ scopeKey }: { scopeKey: string }) =>
        useTransactionFilterForm({
          values: { ...DEFAULT_TRANSACTION_FILTERS },
          onChange,
          onReset,
          debounceMs: 250,
          scopeKey,
        }),
      {
        initialProps: { scopeKey: "card-a" },
      },
    );

    act(() => {
      result.current.setQuery("coffee");
    });
    expect(result.current.query).toBe("coffee");

    rerender({ scopeKey: "card-b" });
    expect(result.current.query).toBe("");

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  test("does not re-commit stale debounced values after external filter clear", () => {
    const onChange = vi.fn();
    const onReset = vi.fn();

    const { result, rerender } = renderHook(
      ({ values }: { values: typeof DEFAULT_TRANSACTION_FILTERS }) =>
        useTransactionFilterForm({
          values,
          onChange,
          onReset,
          debounceMs: 250,
        }),
      {
        initialProps: { values: { ...DEFAULT_TRANSACTION_FILTERS } },
      },
    );

    act(() => {
      result.current.handleMinAmountInputChange("10");
    });

    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(onChange).toHaveBeenCalledWith({ minAmountInput: "10" });

    rerender({
      values: {
        ...DEFAULT_TRANSACTION_FILTERS,
        minAmountInput: "10",
      },
    });

    onChange.mockClear();

    rerender({
      values: { ...DEFAULT_TRANSACTION_FILTERS },
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(onChange).not.toHaveBeenCalled();
  });
});
