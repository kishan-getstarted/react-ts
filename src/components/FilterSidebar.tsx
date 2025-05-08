import React, { useState } from 'react';
import { getSeverityColor } from '../utils/logUtils';
import '../styles/FilterSidebar.scss';

interface FilterSidebarProps {
  activeSeverities: string[];
  onSeverityChange: (severities: string[]) => void;
  counts: Record<string, number>;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  activeSeverities,
  onSeverityChange,
  counts,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const severities = ['INFO', 'DEBUG', 'WARN', 'ERROR'];

  // Toggle a severity filter
  const toggleSeverity = (severity: string) => {
    let newActiveSeverities;

    if (activeSeverities.includes(severity)) {
      // Don't allow deselecting the last severity
      if (activeSeverities.length === 1) {
        return;
      }
      newActiveSeverities = activeSeverities.filter((s) => s !== severity);
    } else {
      newActiveSeverities = [...activeSeverities, severity];
    }

    onSeverityChange(newActiveSeverities);

    // Save to localStorage
    try {
      localStorage.setItem('logViewerActiveSeverities', JSON.stringify(newActiveSeverities));
    } catch (error) {
      console.error('Failed to save severity preferences to localStorage:', error);
    }
  };

  // Toggle all severities
  const toggleAll = () => {
    if (activeSeverities.length === severities.length) {
      // If all are selected, select only INFO (don't select none)
      onSeverityChange(['INFO']);
    } else {
      // Otherwise, select all
      onSeverityChange([...severities]);
    }
  };

  // Toggle sidebar collapse
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={`filter-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="filter-sidebar-header">
        <h3>Filters</h3>
        <button
          className="collapse-button"
          onClick={toggleCollapse}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? '▶' : '◀'}
        </button>
      </div>

      {!isCollapsed && (
        <>
          <div className="filter-section">
            <div className="filter-section-header">
              <h4>Severity</h4>
              <button className="toggle-all-button" onClick={toggleAll}>
                {activeSeverities.length === severities.length ? 'Clear All' : 'Select All'}
              </button>
            </div>

            <div className="severity-filters">
              {severities.map((severity) => (
                <label key={severity} className="severity-filter">
                  <input
                    type="checkbox"
                    checked={activeSeverities.includes(severity)}
                    onChange={() => toggleSeverity(severity)}
                  />
                  <span className="severity-name" style={{ color: getSeverityColor(severity) }}>
                    {severity}
                  </span>
                  <span className="severity-count">{counts[severity] || 0}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-sidebar-footer">
            <div className="total-count">
              Total: {Object.values(counts).reduce((sum, count) => sum + count, 0)} logs
            </div>
            <div className="filtered-count">
              Filtered:{' '}
              {activeSeverities.reduce((sum, severity) => sum + (counts[severity] || 0), 0)} logs
            </div>
          </div>
        </>
      )}
    </aside>
  );
};

export default FilterSidebar;
