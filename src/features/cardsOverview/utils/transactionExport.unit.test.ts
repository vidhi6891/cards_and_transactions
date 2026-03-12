import { describe, expect, test } from "vitest";
import { buildTransactionsCsv } from "./transactionExport";
import type { Transaction } from "../types/types";

describe("buildTransactionsCsv", () => {
  test("builds a csv with header and escaped cells", () => {
    const transactions: Transaction[] = [
      {
        id: "tx-1",
        amount: 12.3,
        description: 'Coffee, "Large"',
        date: "2026-01-01",
      },
      {
        id: "tx-2",
        amount: -4.5,
        description: "Refund\nAdjustment",
        date: "2026-01-02",
      },
    ];

    const csv = buildTransactionsCsv(transactions, "Personal Essentials");
    const rows = csv.split("\n");

    expect(rows[0]).toBe("card,transaction_id,date,description,amount");
    expect(rows[1]).toContain('"Coffee, ""Large"""');
    expect(csv).toContain('"Refund\nAdjustment"');
    expect(rows[1]).toContain("12.30");
    expect(csv).toContain("-4.50");
  });
});
