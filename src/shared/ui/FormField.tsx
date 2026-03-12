import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

interface FormFieldProps {
  label: ReactNode;
  htmlFor: string;
  children: ReactNode;
  className?: string;
  labelClassName?: string;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
}

type FieldControlProps = {
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  "aria-errormessage"?: string;
};

function mergeClasses(...classes: Array<string | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function mergeIds(...ids: Array<string | undefined>): string | undefined {
  const merged = ids
    .flatMap((id) => (id ? id.split(" ") : []))
    .map((id) => id.trim())
    .filter(Boolean);

  return merged.length > 0 ? Array.from(new Set(merged)).join(" ") : undefined;
}

function hasValue(value: ReactNode | undefined): boolean {
  return (
    value !== undefined && value !== null && value !== false && value !== ""
  );
}

export function FormField({
  label,
  htmlFor,
  children,
  className,
  labelClassName,
  hint,
  error,
  required = false,
}: FormFieldProps) {
  const hintId = hasValue(hint) ? `${htmlFor}-hint` : undefined;
  const errorId = hasValue(error) ? `${htmlFor}-error` : undefined;

  let control = children;

  if (
    Children.count(children) === 1 &&
    isValidElement<FieldControlProps>(children)
  ) {
    const child = children as ReactElement<FieldControlProps>;
    control = cloneElement(child, {
      "aria-describedby": mergeIds(
        child.props["aria-describedby"],
        hintId,
        errorId,
      ),
      "aria-invalid": errorId ? true : child.props["aria-invalid"],
      "aria-errormessage": errorId,
    });
  }

  return (
    <div className={mergeClasses("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className={mergeClasses(
          "text-xs font-semibold uppercase tracking-wide text-slate-600",
          labelClassName,
        )}
      >
        {label}
        {required ? (
          <span className="ml-1 text-red-600" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>

      {control}

      {hasValue(hint) ? (
        <p id={hintId} className="text-xs text-slate-500">
          {hint}
        </p>
      ) : null}

      {hasValue(error) ? (
        <p
          id={errorId}
          role="alert"
          className="text-xs font-medium text-red-600"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
