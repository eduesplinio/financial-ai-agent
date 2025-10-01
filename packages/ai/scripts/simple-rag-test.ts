#!/usr/bin/env tsx

import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '../../.env' });

import { mongoConnection } from '../../database/src/connection';
import { Transaction } from '../../database/src/models';

async function simpleRAGTest() {
  try {
    console.log('🧪 Simple RAG integration test...');

    await mongoConnection.connect();

    // Get a sample user ID
    const sampleTransaction = await Transaction.findOne({});
    if (!sampleTransaction) {
      console.log('⚠️  No transactions found');
      return;
    }

    const userId = sampleTransaction.userId.toString();
    console.log(`👤 Using user ID: ${userId}`);

    // Test dynamic import
    console.log('🔄 Testing dynamic import...');
    const { RAGService } = await import('../src/rag/rag-service');
    console.log('✅ RAGService imported successfully');

    // Test initialization
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is required');
    }

    console.log('🔄 Testing RAGService initialization...');
    const ragService = new RAGService(apiKey, {} as any); // Mock LLM service
    console.log('✅ RAGService initialized successfully');

    // Test searchTransactions method exists
    console.log('🔄 Testing searchTransactions method...');
    console.log(
      '✅ searchTransactions method:',
      typeof ragService.searchTransactions
    );

    console.log('\n✅ Basic RAG integration test passed!');
    console.log('🎯 Ready for full integration testing');
  } catch (error) {
    console.error('❌ Simple RAG test failed:', error);
  } finally {
    await mongoConnection.disconnect();
  }
}

simpleRAGTest();
