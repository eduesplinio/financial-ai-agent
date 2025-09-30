#!/usr/bin/env tsx

import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env from project root
config({ path: resolve(__dirname, '../../../.env') });

/**
 * Setup Transaction Vector Search for MongoDB Atlas
 *
 * This script creates the vector search index required for semantic search of transactions.
 * It extends the existing vector search infrastructure to include financial transactions.
 *
 * Usage:
 *   npm run setup:transaction-vector-search
 *   or
 *   tsx scripts/setup-transaction-vector-search.ts
 */

import { mongoConnection } from '../src/connection';
import { Transaction } from '../src/models';
import mongoose from 'mongoose';

// Configuration for transaction vector search index
const TRANSACTION_VECTOR_INDEX_CONFIG = {
  name: 'transaction_vector_index',
  type: 'vectorSearch',
  definition: {
    fields: [
      {
        type: 'vector',
        path: 'embedding',
        numDimensions: 1536, // OpenAI embeddings dimension
        similarity: 'cosine',
      },
      {
        type: 'filter',
        path: 'userId',
      },
      {
        type: 'filter',
        path: 'date',
      },
      {
        type: 'filter',
        path: 'amount',
      },
      {
        type: 'filter',
        path: 'category.primary',
      },
      {
        type: 'filter',
        path: 'accountId',
      },
      {
        type: 'filter',
        path: 'metadata.source',
      },
    ],
  },
};

/**
 * Add embedding fields to existing transactions collection
 */
async function addEmbeddingFieldsToTransactions(): Promise<void> {
  try {
    console.log('📝 Adding embedding fields to transactions collection...');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    const collection = db.collection('transactions');

    // Add embedding fields to existing transactions (set as null initially)
    const result = await collection.updateMany(
      { embedding: { $exists: false } }, // Only update documents without embedding field
      {
        $set: {
          embedding: null,
          embeddingVersion: null,
          embeddingGeneratedAt: null,
          searchableContent: null,
        },
      }
    );

    console.log(
      `✅ Added embedding fields to ${result.modifiedCount} transactions`
    );
  } catch (error) {
    console.error('❌ Failed to add embedding fields:', error);
    throw error;
  }
}

/**
 * Create transaction vector search index in MongoDB Atlas
 */
async function createTransactionVectorIndex(): Promise<void> {
  try {
    console.log('🔍 Creating transaction vector search index...');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    const collection = db.collection('transactions');

    // Check if index already exists
    const indexes = await collection.listSearchIndexes().toArray();
    const existingIndex = indexes.find(
      (idx: any) => idx.name === TRANSACTION_VECTOR_INDEX_CONFIG.name
    );

    if (existingIndex) {
      console.log('✅ Transaction vector search index already exists');
      return;
    }

    // Create the vector search index
    await collection.createSearchIndex(TRANSACTION_VECTOR_INDEX_CONFIG);

    console.log('✅ Transaction vector search index created successfully');
    console.log(
      '⚠️  Note: Index creation may take a few minutes to complete in MongoDB Atlas'
    );
  } catch (error) {
    console.error(
      '❌ Failed to create transaction vector search index:',
      error
    );
    throw error;
  }
}

/**
 * Get current transaction statistics
 */
async function getTransactionStats(): Promise<void> {
  try {
    console.log('📊 Getting transaction statistics...');

    const totalTransactions = await Transaction.countDocuments();
    const transactionsWithEmbeddings = await Transaction.countDocuments({
      embedding: { $exists: true, $ne: null },
    });

    // Get category distribution
    const categoryStats = await Transaction.aggregate([
      { $group: { _id: '$category.primary', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Get source distribution
    const sourceStats = await Transaction.aggregate([
      { $group: { _id: '$metadata.source', count: { $sum: 1 } } },
    ]);

    console.log('📈 Transaction Statistics:');
    console.log(`  - Total transactions: ${totalTransactions}`);
    console.log(
      `  - Transactions with embeddings: ${transactionsWithEmbeddings}`
    );
    console.log(
      `  - Embedding coverage: ${totalTransactions > 0 ? ((transactionsWithEmbeddings / totalTransactions) * 100).toFixed(1) : 0}%`
    );

    if (categoryStats.length > 0) {
      console.log('  - Top categories:');
      categoryStats.slice(0, 5).forEach((cat: any) => {
        console.log(`    • ${cat._id || 'Uncategorized'}: ${cat.count}`);
      });
    }

    if (sourceStats.length > 0) {
      console.log('  - Sources:');
      sourceStats.forEach((source: any) => {
        console.log(`    • ${source._id}: ${source.count}`);
      });
    }
  } catch (error) {
    console.error('❌ Failed to get transaction statistics:', error);
    throw error;
  }
}

/**
 * Validate MongoDB Atlas connection and permissions
 */
async function validateConnection(): Promise<void> {
  try {
    console.log('🔗 Validating MongoDB Atlas connection...');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    // Test basic operations
    const collections = await db.listCollections().toArray();
    const transactionCollection = collections.find(
      col => col.name === 'transactions'
    );

    if (!transactionCollection) {
      console.log('⚠️  Transactions collection does not exist yet');
    } else {
      console.log('✅ Transactions collection found');
    }

    // Test search index permissions
    try {
      const collection = db.collection('transactions');
      await collection.listSearchIndexes().toArray();
      console.log('✅ Search index permissions validated');
    } catch (error) {
      console.log(
        '⚠️  Search index permissions may be limited:',
        (error as Error).message
      );
    }
  } catch (error) {
    console.error('❌ Connection validation failed:', error);
    throw error;
  }
}

/**
 * Main setup function
 */
async function setupTransactionVectorSearch(): Promise<void> {
  try {
    console.log('🚀 Setting up Transaction Vector Search for MongoDB Atlas...');
    console.log('');

    // Connect to MongoDB
    await mongoConnection.connect();

    // Validate connection and permissions
    await validateConnection();
    console.log('');

    // Add embedding fields to existing transactions
    await addEmbeddingFieldsToTransactions();
    console.log('');

    // Create vector search index
    await createTransactionVectorIndex();
    console.log('');

    // Get current statistics
    await getTransactionStats();
    console.log('');

    console.log('✅ Transaction Vector Search setup completed successfully!');
    console.log('');
    console.log('📝 Next steps:');
    console.log(
      '  1. Wait for the index to be built in MongoDB Atlas (may take a few minutes)'
    );
    console.log('  2. Generate embeddings for existing transactions');
    console.log('  3. Test vector search functionality');
    console.log(
      '  4. Integrate with RAG system for semantic transaction search'
    );
    console.log('');
    console.log('💡 Tips:');
    console.log('  - Monitor index status in MongoDB Atlas UI');
    console.log('  - Use Open Finance sandbox data for realistic testing');
    console.log('  - Start with small batches when generating embeddings');
  } catch (error) {
    console.error('❌ Transaction Vector Search setup failed:', error);
    process.exit(1);
  } finally {
    await mongoConnection.disconnect();
  }
}

// Run the setup if this script is executed directly
if (require.main === module) {
  setupTransactionVectorSearch();
}

export {
  setupTransactionVectorSearch,
  TRANSACTION_VECTOR_INDEX_CONFIG,
  addEmbeddingFieldsToTransactions,
  createTransactionVectorIndex,
  getTransactionStats,
  validateConnection,
};
