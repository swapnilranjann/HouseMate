import React from 'react';

const DataTable = ({ columns, data, emptyMessage = "No data found." }) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-200">
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  className={`px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500 ${col.headerClassName || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length > 0 ? (
              data.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-gray-50/50 transition-colors group">
                  {columns.map((col, colIdx) => (
                    <td 
                      key={colIdx} 
                      className={`px-6 py-4 text-sm text-slate-700 whitespace-nowrap ${col.cellClassName || ''}`}
                    >
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-24 text-center">
                  <p className="text-slate-400 font-semibold">{emptyMessage}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
