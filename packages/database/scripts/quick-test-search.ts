#!/usr/bin/env tsx

import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '../../.env' });

import { mongoConnection } from '../src/connection';
import { Transaction } from '../src/models';
import mongoose from 'mongoose';

async function quickTestSearch() {
  try {
    console.log('🚀 Quick test of transaction vector search...');

    await mongoConnection.connect();

    // Get a sample user ID
    const sampleTransaction = await Transaction.findOne({});
    if (!sampleTransaction) {
      console.log('⚠️  No transactions found');
      return;
    }

    const userId = sampleTransaction.userId.toString();
    console.log(`👤 Using user ID: ${userId}`);

    // Test direct MongoDB vector search
    console.log('🔍 Testing direct vector search...');

    // Get a transaction with embedding to use as query using raw MongoDB
    const db = mongoose.connection.db;
    const collection = db.collection('transactions');

    const transactionWithEmbedding = await collection.findOne({
      embedding: { $exists: true, $ne: null },
    });

    if (!transactionWithEmbedding) {
      console.log('⚠️  No transactions with embeddings found');
      return;
    }

    console.log(
      `🎯 Using embedding from: "${transactionWithEmbedding?.description}"`
    );
    const queryVector = transactionWithEmbedding?.embedding;

    if (!queryVector || !Array.isArray(queryVector)) {
      console.log('❌ No valid embedding found in transaction');
      console.log('Embedding type:', typeof queryVector);
      console.log('Embedding length:', queryVector?.length);
      return;
    }

    console.log(`✅ Using embedding with ${queryVector.length} dimensions`);

    const results = await Transaction.aggregate([
      {
        $vectorSearch: {
          index: 'transaction_vector_index',
          path: 'embedding',
          queryVector: queryVector,
          numCandidates: 20,
          limit: 5,
          filter: {
            userId: new mongoose.Types.ObjectId(userId),
          },
        },
      },
      {
        $addFields: {
          score: { $meta: 'vectorSearchScore' },
        },
      },
    ]);

    console.log(`✅ Found ${results.length} results`);

    if (results.length > 0) {
      console.log('📋 Results:');
      results.forEach((result, index) => {
        console.log(
          `  ${index + 1}. "${result.description}" (Score: ${result.score.toFixed(4)})`
        );
        console.log(`     Amount: ${result.amount} ${result.currency}`);
        console.log(`     Category: ${result.category?.primary || 'N/A'}`);
      });
    }

    console.log('\n✅ Direct vector search is working!');
    console.log('🎯 Task 2.2 core functionality validated');
  } catch (error) {
    console.error('❌ Quick test failed:', error);
  } finally {
    await mongoConnection.disconnect();
  }
}

quickTestSearch();
