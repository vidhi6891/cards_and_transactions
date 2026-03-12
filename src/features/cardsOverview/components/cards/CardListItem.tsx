import { memo } from "react";
import { Badge, Button } from "../../../../shared/ui";
import { formatMaskedLast4 } from "../../utils/helpers";
import type { CardTheme } from "../../utils/theme";
import {
  getCardButtonVars,
  getCardMetaVars,
  getCardSelectedPillVars,
} from "../../utils/themeStyles";
import type { Card } from "../../types/types";

interface CardListItemProps {
  card: Card;
  isSelected: boolean;
  theme: CardTheme;
  onSelectCard: (cardId: string) => void;
}

function CardListItemComponent({
  card,
  isSelected,
  theme,
  onSelectCard,
}: CardListItemProps) {
  const cardVars = getCardButtonVars(theme, isSelected);
  const cardMetaVars = getCardMetaVars(theme);
  const selectedPillVars = getCardSelectedPillVars(theme);

  const ariaLabel = `${card.description}, card ending ${card.last4}${
    isSelected ? ", selected" : ""
  }`;

  return (
    <li>
      <Button
        type="button"
        aria-pressed={isSelected}
        data-selected={isSelected ? "true" : undefined}
        className="co-card-button w-full rounded-2xl border border-l-4 px-4 py-3 text-left"
        aria-label={ariaLabel}
        aria-controls="co-transactions-list"
        onClick={() => onSelectCard(card.id)}
        style={cardVars}
      >
        <div className="flex items-start justify-between gap-2">
          <span className="block text-[0.95rem] font-semibold leading-tight text-slate-900">
            {card.description}
          </span>
          {isSelected ? (
            <Badge
              className="co-card-selected-pill rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
              style={selectedPillVars}
            >
              Selected
            </Badge>
          ) : null}
        </div>

        <span
          className="co-card-meta mt-2 block text-[0.72rem] font-semibold uppercase tracking-[0.14em]"
          style={cardMetaVars}
        >
          {formatMaskedLast4(card.last4)}
        </span>
      </Button>
    </li>
  );
}

export const CardListItem = memo(CardListItemComponent);
CardListItem.displayName = "CardListItem";
