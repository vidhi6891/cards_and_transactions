import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { CardsOverview } from "./CardsOverview";

function getPath(input: RequestInfo | URL): string {
  if (typeof input === "string") {
    return new URL(input, "http://localhost").pathname;
  }

  if (input instanceof URL) {
    return input.pathname;
  }

  return new URL(input.url, "http://localhost").pathname;
}

describe("CardsOverview integration", () => {
  test("switches cards and updates the transaction list", async () => {
    render(<CardsOverview />);

    expect(await screen.findByText("Groceries")).toBeInTheDocument();

    fireEvent.click(
      await screen.findByRole("button", {
        name: /business operations, card ending/i,
      }),
    );

    expect(
      await screen.findByText("Client Demo Smartphone"),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("Groceries")).not.toBeInTheDocument();
    });
  });

  test("creates active amount filter chips when filtering", async () => {
    render(<CardsOverview />);
    await screen.findByText("Groceries");

    fireEvent.change(screen.getByLabelText(/minimum amount/i), {
      target: { value: "120" },
    });

    expect(await screen.findByText("Min: 120")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("Groceries")).not.toBeInTheDocument();
      expect(screen.getByText(/1 result/i)).toBeInTheDocument();
    });
  });

  test("clears amount filters via reset", async () => {
    render(<CardsOverview />);
    await screen.findByText("Groceries");

    const minAmountInput = screen.getByLabelText(
      /minimum amount/i,
    ) as HTMLInputElement;
    const maxAmountInput = screen.getByLabelText(
      /maximum amount/i,
    ) as HTMLInputElement;

    fireEvent.change(minAmountInput, { target: { value: "300" } });
    fireEvent.change(maxAmountInput, { target: { value: "100" } });
    expect(minAmountInput.value).toBe("300");
    expect(maxAmountInput.value).toBe("100");

    fireEvent.click(screen.getByRole("button", { name: /^reset$/i }));

    await waitFor(() => {
      expect(minAmountInput.value).toBe("");
      expect(maxAmountInput.value).toBe("");
    });
  });

  test("applies highest sort order", async () => {
    render(<CardsOverview />);
    await screen.findByText("Groceries");

    fireEvent.change(screen.getByLabelText(/sort/i), {
      target: { value: "highest" },
    });

    await waitFor(() => {
      const transactionList = document.getElementById("co-transactions-list");
      expect(transactionList).not.toBeNull();
      const firstItem = transactionList?.querySelector("li");
      expect(firstItem?.textContent ?? "").toContain("Home Supplies");
    });
  });

  test("shows cards error state when cards request fails", async () => {
    const originalFetch = global.fetch;
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const path = getPath(input);

        if (path === "/data/cards.json") {
          return new Response(null, { status: 500 });
        }

        return originalFetch(input, init);
      }),
    );

    render(<CardsOverview />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Could not load cards.",
    );
  });

  test("shows transactions error state when transactions request fails", async () => {
    const originalFetch = global.fetch;
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const path = getPath(input);

        if (path === "/data/transactions.json") {
          return new Response(null, { status: 500 });
        }

        return originalFetch(input, init);
      }),
    );

    render(<CardsOverview />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Could not load transactions.",
    );
  });

  test("keeps latest card transactions when switching cards quickly", async () => {
    render(<CardsOverview />);

    fireEvent.click(
      await screen.findByRole("button", {
        name: /business operations, card ending/i,
      }),
    );

    expect(
      await screen.findByText("Client Demo Smartphone"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Groceries")).not.toBeInTheDocument();
  });

  test("shows active chip controls for each applied filter", async () => {
    render(<CardsOverview />);
    await screen.findByText("Groceries");

    fireEvent.change(screen.getByLabelText(/search/i), {
      target: { value: "coffee" },
    });
    expect(await screen.findByText("Search: coffee")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/minimum amount/i), {
      target: { value: "10" },
    });
    expect(await screen.findByText("Min: 10")).toBeInTheDocument();

    const removeMinButton = screen.getByRole("button", {
      name: /remove min: 10/i,
    });
    const removeQueryButton = screen.getByRole("button", {
      name: /remove search: coffee/i,
    });
    const clearAllButton = screen.getByRole("button", { name: /clear all/i });

    await waitFor(() => {
      expect(removeQueryButton).toBeEnabled();
      expect(removeMinButton).toBeEnabled();
      expect(clearAllButton).toBeEnabled();
    });
  });

  test("clears active chips and restores results via clear all", async () => {
    render(<CardsOverview />);
    await screen.findByText("Groceries");

    fireEvent.change(screen.getByLabelText(/search/i), {
      target: { value: "coffee" },
    });
    expect(await screen.findByText("Search: coffee")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/minimum amount/i), {
      target: { value: "10" },
    });
    expect(await screen.findByText("Min: 10")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /clear all/i }));

    await waitFor(() => {
      expect(screen.queryByText("Search: coffee")).not.toBeInTheDocument();
      expect(screen.queryByText("Min: 10")).not.toBeInTheDocument();
      expect(screen.getByText(/12 results/i)).toBeInTheDocument();
      expect(screen.getByText("Groceries")).toBeInTheDocument();
    });
  });

  test("disables export when there are no filtered results", async () => {
    render(<CardsOverview />);
    await screen.findByText("Groceries");

    fireEvent.change(screen.getByLabelText(/search/i), {
      target: { value: "zzzz-no-match" },
    });

    expect(await screen.findByText(/no matching transactions/i)).toBeVisible();

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: /export filtered results for personal essentials/i,
        }),
      ).toBeDisabled();
    });
  });
});
