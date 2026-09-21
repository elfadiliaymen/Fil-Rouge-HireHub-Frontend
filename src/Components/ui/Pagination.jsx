import "./Pagination.css";

function buildPages(current, total) {
  const pages = [];
  for (let i = 0; i < total; i += 1) {
    if (i === 0 || i === total - 1 || Math.abs(i - current) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }
  return pages;
}

export default function Pagination({ page, totalPages, size, onPageChange, onSizeChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const pages = buildPages(page, totalPages);

  return (
    <div className="pagination">
      <span className="pagination-info">
        Page {page + 1} sur {totalPages}
      </span>

      <div className="pagination-controls">
        <button
          type="button"
          className="pagination-btn"
          disabled={page === 0}
          onClick={() => onPageChange(page - 1)}
        >
          Précédent
        </button>

        {pages.map((item, index) =>
          item === "..." ? (
            <span key={`ellipsis-${index}`} className="pagination-ellipsis">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={"pagination-btn" + (item === page ? " is-active" : "")}
              aria-current={item === page ? "page" : undefined}
              onClick={() => onPageChange(item)}
            >
              {item + 1}
            </button>
          )
        )}

        <button
          type="button"
          className="pagination-btn"
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
        >
          Suivant
        </button>
      </div>

      {onSizeChange && (
        <label className="pagination-size">
          Afficher
          <select value={size} onChange={(event) => onSizeChange(Number(event.target.value))}>
            {[10, 25, 50].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      )}
    </div>
  );
}