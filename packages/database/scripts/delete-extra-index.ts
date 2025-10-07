import { MongoClient } from 'mongodb';

async function deleteExtraIndex() {
  console.log('🗑️  Deleting extra vector search index...');

  try {
    // Connect to MongoDB
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();

    const db = client.db();
    const collection = db.collection('transactions');

    // List all search indexes
    const indexes = await collection.listSearchIndexes().toArray();
    console.log('📋 Current search indexes:');
    indexes.forEach(index => {
      console.log(`  - ${index.name} (${index.type}) - ${index.status}`);
    });

    // Delete the extra index if it exists
    const extraIndexName = 'transaction_vector_index'; // The one we don't want
    const correctIndexName = 'transaction_vector_search'; // The one we want to keep

    const extraIndex = indexes.find(idx => idx.name === extraIndexName);
    if (extraIndex) {
      console.log(`🗑️  Deleting extra index: ${extraIndexName}`);
      await collection.dropSearchIndex(extraIndexName);
      console.log('✅ Extra index deleted successfully');
    } else {
      console.log(`ℹ️  Extra index ${extraIndexName} not found`);
    }

    // Verify the correct index exists
    const correctIndex = indexes.find(idx => idx.name === correctIndexName);
    if (correctIndex) {
      console.log(
        `✅ Correct index ${correctIndexName} exists and is ${correctIndex.status}`
      );
    } else {
      console.log(`❌ Correct index ${correctIndexName} not found`);
    }

    await client.close();
    console.log('✅ Index cleanup completed');
  } catch (error) {
    console.error('❌ Failed to delete extra index:', error);
    process.exit(1);
  }
}

deleteExtraIndex();
