// src/components/Table.jsx
import React, { useState } from "react";
import { FiChevronDown, FiEdit2, FiTrash2 } from "react-icons/fi";

function Table({ columns, data, onEdit, onDelete }) {
  const [expandedRow, setExpandedRow] = useState(null);

  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {col}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row[col] || "-"}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="text-blue-600 hover:text-blue-900 mr-3 transition-colors flex items-center"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="text-red-600 hover:text-red-900 transition-colors flex items-center"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-sm text-gray-500">
                  <div className="flex flex-col items-center">
                    <div className="text-gray-400 text-3xl mb-2">📋</div>
                    No data available
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden">
        {data.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <div key={rowIndex} className="p-4 space-y-3">
                {/* Mobile Header */}
                <div 
                  className="flex justify-between items-start cursor-pointer"
                  onClick={() => toggleRow(rowIndex)}
                >
                  <div className="font-medium text-gray-900 flex-1 min-w-0 mr-4">
                    <div className="break-words overflow-wrap-anywhere">
                      {row[columns[0]] || "Record"}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {(onEdit || onDelete) && (
                      <div className="flex space-x-2">
                        {onEdit && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(row);
                            }}
                            className="text-blue-600 hover:text-blue-900 text-sm font-medium transition-colors flex items-center"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(row);
                            }}
                            className="text-red-600 hover:text-red-900 text-sm font-medium transition-colors flex items-center"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                    <button
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <FiChevronDown className={`w-4 h-4 transform transition-transform ${expandedRow === rowIndex ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Mobile Content */}
                {expandedRow === rowIndex && (
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    {columns.slice(1).map((col, colIndex) => (
                      <div key={colIndex} className="flex flex-col sm:flex-row sm:justify-between py-2 space-y-1 sm:space-y-0">
                        <span className="text-sm font-medium text-gray-500 sm:w-1/2">
                          {col}:
                        </span>
                        <span className="text-sm text-gray-900 sm:text-right sm:w-1/2 break-words overflow-wrap-anywhere">
                          {row[col] || "-"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-sm text-gray-500">
            <div className="flex flex-col items-center">
              <div className="text-gray-400 text-4xl mb-3">📋</div>
              <div className="font-medium">No data available</div>
              <div className="text-xs text-gray-400 mt-1">Try adjusting your filters or add new data</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Table;