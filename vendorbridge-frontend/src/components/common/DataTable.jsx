import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';

const DataTable = ({ columns, data = [], isLoading, pagination, emptyState }) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!data || data.length === 0) {
    return emptyState || <EmptyState />;
  }

  return (
    <div className="bg-surface rounded-xl card-shadow border border-outline-variant overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-max">
          <thead className="bg-surface-container-low border-b border-outline-variant">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`px-lg py-md font-label-sm text-on-surface-variant uppercase tracking-wider ${
                    col.align === 'right' ? 'text-right' : ''
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="table-row-hover transition-colors">
                {columns.map((col, colIndex) => {
                  const val = row[col.accessor];
                  return (
                    <td
                      key={colIndex}
                      className={`px-lg py-md text-body-md ${col.align === 'right' ? 'text-right' : ''}`}
                    >
                      {col.render ? col.render(row) : val}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="bg-surface-container-low px-lg py-md flex items-center justify-between border-t border-outline-variant flex-wrap gap-md">
          <p className="font-body-sm text-on-surface-variant">
            Showing <span className="font-bold text-on-surface">{Math.min((pagination.currentPage - 1) * pagination.itemsPerPage + 1, pagination.totalItems)} - {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}</span> of <span className="font-bold text-on-surface">{pagination.totalItems}</span> items
          </p>
          <div className="flex items-center gap-sm">
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="w-10 h-10 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container-high transition-colors disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            
            {Array.from({ length: pagination.totalPages }, (_, idx) => idx + 1)
              .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - pagination.currentPage) <= 1)
              .map((p, index, arr) => {
                const showEllipsis = index > 0 && p - arr[index - 1] > 1;
                return (
                  <React.Fragment key={p}>
                    {showEllipsis && <span className="px-sm text-on-surface-variant">...</span>}
                    <button
                      onClick={() => pagination.onPageChange(p)}
                      className={`w-10 h-10 flex items-center justify-center rounded transition-colors ${
                        pagination.currentPage === p
                          ? 'bg-primary text-on-primary font-bold'
                          : 'hover:bg-surface-container-high'
                      }`}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                );
              })}

            <button
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="w-10 h-10 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container-high transition-colors disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
