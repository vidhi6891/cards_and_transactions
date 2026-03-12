import { type HTMLAttributes } from "react";

type OverviewPanelVariant = "default" | "themed";

interface OverviewPanelProps extends HTMLAttributes<HTMLElement> {
  variant?: OverviewPanelVariant;
}

function mergeClasses(...classes: Array<string | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function OverviewPanel({
  variant = "default",
  className,
  ...props
}: OverviewPanelProps) {
  const baseClassName = "mt-4 rounded-2xl border p-3.5 sm:mt-5 sm:p-5";

  const variantClassName =
    variant === "themed"
      ? "co-transactions-panel border-l-4"
      : "border-slate-200 bg-white/85 shadow-sm backdrop-blur-sm";

  return (
    <section
      className={mergeClasses(baseClassName, variantClassName, className)}
      {...props}
    />
  );
}
