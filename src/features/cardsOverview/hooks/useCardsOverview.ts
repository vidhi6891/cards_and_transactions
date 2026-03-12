import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getCards, getTransactions } from "../api/cardsApi";
import type { Card, Transaction } from "../types/types";
import {
  DEFAULT_TRANSACTION_FILTERS,
  type TransactionFilters,
} from "../types/transactionFilters";
import { isAbortError } from "../../../shared/utils/errors";

export interface CardsOverviewState {
  cards: Card[];
  selectedCardId: string | null;
  selectedCard: Card | null;
  transactions: Transaction[];
  totalTransactionsCount: number;
  hasActiveTransactionFilters: boolean;
  transactionFilters: TransactionFilters;
  isLoadingCards: boolean;
  isLoadingTransactions: boolean;
  errorMessage: string | null;
  selectCard: (cardId: string) => void;
  updateTransactionFilters: (next: Partial<TransactionFilters>) => void;
  resetTransactionFilters: () => void;
}

export function useCardsOverview(): CardsOverviewState {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalTransactionsCount, setTotalTransactionsCount] = useState(0);

  const [transactionFilters, setTransactionFilters] =
    useState<TransactionFilters>(() => ({ ...DEFAULT_TRANSACTION_FILTERS }));

  const [isLoadingCards, setIsLoadingCards] = useState(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedCardIdRef = useRef<string | null>(selectedCardId);

  useEffect(() => {
    selectedCardIdRef.current = selectedCardId;
  }, [selectedCardId]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCards() {
      setIsLoadingCards(true);

      try {
        const nextCards = await getCards(controller.signal);
        if (controller.signal.aborted) {
          return;
        }

        setCards(nextCards);
        setSelectedCardId((current) => current ?? nextCards[0]?.id ?? null);
        setErrorMessage(null);
      } catch (error) {
        if (!isAbortError(error)) {
          setErrorMessage("Could not load cards.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingCards(false);
        }
      }
    }

    void loadCards();

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (!selectedCardId) {
      setTransactions([]);
      setTotalTransactionsCount(0);
      return;
    }

    const cardId = selectedCardId;
    const controller = new AbortController();

    async function loadTransactions() {
      setIsLoadingTransactions(true);

      try {
        const response = await getTransactions({
          cardId,
          filters: transactionFilters,
          signal: controller.signal,
        });

        if (controller.signal.aborted) {
          return;
        }

        setTransactions(response.items);
        setTotalTransactionsCount(response.totalUnfiltered);
        setErrorMessage(null);
      } catch (error) {
        if (isAbortError(error)) {
          return;
        }

        setTransactions([]);
        setTotalTransactionsCount(0);
        setErrorMessage("Could not load transactions.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingTransactions(false);
        }
      }
    }

    void loadTransactions();

    return () => {
      controller.abort();
    };
  }, [
    selectedCardId,
    transactionFilters.query,
    transactionFilters.minAmountInput,
    transactionFilters.maxAmountInput,
    transactionFilters.sortBy,
  ]);

  const selectedCard = useMemo(
    () => cards.find((card) => card.id === selectedCardId) ?? null,
    [cards, selectedCardId],
  );

  const hasActiveTransactionFilters = useMemo(
    () =>
      transactionFilters.query.trim().length > 0 ||
      transactionFilters.minAmountInput.trim().length > 0 ||
      transactionFilters.maxAmountInput.trim().length > 0,
    [
      transactionFilters.query,
      transactionFilters.minAmountInput,
      transactionFilters.maxAmountInput,
    ],
  );

  const selectCard = useCallback((cardId: string) => {
    if (selectedCardIdRef.current === cardId) {
      return;
    }

    setSelectedCardId(cardId);
    // Filters are card-scoped to avoid carrying one card's context into another.
    setTransactionFilters({ ...DEFAULT_TRANSACTION_FILTERS });
  }, []);

  const updateTransactionFilters = useCallback(
    (next: Partial<TransactionFilters>) => {
      setTransactionFilters((current) => ({ ...current, ...next }));
    },
    [],
  );

  const resetTransactionFilters = useCallback(() => {
    setTransactionFilters({ ...DEFAULT_TRANSACTION_FILTERS });
  }, []);

  return {
    cards,
    selectedCardId,
    selectedCard,
    transactions,
    totalTransactionsCount,
    hasActiveTransactionFilters,
    transactionFilters,
    isLoadingCards,
    isLoadingTransactions,
    errorMessage,
    selectCard,
    updateTransactionFilters,
    resetTransactionFilters,
  };
}
