import React from 'react';
import '../styles/Pagination.scss';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  // Calculate the range of page numbers to display
  const getPageNumbers = (): number[] => {
    const displayCount = 5; // Number of page buttons to display
    const pages: number[] = [];

    // Always include the first page
    pages.push(1);

    // Calculate the start and end of the current page range
    let rangeStart = Math.max(2, currentPage - Math.floor(displayCount / 2));
    const rangeEnd = Math.min(totalPages - 1, rangeStart + displayCount - 3);

    // Adjust the start if the end of the range is too small
    if (rangeEnd - rangeStart < displayCount - 3 && rangeStart > 2) {
      rangeStart = Math.max(2, rangeEnd - (displayCount - 3));
    }

    // Add ellipsis after first page if needed
    if (rangeStart > 2) {
      pages.push(-1); // -1 represents an ellipsis
    }

    // Add all pages in the calculated range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 1) {
      pages.push(-2); // -2 represents an ellipsis
    }

    // Always include the last page if there is more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
      // Scroll to top of table
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        className="pagination-button pagination-button-nav"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        &lt;
      </button>

      {getPageNumbers().map((page, index) =>
        page < 0 ? (
          <span key={`ellipsis-${index}`} className="pagination-ellipsis">
            ...
          </span>
        ) : (
          <button
            key={page}
            className={`pagination-button ${
              currentPage === page ? 'pagination-button-active' : ''
            }`}
            onClick={() => handlePageChange(page)}
            disabled={currentPage === page}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        )
      )}

      <button
        className="pagination-button pagination-button-nav"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
