import React, { useState, useEffect } from 'react';
import LogTable from './components/LogTable';
import FilterSidebar from './components/FilterSidebar';
import SearchBar from './components/SearchBar';
import { useLogs } from './hooks/useLogs';
import { useFilteredLogs } from './hooks/useFilteredLogs';
import './styles/App.scss';

const App: React.FC = () => {
  // Load saved preferences from localStorage
  const loadSavedPreferences = () => {
    try {
      const savedColumns = localStorage.getItem('logViewerVisibleColumns');
      const savedSeverities = localStorage.getItem('logViewerActiveSeverities');

      return {
        columns: savedColumns ? JSON.parse(savedColumns) : ['timestamp', 'severity', 'body'],
        severities: savedSeverities
          ? JSON.parse(savedSeverities)
          : ['INFO', 'DEBUG', 'WARN', 'ERROR'],
      };
    } catch (error) {
      console.error('Failed to load saved preferences:', error);
      return {
        columns: ['timestamp', 'severity', 'body'],
        severities: ['INFO', 'DEBUG', 'WARN', 'ERROR'],
      };
    }
  };

  const { columns: savedColumns, severities: savedSeverities } = loadSavedPreferences();

  // State
  const { logs, isLoading } = useLogs();
  const [activeSeverities, setActiveSeverities] = useState<string[]>(savedSeverities);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(savedColumns);
  const itemsPerPage = 100;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSeverities, searchTerm]);

  // Use optimized filtering hook
  const { paginatedLogs, totalPages, isFiltering, severityCounts } = useFilteredLogs({
    logs,
    activeSeverities,
    searchTerm,
    itemsPerPage,
    currentPage,
  });

  // Handle severity filter change
  const handleSeverityChange = (selectedSeverities: string[]) => {
    setActiveSeverities(selectedSeverities);
  };

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Handle column visibility toggle
  const handleColumnToggle = (columns: string[]) => {
    setVisibleColumns(columns);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of table
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Log Viewer Dashboard</h1>
      </header>
      <main className="app-content">
        <div className="toolbar">
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="dashboard-layout">
          <FilterSidebar
            activeSeverities={activeSeverities}
            onSeverityChange={handleSeverityChange}
            counts={severityCounts}
          />
          <div className="main-content">
            <LogTable
              logs={paginatedLogs}
              visibleColumns={visibleColumns}
              onColumnToggle={handleColumnToggle}
              onPageChange={handlePageChange}
              currentPage={currentPage}
              totalPages={totalPages}
              searchTerm={searchTerm}
              isLoading={isLoading || isFiltering}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
