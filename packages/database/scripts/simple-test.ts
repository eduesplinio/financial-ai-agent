#!/usr/bin/env tsx

import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '../../.env' });

import { mongoConnection } from '../src/connection';

async function simpleTest() {
  try {
    console.log('🧪 Simple test...');

    await mongoConnection.connect();

    // Test dynamic import
    const { TransactionVectorSearchService } = await import(
      '../src/transaction-vector-search'
    );

    console.log(
      '✅ TransactionVectorSearchService imported:',
      typeof TransactionVectorSearchService
    );
    console.log(
      '✅ searchTransactions method:',
      typeof TransactionVectorSearchService.searchTransactions
    );
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoConnection.disconnect();
  }
}

simpleTest();
