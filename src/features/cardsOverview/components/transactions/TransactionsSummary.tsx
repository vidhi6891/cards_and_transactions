import { DataTile } from "../../../../shared/ui";
import { formatEuroAmount } from "../../utils/formatters";
import type { TransactionSummary } from "../../utils/transactionSummary";

interface TransactionsSummaryProps {
  summary: TransactionSummary;
  isLoading: boolean;
}

function getValueClassName(tone: "neutral" | "positive" | "negative"): string {
  if (tone === "negative") return "text-red-700";
  if (tone === "positive") return "text-emerald-700";
  return "text-slate-900";
}

export function TransactionsSummary({
  summary,
  isLoading,
}: TransactionsSummaryProps) {
  if (isLoading) {
    return (
      <p
        className="mb-3 text-sm text-slate-600"
        role="status"
        aria-live="polite"
      >
        Calculating summary...
      </p>
    );
  }

  return (
    <dl
      className="mb-3 grid grid-cols-2 gap-2 lg:grid-cols-4"
      aria-label="Transactions summary"
    >
      <DataTile
        label={
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Transactions
          </dt>
        }
        value={
          <dd
            className={`mt-1 text-sm font-bold tabular-nums ${getValueClassName("neutral")}`}
          >
            {String(summary.count)}
          </dd>
        }
      />

      <DataTile
        label={
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Total spend
          </dt>
        }
        value={
          <dd
            className={`mt-1 text-sm font-bold tabular-nums ${getValueClassName("neutral")}`}
          >
            {formatEuroAmount(summary.totalSpent)}
          </dd>
        }
      />

      <DataTile
        label={
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Refunds
          </dt>
        }
        value={
          <dd
            className={`mt-1 text-sm font-bold tabular-nums ${getValueClassName("neutral")}`}
          >
            {formatEuroAmount(summary.totalRefunds)}
          </dd>
        }
      />

      <DataTile
        label={
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Net amount
          </dt>
        }
        value={
          <dd
            className={`mt-1 text-sm font-bold tabular-nums ${getValueClassName(
              summary.netAmount < 0 ? "negative" : "positive",
            )}`}
          >
            {formatEuroAmount(summary.netAmount)}
          </dd>
        }
      />
    </dl>
  );
}
