import { StatusPanel } from "../../../../shared/ui";
import type { CardTheme } from "../../utils/theme";
import type { Card } from "../../types/types";
import { CardList } from "../cards/CardList";
import { OverviewPanel } from "./OverviewPanel";

interface CardsSectionProps {
  cards: Card[];
  selectedCardId: string | null;
  isLoadingCards: boolean;
  themeByCardId: Record<string, CardTheme>;
  onSelectCard: (cardId: string) => void;
}

export function CardsSection({
  cards,
  selectedCardId,
  isLoadingCards,
  themeByCardId,
  onSelectCard,
}: CardsSectionProps) {
  return (
    <OverviewPanel
      aria-labelledby="co-cards-heading"
      aria-busy={isLoadingCards}
    >
      <h2
        id="co-cards-heading"
        className="mb-3 text-base font-semibold text-slate-900"
      >
        Cards
      </h2>

      {isLoadingCards ? (
        <StatusPanel
          className="co-cards-state"
          compact
          loading
          title="Loading cards"
        />
      ) : cards.length === 0 ? (
        <StatusPanel
          className="co-cards-state"
          compact
          title="No cards available"
        />
      ) : (
        <CardList
          cards={cards}
          selectedCardId={selectedCardId}
          onSelectCard={onSelectCard}
          themeByCardId={themeByCardId}
        />
      )}
    </OverviewPanel>
  );
}
