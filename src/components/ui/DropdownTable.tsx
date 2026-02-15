'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSort,
  faSortUp,
  faSortDown,
  faInbox,
  faChevronDown,
  faChevronRight
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

interface DropdownTableProps<T, D> {
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
  // Dropdown specific props
  getDropdownData?: (row: T, index: number) => D[];
  dropdownColumns?: Column<D>[];
  renderDropdownContent?: (row: T, index: number, dropdownData: D[]) => React.ReactNode;
  expandableColumnKey?: string; // Column key that contains the expand/collapse button
}

function DropdownTable<T extends Record<string, any>, D extends Record<string, any> = any>({
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
  compact = false,
  getDropdownData,
  dropdownColumns,
  renderDropdownContent,
  expandableColumnKey
}: DropdownTableProps<T, D>) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRow = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  const getCellValue = <R extends Record<string, any>>(row: R, key: string) => {
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
              {getDropdownData && (
                <th
                  className={`
                    ${compact ? 'px-4 py-3' : 'px-6 py-4'}
                    text-xs font-semibold text-gray-600 uppercase tracking-wider
                    w-12
                  `}
                />
              )}
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
                  {getDropdownData && (
                    <td className={compact ? 'px-4 py-3' : 'px-6 py-4'} />
                  )}
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
                  colSpan={columns.length + (getDropdownData ? 1 : 0)}
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
              data.map((row, rowIndex) => {
                const isExpanded = expandedRows.has(rowIndex);
                const dropdownData = getDropdownData ? getDropdownData(row, rowIndex) : [];
                const hasDropdown = getDropdownData && dropdownData.length > 0;

                return (
                  <React.Fragment key={rowIndex}>
                    <tr
                      onClick={() => !hasDropdown && onRowClick?.(row, rowIndex)}
                      className={`
                        transition-colors duration-150
                        ${striped && rowIndex % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'}
                        ${hoverable ? 'hover:bg-red-50/50' : ''}
                        ${onRowClick && !hasDropdown ? 'cursor-pointer' : ''}
                        ${selectedRows.includes(rowIndex) ? 'bg-red-50 hover:bg-red-100' : ''}
                      `}
                    >
                      {hasDropdown && (
                        <td
                          className={`
                            ${compact ? 'px-4 py-3' : 'px-6 py-4'}
                            text-center
                          `}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRow(rowIndex);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <FontAwesomeIcon
                              icon={isExpanded ? faChevronDown : faChevronRight}
                              className="text-gray-600"
                            />
                          </button>
                        </td>
                      )}
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
                    {isExpanded && hasDropdown && (
                      <tr>
                        <td
                          colSpan={columns.length + 1}
                          className="px-6 py-4 bg-gray-50/30"
                        >
                          {renderDropdownContent ? (
                            renderDropdownContent(row, rowIndex, dropdownData)
                          ) : dropdownColumns ? (
                            <div className="ml-8 border-l-2 border-gray-200 pl-6">
                              <table className="w-full">
                                <thead>
                                  <tr className="bg-gray-100/50">
                                    {dropdownColumns.map((col) => (
                                      <th
                                        key={col.key}
                                        className={`
                                          ${compact ? 'px-3 py-2' : 'px-4 py-3'}
                                          ${alignmentClasses[col.align || 'left']}
                                          text-xs font-semibold text-gray-600 uppercase tracking-wider
                                          ${col.headerClassName || ''}
                                        `}
                                        style={{ width: typeof col.width === 'number' ? `${col.width}%` : col.width }}
                                      >
                                        {col.header}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                  {dropdownData.map((dropdownRow, dropdownIndex) => (
                                    <tr
                                      key={dropdownIndex}
                                      className={`
                                        ${striped && dropdownIndex % 2 === 1 ? 'bg-white/50' : 'bg-white'}
                                        ${hoverable ? 'hover:bg-gray-50' : ''}
                                      `}
                                    >
                                      {dropdownColumns.map((col: Column<D>) => {
                                        const cellValue = getCellValue<D>(dropdownRow, col.key);
                                        return (
                                          <td
                                            key={col.key}
                                            className={`
                                              ${compact ? 'px-3 py-2' : 'px-4 py-3'}
                                              ${alignmentClasses[col.align || 'left']}
                                              text-sm text-gray-700
                                              ${col.cellClassName || ''}
                                            `}
                                          >
                                            {col.render
                                              ? col.render(cellValue, dropdownRow, dropdownIndex)
                                              : cellValue}
                                          </td>
                                        );
                                      })}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : null}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DropdownTable;
