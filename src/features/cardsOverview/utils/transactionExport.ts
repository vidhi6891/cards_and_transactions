import type { Transaction } from "../types/types";

function escapeCsvCell(value: string | number): string {
  const text = String(value);

  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

function formatAmount(amount: number): string {
  return amount.toFixed(2);
}

function sanitizeFilenamePart(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "card"
  );
}

function buildFilename(prefix: string): string {
  const date = new Date().toISOString().slice(0, 10);
  return `${prefix}-${date}.csv`;
}

export function buildTransactionsCsv(
  transactions: Transaction[],
  cardDescription: string | null,
): string {
  const header = ["card", "transaction_id", "date", "description", "amount"];

  const rows = transactions.map((transaction) => [
    cardDescription ?? "",
    transaction.id,
    transaction.date,
    transaction.description,
    formatAmount(transaction.amount),
  ]);

  return [header, ...rows]
    .map((row) => row.map(escapeCsvCell).join(","))
    .join("\n");
}

export function downloadTransactionsCsv(
  transactions: Transaction[],
  options?: {
    cardDescription?: string | null;
    filenamePrefix?: string;
  },
): void {
  if (transactions.length === 0) {
    return;
  }

  const cardDescription = options?.cardDescription ?? null;
  const csv = buildTransactionsCsv(transactions, cardDescription);

  const prefix = options?.filenamePrefix?.trim() || "transactions";
  const cardPart = cardDescription
    ? `-${sanitizeFilenamePart(cardDescription)}`
    : "";
  const filename = buildFilename(`${prefix}${cardPart}`);

  const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";

  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  URL.revokeObjectURL(url);
}
