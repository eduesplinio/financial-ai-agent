#!/usr/bin/env tsx

import 'dotenv/config';
import { config } from 'dotenv';

// Load environment variables from root .env file
config({ path: '../../.env' });

/**
 * Generate Embeddings for Existing Transactions
 *
 * This script generates OpenAI embeddings for all transactions that don't have them yet.
 * Processes in batches to optimize API usage and costs.
 */

import { mongoConnection } from '../src/connection';
import { Transaction } from '../src/models';
import { OpenAIEmbeddingProvider } from '../../ai/src/rag/embedding-generator';
import mongoose from 'mongoose';

// Configuration
const BATCH_SIZE = 10; // Process 10 transactions at a time
const DELAY_BETWEEN_BATCHES = 1000; // 1 second delay to respect rate limits

/**
 * Prepare transaction content for embedding generation
 */
function prepareTransactionContent(transaction: any): string {
  const parts = [];

  // Add description (main content)
  if (transaction.description) {
    parts.push(transaction.description);
  }

  // Add category
  if (transaction.category?.primary) {
    parts.push(`Categoria: ${transaction.category.primary}`);
  }

  // Add merchant name
  if (transaction.merchant?.name) {
    parts.push(`Estabelecimento: ${transaction.merchant.name}`);
  }

  // Add amount context
  if (transaction.amount) {
    const amountText = transaction.amount > 0 ? 'Receita' : 'Despesa';
    parts.push(`${amountText}: R$ ${Math.abs(transaction.amount).toFixed(2)}`);
  }

  return parts.join(' - ');
}

/**
 * Generate embeddings for a batch of transactions
 */
async function generateEmbeddingsForBatch(
  transactions: any[],
  embeddingProvider: OpenAIEmbeddingProvider
): Promise<void> {
  console.log(
    `  📝 Processing batch of ${transactions.length} transactions...`
  );

  for (const transaction of transactions) {
    try {
      // Prepare content for embedding
      const content = prepareTransactionContent(transaction);

      console.log(
        `    🔄 Generating embedding for: "${transaction.description}"`
      );

      // Generate embedding
      const embedding = await embeddingProvider.getEmbedding(content);

      // Update transaction in database
      await Transaction.findByIdAndUpdate(transaction._id, {
        $set: {
          embedding: embedding,
          embeddingVersion: 'openai-ada-002-v1',
          embeddingGeneratedAt: new Date(),
          searchableContent: content,
        },
      });

      console.log(
        `    ✅ Embedding generated (${embedding.length} dimensions)`
      );
    } catch (error) {
      console.error(
        `    ❌ Failed to generate embedding for transaction ${transaction._id}:`,
        error
      );
      // Continue with next transaction instead of failing the whole batch
    }
  }
}

/**
 * Get statistics about embedding coverage
 */
async function getEmbeddingStats(): Promise<void> {
  const totalTransactions = await Transaction.countDocuments();
  const transactionsWithEmbeddings = await Transaction.countDocuments({
    embedding: { $exists: true, $ne: null },
  });

  const coverage =
    totalTransactions > 0
      ? ((transactionsWithEmbeddings / totalTransactions) * 100).toFixed(1)
      : 0;

  console.log('📊 Embedding Statistics:');
  console.log(`  - Total transactions: ${totalTransactions}`);
  console.log(`  - With embeddings: ${transactionsWithEmbeddings}`);
  console.log(`  - Coverage: ${coverage}%`);

  if (transactionsWithEmbeddings < totalTransactions) {
    const remaining = totalTransactions - transactionsWithEmbeddings;
    console.log(`  - Remaining to process: ${remaining}`);
  }
}

/**
 * Main function to generate embeddings for all transactions
 */
async function generateTransactionEmbeddings(): Promise<void> {
  try {
    console.log('🚀 Starting transaction embedding generation...');
    console.log('');

    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }

    // Connect to MongoDB
    await mongoConnection.connect();

    // Initialize OpenAI embedding provider
    const embeddingProvider = new OpenAIEmbeddingProvider(
      process.env.OPENAI_API_KEY
    );

    // Get initial statistics
    console.log('📊 Initial statistics:');
    await getEmbeddingStats();
    console.log('');

    // Find transactions without embeddings
    const transactionsWithoutEmbeddings = await Transaction.find({
      $or: [{ embedding: { $exists: false } }, { embedding: null }],
    })
      .select('_id description category merchant amount')
      .lean();

    if (transactionsWithoutEmbeddings.length === 0) {
      console.log('✅ All transactions already have embeddings!');
      return;
    }

    console.log(
      `🔄 Found ${transactionsWithoutEmbeddings.length} transactions without embeddings`
    );
    console.log(`📦 Processing in batches of ${BATCH_SIZE}...`);
    console.log('');

    // Process transactions in batches
    const totalBatches = Math.ceil(
      transactionsWithoutEmbeddings.length / BATCH_SIZE
    );

    for (let i = 0; i < transactionsWithoutEmbeddings.length; i += BATCH_SIZE) {
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
      const batch = transactionsWithoutEmbeddings.slice(i, i + BATCH_SIZE);

      console.log(`📦 Batch ${batchNumber}/${totalBatches}:`);

      await generateEmbeddingsForBatch(batch, embeddingProvider);

      // Add delay between batches to respect rate limits
      if (i + BATCH_SIZE < transactionsWithoutEmbeddings.length) {
        console.log(
          `  ⏳ Waiting ${DELAY_BETWEEN_BATCHES}ms before next batch...`
        );
        await new Promise(resolve =>
          setTimeout(resolve, DELAY_BETWEEN_BATCHES)
        );
      }

      console.log('');
    }

    // Get final statistics
    console.log('📊 Final statistics:');
    await getEmbeddingStats();
    console.log('');

    console.log('✅ Transaction embedding generation completed!');
    console.log('');
    console.log('🚀 Next steps:');
    console.log('  1. Test vector search with real embeddings');
    console.log('  2. Create TransactionVectorSearchService');
    console.log('  3. Integrate with RAG system');
  } catch (error) {
    console.error('❌ Transaction embedding generation failed:', error);
    process.exit(1);
  } finally {
    await mongoConnection.disconnect();
  }
}

// Run the script if executed directly
if (require.main === module) {
  generateTransactionEmbeddings();
}

export { generateTransactionEmbeddings };
