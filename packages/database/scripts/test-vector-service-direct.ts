#!/usr/bin/env tsx

import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../../../apps/web/.env.local') });

import mongoose from 'mongoose';
import { TransactionVectorSearchService } from '../src/transaction-vector-search';

async function testVectorServiceDirect() {
  console.log('🔧 TESTE DIRETO DO TRANSACTIONVECTORSEARCHSERVICE');
  console.log('================================================\n');

  try {
    // Connect to MongoDB first
    console.log('📡 Conectando ao MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ Conectado com sucesso!\n');

    // Test the service directly
    console.log('🔍 Testando TransactionVectorSearchService...');

    const testQuery = {
      queryText: 'investimento',
      userId: '68c2a35df7eb84f5a4af8560',
      limit: 3,
    };

    console.log('Query:', testQuery);

    // First, let's test without the service to see if the issue is in the service
    console.log('\n🔍 Testando query direta primeiro...');
    const db = mongoose.connection.db;
    const collection = db.collection('transactions');

    // Test direct vector search without userId filter
    const directPipeline = [
      {
        $vectorSearch: {
          index: 'transaction_vector_search',
          path: 'embedding',
          queryVector: new Array(1536).fill(0.1), // Dummy vector
          numCandidates: 10,
          limit: 3,
        },
      },
      {
        $project: {
          description: 1,
          amount: 1,
          userId: 1,
          score: { $meta: 'vectorSearchScore' },
        },
      },
    ];

    const directResults = await collection.aggregate(directPipeline).toArray();
    console.log(`   Resultados diretos (sem filtro): ${directResults.length}`);
    directResults.forEach((tx, i) => {
      console.log(
        `   ${i + 1}. ${tx.description} - $${tx.amount} (userId: ${tx.userId})`
      );
    });

    // Now test the service
    console.log('\n🔧 Testando via TransactionVectorSearchService...');
    const results =
      await TransactionVectorSearchService.searchTransactions(testQuery);

    console.log(`✅ Busca via serviço executada!`);
    console.log(`   Resultados encontrados: ${results.length}`);

    results.forEach((result, i) => {
      console.log(
        `   ${i + 1}. ${result.transaction.description} - $${result.transaction.amount}`
      );
      console.log(`      Score: ${result.score?.toFixed(3)}`);
      console.log(
        `      Fatores: semantic=${result.relevanceFactors.semantic?.toFixed(3)}`
      );
    });
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Conexão encerrada');
  }
}

testVectorServiceDirect().catch(console.error);
