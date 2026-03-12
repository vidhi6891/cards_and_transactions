import { DataTile } from "../../../../shared/ui";
import {
  formatEuroAmount,
  formatTransactionDate,
} from "../../utils/formatters";
import type { ThemeVars } from "../../utils/themeStyles";
import type { Transaction } from "../../types/types";

interface TransactionRowProps {
  transaction: Transaction;
  style: ThemeVars;
}

export function TransactionRow({ transaction, style }: TransactionRowProps) {
  const isNegative = transaction.amount < 0;

  return (
    <DataTile
      as="li"
      layout="inline"
      className="co-transaction-item border-l-4"
      style={style}
      label={
        <span className="block truncate text-sm font-medium text-slate-700">
          {transaction.description}
        </span>
      }
      subtitle={
        <time
          dateTime={transaction.date}
          className="block text-xs text-slate-500"
        >
          {formatTransactionDate(transaction.date)}
        </time>
      }
      value={
        <span
          className={`text-sm font-bold tabular-nums ${
            isNegative ? "text-red-700" : "co-transaction-amount-positive"
          }`}
        >
          {formatEuroAmount(transaction.amount)}
        </span>
      }
    />
  );
}
