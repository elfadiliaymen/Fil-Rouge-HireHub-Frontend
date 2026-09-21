import "./Badge.css";

export default function Badge({ className = "", children, ...props }) {
  const classes = ["badge", className].filter(Boolean).join(" ");
  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}