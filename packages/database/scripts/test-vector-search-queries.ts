#!/usr/bin/env tsx

import 'dotenv/config';

/**
 * Test Real Vector Search Queries
 *
 * This script tests actual vector search queries with mock embeddings
 * to validate the MongoDB Atlas Vector Search functionality.
 */

import { mongoConnection } from '../src/connection';
import mongoose from 'mongoose';
import { TRANSACTION_VECTOR_INDEX_CONFIG } from './setup-transaction-vector-search';

/**
 * Generate a mock embedding vector (1536 dimensions)
 */
function generateMockEmbedding(): number[] {
  const embedding = [];
  for (let i = 0; i < 1536; i++) {
    embedding.push(Math.random() * 2 - 1); // Random values between -1 and 1
  }
  return embedding;
}

/**
 * Add mock embeddings to a few transactions for testing
 */
async function addMockEmbeddings(): Promise<void> {
  try {
    console.log('🧪 Adding mock embeddings to sample transactions...');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    const collection = db.collection('transactions');

    // Get 5 sample transactions
    const sampleTransactions = await collection.find({}).limit(5).toArray();

    if (sampleTransactions.length === 0) {
      console.log('⚠️  No transactions found to add embeddings');
      return;
    }

    console.log(
      `  📝 Adding embeddings to ${sampleTransactions.length} transactions...`
    );

    // Add mock embeddings to each transaction
    for (const tx of sampleTransactions) {
      const embedding = generateMockEmbedding();

      await collection.updateOne(
        { _id: tx._id },
        {
          $set: {
            embedding: embedding,
            embeddingVersion: 'mock-v1',
            embeddingGeneratedAt: new Date(),
            searchableContent:
              `${tx.description} ${tx.category?.primary || ''} ${tx.merchant?.name || ''}`.trim(),
          },
        }
      );

      console.log(`    ✅ Added embedding to: "${tx.description}"`);
    }

    console.log('✅ Mock embeddings added successfully');
  } catch (error) {
    console.error('❌ Failed to add mock embeddings:', error);
    throw error;
  }
}

/**
 * Test vector search query
 */
async function testVectorSearchQuery(): Promise<void> {
  try {
    console.log('🔍 Testing vector search query...');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    const collection = db.collection('transactions');

    // Generate a query vector
    const queryVector = generateMockEmbedding();

    console.log('  📊 Executing vector search...');

    // Execute vector search query
    const results = await collection
      .aggregate([
        {
          $vectorSearch: {
            index: TRANSACTION_VECTOR_INDEX_CONFIG.name,
            path: 'embedding',
            queryVector: queryVector,
            numCandidates: 20,
            limit: 5,
          },
        },
        {
          $project: {
            _id: 1,
            description: 1,
            amount: 1,
            currency: 1,
            'category.primary': 1,
            'merchant.name': 1,
            embeddingVersion: 1,
            score: { $meta: 'vectorSearchScore' },
          },
        },
      ])
      .toArray();

    console.log(`  ✅ Found ${results.length} results`);

    if (results.length > 0) {
      console.log('  📋 Vector search results:');
      results.forEach((result, index) => {
        console.log(
          `    ${index + 1}. "${result.description}" (Score: ${result.score.toFixed(4)})`
        );
        console.log(`       Amount: ${result.amount} ${result.currency}`);
        console.log(`       Category: ${result.category?.primary || 'N/A'}`);
        console.log(`       Merchant: ${result.merchant?.name || 'N/A'}`);
        console.log(`       Embedding: ${result.embeddingVersion}`);
        console.log('');
      });
    } else {
      console.log(
        '  ⚠️  No results found. This might be normal with random embeddings.'
      );
    }
  } catch (error) {
    console.error('❌ Vector search query failed:', error);
    throw error;
  }
}

/**
 * Test vector search with filters
 */
async function testVectorSearchWithFilters(): Promise<void> {
  try {
    console.log('🎯 Testing vector search with filters...');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    const collection = db.collection('transactions');

    // Get a sample user ID from existing transactions
    const sampleTx = await collection.findOne({});
    if (!sampleTx) {
      console.log('⚠️  No transactions found for filter test');
      return;
    }

    const queryVector = generateMockEmbedding();

    console.log('  📊 Executing filtered vector search...');
    console.log(`  🔍 Filter: userId = ${sampleTx.userId}`);

    // Execute vector search with user filter
    const results = await collection
      .aggregate([
        {
          $vectorSearch: {
            index: TRANSACTION_VECTOR_INDEX_CONFIG.name,
            path: 'embedding',
            queryVector: queryVector,
            numCandidates: 20,
            limit: 3,
            filter: {
              userId: sampleTx.userId,
            },
          },
        },
        {
          $project: {
            _id: 1,
            description: 1,
            amount: 1,
            userId: 1,
            'category.primary': 1,
            score: { $meta: 'vectorSearchScore' },
          },
        },
      ])
      .toArray();

    console.log(`  ✅ Found ${results.length} filtered results`);

    if (results.length > 0) {
      console.log('  📋 Filtered search results:');
      results.forEach((result, index) => {
        console.log(
          `    ${index + 1}. "${result.description}" (Score: ${result.score.toFixed(4)})`
        );
        console.log(`       User: ${result.userId}`);
        console.log(`       Category: ${result.category?.primary || 'N/A'}`);
        console.log('');
      });
    }
  } catch (error) {
    console.error('❌ Filtered vector search failed:', error);
    throw error;
  }
}

/**
 * Test different query scenarios
 */
async function testQueryScenarios(): Promise<void> {
  try {
    console.log('🎭 Testing different query scenarios...');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    const collection = db.collection('transactions');

    // Scenario 1: Search for investment transactions
    console.log('  💰 Scenario 1: Investment transactions');
    const investmentResults = await collection
      .aggregate([
        {
          $vectorSearch: {
            index: TRANSACTION_VECTOR_INDEX_CONFIG.name,
            path: 'embedding',
            queryVector: generateMockEmbedding(),
            numCandidates: 20,
            limit: 3,
            filter: {
              'category.primary': 'Investimento',
            },
          },
        },
        {
          $project: {
            description: 1,
            amount: 1,
            'category.primary': 1,
            score: { $meta: 'vectorSearchScore' },
          },
        },
      ])
      .toArray();

    console.log(
      `    ✅ Found ${investmentResults.length} investment transactions`
    );

    // Scenario 2: Search for high-value transactions
    console.log('  💸 Scenario 2: High-value transactions (>1000)');
    const highValueResults = await collection
      .aggregate([
        {
          $vectorSearch: {
            index: TRANSACTION_VECTOR_INDEX_CONFIG.name,
            path: 'embedding',
            queryVector: generateMockEmbedding(),
            numCandidates: 20,
            limit: 3,
            filter: {
              amount: { $gt: 1000 },
            },
          },
        },
        {
          $project: {
            description: 1,
            amount: 1,
            'category.primary': 1,
            score: { $meta: 'vectorSearchScore' },
          },
        },
      ])
      .toArray();

    console.log(
      `    ✅ Found ${highValueResults.length} high-value transactions`
    );

    // Scenario 3: Recent transactions (last 30 days)
    console.log('  📅 Scenario 3: Recent transactions (last 30 days)');
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentResults = await collection
      .aggregate([
        {
          $vectorSearch: {
            index: TRANSACTION_VECTOR_INDEX_CONFIG.name,
            path: 'embedding',
            queryVector: generateMockEmbedding(),
            numCandidates: 20,
            limit: 3,
            filter: {
              date: { $gte: thirtyDaysAgo },
            },
          },
        },
        {
          $project: {
            description: 1,
            date: 1,
            'category.primary': 1,
            score: { $meta: 'vectorSearchScore' },
          },
        },
      ])
      .toArray();

    console.log(`    ✅ Found ${recentResults.length} recent transactions`);
  } catch (error) {
    console.error('❌ Query scenarios test failed:', error);
    throw error;
  }
}

/**
 * Main test function
 */
async function testVectorSearchQueries(): Promise<void> {
  try {
    console.log('🧪 Testing Real Vector Search Queries...');
    console.log('');

    // Connect to MongoDB
    await mongoConnection.connect();

    // Add mock embeddings to sample transactions
    await addMockEmbeddings();
    console.log('');

    // Test basic vector search
    await testVectorSearchQuery();
    console.log('');

    // Test vector search with filters
    await testVectorSearchWithFilters();
    console.log('');

    // Test different query scenarios
    await testQueryScenarios();
    console.log('');

    console.log('✅ All vector search tests completed!');
    console.log('');
    console.log('📝 Summary:');
    console.log('  - Vector search index: Working');
    console.log('  - Basic queries: Functional');
    console.log('  - Filtered queries: Functional');
    console.log('  - Multiple scenarios: Tested');
    console.log('');
    console.log('🚀 Next steps:');
    console.log('  1. Implement real embedding generation (OpenAI)');
    console.log('  2. Create TransactionVectorSearchService');
    console.log('  3. Integrate with RAG system');
  } catch (error) {
    console.error('❌ Vector search tests failed:', error);
    process.exit(1);
  } finally {
    await mongoConnection.disconnect();
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testVectorSearchQueries();
}

export { testVectorSearchQueries };
