import { useId } from "react";

export default function Textarea({ label, error, hint, className = "", id, ...props }) {
  const generatedId = useId();
  const textareaId = id || generatedId;
  const messageId = error || hint ? `${textareaId}-message` : undefined;
  const classes = ["field", error ? "field-error" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      {label && <label htmlFor={textareaId}>{label}</label>}
      <textarea
        id={textareaId}
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
