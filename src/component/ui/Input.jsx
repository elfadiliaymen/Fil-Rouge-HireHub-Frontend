import { useId } from "react";

export default function Input({ label, error, hint, className = "", id, ...props }) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const messageId = error || hint ? `${inputId}-message` : undefined;
  const classes = ["field", error ? "field-error" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      {label && <label htmlFor={inputId}>{label}</label>}
      <input
        id={inputId}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={messageId}
        {...props}
      />
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
