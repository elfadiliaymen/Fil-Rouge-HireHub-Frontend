import { useId } from "react";

export default function Select({ label, error, hint, className = "", id, children, ...props }) {
  const generatedId = useId();
  const selectId = id || generatedId;
  const messageId = error || hint ? `${selectId}-message` : undefined;
  const classes = ["field", error ? "field-error" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      {label && <label htmlFor={selectId}>{label}</label>}
      <select
        id={selectId}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={messageId}
        {...props}
      >
        {children}
      </select>
      {error ? (
        <p id={messageId} className="field-error-msg" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={messageId} className="field-hint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
