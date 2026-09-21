import "./Field.css";

export default function Select({ label, error, hint, className = "", children, ...props }) {
  const classes = ["field", error ? "field-error" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      {label && <label htmlFor={props.id}>{label}</label>}
      <select aria-invalid={error ? "true" : undefined} {...props}>
        {children}
      </select>
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