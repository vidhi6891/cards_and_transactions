import type { CSSProperties } from "react";
import type { CardTheme } from "./theme";

export type ThemeVars = CSSProperties &
  Record<`--co-${string}`, string | number>;

export function getTransactionsPanelVars(theme: CardTheme): ThemeVars {
  return {
    "--co-panel-border": theme.border,
    "--co-panel-accent": theme.accent,
    "--co-panel-surface": theme.surface,
    "--co-panel-glow": theme.glow,
  };
}

export function getSelectedCardBadgeVars(theme: CardTheme): ThemeVars {
  return {
    "--co-badge-text": theme.text,
    "--co-badge-border": theme.border,
    "--co-badge-surface": theme.accentSoft,
  };
}

export function getCardButtonVars(
  theme: CardTheme,
  isSelected: boolean,
): ThemeVars {
  return {
    "--co-card-border": isSelected ? theme.accent : theme.border,
    "--co-card-accent": theme.accentStrong,
    "--co-card-surface": theme.surface,
    "--co-card-accent-soft": theme.accentSoft,
    "--co-card-glow": theme.glow,
    "--co-card-ring": theme.accent,
    "--co-card-selected-ring": theme.accent,
    "--co-card-focus-ring": theme.accentSoft,
    "--co-card-opacity": isSelected ? 1 : 0.92,
  };
}

export function getCardSelectedPillVars(theme: CardTheme): ThemeVars {
  return {
    "--co-pill-text": theme.text,
    "--co-pill-border": theme.border,
    "--co-pill-surface": theme.accentSoft,
  };
}

export function getCardMetaVars(theme: CardTheme): ThemeVars {
  return {
    "--co-card-meta-text": theme.text,
  };
}

export function getTransactionItemVars(theme: CardTheme): ThemeVars {
  return {
    "--co-tx-item-accent": theme.accentSoft,
    "--co-tx-amount-positive": theme.accentStrong,
  };
}
