import "./FilterPanel.css";

export default function FilterPanel({ title, children }) {
  return (
    <aside className="filter-panel" aria-label={title || "Filtres"}>
      {title && <h3 className="filter-panel-title">{title}</h3>}
      <div className="filter-panel-body">{children}</div>
    </aside>
  );
}