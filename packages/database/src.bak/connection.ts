import mongoose from 'mongoose';
import { z } from 'zod';

// Environment validation schema
const envSchema = z.object({
  MONGODB_URI: z.string().url('Invalid MongoDB URI'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

// Connection configuration interface
interface ConnectionConfig {
  uri: string;
  options: mongoose.ConnectOptions;
}

// Connection status enum
export enum ConnectionStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  DISCONNECTING = 'disconnecting',
  ERROR = 'error',
}

// Connection health check result
export interface HealthCheckResult {
  status: ConnectionStatus;
  latency?: number;
  error?: string;
  timestamp: Date;
}

class MongoDBConnection {
  private static instance: MongoDBConnection;
  private connectionStatus: ConnectionStatus = ConnectionStatus.DISCONNECTED;
  private retryAttempts = 0;
  private maxRetryAttempts = 5;
  private retryDelay = 1000; // Base delay in ms

  // Métodos getter e setter para testes
  public getMaxRetries(): number {
    return this.maxRetryAttempts;
  }

  public setMaxRetries(value: number): void {
    this.maxRetryAttempts = value;
  }

  public setRetryDelay(value: number): void {
    this.retryDelay = value;
  }
  private healthCheckInterval?: NodeJS.Timeout;

  private constructor() {
    this.setupEventListeners();
  }

  public static getInstance(): MongoDBConnection {
    if (!MongoDBConnection.instance) {
      MongoDBConnection.instance = new MongoDBConnection();
    }
    return MongoDBConnection.instance;
  }

  /**
   * Connect to MongoDB with retry logic and connection pooling
   */
  public async connect(): Promise<void> {
    try {
      // Validate environment variables
      const env = envSchema.parse(process.env);

      const config = this.getConnectionConfig(env.MONGODB_URI, env.NODE_ENV);

      this.connectionStatus = ConnectionStatus.CONNECTING;

      await this.connectWithRetry(config);

      this.connectionStatus = ConnectionStatus.CONNECTED;
      this.retryAttempts = 0;

      // Start health check monitoring
      this.startHealthCheckMonitoring();

      console.log('✅ MongoDB connected successfully');
    } catch (error) {
      this.connectionStatus = ConnectionStatus.ERROR;
      console.error('❌ MongoDB connection failed:', error);
      throw error;
    }
  }

  /**
   * Disconnect from MongoDB
   */
  public async disconnect(): Promise<void> {
    try {
      this.connectionStatus = ConnectionStatus.DISCONNECTING;

      // Stop health check monitoring
      if (this.healthCheckInterval) {
        clearInterval(this.healthCheckInterval);
        this.healthCheckInterval = undefined;
      }

      await mongoose.disconnect();
      this.connectionStatus = ConnectionStatus.DISCONNECTED;

      console.log('✅ MongoDB disconnected successfully');
    } catch (error) {
      console.error('❌ MongoDB disconnection failed:', error);
      throw error;
    }
  }

  /**
   * Get current connection status
   */
  public getStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  /**
   * Check if database is connected
   */
  public isConnected(): boolean {
    return (
      this.connectionStatus === ConnectionStatus.CONNECTED &&
      mongoose.connection.readyState === 1
    );
  }

  /**
   * Perform health check on the database connection
   */
  public async healthCheck(): Promise<HealthCheckResult> {
    const startTime = Date.now();

    try {
      if (!this.isConnected()) {
        return {
          status: this.connectionStatus,
          error: 'Database not connected',
          timestamp: new Date(),
        };
      }

      // Perform a simple ping operation
      await mongoose.connection.db.admin().ping();

      const latency = Date.now() - startTime;

      return {
        status: ConnectionStatus.CONNECTED,
        latency,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        status: ConnectionStatus.ERROR,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Create database indexes for performance optimization
   */
  public async createIndexes(): Promise<void> {
    try {
      if (!this.isConnected()) {
        throw new Error('Database not connected');
      }

      const db = mongoose.connection.db;

      // User collection indexes
      await db
        .collection('users')
        .createIndexes([
          { key: { email: 1 }, unique: true },
          { key: { createdAt: 1 } },
          { key: { 'profile.riskTolerance': 1 } },
        ]);

      // Transaction collection indexes
      await db
        .collection('transactions')
        .createIndexes([
          { key: { userId: 1, date: -1 } },
          { key: { accountId: 1 } },
          { key: { 'category.primary': 1 } },
          { key: { amount: 1 } },
          { key: { date: -1 } },
          { key: { userId: 1, 'category.primary': 1, date: -1 } },
        ]);

      // Knowledge documents indexes
      await db
        .collection('knowledgedocuments')
        .createIndexes([
          { key: { category: 1 } },
          { key: { source: 1 } },
          { key: { 'metadata.lastUpdated': -1 } },
          { key: { title: 'text', content: 'text' } },
        ]);

      // Conversations indexes
      await db
        .collection('conversations')
        .createIndexes([
          { key: { userId: 1, createdAt: -1 } },
          { key: { sessionId: 1 }, unique: true },
          { key: { updatedAt: -1 } },
        ]);

      console.log('✅ Database indexes created successfully');

      // Note: Vector search index creation is handled separately
      // as it requires MongoDB Atlas and may take time to complete
      console.log(
        'ℹ️  Vector search index should be created separately using VectorSearchService.createVectorSearchIndex()'
      );
    } catch (error) {
      console.error('❌ Failed to create database indexes:', error);
      throw error;
    }
  }

  /**
   * Get connection configuration based on environment
   */
  private getConnectionConfig(uri: string, nodeEnv: string): ConnectionConfig {
    const baseOptions: mongoose.ConnectOptions = {
      // Connection pooling settings
      maxPoolSize: nodeEnv === 'production' ? 10 : 5,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,

      // Buffering settings - bufferMaxEntries removido pois está obsoleto
      bufferCommands: false,

      // Monitoring
      monitorCommands: nodeEnv === 'development',
    };

    return {
      uri,
      options: baseOptions,
    };
  }

  /**
   * Connect with exponential backoff retry logic
   */
  private async connectWithRetry(config: ConnectionConfig): Promise<void> {
    while (this.retryAttempts < this.maxRetryAttempts) {
      try {
        await mongoose.connect(config.uri, config.options);
        return;
      } catch (error) {
        this.retryAttempts++;

        if (this.retryAttempts >= this.maxRetryAttempts) {
          throw new Error(
            `Failed to connect to MongoDB after ${this.maxRetryAttempts} attempts: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`
          );
        }

        const delay = this.retryDelay * Math.pow(2, this.retryAttempts - 1);
        console.warn(
          `⚠️ MongoDB connection attempt ${this.retryAttempts} failed. Retrying in ${delay}ms...`
        );

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  /**
   * Setup mongoose event listeners
   */
  private setupEventListeners(): void {
    mongoose.connection.on('connected', () => {
      console.log('🔗 Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', error => {
      console.error('❌ Mongoose connection error:', error);
      this.connectionStatus = ConnectionStatus.ERROR;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('🔌 Mongoose disconnected from MongoDB');
      this.connectionStatus = ConnectionStatus.DISCONNECTED;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 Mongoose reconnected to MongoDB');
      this.connectionStatus = ConnectionStatus.CONNECTED;
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      await this.disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await this.disconnect();
      process.exit(0);
    });
  }

  /**
   * Start periodic health check monitoring
   */
  private startHealthCheckMonitoring(): void {
    // Perform health check every 30 seconds
    this.healthCheckInterval = setInterval(async () => {
      const health = await this.healthCheck();

      if (health.status === ConnectionStatus.ERROR) {
        console.warn('⚠️ Database health check failed:', health.error);

        // Attempt to reconnect if connection is lost
        if (!this.isConnected()) {
          console.log('🔄 Attempting to reconnect to MongoDB...');
          try {
            await this.connect();
          } catch (error) {
            console.error('❌ Reconnection failed:', error);
          }
        }
      }
    }, 30000);
  }
}

// Export singleton instance
export const mongoConnection = MongoDBConnection.getInstance();

// Convenience functions
export const connectDB = () => mongoConnection.connect();
export const disconnectDB = () => mongoConnection.disconnect();
export const getDBStatus = () => mongoConnection.getStatus();
export const isDBConnected = () => mongoConnection.isConnected();
export const dbHealthCheck = () => mongoConnection.healthCheck();
export const createDBIndexes = () => mongoConnection.createIndexes();
