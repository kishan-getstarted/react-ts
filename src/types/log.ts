export type Severity = 'INFO' | 'DEBUG' | 'WARN' | 'ERROR';

export interface LogEntry {
  timestamp: string; // Unix timestamp in milliseconds
  severity: Severity;
  body: string; // JSON string containing message and other data
}

export interface ParsedLogBody {
  message: string;
  [key: string]: any;
}