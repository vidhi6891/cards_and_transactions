import { describe, expect, test } from "vitest";
import { buildCardThemeMap, getThemeCapacity } from "./theme";

function makeCardIds(count: number): string[] {
  return Array.from(
    { length: count },
    (_, index) => `card-${String(index + 1).padStart(3, "0")}`,
  );
}

describe("buildCardThemeMap", () => {
  test("is deterministic regardless of card order", () => {
    const ids = ["card-a", "card-b", "card-c", "card-d"];
    const forward = buildCardThemeMap(ids.map((id) => ({ id })));
    const reversed = buildCardThemeMap(
      [...ids].reverse().map((id) => ({ id })),
    );

    for (const id of ids) {
      expect(reversed[id]).toEqual(forward[id]);
    }
  });

  test("avoids accent collisions up to palette capacity", () => {
    const capacity = getThemeCapacity();
    const ids = makeCardIds(capacity);
    const themes = buildCardThemeMap(ids.map((id) => ({ id })));

    const accents = ids.map((id) => themes[id].accent);
    expect(new Set(accents).size).toBe(capacity);
  });
});
