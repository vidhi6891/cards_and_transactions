import { type CSSProperties, type ReactNode } from "react";

type DataTileElement = "div" | "li";
type DataTileLayout = "stacked" | "inline";

export interface DataTileProps {
  label: ReactNode;
  value: ReactNode;
  subtitle?: ReactNode;
  as?: DataTileElement;
  layout?: DataTileLayout;
  className?: string;
  style?: CSSProperties;
}

function mergeClasses(...classes: Array<string | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function DataTile({
  label,
  value,
  subtitle,
  as = "div",
  layout = "stacked",
  className,
  style,
}: DataTileProps) {
  const Component = as;

  if (layout === "inline") {
    return (
      <Component
        className={mergeClasses(
          "rounded-xl border border-slate-200 bg-white px-3.5 py-3 shadow-sm",
          "flex items-center justify-between gap-4",
          className,
        )}
        style={style}
      >
        <div className="min-w-0">
          {label}
          {subtitle ? <div className="mt-1">{subtitle}</div> : null}
        </div>
        <div className="shrink-0">{value}</div>
      </Component>
    );
  }

  return (
    <Component
      className={mergeClasses(
        "rounded-xl border border-slate-200 bg-white/85 px-3 py-2.5 shadow-sm",
        className,
      )}
      style={style}
    >
      {label}
      {subtitle}
      {value}
    </Component>
  );
}
