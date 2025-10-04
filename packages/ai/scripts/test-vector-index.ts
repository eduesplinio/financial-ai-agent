#!/usr/bin/env tsx

/**
 * TESTE E CORREÇÃO DO ÍNDICE VETORIAL
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../../../apps/web/.env.local') });

import { MongoClient } from 'mongodb';

async function testAndFixVectorIndex() {
  console.log('🔧 TESTE E CORREÇÃO DO ÍNDICE VETORIAL');
  console.log('=====================================\n');

  const client = new MongoClient(process.env.MONGODB_URI!);

  try {
    await client.connect();
    const db = client.db('financial_ai');
    const collection = db.collection('transactions');

    // Check existing search indexes
    console.log('🔍 Verificando índices de busca existentes...');
    try {
      const indexes = await collection.listSearchIndexes().toArray();
      console.log(`✅ Encontrados ${indexes.length} índices de busca:`);

      indexes.forEach(idx => {
        console.log(`   - Nome: ${idx.name}`);
        console.log(`   - Status: ${idx.status || 'UNKNOWN'}`);
        console.log(`   - Tipo: ${idx.type || 'vectorSearch'}`);
      });

      // Check if our index exists
      const vectorIndex = indexes.find(
        idx => idx.name === 'transaction_vector_search'
      );

      if (!vectorIndex) {
        console.log('\n❌ Índice "transaction_vector_search" não encontrado');
        console.log('🔧 Criando índice vetorial...');

        // Create the vector search index
        const indexDefinition = {
          name: 'transaction_vector_search',
          type: 'vectorSearch',
          definition: {
            fields: [
              {
                type: 'vector',
                path: 'embedding',
                numDimensions: 1536,
                similarity: 'cosine',
              },
              {
                type: 'filter',
                path: 'userId',
              },
              {
                type: 'filter',
                path: 'category',
              },
              {
                type: 'filter',
                path: 'amount',
              },
              {
                type: 'filter',
                path: 'date',
              },
            ],
          },
        };

        await collection.createSearchIndex(indexDefinition);
        console.log(
          '✅ Índice vetorial criado! (pode levar alguns minutos para ficar ativo)'
        );
      } else {
        console.log(`\n✅ Índice "transaction_vector_search" encontrado`);
        console.log(`   Status: ${vectorIndex.status}`);

        if (vectorIndex.status === 'READY') {
          console.log('✅ Índice está PRONTO para uso!');
        } else {
          console.log(
            '⏳ Índice ainda não está pronto. Status atual:',
            vectorIndex.status
          );
        }
      }
    } catch (indexError) {
      console.log(`❌ Erro ao verificar índices: ${indexError.message}`);
    }

    // Test with a simple vector search using actual embedding
    console.log('\n🎯 TESTE DE BUSCA VETORIAL REAL');
    console.log('==============================');

    const sampleWithEmbedding = await collection.findOne({
      embedding: { $exists: true, $ne: null },
    });

    if (sampleWithEmbedding?.embedding) {
      console.log(`📋 Usando transação: "${sampleWithEmbedding.description}"`);
      console.log(
        `📐 Dimensões do embedding: ${sampleWithEmbedding.embedding.length}`
      );

      try {
        // Try vector search with proper error handling
        const pipeline = [
          {
            $vectorSearch: {
              index: 'transaction_vector_search',
              path: 'embedding',
              queryVector: sampleWithEmbedding.embedding,
              numCandidates: 20,
              limit: 5,
            },
          },
          {
            $project: {
              description: 1,
              amount: 1,
              category: 1,
              userId: 1,
              score: { $meta: 'vectorSearchScore' },
            },
          },
        ];

        console.log('🔍 Executando pipeline de busca vetorial...');
        const results = await collection.aggregate(pipeline).toArray();

        console.log(`✅ Busca executada! Resultados: ${results.length}`);

        if (results.length > 0) {
          console.log('📊 Resultados encontrados:');
          results.forEach((result, i) => {
            console.log(`   ${i + 1}. ${result.description}`);
            console.log(`      Valor: $${result.amount}`);
            console.log(`      Score: ${result.score?.toFixed(4)}`);
            console.log(`      UserID: ${result.userId}`);
          });
        } else {
          console.log('❌ Nenhum resultado encontrado');
          console.log('💡 Isso pode indicar que o índice ainda não está ativo');
        }
      } catch (searchError) {
        console.log(`❌ Erro na busca vetorial: ${searchError.message}`);

        if (searchError.message.includes('index')) {
          console.log(
            '💡 Dica: O índice pode ainda não estar ativo. Aguarde alguns minutos.'
          );
        }
      }
    } else {
      console.log('❌ Nenhuma transação com embedding encontrada');
    }

    // Generate more embeddings if needed
    console.log('\n🤖 VERIFICANDO EMBEDDINGS');
    console.log('=========================');

    const totalTransactions = await collection.countDocuments();
    const withEmbeddings = await collection.countDocuments({
      embedding: { $exists: true, $ne: null },
    });

    console.log(`📊 Total de transações: ${totalTransactions}`);
    console.log(`✅ Com embeddings: ${withEmbeddings}`);
    console.log(`❌ Sem embeddings: ${totalTransactions - withEmbeddings}`);

    if (withEmbeddings < totalTransactions) {
      console.log(
        '\n💡 Sugestão: Execute o script de geração de embeddings para processar todas as transações:'
      );
      console.log(
        '   npm run tsx packages/database/scripts/generate-transaction-embeddings.ts'
      );
    }
  } catch (error) {
    console.log(`❌ Erro: ${error.message}`);
  } finally {
    await client.close();
    console.log('\n🔌 Conexão encerrada');
  }

  console.log('\n🎉 DIAGNÓSTICO CONCLUÍDO!');
}

testAndFixVectorIndex().catch(console.error);
