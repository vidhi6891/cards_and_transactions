import { forwardRef, type InputHTMLAttributes } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

function mergeClasses(...classes: Array<string | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={mergeClasses(
          "transition disabled:cursor-not-allowed disabled:opacity-70",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
