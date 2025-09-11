#!/usr/bin/env tsx

import 'dotenv/config';

/**
 * Setup Vector Search Index for MongoDB Atlas
 *
 * This script creates the vector search index required for the RAG system.
 * It should be run once after setting up MongoDB Atlas.
 *
 * Usage:
 *   npm run setup:vector-search
 *   or
 *   tsx scripts/setup-vector-search.ts
 */

import { mongoConnection } from '../src/connection';
import { VectorSearchService } from '../src/vector-search';
import 'dotenv/config';

async function setupVectorSearch() {
  try {
    console.log('🚀 Setting up Vector Search for MongoDB Atlas...');

    // Connect to MongoDB
    await mongoConnection.connect();

    // Create vector search index
    await VectorSearchService.createVectorSearchIndex();

    // Get current stats
    const stats = await VectorSearchService.getVectorSearchStats();
    console.log('📊 Current Vector Search Stats:');
    console.log(`  - Total documents: ${stats.totalDocuments}`);
    console.log(
      `  - Documents with embeddings: ${stats.documentsWithEmbeddings}`
    );
    console.log(
      `  - Average embedding dimensions: ${stats.averageEmbeddingDimensions}`
    );
    console.log(
      `  - Categories: ${Object.keys(stats.categoriesCount).join(', ')}`
    );
    console.log(
      `  - Languages: ${Object.keys(stats.languagesCount).join(', ')}`
    );

    console.log('✅ Vector Search setup completed successfully!');
    console.log('');
    console.log('📝 Next steps:');
    console.log(
      '  1. Wait for the index to be built in MongoDB Atlas (may take a few minutes)'
    );
    console.log('  2. Add knowledge documents with embeddings');
    console.log('  3. Test vector search functionality');
  } catch (error) {
    console.error('❌ Vector Search setup failed:', error);
    process.exit(1);
  } finally {
    await mongoConnection.disconnect();
  }
}

// Run the setup if this script is executed directly
if (require.main === module) {
  setupVectorSearch();
}

export { setupVectorSearch };
