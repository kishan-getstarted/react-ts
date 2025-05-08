import { useState, useEffect, useMemo, useCallback } from 'react';
import { LogEntry } from '../types/log';

interface UseFilteredLogsParams {
  logs: LogEntry[];
  activeSeverities: string[];
  searchTerm: string;
  itemsPerPage: number;
  currentPage: number;
}

interface UseFilteredLogsResult {
  filteredLogs: LogEntry[];
  paginatedLogs: LogEntry[];
  totalPages: number;
  isFiltering: boolean;
  severityCounts: Record<string, number>;
}

export const useFilteredLogs = ({
  logs,
  activeSeverities,
  searchTerm,
  itemsPerPage,
  currentPage,
}: UseFilteredLogsParams): UseFilteredLogsResult => {
  const [isFiltering, setIsFiltering] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // Debounce search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setIsFiltering(false);
    }, 300);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  // When search term changes, set filtering state
  useEffect(() => {
    if (searchTerm !== debouncedSearchTerm) {
      setIsFiltering(true);
    }
  }, [searchTerm, debouncedSearchTerm]);

  // Calculate severity counts for all logs
  const severityCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    
    logs.forEach((log) => {
      counts[log.severity] = (counts[log.severity] || 0) + 1;
    });
    
    return counts;
  }, [logs]);

  // Memoized filtering function
  const filterLog = useCallback((log: LogEntry): boolean => {
    const matchesSeverity = activeSeverities.includes(log.severity);
    const matchesSearch = debouncedSearchTerm === '' || 
      log.body.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    return matchesSeverity && matchesSearch;
  }, [activeSeverities, debouncedSearchTerm]);

  // Memoized filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter(filterLog);
  }, [logs, filterLog]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredLogs.length / itemsPerPage);
  }, [filteredLogs.length, itemsPerPage]);

  // Get paginated logs
  const paginatedLogs = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredLogs, currentPage, itemsPerPage]);

  return {
    filteredLogs,
    paginatedLogs,
    totalPages,
    isFiltering,
    severityCounts,
  };
};