/**
 * Generate real embeddings for knowledge documents using OpenAI
 * Replaces placeholder embeddings with actual semantic embeddings
 */

import 'dotenv/config';
import { MongoClient } from 'mongodb';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return response.data[0].embedding;
}

async function generateRealEmbeddings() {
  console.log('🚀 Starting real embeddings generation...\n');

  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY not found in environment variables');
    process.exit(1);
  }

  const client = new MongoClient(process.env.MONGODB_URI!);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db();
    const collection = db.collection('knowledgedocuments');

    // Get all documents
    const documents = await collection.find({}).toArray();

    console.log(`📚 Found ${documents.length} documents to process\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const doc of documents) {
      try {
        console.log(`📝 Processing: "${doc.title}"`);

        // Generate embedding from title + content for better semantic search
        const textToEmbed = `${doc.title}\n\n${doc.content}`;

        console.log(`   🔄 Generating embedding...`);
        const embedding = await generateEmbedding(textToEmbed);

        console.log(
          `   ✅ Embedding generated (${embedding.length} dimensions)`
        );

        // Update document with real embedding
        await collection.updateOne(
          { _id: doc._id },
          { $set: { embedding: embedding } }
        );

        console.log(`   💾 Document updated in database\n`);
        successCount++;

        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`   ❌ Error processing "${doc.title}":`, error);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 Summary:');
    console.log(`   ✅ Successfully processed: ${successCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   📈 Total: ${documents.length}`);
    console.log('='.repeat(50) + '\n');

    if (successCount > 0) {
      console.log('🎉 Real embeddings generated successfully!');
      console.log('💡 Your knowledge base is now ready for semantic search!');
    }
  } finally {
    await client.close();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

if (require.main === module) {
  generateRealEmbeddings().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

export { generateRealEmbeddings };
