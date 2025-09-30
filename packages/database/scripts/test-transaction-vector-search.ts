#!/usr/bin/env tsx

import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env from project root
config({ path: resolve(__dirname, '../../../.env') });

/**
 * Test Transaction Vector Search Configuration
 *
 * This script tests the transaction vector search setup by performing
 * basic validation queries and checking index status.
 *
 * Usage:
 *   npm run test:transaction-vector-search
 *   or
 *   tsx scripts/test-transaction-vector-search.ts
 */

import { mongoConnection } from '../src/connection';
import { Transaction } from '../src/models';
import mongoose from 'mongoose';
import { TRANSACTION_VECTOR_INDEX_CONFIG } from './setup-transaction-vector-search';

/**
 * Test basic transaction queries
 */
async function testBasicQueries(): Promise<void> {
  try {
    console.log('🧪 Testing basic transaction queries...');

    // Test basic find
    const totalTransactions = await Transaction.countDocuments();
    console.log(`  ✅ Found ${totalTransactions} transactions`);

    if (totalTransactions > 0) {
      // Test find with filters
      const recentTransactions = await Transaction.find()
        .sort({ date: -1 })
        .limit(5);

      console.log(
        `  ✅ Retrieved ${recentTransactions.length} recent transactions`
      );

      // Check for embedding fields
      const transactionsWithEmbeddings = await Transaction.countDocuments({
        embedding: { $exists: true },
      });

      console.log(
        `  ✅ ${transactionsWithEmbeddings} transactions have embedding fields`
      );

      // Show sample transaction structure
      if (recentTransactions.length > 0) {
        const sample = recentTransactions[0];
        console.log('  📄 Sample transaction structure:');
        console.log(`    - ID: ${sample._id}`);
        console.log(`    - Description: ${sample.description}`);
        console.log(`    - Amount: ${sample.amount} ${sample.currency}`);
        console.log(
          `    - Category: ${sample.category?.primary || 'Uncategorized'}`
        );
        console.log(`    - Source: ${sample.metadata.source}`);
        console.log(
          `    - Has embedding field: ${sample.embedding !== undefined}`
        );
      }
    } else {
      console.log(
        '  ⚠️  No transactions found. Consider running populate script first.'
      );
    }
  } catch (error) {
    console.error('❌ Basic queries test failed:', error);
    throw error;
  }
}

/**
 * Test vector search index status
 */
async function testVectorSearchIndex(): Promise<void> {
  try {
    console.log('🔍 Testing vector search index status...');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    const collection = db.collection('transactions');

    // List all search indexes
    const indexes = await collection.listSearchIndexes().toArray();
    console.log(`  ✅ Found ${indexes.length} search indexes`);

    // Check for our specific index
    const transactionIndex = indexes.find(
      (idx: any) => idx.name === TRANSACTION_VECTOR_INDEX_CONFIG.name
    );

    if (transactionIndex) {
      console.log(
        `  ✅ Transaction vector index found: ${transactionIndex.name}`
      );
      console.log(`  📊 Index status: ${transactionIndex.status || 'UNKNOWN'}`);
      console.log(`  🔧 Index type: ${transactionIndex.type}`);

      if (transactionIndex.status === 'READY') {
        console.log('  🎉 Index is ready for vector search!');
      } else if (transactionIndex.status === 'BUILDING') {
        console.log('  ⏳ Index is still building. Please wait...');
      } else {
        console.log('  ⚠️  Index status is not optimal. Check MongoDB Atlas.');
      }
    } else {
      console.log('  ❌ Transaction vector index not found');
      console.log(
        '  💡 Run setup script: npm run setup:transaction-vector-search'
      );
    }

    // List all indexes for reference
    if (indexes.length > 0) {
      console.log('  📋 All search indexes:');
      indexes.forEach((idx: any) => {
        console.log(
          `    - ${idx.name} (${idx.type}) - ${idx.status || 'UNKNOWN'}`
        );
      });
    }
  } catch (error) {
    console.error('❌ Vector search index test failed:', error);
    throw error;
  }
}

/**
 * Test sample vector search query (mock)
 */
async function testSampleVectorQuery(): Promise<void> {
  try {
    console.log('🎯 Testing sample vector search query...');

    // This is a mock test since we don't have embeddings yet
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    const collection = db.collection('transactions');

    // Test if we can perform aggregation queries (prerequisite for vector search)
    const sampleAggregation = await collection
      .aggregate([
        { $match: { description: { $exists: true } } },
        { $limit: 1 },
        { $project: { description: 1, amount: 1, 'category.primary': 1 } },
      ])
      .toArray();

    if (sampleAggregation.length > 0) {
      console.log('  ✅ Aggregation pipeline works');
      console.log('  📄 Sample transaction for vector search:');
      console.log(`    - Description: "${sampleAggregation[0].description}"`);
      console.log(`    - Amount: ${sampleAggregation[0].amount}`);
      console.log(
        `    - Category: ${sampleAggregation[0].category?.primary || 'N/A'}`
      );
    } else {
      console.log('  ⚠️  No transactions available for testing');
    }

    // Mock vector search query structure (for reference)
    console.log('  📝 Example vector search query structure:');
    console.log('    {');
    console.log('      $vectorSearch: {');
    console.log(`        index: "${TRANSACTION_VECTOR_INDEX_CONFIG.name}",`);
    console.log('        path: "embedding",');
    console.log('        queryVector: [0.1, 0.2, ...], // 1536 dimensions');
    console.log('        numCandidates: 100,');
    console.log('        limit: 10,');
    console.log('        filter: { userId: "user123" }');
    console.log('      }');
    console.log('    }');
  } catch (error) {
    console.error('❌ Sample vector query test failed:', error);
    throw error;
  }
}

/**
 * Test transaction data quality for embeddings
 */
async function testDataQuality(): Promise<void> {
  try {
    console.log('📊 Testing transaction data quality for embeddings...');

    // Check for transactions with good descriptions
    const transactionsWithDescriptions = await Transaction.countDocuments({
      description: { $exists: true, $ne: '', $ne: null },
    });

    const totalTransactions = await Transaction.countDocuments();
    const descriptionCoverage =
      totalTransactions > 0
        ? ((transactionsWithDescriptions / totalTransactions) * 100).toFixed(1)
        : 0;

    console.log(
      `  ✅ ${transactionsWithDescriptions}/${totalTransactions} transactions have descriptions (${descriptionCoverage}%)`
    );

    // Check description lengths
    const sampleDescriptions = await Transaction.aggregate([
      { $match: { description: { $exists: true, $ne: '' } } },
      {
        $project: {
          description: 1,
          descriptionLength: { $strLenCP: '$description' },
          'category.primary': 1,
          'merchant.name': 1,
        },
      },
      { $limit: 10 },
    ]);

    if (sampleDescriptions.length > 0) {
      console.log('  📝 Sample descriptions for embedding generation:');
      sampleDescriptions.forEach((tx: any, index: number) => {
        const desc =
          tx.description.substring(0, 50) +
          (tx.description.length > 50 ? '...' : '');
        console.log(
          `    ${index + 1}. "${desc}" (${tx.descriptionLength} chars)`
        );
        if (tx.category?.primary) {
          console.log(`       Category: ${tx.category.primary}`);
        }
        if (tx.merchant?.name) {
          console.log(`       Merchant: ${tx.merchant.name}`);
        }
      });

      const avgLength =
        sampleDescriptions.reduce(
          (sum: number, tx: any) => sum + tx.descriptionLength,
          0
        ) / sampleDescriptions.length;
      console.log(
        `  📏 Average description length: ${avgLength.toFixed(1)} characters`
      );
    }

    // Check for categories
    const categorizedTransactions = await Transaction.countDocuments({
      'category.primary': { $exists: true, $ne: null },
    });

    const categorizationCoverage =
      totalTransactions > 0
        ? ((categorizedTransactions / totalTransactions) * 100).toFixed(1)
        : 0;

    console.log(
      `  ✅ ${categorizedTransactions}/${totalTransactions} transactions are categorized (${categorizationCoverage}%)`
    );
  } catch (error) {
    console.error('❌ Data quality test failed:', error);
    throw error;
  }
}

/**
 * Main test function
 */
async function testTransactionVectorSearch(): Promise<void> {
  try {
    console.log('🧪 Testing Transaction Vector Search Configuration...');
    console.log('');

    // Connect to MongoDB
    await mongoConnection.connect();

    // Run all tests
    await testBasicQueries();
    console.log('');

    await testVectorSearchIndex();
    console.log('');

    await testSampleVectorQuery();
    console.log('');

    await testDataQuality();
    console.log('');

    console.log('✅ All tests completed successfully!');
    console.log('');
    console.log('📝 Summary:');
    console.log('  - Basic MongoDB operations: Working');
    console.log('  - Transaction collection: Accessible');
    console.log('  - Vector search index: Check status above');
    console.log('  - Data quality: Check metrics above');
    console.log('');
    console.log('🚀 Ready for next steps:');
    console.log('  1. Generate embeddings for transactions');
    console.log('  2. Test actual vector search queries');
    console.log('  3. Integrate with RAG system');
  } catch (error) {
    console.error('❌ Transaction Vector Search test failed:', error);
    process.exit(1);
  } finally {
    await mongoConnection.disconnect();
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testTransactionVectorSearch();
}

export { testTransactionVectorSearch };
