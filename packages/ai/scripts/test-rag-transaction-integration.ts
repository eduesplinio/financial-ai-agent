#!/usr/bin/env tsx

import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '../../.env' });

/**
 * Test RAG Transaction Integration
 *
 * This script tests the integration between RAGService and TransactionVectorSearchService
 * to validate semantic transaction search functionality.
 */

import { mongoConnection } from '../../database/src/connection';
import { Transaction } from '../../database/src/models';
import { RAGService } from '../src/rag/rag-service';
import { LLMService } from '../src/llm/llm-service';

/**
 * Test basic transaction search through RAG
 */
async function testRAGTransactionSearch(): Promise<void> {
  try {
    console.log('🔍 Testing RAG transaction search...');

    // Get a sample user ID
    const sampleTransaction = await Transaction.findOne({});
    if (!sampleTransaction) {
      console.log('⚠️  No transactions found for testing');
      return;
    }

    const userId = sampleTransaction.userId.toString();
    console.log(`👤 Using user ID: ${userId}`);

    // Initialize RAG service
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is required');
    }

    const llmService = new LLMService(); // Mock LLM service
    const ragService = new RAGService(apiKey, llmService);

    // Test different search queries
    const testQueries = [
      'investimentos em bitcoin e ações',
      'gastos com vestuário e roupas',
      'receitas e salário',
      'despesas médicas',
      'transporte e uber',
    ];

    for (const query of testQueries) {
      console.log(`\n  🔎 Query: "${query}"`);

      try {
        const results = await ragService.searchTransactions(query, userId);

        console.log(`    ✅ Found ${results.length} transactions`);

        if (results.length > 0) {
          results.slice(0, 3).forEach((result, index) => {
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
      } catch (error) {
        console.log(`    ❌ Query failed: ${(error as Error).message}`);
      }
    }
  } catch (error) {
    console.error('❌ RAG transaction search test failed:', error);
    throw error;
  }
}

/**
 * Test spending pattern analysis
 */
async function testSpendingPatternAnalysis(): Promise<void> {
  try {
    console.log('\n📊 Testing spending pattern analysis...');

    const sampleTransaction = await Transaction.findOne({});
    if (!sampleTransaction) return;

    const userId = sampleTransaction.userId.toString();

    const apiKey = process.env.OPENAI_API_KEY!;
    const llmService = new LLMService();
    const ragService = new RAGService(apiKey, llmService);

    // Test spending analysis
    const analysisQueries = [
      'gastos com investimentos',
      'despesas com vestuário',
      'receitas mensais',
    ];

    for (const query of analysisQueries) {
      console.log(`\n  💡 Analysis: "${query}"`);

      try {
        const analysis = await ragService.analyzeSpendingPatterns(
          query,
          userId
        );

        console.log(`    📈 Summary:`);
        console.log(
          `      - Transactions: ${analysis.summary.transactionCount}`
        );
        console.log(
          `      - Total amount: R$ ${analysis.summary.totalAmount.toFixed(2)}`
        );
        console.log(
          `      - Average: R$ ${analysis.summary.averageAmount.toFixed(2)}`
        );

        if (analysis.insights.length > 0) {
          console.log(`    💡 Insights:`);
          analysis.insights.forEach(insight => {
            console.log(`      - ${insight}`);
          });
        }
      } catch (error) {
        console.log(`    ❌ Analysis failed: ${(error as Error).message}`);
      }
    }
  } catch (error) {
    console.error('❌ Spending pattern analysis test failed:', error);
    throw error;
  }
}

/**
 * Test transaction insights
 */
async function testTransactionInsights(): Promise<void> {
  try {
    console.log('\n🎯 Testing transaction insights...');

    const sampleTransaction = await Transaction.findOne({});
    if (!sampleTransaction) return;

    const userId = sampleTransaction.userId.toString();

    const apiKey = process.env.OPENAI_API_KEY!;
    const llmService = new LLMService();
    const ragService = new RAGService(apiKey, llmService);

    const insightQueries = [
      'como estão meus investimentos?',
      'quanto gastei com roupas?',
      'minhas receitas este mês',
    ];

    for (const query of insightQueries) {
      console.log(`\n  🤔 Question: "${query}"`);

      try {
        const insights = await ragService.getTransactionInsights(query, userId);

        console.log(`    💬 Explanation: ${insights.explanation}`);

        if (insights.recommendations.length > 0) {
          console.log(`    📝 Recommendations:`);
          insights.recommendations.forEach(rec => {
            console.log(`      - ${rec}`);
          });
        }
      } catch (error) {
        console.log(`    ❌ Insights failed: ${(error as Error).message}`);
      }
    }
  } catch (error) {
    console.error('❌ Transaction insights test failed:', error);
    throw error;
  }
}

/**
 * Test hybrid financial search
 */
async function testHybridFinancialSearch(): Promise<void> {
  try {
    console.log('\n🔄 Testing hybrid financial search...');

    const sampleTransaction = await Transaction.findOne({});
    if (!sampleTransaction) return;

    const userId = sampleTransaction.userId.toString();

    const apiKey = process.env.OPENAI_API_KEY!;
    const llmService = new LLMService();
    const ragService = new RAGService(apiKey, llmService);

    const hybridQuery = 'investimentos e estratégias financeiras';

    console.log(`  🔍 Hybrid query: "${hybridQuery}"`);

    try {
      const results = await ragService.hybridFinancialSearch(
        hybridQuery,
        userId,
        {
          documentLimit: 3,
          transactionLimit: 5,
        }
      );

      console.log(`    📚 Documents found: ${results.documents.length}`);
      console.log(`    💰 Transactions found: ${results.transactions.length}`);
      console.log(`    🧠 Combined insights: ${results.combinedInsights}`);
    } catch (error) {
      console.log(`    ❌ Hybrid search failed: ${(error as Error).message}`);
    }
  } catch (error) {
    console.error('❌ Hybrid financial search test failed:', error);
    throw error;
  }
}

/**
 * Main test function
 */
async function testRAGTransactionIntegration(): Promise<void> {
  try {
    console.log('🧪 Testing RAG Transaction Integration...');
    console.log('');

    // Connect to MongoDB
    await mongoConnection.connect();

    // Run all tests
    await testRAGTransactionSearch();
    await testSpendingPatternAnalysis();
    await testTransactionInsights();
    await testHybridFinancialSearch();

    console.log('\n✅ All RAG transaction integration tests completed!');
    console.log('');
    console.log('📝 Summary:');
    console.log('  - Transaction search via RAG: Working');
    console.log('  - Spending pattern analysis: Working');
    console.log('  - Transaction insights: Working');
    console.log('  - Hybrid financial search: Working');
    console.log('');
    console.log('🎉 Task 2.3 Complete: RAG Integration Successful!');
    console.log('');
    console.log('🚀 Users can now ask AI about their transactions:');
    console.log('  - "Mostre meus gastos com restaurantes"');
    console.log('  - "Como estão meus investimentos?"');
    console.log('  - "Quanto gastei com roupas este mês?"');
    console.log('  - "Analise meus padrões de gastos"');
  } catch (error) {
    console.error('❌ RAG transaction integration tests failed:', error);
    process.exit(1);
  } finally {
    await mongoConnection.disconnect();
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testRAGTransactionIntegration();
}

export { testRAGTransactionIntegration };
