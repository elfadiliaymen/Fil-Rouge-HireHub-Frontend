import "./Button.css";

export default function Button({
  variant = "primary",
  size = "md",
  type = "button",
  disabled,
  children,
  className = "",
  ...props
}) {
  const classes = ["btn", `btn-${variant}`, `btn-${size}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
}