import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  test("renders the CardsOverview entry point", async () => {
    render(<App />);

    expect(
      await screen.findByRole("heading", { name: /cards & transactions/i }),
    ).toBeInTheDocument();
  });
});
