import React from "react";
import PortalEmpty from "./PortalEmpty";
import PortalLoading from "./PortalLoading";

const PortalTable = ({ columns, rows, loading, emptyTitle, emptyMessage }) => {
  if (loading) return <PortalLoading />;
  if (!rows?.length) {
    return <PortalEmpty title={emptyTitle} message={emptyMessage} />;
  }

  return (
    <div className="ep-table-wrap">
      <table className="ep-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PortalTable;
