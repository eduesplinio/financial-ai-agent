#!/usr/bin/env tsx

/**
 * TESTE DIRETO DO BANCO DE DADOS financial_ai
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../../../apps/web/.env.local') });

import { MongoClient } from 'mongodb';

async function testDatabase() {
  console.log('🔌 TESTE DIRETO DO BANCO financial_ai');
  console.log('====================================\n');

  const client = new MongoClient(process.env.MONGODB_URI!);

  try {
    // Connect
    console.log('📡 Conectando ao MongoDB...');
    await client.connect();
    console.log('✅ MongoDB conectado com sucesso!');

    // Access financial_ai database
    const db = client.db('financial_ai');
    console.log('📍 Acessando banco: financial_ai');

    // List collections
    const collections = await db.listCollections().toArray();
    console.log(`✅ Encontradas ${collections.length} coleções:`);
    collections.forEach(col => console.log(`   - ${col.name}`));

    // Check transactions collection
    const transactionsCollection = db.collection('transactions');
    const totalTransactions = await transactionsCollection.countDocuments();
    console.log(`\n📊 Total de transações: ${totalTransactions}`);

    if (totalTransactions > 0) {
      // Check embeddings
      const withEmbeddings = await transactionsCollection.countDocuments({
        embedding: { $exists: true, $ne: null },
      });
      console.log(`✅ Transações com embeddings: ${withEmbeddings}`);

      // Sample transaction
      const sampleTransaction = await transactionsCollection.findOne();
      console.log('\n📋 Transação de exemplo:');
      console.log(`   ID: ${sampleTransaction?._id}`);
      console.log(`   Descrição: ${sampleTransaction?.description}`);
      console.log(`   Valor: $${sampleTransaction?.amount}`);
      console.log(
        `   Tem embedding: ${sampleTransaction?.embedding ? 'Sim' : 'Não'}`
      );

      // Test vector search if embeddings exist
      if (withEmbeddings > 0) {
        console.log('\n🔍 TESTANDO BUSCA VETORIAL');
        console.log('==========================');

        try {
          // Get a sample embedding for testing
          const sampleWithEmbedding = await transactionsCollection.findOne({
            embedding: { $exists: true, $ne: null },
          });

          if (sampleWithEmbedding?.embedding) {
            console.log('🎯 Executando busca vetorial...');

            const vectorSearchResults = await transactionsCollection
              .aggregate([
                {
                  $vectorSearch: {
                    index: 'transaction_vector_search',
                    path: 'embedding',
                    queryVector: sampleWithEmbedding.embedding,
                    numCandidates: 10,
                    limit: 3,
                  },
                },
                {
                  $project: {
                    description: 1,
                    amount: 1,
                    category: 1,
                    score: { $meta: 'vectorSearchScore' },
                  },
                },
              ])
              .toArray();

            console.log(
              `✅ Busca vetorial executada! Resultados: ${vectorSearchResults.length}`
            );
            vectorSearchResults.forEach((result, i) => {
              console.log(
                `   ${i + 1}. ${result.description} - $${result.amount} (Score: ${result.score?.toFixed(4)})`
              );
            });
          } else {
            console.log('❌ Não foi possível obter embedding de exemplo');
          }
        } catch (vectorError) {
          console.log(`❌ Erro na busca vetorial: ${vectorError.message}`);
        }
      }

      // Test simple aggregation
      console.log('\n📈 TESTE DE AGREGAÇÃO SIMPLES');
      console.log('=============================');

      try {
        const categoryStats = await transactionsCollection
          .aggregate([
            {
              $group: {
                _id: '$category',
                count: { $sum: 1 },
                total: { $sum: '$amount' },
              },
            },
            { $sort: { count: -1 } },
            { $limit: 5 },
          ])
          .toArray();

        console.log('✅ Top 5 categorias:');
        categoryStats.forEach(stat => {
          console.log(
            `   ${stat._id || 'Sem categoria'}: ${stat.count} transações, $${stat.total?.toFixed(2)}`
          );
        });
      } catch (aggError) {
        console.log(`❌ Erro na agregação: ${aggError.message}`);
      }
    } else {
      console.log('❌ Nenhuma transação encontrada no banco');
    }
  } catch (error) {
    console.log(`❌ Erro: ${error.message}`);
  } finally {
    await client.close();
    console.log('\n🔌 Conexão encerrada');
  }

  console.log('\n🎉 TESTE CONCLUÍDO!');
}

testDatabase().catch(console.error);
