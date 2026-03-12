import { expect, test } from "@playwright/test";

test.describe("Cards overview", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /cards & transactions/i }),
    ).toBeVisible();
  });

  test("renders the default selected card and its transactions", async ({
    page,
  }) => {
    await expect(
      page.getByRole("button", {
        name: /personal essentials, card ending 4821, selected/i,
      }),
    ).toBeVisible();
    await expect(page.getByText("Groceries")).toBeVisible();
  });

  test("applies search and minimum amount filters", async ({ page }) => {
    await page.getByLabel("Search").fill("coffee");
    await expect(page.getByText("Search: coffee")).toBeVisible();

    await page.getByLabel("Minimum amount").fill("10");

    await expect(page.getByLabel("Minimum amount")).toHaveValue("10");
    await expect(page.getByText("Coffee Beans")).toBeVisible();
    await expect(page.getByText("Groceries")).toHaveCount(0);
  });

  test("exports filtered transactions as csv", async ({ page }) => {
    await page.getByLabel("Search").fill("coffee");
    await expect(page.getByText("Search: coffee")).toBeVisible();

    const exportButton = page.getByRole("button", {
      name: /export filtered results for personal essentials/i,
    });
    await expect(exportButton).toBeEnabled();

    const downloadPromise = page.waitForEvent("download");
    await exportButton.click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(
      /^transactions-personal-essentials-\d{4}-\d{2}-\d{2}\.csv$/,
    );
  });

  test("supports keyboard selection and keyboard-driven filtering", async ({
    page,
  }) => {
    const businessCard = page.getByRole("button", {
      name: /business operations, card ending 9174/i,
    });

    await businessCard.focus();
    await expect(businessCard).toBeFocused();
    await page.keyboard.press("Enter");

    await expect(
      page.getByRole("button", {
        name: /business operations, card ending 9174, selected/i,
      }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByText("Client Demo Smartphone")).toBeVisible();

    const search = page.getByLabel("Search");
    await search.focus();
    await page.keyboard.type("client");

    await expect(page.getByText("Search: client")).toBeVisible();
    await expect(page.getByText("Client Demo Smartphone")).toBeVisible();
  });
});
