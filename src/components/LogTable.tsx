import React, { useState, useCallback, memo } from 'react';
import { LogEntry } from '../types/log';
import { formatTimestamp, parseJsonBody, getSeverityColor } from '../utils/logUtils';
import ColumnCustomizer from './ColumnCustomizer';
import Pagination from './Pagination';
import '../styles/LogTable.scss';

interface LogTableProps {
  logs: LogEntry[];
  visibleColumns: string[];
  onColumnToggle: (columns: string[]) => void;
  onPageChange: (page: number) => void;
  currentPage: number;
  totalPages: number;
  searchTerm: string;
  isLoading: boolean;
}

const LogTable: React.FC<LogTableProps> = ({
  logs,
  visibleColumns,
  onColumnToggle,
  onPageChange,
  currentPage,
  totalPages,
  searchTerm,
  isLoading,
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  // Toggle row expansion
  const toggleRowExpansion = useCallback((index: number) => {
    setExpandedRows((prevExpandedRows) => {
      const newExpandedRows = new Set(prevExpandedRows);
      if (newExpandedRows.has(index)) {
        newExpandedRows.delete(index);
      } else {
        newExpandedRows.add(index);
      }
      return newExpandedRows;
    });
  }, []);

  // Render timestamp column
  const renderTimestamp = useCallback(
    (timestamp: string) => <div className="log-timestamp">{formatTimestamp(timestamp)}</div>,
    []
  );

  // Render severity column
  const renderSeverity = useCallback(
    (severity: string) => (
      <div className="log-severity" style={{ color: getSeverityColor(severity) }}>
        {severity}
      </div>
    ),
    []
  );
  const highlightSearchTerm = (text: string, searchTerm: string): React.ReactNode => {
    if (!searchTerm) return text;

    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));

    return parts.map((part, i) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={i} className="highlight">
          {part}
        </span>
      ) : (
        part
      )
    );
  };
  // Render body column
  const renderBody = useCallback(
    (body: string, index: number) => {
      const isExpanded = expandedRows.has(index);
      const parsedBody = parseJsonBody(body);

      return (
        <div className="log-body">
          <div className="log-body-message" onClick={() => toggleRowExpansion(index)}>
            {highlightSearchTerm(parsedBody.message || 'No message', searchTerm)}
            <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
          </div>
          {isExpanded && (
            <pre className="log-body-details">
              {Object.entries(parsedBody).map(
                ([key, value]) =>
                  key !== 'message' && (
                    <div key={key} className="log-body-detail">
                      <span className="log-body-key">{key}:</span>
                      <span className="log-body-value">
                        {typeof value === 'string'
                          ? highlightSearchTerm(value, searchTerm)
                          : JSON.stringify(value)}
                      </span>
                    </div>
                  )
              )}
            </pre>
          )}
        </div>
      );
    },
    [expandedRows, searchTerm, toggleRowExpansion]
  );

  // Map column names to render functions
  const columnRenderers = {
    timestamp: renderTimestamp,
    severity: renderSeverity,
    body: renderBody,
  };

  // Column display names
  const columnDisplayNames: Record<string, string> = {
    timestamp: 'Timestamp',
    severity: 'Severity',
    body: 'Message',
  };

  // Memoize the table rows to prevent unnecessary re-renders
  const renderTableRows = () => {
    return logs.map((log, index) => (
      <div key={`${log.timestamp}-${index}`} className="log-row">
        {visibleColumns.map((column) => (
          <div key={column} className={`log-cell log-cell-${column}`}>
            {columnRenderers[column as keyof typeof columnRenderers](
              log[column as keyof LogEntry],
              index
            )}
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className="log-table-container">
      <div className="log-table-header">
        <h2>Logs</h2>
        <ColumnCustomizer
          columns={Object.keys(columnDisplayNames)}
          visibleColumns={visibleColumns}
          onColumnToggle={onColumnToggle}
        />
      </div>

      {isLoading ? (
        <div className="loading-indicator">Loading logs...</div>
      ) : logs.length === 0 ? (
        <div className="no-logs-message">
          {searchTerm ? 'No logs match your search.' : 'No logs available.'}
        </div>
      ) : (
        <>
          <div className="log-table">
            <div className="log-table-head">
              <div className="log-row">
                {visibleColumns.map((column) => (
                  <div key={column} className={`log-cell log-cell-${column}`}>
                    {columnDisplayNames[column]}
                  </div>
                ))}
              </div>
            </div>
            <div className="log-table-body">{renderTableRows()}</div>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </>
      )}
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(LogTable);
