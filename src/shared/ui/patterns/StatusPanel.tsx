import { type ReactNode } from "react";

export interface StatusPanelProps {
  title: string;
  description?: string;
  loading?: boolean;
  announce?: boolean;
  compact?: boolean;
  className?: string;
  children?: ReactNode;
}

function mergeClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function StatusPanel({
  title,
  description,
  loading = false,
  announce = false,
  compact = false,
  className,
  children,
}: StatusPanelProps) {
  return (
    <div
      className={mergeClasses(
        "co-state-panel",
        loading && "co-state-panel--loading",
        compact && "co-state-panel--compact",
        className,
      )}
      role={announce ? "status" : undefined}
      aria-live={announce ? "polite" : undefined}
      aria-atomic={announce ? "true" : undefined}
    >
      {loading ? <span className="co-loading-spinner" aria-hidden="true" /> : null}
      <p className="co-state-title">{title}</p>
      {description ? <p className="co-state-text">{description}</p> : null}
      {children ? <div className="mt-1">{children}</div> : null}
    </div>
  );
}
