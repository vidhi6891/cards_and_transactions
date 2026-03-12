import "@testing-library/jest-dom/vitest";
import cardsJson from "./test/fixtures/cards.json";
import transactionsJson from "./test/fixtures/transactions.json";
import { afterEach, beforeEach, vi } from "vitest";

function getPath(input: RequestInfo | URL): string {
  if (typeof input === "string") {
    return new URL(input, "http://localhost").pathname;
  }

  if (input instanceof URL) {
    return input.pathname;
  }

  return new URL(input.url, "http://localhost").pathname;
}

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(
      async (
        input: RequestInfo | URL,
        init?: RequestInit,
      ): Promise<Response> => {
        if (init?.signal?.aborted) {
          throw new DOMException("The operation was aborted.", "AbortError");
        }

        const path = getPath(input);

        if (path === "/data/cards.json") {
          return new Response(JSON.stringify(cardsJson), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        if (path === "/data/transactions.json") {
          return new Response(JSON.stringify(transactionsJson), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(null, { status: 404 });
      },
    ),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
