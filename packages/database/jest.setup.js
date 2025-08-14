// Jest setup file for database package
require('dotenv').config({ path: '../../.env.local' });

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test_financial_ai';

// Increase timeout for database operations
jest.setTimeout(30000);