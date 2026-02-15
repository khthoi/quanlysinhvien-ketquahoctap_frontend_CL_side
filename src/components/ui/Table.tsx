'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSort,
  faSortUp,
  faSortDown,
  faInbox
} from '@fortawesome/free-solid-svg-icons';

interface Column<T> {
  headerClassName?: string;
  key: string;
  header: string;
  sortable?: boolean;
  width?: string | number; // number is percentage (e.g., 10 means 10%)
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T, index: number) => React.ReactNode;
  cellClassName?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string) => void;
  onRowClick?: (row: T, index: number) => void;
  selectedRows?: number[];
  emptyMessage?: string;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  compact?: boolean;
}

function Table<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  sortColumn,
  sortDirection,
  onSort,
  onRowClick,
  selectedRows = [],
  emptyMessage = 'Không có dữ liệu',
  striped = true,
  hoverable = true,
  bordered = false,
  compact = false
}: TableProps<T>) {
  const getCellValue = (row: T, key: string) => {
    const keys = key.split('.');
    let value: any = row;
    for (const k of keys) {
      value = value?.[k];
    }
    return value;
  };

  const renderSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;

    if (sortColumn === column.key) {
      return (
        <FontAwesomeIcon
          icon={sortDirection === 'asc' ? faSortUp : faSortDown}
          className="ml-2 text-red-700"
        />
      );
    }
    return <FontAwesomeIcon icon={faSort} className="ml-2 text-gray-300" />;
  };

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  return (
    <div className={`
      bg-white rounded-xl overflow-hidden
      ${bordered ? 'border border-gray-200' : 'shadow-sm'}
    `}>
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`
                    ${compact ? 'px-4 py-3' : 'px-6 py-4'}
                    ${alignmentClasses[column.align || 'left']}
                    text-xs font-semibold text-gray-600 uppercase tracking-wider
                    ${column.sortable ? 'cursor-pointer hover:bg-gray-100 select-none' : ''}
                    ${column.headerClassName || ''}
                  `}
                  style={{ width: typeof column.width === 'number' ? `${column.width}%` : column.width }}
                  onClick={() => column.sortable && onSort?.(column.key)}
                >
                  <span className="inline-flex items-center">
                    {column.header}
                    {renderSortIcon(column)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={compact ? 'px-4 py-3' : 'px-6 py-4'}
                    >
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              // Empty state
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-16 text-center"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <FontAwesomeIcon icon={faInbox} className="text-2xl text-gray-400" />
                    </div>
                    <p className="text-gray-500">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              // Data rows
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => onRowClick?.(row, rowIndex)}
                  className={`
                    transition-colors duration-150
                    ${striped && rowIndex % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'}
                    ${hoverable ? 'hover:bg-red-50/50' : ''}
                    ${onRowClick ? 'cursor-pointer' : ''}
                    ${selectedRows.includes(rowIndex) ? 'bg-red-50 hover:bg-red-100' : ''}
                  `}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`
                        ${compact ? 'px-4 py-3' : 'px-6 py-4'}
                        ${alignmentClasses[column.align || 'left']}
                        text-sm text-gray-700
                        ${column.cellClassName || ''}
                      `}
                    >
                      {column.render
                        ? column.render(getCellValue(row, column.key), row, rowIndex)
                        : getCellValue(row, column.key)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;