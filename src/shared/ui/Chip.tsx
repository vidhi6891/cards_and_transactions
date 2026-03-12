import { type CSSProperties, type ReactNode } from "react";
import { Button } from "./Button";

export interface ChipProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onRemove?: () => void;
  removeLabel?: string;
  disabled?: boolean;
}

function mergeClasses(...classes: Array<string | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function Chip({
  children,
  className,
  style,
  onRemove,
  removeLabel = "Remove",
  disabled = false,
}: ChipProps) {
  return (
    <span
      className={mergeClasses(
        "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium",
        className,
      )}
      style={style}
    >
      <span className="truncate">{children}</span>
      {onRemove ? (
        <Button
          type="button"
          aria-label={removeLabel}
          className="-mr-1 ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold leading-none transition hover:bg-slate-900/10"
          onClick={onRemove}
          disabled={disabled}
        >
          ×
        </Button>
      ) : null}
    </span>
  );
}
