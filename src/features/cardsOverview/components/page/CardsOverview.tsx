import { useMemo } from "react";
import { LiveAnnouncer } from "../../../../shared/ui";
import { buildCardsOverviewAnnouncement } from "../../utils/announcements";
import { useCardsOverview } from "../../hooks/useCardsOverview";
import { buildCardThemeMap, getCardThemeFromMap } from "../../utils/theme";
import { CardsSection } from "../sections/CardsSection";
import { FiltersSection } from "../sections/FiltersSection";
import { TransactionsSection } from "../sections/TransactionsSection";
import "../../cardsOverview.css";

export function CardsOverview() {
  const {
    cards,
    selectedCard,
    selectedCardId,
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
  } = useCardsOverview();

  const hasSelectedCard = Boolean(selectedCardId);

  const themeByCardId = useMemo(() => buildCardThemeMap(cards), [cards]);
  const selectedTheme = getCardThemeFromMap(themeByCardId, selectedCardId);

  const transactionsAnnouncement = buildCardsOverviewAnnouncement({
    hasSelectedCard,
    selectedCardDescription: selectedCard?.description ?? null,
    isLoadingTransactions,
    filteredTransactionsCount: transactions.length,
    totalTransactionsCount,
    hasActiveFilters: hasActiveTransactionFilters,
    filters: transactionFilters,
  });

  return (
    <main
      className="co-root mx-auto w-full max-w-5xl px-3 pb-10 pt-5 text-slate-900 sm:px-6 sm:pb-12 sm:pt-8 lg:px-8"
      aria-labelledby="co-page-title"
    >
      <h1
        id="co-page-title"
        className="mb-4 text-2xl font-extrabold tracking-tight sm:text-4xl"
      >
        Cards & Transactions
      </h1>

      <LiveAnnouncer message={transactionsAnnouncement} />

      {errorMessage ? (
        <div className="co-alert co-alert--error" role="alert">
          {errorMessage}
        </div>
      ) : null}

      <CardsSection
        cards={cards}
        selectedCardId={selectedCardId}
        isLoadingCards={isLoadingCards}
        themeByCardId={themeByCardId}
        onSelectCard={selectCard}
      />

      <FiltersSection
        values={transactionFilters}
        scopeKey={selectedCardId}
        disabled={!selectedCardId}
        onChange={updateTransactionFilters}
        onReset={resetTransactionFilters}
      />

      <TransactionsSection
        selectedCard={selectedCard}
        selectedTheme={selectedTheme}
        transactions={transactions}
        totalTransactionsCount={totalTransactionsCount}
        hasActiveTransactionFilters={hasActiveTransactionFilters}
        transactionFilters={transactionFilters}
        hasSelectedCard={hasSelectedCard}
        isLoadingTransactions={isLoadingTransactions}
        onUpdateTransactionFilters={updateTransactionFilters}
        onResetTransactionFilters={resetTransactionFilters}
      />
    </main>
  );
}
