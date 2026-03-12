import { memo } from "react";
import { getFallbackCardTheme, type CardTheme } from "../../utils/theme";
import type { Card } from "../../types/types";
import { CardListItem } from "./CardListItem";

interface CardListProps {
  cards: Card[];
  selectedCardId: string | null;
  onSelectCard: (cardId: string) => void;
  themeByCardId: Record<string, CardTheme>;
}

function CardListComponent({
  cards,
  selectedCardId,
  onSelectCard,
  themeByCardId,
}: CardListProps) {
  return (
    <div className="co-scroll-region co-cards-scroll">
      <ul className="grid list-none content-start grid-cols-1 gap-3 p-2 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <CardListItem
            key={card.id}
            card={card}
            isSelected={card.id === selectedCardId}
            theme={themeByCardId[card.id] ?? getFallbackCardTheme()}
            onSelectCard={onSelectCard}
          />
        ))}
      </ul>
    </div>
  );
}

export const CardList = memo(CardListComponent);
CardList.displayName = "CardList";
