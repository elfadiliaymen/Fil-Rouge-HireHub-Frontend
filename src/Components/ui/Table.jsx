import "./Table.css";

export default function Table({ columns = [], children, emptyText = "Aucune donnée." }) {
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={column.className || ""}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children ||
            ((
              <tr>
                <td className="table-empty-cell" colSpan={columns.length || 1}>
                  {emptyText}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}