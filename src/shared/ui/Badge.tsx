import { type CSSProperties, type ReactNode } from "react";

export interface BadgeProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

function mergeClasses(...classes: Array<string | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function Badge({ children, className, style }: BadgeProps) {
  return (
    <span
      className={mergeClasses(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold",
        className,
      )}
      style={style}
    >
      {children}
    </span>
  );
}
