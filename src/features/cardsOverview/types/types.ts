export interface Card {
  id: string;
  description: string;
  last4: string;
  // Optional backend-provided override for future migration.
  themeKey?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string; // ISO date string: YYYY-MM-DD
}

export type TransactionsByCardId = Record<string, Transaction[]>;
