import React, { useState, useRef, useEffect } from 'react';
import '../styles/ColumnCustomizer.scss';

interface ColumnCustomizerProps {
  columns: string[];
  visibleColumns: string[];
  onColumnToggle: (columns: string[]) => void;
}

const ColumnCustomizer: React.FC<ColumnCustomizerProps> = ({
  columns,
  visibleColumns,
  onColumnToggle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Column display names
  const columnDisplayNames: Record<string, string> = {
    timestamp: 'Timestamp',
    severity: 'Severity',
    body: 'Message',
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handle column toggle
  const handleColumnToggle = (column: string) => {
    let newVisibleColumns: string[];

    if (visibleColumns.includes(column)) {
      // Don't allow deselecting the last column
      if (visibleColumns.length === 1) {
        return;
      }
      newVisibleColumns = visibleColumns.filter((c) => c !== column);
    } else {
      newVisibleColumns = [...visibleColumns, column];
    }

    // Call the parent handler
    onColumnToggle(newVisibleColumns);

    // Save to localStorage
    try {
      localStorage.setItem('logViewerVisibleColumns', JSON.stringify(newVisibleColumns));
    } catch (error) {
      console.error('Failed to save column preferences to localStorage:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="column-customizer" ref={dropdownRef}>
      <button
        className="customize-button"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Customize
      </button>

      {isOpen && (
        <div className="column-dropdown">
          <div className="column-dropdown-header">Toggle Columns</div>
          <div className="column-dropdown-content">
            {columns.map((column) => (
              <label key={column} className="column-checkbox">
                <input
                  type="checkbox"
                  checked={visibleColumns.includes(column)}
                  onChange={() => handleColumnToggle(column)}
                />
                {columnDisplayNames[column] || column}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColumnCustomizer;
