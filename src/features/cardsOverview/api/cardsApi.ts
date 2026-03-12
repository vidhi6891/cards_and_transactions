import { applyTransactionFilters } from "../utils/helpers";
import type { TransactionFilters } from "../types/transactionFilters";
import type { Card, Transaction, TransactionsByCardId } from "../types/types";

export interface TransactionsResponse {
  items: Transaction[];
  totalUnfiltered: number;
}

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Request to ${url} failed with ${response.status}`);
  }
  return (await response.json()) as T;
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const id = setTimeout(() => {
      cleanup();
      resolve();
    }, ms);

    const onAbort = () => {
      cleanup();
      reject(new DOMException("Aborted", "AbortError"));
    };

    const cleanup = () => {
      clearTimeout(id);
      signal?.removeEventListener("abort", onAbort);
    };

    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

async function getTransactionsByCardId(
  signal?: AbortSignal,
): Promise<TransactionsByCardId> {
  return fetchJson<TransactionsByCardId>("/data/transactions.json", signal);
}

export async function getCards(signal?: AbortSignal): Promise<Card[]> {
  return fetchJson<Card[]>("/data/cards.json", signal);
}

export async function getTransactions(args: {
  cardId: string;
  filters: TransactionFilters;
  signal?: AbortSignal;
}): Promise<TransactionsResponse> {
  const { cardId, filters, signal } = args;

  const byCardId = await getTransactionsByCardId(signal);
  await sleep(300, signal); // simulate network latency

  const all = byCardId[cardId] ?? [];
  const filtered = applyTransactionFilters(all, filters);

  return {
    items: filtered,
    totalUnfiltered: all.length,
  };
}
