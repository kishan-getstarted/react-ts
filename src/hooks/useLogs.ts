import { useState, useEffect } from 'react';
import { LogEntry } from '../types/log';
import { getMockLogs } from '../utils/mockDataGenerator';

interface UseLogsResult {
  logs: LogEntry[];
  isLoading: boolean;
  error: Error | null;
  totalCount: number;
}

export const useLogs = (): UseLogsResult => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        const data = await getMockLogs();
        setLogs(data);
        setTotalCount(data.length);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return { logs, isLoading, error, totalCount };
};