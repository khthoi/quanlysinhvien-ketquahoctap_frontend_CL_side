'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faAngleDoubleLeft,
  faAngleDoubleRight
} from '@fortawesome/free-solid-svg-icons';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page:  number) => void;
  totalItems?:  number;
  itemsPerPage?: number;
  showInfo?: boolean;
  showFirstLast?: boolean;
  siblingCount?: number;
  size?: 'sm' | 'md' | 'lg';
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage = 10,
  showInfo = true,
  showFirstLast = true,
  siblingCount = 1,
  size = 'md'
}) => {
  // Generate page numbers
  const generatePages = () => {
    const pages:  (number | string)[] = [];
    const leftSibling = Math.max(currentPage - siblingCount, 1);
    const rightSibling = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < totalPages - 1;

    if (! showLeftDots && showRightDots) {
      // Show first pages
      for (let i = 1; i <= 3 + 2 * siblingCount; i++) {
        if (i <= totalPages) pages.push(i);
      }
      pages.push('...');
      pages.push(totalPages);
    } else if (showLeftDots && !showRightDots) {
      // Show last pages
      pages.push(1);
      pages.push('...');
      for (let i = totalPages - (2 + 2 * siblingCount); i <= totalPages; i++) {
        if (i > 1) pages.push(i);
      }
    } else if (showLeftDots && showRightDots) {
      // Show middle pages
      pages.push(1);
      pages.push('...');
      for (let i = leftSibling; i <= rightSibling; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(totalPages);
    } else {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const sizes = {
    sm: {
      button: 'w-8 h-8 text-sm',
      text: 'text-sm'
    },
    md: {
      button: 'w-10 h-10 text-sm',
      text: 'text-sm'
    },
    lg: {
      button: 'w-12 h-12 text-base',
      text: 'text-base'
    }
  };

  const buttonBase = `
    ${sizes[size].button}
    rounded-lg font-medium
    flex items-center justify-center
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems || 0);

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
      {/* Info */}
      {showInfo && totalItems && (
        <p className={`${sizes[size].text} text-gray-600`}>
          Hiển thị <span className="font-semibold text-gray-900">{startItem}</span> -{' '}
          <span className="font-semibold text-gray-900">{endItem}</span> trong tổng số{' '}
          <span className="font-semibold text-gray-900">{totalItems}</span> kết quả
        </p>
      )}

      {/* Pagination Buttons */}
      <nav className="flex items-center gap-1">
        {/* First Page */}
        {showFirstLast && (
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className={`${buttonBase} text-gray-600 hover:bg-gray-100 disabled:hover:bg-transparent`}
            title="Trang đầu"
          >
            <FontAwesomeIcon icon={faAngleDoubleLeft} />
          </button>
        )}

        {/* Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${buttonBase} text-gray-600 hover:bg-gray-100 disabled:hover:bg-transparent`}
          title="Trang trước"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {generatePages().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className={`${sizes[size].button} flex items-center justify-center text-gray-400`}>
                  ...
                </span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={`
                    ${buttonBase}
                    ${currentPage === page
                      ? 'bg-red-700 text-white shadow-md hover:bg-red-800'
                      : 'text-gray-600 hover:bg-gray-100'
                    }
                  `}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${buttonBase} text-gray-600 hover:bg-gray-100 disabled:hover:bg-transparent`}
          title="Trang sau"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>

        {/* Last Page */}
        {showFirstLast && (
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={`${buttonBase} text-gray-600 hover:bg-gray-100 disabled:hover: bg-transparent`}
            title="Trang cuối"
          >
            <FontAwesomeIcon icon={faAngleDoubleRight} />
          </button>
        )}
      </nav>
    </div>
  );
};

export default Pagination;