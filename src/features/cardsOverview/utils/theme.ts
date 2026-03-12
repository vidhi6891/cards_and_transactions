import type { Card } from "../types/types";

export interface CardTheme {
  accent: string;
  accentStrong: string;
  accentSoft: string;
  border: string;
  surface: string;
  text: string;
  glow: string;
}

type ThemeCard = Pick<Card, "id" | "themeKey">;

type Tone = {
  saturation: number;
  lightness: number;
};

const HUE_STEP = 10;
const HUES = Array.from(
  { length: 360 / HUE_STEP },
  (_, index) => index * HUE_STEP,
);
const HUE_PERMUTATION_STEP = 11;

const TONES: readonly Tone[] = [
  { saturation: 78, lightness: 43 },
  { saturation: 66, lightness: 37 },
  { saturation: 84, lightness: 50 },
];

const SLOT_COUNT = HUES.length * TONES.length;
const PROBE_STEP = 29;
const FALLBACK_THEME = buildTheme(188, 74, 44);

function hashString(value: string): number {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function normalizeSeed(value: string | undefined): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function hsl(hue: number, saturation: number, lightness: number): string {
  return `hsl(${hue} ${saturation}% ${lightness}%)`;
}

function buildTheme(
  hue: number,
  saturation: number,
  accentLightness: number,
): CardTheme {
  const strongLightness = Math.max(24, accentLightness - 15);
  const textLightness = Math.max(19, accentLightness - 22);
  const softLightness = Math.min(83, accentLightness + 26);
  const surfaceLightness = Math.min(95, accentLightness + 45);
  const borderLightness = Math.min(80, accentLightness + 21);

  return {
    accent: hsl(hue, saturation, accentLightness),
    accentStrong: hsl(hue, Math.min(90, saturation + 6), strongLightness),
    accentSoft: hsl(hue, Math.max(52, saturation - 14), softLightness),
    border: hsl(hue, Math.max(50, saturation - 16), borderLightness),
    surface: hsl(hue, Math.max(44, saturation - 26), surfaceLightness),
    text: hsl(hue, Math.max(56, saturation - 6), textLightness),
    glow: `hsl(${hue} ${Math.min(90, saturation + 4)}% ${accentLightness}% / 0.42)`,
  };
}

function slotToTheme(slot: number): CardTheme {
  const hueBucket = slot % HUES.length;
  const permutedHue = HUES[(hueBucket * HUE_PERMUTATION_STEP) % HUES.length];
  const tone = TONES[Math.floor(slot / HUES.length)];
  return buildTheme(permutedHue, tone.saturation, tone.lightness);
}

export function getThemeCapacity(): number {
  return SLOT_COUNT;
}

export function getFallbackCardTheme(): CardTheme {
  return FALLBACK_THEME;
}

export function buildCardThemeMap(
  cards: readonly ThemeCard[],
): Record<string, CardTheme> {
  const uniqueById = new Map<string, ThemeCard>();
  for (const card of cards) {
    if (!uniqueById.has(card.id)) {
      uniqueById.set(card.id, card);
    }
  }

  const sortedCards = Array.from(uniqueById.values()).sort((a, b) =>
    a.id.localeCompare(b.id),
  );

  const usedSlots = new Set<number>();
  const themeByCardId: Record<string, CardTheme> = {};

  for (const card of sortedCards) {
    const seed = normalizeSeed(card.themeKey) ?? card.id;
    let slot = hashString(seed) % SLOT_COUNT;
    let attempts = 0;

    while (usedSlots.has(slot) && attempts < SLOT_COUNT) {
      slot = (slot + PROBE_STEP) % SLOT_COUNT;
      attempts += 1;
    }

    if (attempts >= SLOT_COUNT) {
      themeByCardId[card.id] = FALLBACK_THEME;
      continue;
    }

    usedSlots.add(slot);
    themeByCardId[card.id] = slotToTheme(slot);
  }

  return themeByCardId;
}

export function getCardThemeFromMap(
  themeByCardId: Record<string, CardTheme>,
  cardId: string | null,
): CardTheme {
  if (!cardId) {
    return FALLBACK_THEME;
  }

  return themeByCardId[cardId] ?? FALLBACK_THEME;
}
