const euroFormatter = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
});

const dateFormatter = new Intl.DateTimeFormat("en-IE", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatEuroAmount(amount: number): string {
  return euroFormatter.format(amount);
}

export function formatTransactionDate(value: string): string {
  const parsed = Date.parse(value);

  if (!Number.isFinite(parsed)) {
    return "Unknown date";
  }

  return dateFormatter.format(new Date(parsed));
}
