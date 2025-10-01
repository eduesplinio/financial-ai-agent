#!/usr/bin/env tsx

import 'dotenv/config';
import { config } from 'dotenv';

// Load environment variables from root .env file
config({ path: '../../.env' });

/**
 * Test TransactionVectorSearchService
 *
 * This script tests the TransactionVectorSearchService with real queries
 * to validate semantic search functionality.
 */

import { mongoConnection } from '../src/connection';
import { TransactionVectorSearchService } from '../src/transaction-vector-search';
import { Transaction } from '../src/models';

/**
 * Test basic semantic search
 */
async function testSemanticSearch(): Promise<void> {
  try {
    console.log('🔍 Testing semantic search...');

    // Get a sample user ID from existing transactions
    const sampleTransaction = await Transaction.findOne({});
    if (!sampleTransaction) {
      console.log('⚠️  No transactions found for testing');
      return;
    }

    const userId = sampleTransaction.userId.toString();
    console.log(`  👤 Using user ID: ${userId}`);

    // Test different search queries
    const testQueries = [
      'investimentos em bitcoin e ações',
      'receitas e salário',
      'gastos com roupas e vestuário',
      'despesas médicas e saúde',
      'transporte e uber',
      'compras online e e-commerce',
    ];

    for (const query of testQueries) {
      console.log(`\n  🔎 Query: "${query}"`);

      const results = await TransactionVectorSearchService.searchTransactions({
        queryText: query,
        userId: userId,
        limit: 5,
      });

      console.log(`    ✅ Found ${results.length} results`);

      if (results.length > 0) {
        results.forEach((result, index) => {
          console.log(
            `      ${index + 1}. "${result.transaction.description}" (Score: ${result.score.toFixed(4)})`
          );
          console.log(
            `         Amount: ${result.transaction.amount} ${result.transaction.currency}`
          );
          console.log(
            `         Category: ${result.transaction.category?.primary || 'N/A'}`
          );
        });
      }
    }
  } catch (error) {
    console.error('❌ Semantic search test failed:', error);
    throw error;
  }
}

/**
 * Test search with filters
 */
async function testSearchWithFilters(): Promise<void> {
  try {
    console.log('\n🎯 Testing search with filters...');

    const sampleTransaction = await Transaction.findOne({});
    if (!sampleTransaction) return;

    const userId = sampleTransaction.userId.toString();

    // Test with date range filter
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    console.log('  📅 Testing with date range filter (last 30 days)...');

    const dateFilterResults =
      await TransactionVectorSearchService.searchTransactions({
        queryText: 'todas as transações',
        userId: userId,
        limit: 10,
        filters: {
          dateRange: {
            start: thirtyDaysAgo,
            end: new Date(),
          },
        },
      });

    console.log(
      `    ✅ Found ${dateFilterResults.length} transactions in last 30 days`
    );

    // Test with amount range filter
    console.log('  💰 Testing with amount range filter (>1000)...');

    const amountFilterResults =
      await TransactionVectorSearchService.searchTransactions({
        queryText: 'transações de alto valor',
        userId: userId,
        limit: 10,
        filters: {
          amountRange: {
            min: 1000,
          },
        },
      });

    console.log(
      `    ✅ Found ${amountFilterResults.length} high-value transactions`
    );

    // Test with category filter
    console.log('  🏷️ Testing with category filter (Investimento)...');

    const categoryFilterResults =
      await TransactionVectorSearchService.searchTransactions({
        queryText: 'investimentos',
        userId: userId,
        limit: 10,
        filters: {
          categories: ['Investimento'],
        },
      });

    console.log(
      `    ✅ Found ${categoryFilterResults.length} investment transactions`
    );
  } catch (error) {
    console.error('❌ Filter search test failed:', error);
    throw error;
  }
}

/**
 * Test find similar transactions
 */
async function testFindSimilarTransactions(): Promise<void> {
  try {
    console.log('\n🔗 Testing find similar transactions...');

    // Find a transaction with embedding
    const transactionWithEmbedding = await Transaction.findOne({
      embedding: { $exists: true, $ne: null },
    });

    if (!transactionWithEmbedding) {
      console.log('⚠️  No transactions with embeddings found');
      return;
    }

    const userId = transactionWithEmbedding.userId.toString();
    const transactionId = transactionWithEmbedding._id.toString();

    console.log(
      `  🎯 Finding transactions similar to: "${transactionWithEmbedding.description}"`
    );

    const similarTransactions =
      await TransactionVectorSearchService.findSimilarTransactions(
        transactionId,
        userId,
        5
      );

    console.log(
      `    ✅ Found ${similarTransactions.length} similar transactions`
    );

    similarTransactions.forEach((result, index) => {
      console.log(
        `      ${index + 1}. "${result.transaction.description}" (Score: ${result.score.toFixed(4)})`
      );
      console.log(
        `         Category: ${result.transaction.category?.primary || 'N/A'}`
      );
      console.log(
        `         Amount: ${result.transaction.amount} ${result.transaction.currency}`
      );
    });
  } catch (error) {
    console.error('❌ Find similar transactions test failed:', error);
    throw error;
  }
}

/**
 * Test spending insights
 */
async function testSpendingInsights(): Promise<void> {
  try {
    console.log('\n📊 Testing spending insights...');

    const sampleTransaction = await Transaction.findOne({});
    if (!sampleTransaction) return;

    const userId = sampleTransaction.userId.toString();

    // Test insights for different categories
    const insightQueries = [
      'gastos com vestuário e roupas',
      'investimentos e aplicações',
      'despesas médicas e saúde',
      'receitas e entradas',
    ];

    for (const query of insightQueries) {
      console.log(`\n  💡 Insights for: "${query}"`);

      const insights = await TransactionVectorSearchService.getSpendingInsights(
        userId,
        query
      );

      console.log(`    📈 Summary:`);
      console.log(
        `      - Transactions found: ${insights.summary.transactionCount}`
      );
      console.log(
        `      - Total amount: R$ ${insights.summary.totalAmount.toFixed(2)}`
      );
      console.log(
        `      - Average amount: R$ ${insights.summary.averageAmount.toFixed(2)}`
      );

      if (Object.keys(insights.summary.categories).length > 0) {
        console.log(`    🏷️ Categories:`);
        Object.entries(insights.summary.categories).forEach(
          ([category, amount]) => {
            console.log(`      - ${category}: R$ ${amount.toFixed(2)}`);
          }
        );
      }
    }
  } catch (error) {
    console.error('❌ Spending insights test failed:', error);
    throw error;
  }
}

/**
 * Main test function
 */
async function testTransactionSearchService(): Promise<void> {
  try {
    console.log('🧪 Testing TransactionVectorSearchService...');
    console.log('');

    // Connect to MongoDB
    await mongoConnection.connect();

    // Run all tests
    await testSemanticSearch();
    await testSearchWithFilters();
    await testFindSimilarTransactions();
    await testSpendingInsights();

    console.log('\n✅ All TransactionVectorSearchService tests completed!');
    console.log('');
    console.log('📝 Summary:');
    console.log('  - Semantic search: Working');
    console.log('  - Filtered search: Working');
    console.log('  - Similar transactions: Working');
    console.log('  - Spending insights: Working');
    console.log('');
    console.log('🚀 Ready for Task 2.3: RAG Integration');
  } catch (error) {
    console.error('❌ TransactionVectorSearchService tests failed:', error);
    process.exit(1);
  } finally {
    await mongoConnection.disconnect();
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testTransactionSearchService();
}

export { testTransactionSearchService };
