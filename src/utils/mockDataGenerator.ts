import { LogEntry, Severity } from '../types/log';

// Sample messages to use in mock data
const sampleMessages = [
  { message: 'User login', userId: '{userId}' },
  { message: 'User logout', userId: '{userId}' },
  { message: 'Page viewed', page: '{page}', userId: '{userId}' },
  { message: 'Item purchased', itemId: '{itemId}', userId: '{userId}', amount: '{amount}' },
  { message: 'Friend request sent', fromUserId: '{userId}', toUserId: '{toUserId}' },
  { message: 'Friend request accepted', fromUserId: '{toUserId}', toUserId: '{userId}' },
  { message: 'Password changed', userId: '{userId}' },
  { message: 'Email verification sent', userId: '{userId}', email: '{email}' },
  { message: 'Profile updated', userId: '{userId}', fields: '{fields}' },
  { message: 'API request failed', endpoint: '{endpoint}', statusCode: '{statusCode}', error: '{error}' },
  { message: 'Database query executed', query: '{query}', executionTime: '{executionTime}' },
  { message: 'File uploaded', userId: '{userId}', fileId: '{fileId}', size: '{size}' },
  { message: 'User registered', userId: '{userId}', email: '{email}' },
  { message: 'Payment processed', userId: '{userId}', paymentId: '{paymentId}', amount: '{amount}' },
  { message: 'Comment added', userId: '{userId}', postId: '{postId}' },
  { message: 'Post created', userId: '{userId}', postId: '{postId}' },
];

// Sample pages for the 'Page viewed' message
const samplePages = [
  'Homepage', 'Profile', 'Settings', 'Dashboard', 'Analytics', 'Friends', 
  'Messages', 'Notifications', 'Search', 'Help', 'About', 'Products', 
  'Cart', 'Checkout', 'Orders', 'Wishlist'
];

// Sample API endpoints for the 'API request failed' message
const sampleEndpoints = [
  '/api/users', '/api/auth/login', '/api/auth/logout', '/api/posts', 
  '/api/comments', '/api/friends', '/api/products', '/api/orders', 
  '/api/payments', '/api/files'
];

// Sample status codes for the 'API request failed' message
const sampleStatusCodes = [
  '400', '401', '403', '404', '500', '502', '503'
];

// Sample errors for the 'API request failed' message
const sampleErrors = [
  'Invalid request', 'Unauthorized', 'Forbidden', 'Not found', 
  'Internal server error', 'Bad gateway', 'Service unavailable'
];

// Sample database queries for the 'Database query executed' message
const sampleQueries = [
  'SELECT * FROM users', 'INSERT INTO posts', 'UPDATE users SET', 
  'DELETE FROM comments', 'SELECT COUNT(*) FROM orders'
];

// Sample fields for the 'Profile updated' message
const sampleFields = [
  'name', 'avatar', 'bio', 'location', 'website', 'name,bio', 
  'avatar,bio', 'location,website', 'name,avatar,bio'
];

// Generate a random integer between min and max (inclusive)
const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Get a random item from an array
const getRandomItem = <T>(array: T[]): T => {
  return array[getRandomInt(0, array.length - 1)];
};

// Generate a random ID
const generateId = (): string => {
  return Math.floor(Math.random() * 10000).toString();
};

// Generate a random email
const generateEmail = (): string => {
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'example.com'];
  const names = ['john', 'jane', 'bob', 'alice', 'charlie', 'dave', 'eve', 'frank', 'grace', 'heidi'];
  return `${getRandomItem(names)}${getRandomInt(100, 999)}@${getRandomItem(domains)}`;
};

// Generate a random file size
const generateFileSize = (): string => {
  return `${getRandomInt(1, 10000)}KB`;
};

// Generate a random execution time
const generateExecutionTime = (): string => {
  return `${getRandomInt(10, 500)}ms`;
};

// Generate a random amount
const generateAmount = (): string => {
  return `$${getRandomInt(10, 1000)}.${getRandomInt(0, 99).toString().padStart(2, '0')}`;
};

// Generate a random body
const generateBody = (severity: Severity): string => {
  // Select a message template based on severity
  let messageTemplate;
  
  if (severity === 'ERROR') {
    messageTemplate = sampleMessages.find(m => m.message === 'API request failed') || sampleMessages[0];
  } else if (severity === 'WARN') {
    const warnMessages = sampleMessages.filter(m => 
      ['API request failed', 'Database query executed'].includes(m.message)
    );
    messageTemplate = getRandomItem(warnMessages);
  } else {
    messageTemplate = getRandomItem(sampleMessages);
  }
  
  // Clone the template to avoid modifying the original
  const body = { ...messageTemplate };
  
  // Fill in the placeholders with random values
  if (body.userId) body.userId = generateId();
  if (body.toUserId) body.toUserId = generateId();
  if (body.itemId) body.itemId = generateId();
  if (body.postId) body.postId = generateId();
  if (body.fileId) body.fileId = generateId();
  if (body.paymentId) body.paymentId = generateId();
  if (body.email) body.email = generateEmail();
  if (body.page) body.page = getRandomItem(samplePages);
  if (body.endpoint) body.endpoint = getRandomItem(sampleEndpoints);
  if (body.statusCode) body.statusCode = getRandomItem(sampleStatusCodes);
  if (body.error) body.error = getRandomItem(sampleErrors);
  if (body.query) body.query = getRandomItem(sampleQueries);
  if (body.fields) body.fields = getRandomItem(sampleFields);
  if (body.size) body.size = generateFileSize();
  if (body.executionTime) body.executionTime = generateExecutionTime();
  if (body.amount) body.amount = generateAmount();
  
  return JSON.stringify(body);
};

// Generate a random timestamp within the last 30 days
const generateTimestamp = (): string => {
  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
  return getRandomInt(thirtyDaysAgo, now).toString();
};

// Generate a random severity
const generateSeverity = (): Severity => {
  const severities: Severity[] = ['INFO', 'DEBUG', 'WARN', 'ERROR'];
  const weights = [70, 20, 7, 3]; // Probabilities in percentage: 70% INFO, 20% DEBUG, 7% WARN, 3% ERROR
  
  const randomNum = getRandomInt(1, 100);
  let cumulativeWeight = 0;
  
  for (let i = 0; i < severities.length; i++) {
    cumulativeWeight += weights[i];
    if (randomNum <= cumulativeWeight) {
      return severities[i];
    }
  }
  
  return 'INFO'; // Default to INFO if something goes wrong
};

// Generate a single log entry
const generateLogEntry = (): LogEntry => {
  const severity = generateSeverity();
  
  return {
    timestamp: generateTimestamp(),
    severity,
    body: generateBody(severity)
  };
};

// Generate an array of log entries
export const generateMockLogs = (count: number): LogEntry[] => {
  const logs: LogEntry[] = [];
  
  for (let i = 0; i < count; i++) {
    logs.push(generateLogEntry());
  }
  
  // Sort by timestamp (newest first)
  return logs.sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp));
};

// Export a function that returns the mock data
export const getMockLogs = (): Promise<LogEntry[]> => {
  return new Promise(resolve => {
    // Simulate a network delay
    setTimeout(() => {
      resolve(generateMockLogs(10000));
    }, 500);
  });
};