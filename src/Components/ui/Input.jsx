import "./Field.css";

export default function Input({ label, error, hint, className = "", ...props }) {
  const classes = ["field", error ? "field-error" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      {label && <label htmlFor={props.id}>{label}</label>}
      <input aria-invalid={error ? "true" : undefined} {...props} />
      {error ? (
        <p className="field-error-msg" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="field-hint">{hint}</p>
      ) : null}
    </div>
  );
}