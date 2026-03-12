import { expect, test } from "@playwright/test";

test.describe("Cards overview visual", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 1200 });
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /cards & transactions/i }),
    ).toBeVisible();
  });

  test("matches default overview layout", async ({ page }) => {
    const root = page.locator("main[aria-labelledby='co-page-title']");
    await expect(root).toBeVisible();
    await expect(root).toHaveScreenshot("cards-overview-default.png", {
      animations: "disabled",
    });
  });

  test("matches filtered transactions layout", async ({ page }) => {
    await page.getByLabel("Search").fill("coffee");
    await expect(page.getByText("Search: coffee")).toBeVisible();

    await page.getByLabel("Minimum amount").fill("10");
    await expect(page.getByText("Min: 10")).toBeVisible();

    const root = page.locator("main[aria-labelledby='co-page-title']");
    await expect(root).toBeVisible();
    await expect(root).toHaveScreenshot("cards-overview-filtered.png", {
      animations: "disabled",
    });
  });
});
