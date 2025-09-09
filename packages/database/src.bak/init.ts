import { mongoConnection } from './connection';

/**
 * Initialize database connection and setup
 * This function should be called when the application starts
 */
export async function initializeDatabase(): Promise<void> {
  try {
    console.log('🚀 Initializing database connection...');
    
    // Connect to MongoDB
    await mongoConnection.connect();
    
    // Create indexes for performance
    await mongoConnection.createIndexes();
    
    console.log('✅ Database initialized successfully');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

/**
 * Gracefully shutdown database connection
 * This function should be called when the application shuts down
 */
export async function shutdownDatabase(): Promise<void> {
  try {
    console.log('🔄 Shutting down database connection...');
    
    await mongoConnection.disconnect();
    
    console.log('✅ Database shutdown completed');
    
  } catch (error) {
    console.error('❌ Database shutdown failed:', error);
    throw error;
  }
}

/**
 * Check database health and connectivity
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const health = await mongoConnection.healthCheck();
    return health.status === 'connected';
  } catch (error) {
    console.error('❌ Database health check failed:', error);
    return false;
  }
}