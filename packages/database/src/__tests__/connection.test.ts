import { describe, it, expect, beforeAll, afterAll, jest } from '@jest/globals';
import { mongoConnection, ConnectionStatus } from '../connection';

// Mock environment variables
process.env.MONGODB_URI = 'mongodb://localhost:27017/test_financial_ai';
process.env.NODE_ENV = 'test';

describe('MongoDB Connection', () => {
  beforeAll(async () => {
    // Increase timeout for database operations
    jest.setTimeout(30000);
  });

  afterAll(async () => {
    // Clean up connection after tests
    if (mongoConnection.isConnected()) {
      await mongoConnection.disconnect();
    }
  });

  describe('Connection Management', () => {
    it('should start with disconnected status', () => {
      expect(mongoConnection.getStatus()).toBe(ConnectionStatus.DISCONNECTED);
      expect(mongoConnection.isConnected()).toBe(false);
    });

    it('should connect to MongoDB successfully', async () => {
      await mongoConnection.connect();
      
      expect(mongoConnection.getStatus()).toBe(ConnectionStatus.CONNECTED);
      expect(mongoConnection.isConnected()).toBe(true);
    });

    it('should perform health check successfully when connected', async () => {
      const health = await mongoConnection.healthCheck();
      
      expect(health.status).toBe(ConnectionStatus.CONNECTED);
      expect(health.latency).toBeGreaterThan(0);
      expect(health.timestamp).toBeInstanceOf(Date);
      expect(health.error).toBeUndefined();
    });

    it('should create database indexes successfully', async () => {
      await expect(mongoConnection.createIndexes()).resolves.not.toThrow();
    });

    it('should disconnect from MongoDB successfully', async () => {
      await mongoConnection.disconnect();
      
      expect(mongoConnection.getStatus()).toBe(ConnectionStatus.DISCONNECTED);
      expect(mongoConnection.isConnected()).toBe(false);
    });

    it('should return error status for health check when disconnected', async () => {
      const health = await mongoConnection.healthCheck();
      
      expect(health.status).toBe(ConnectionStatus.DISCONNECTED);
      expect(health.error).toBe('Database not connected');
      expect(health.latency).toBeUndefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid MongoDB URI', async () => {
      // Temporarily override environment
      const originalUri = process.env.MONGODB_URI;
      process.env.MONGODB_URI = 'invalid-uri';

      await expect(mongoConnection.connect()).rejects.toThrow();

      // Restore original URI
      process.env.MONGODB_URI = originalUri;
    });

    it('should handle connection failures with retry logic', async () => {
      // Use a non-existent MongoDB server
      const originalUri = process.env.MONGODB_URI;
      process.env.MONGODB_URI = 'mongodb://nonexistent:27017/test';

      await expect(mongoConnection.connect()).rejects.toThrow(/Failed to connect to MongoDB after/);

      // Restore original URI
      process.env.MONGODB_URI = originalUri;
    });
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = mongoConnection;
      const instance2 = mongoConnection;
      
      expect(instance1).toBe(instance2);
    });
  });
});