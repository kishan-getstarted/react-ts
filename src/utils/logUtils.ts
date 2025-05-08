import React from 'react';
import { ParsedLogBody } from '../types/log';

// Format a Unix timestamp to a human-readable date/time
export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(parseInt(timestamp));

  // Format: YYYY-MM-DD HH:MM:SS
  return date
    .toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    .replace(',', '');
};

// Parse JSON string from log body
export const parseJsonBody = (jsonString: string): ParsedLogBody => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Failed to parse JSON body:', error);
    return { message: 'Invalid JSON' };
  }
};

// Get color for severity level
export const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case 'ERROR':
      return '#f44336'; // Red
    case 'WARN':
      return '#ff9800'; // Orange
    case 'INFO':
      return '#2196f3'; // Blue
    case 'DEBUG':
      return '#4caf50'; // Green
    default:
      return '#757575'; // Gray
  }
};

// Get background color for severity level (lighter version)
export const getSeverityBackgroundColor = (severity: string): string => {
  switch (severity) {
    case 'ERROR':
      return 'rgba(244, 67, 54, 0.1)'; // Light Red
    case 'WARN':
      return 'rgba(255, 152, 0, 0.1)'; // Light Orange
    case 'INFO':
      return 'rgba(33, 150, 243, 0.1)'; // Light Blue
    case 'DEBUG':
      return 'rgba(76, 175, 80, 0.1)'; // Light Green
    default:
      return 'rgba(117, 117, 117, 0.1)'; // Light Gray
  }
};

// Format a JSON string with indentation and line breaks
export const formatJson = (jsonString: string): string => {
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed, null, 2);
  } catch (error) {
    return jsonString;
  }
};
