import "./ActiveFilterChips.css";

export default function ActiveFilterChips({ filters = [], onRemove, onClear }) {
  if (filters.length === 0) return null;

  return (
    <div className="active-filters" aria-label="Filtres actifs">
      {filters.map((filter) => (
        <span key={filter.key} className="active-chip">
          {filter.label}
          <button
            type="button"
            className="active-chip-remove"
            aria-label={`Retirer le filtre ${filter.label}`}
            onClick={() => onRemove(filter.key)}
          >
            &times;
          </button>
        </span>
      ))}

      {onClear && (
        <button type="button" className="active-filters-clear" onClick={onClear}>
          Tout effacer
        </button>
      )}
    </div>
  );
}