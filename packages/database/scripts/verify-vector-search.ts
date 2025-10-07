/**
 * Verify Vector Search setup
 * Checks if indexes exist and tests a simple search
 */

import 'dotenv/config';
import { MongoClient } from 'mongodb';

async function verifyVectorSearch() {
  console.log('🔍 Verifying Vector Search setup...\n');

  const client = new MongoClient(process.env.MONGODB_URI!);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db();
    const collection = db.collection('knowledgedocuments');

    // Check if documents have embeddings
    const docWithEmbedding = await collection.findOne({
      embedding: { $exists: true },
    });

    if (!docWithEmbedding) {
      console.log('❌ No documents with embeddings found');
      return;
    }

    console.log('✅ Documents have embeddings');
    console.log(
      `   Sample embedding length: ${docWithEmbedding.embedding.length}\n`
    );

    // List search indexes
    console.log('📋 Checking for search indexes...');
    try {
      const indexes = await collection.listSearchIndexes().toArray();

      if (indexes.length === 0) {
        console.log('⚠️  No search indexes found');
        console.log('\n📝 To create the vector search index:');
        console.log('   1. Go to MongoDB Atlas UI');
        console.log('   2. Navigate to your cluster → Search');
        console.log('   3. Create a new Search Index with this configuration:');
        console.log('\n```json');
        console.log(
          JSON.stringify(
            {
              name: 'knowledge_vector_index',
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
                    path: 'category',
                  },
                ],
              },
            },
            null,
            2
          )
        );
        console.log('```\n');
      } else {
        console.log(`✅ Found ${indexes.length} search index(es):`);
        indexes.forEach(idx => {
          console.log(`   - ${idx.name} (${idx.type || 'search'})`);
        });
      }
    } catch (error) {
      console.log('⚠️  Could not list search indexes (may need Atlas UI)');
    }

    // Try a simple vector search
    console.log('\n🧪 Testing vector search...');
    try {
      const testEmbedding = docWithEmbedding.embedding;

      const results = await collection
        .aggregate([
          {
            $vectorSearch: {
              index: 'knowledge_vector_index',
              path: 'embedding',
              queryVector: testEmbedding,
              numCandidates: 10,
              limit: 3,
            },
          },
          {
            $project: {
              title: 1,
              category: 1,
              score: { $meta: 'vectorSearchScore' },
            },
          },
        ])
        .toArray();

      if (results.length > 0) {
        console.log('✅ Vector search is working!');
        console.log('\n📊 Test results:');
        results.forEach((doc, i) => {
          console.log(
            `   ${i + 1}. ${doc.title} (score: ${doc.score.toFixed(4)})`
          );
        });
      } else {
        console.log('⚠️  Vector search returned no results');
      }
    } catch (error: any) {
      if (error.message?.includes('index')) {
        console.log('❌ Vector search index not found or not ready');
        console.log(
          '   Please create the index in MongoDB Atlas UI (see instructions above)'
        );
      } else {
        console.log('❌ Vector search test failed:', error.message);
      }
    }
  } finally {
    await client.close();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

if (require.main === module) {
  verifyVectorSearch().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

export { verifyVectorSearch };
