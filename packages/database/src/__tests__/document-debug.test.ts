import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { KnowledgeDocument } from '../models';
import { VectorSearchService } from '../vector-search';
import { EmbeddingUtils } from '../vector-search';

let mongod: MongoMemoryServer;

describe('MongoDB Document ID Tests', () => {
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    console.log('MongoDB URI:', uri);
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongod.stop();
  });

  it('should test document IDs and updateDocumentEmbedding', async () => {
    // Create a test document
    const testDoc = new KnowledgeDocument({
      title: 'Test Document',
      content: 'Test content',
      category: 'investment', // Usando uma categoria válida
      source: 'test-source',
      metadata: {
        language: 'pt-BR',
        relevanceScore: 0.9,
        lastUpdated: new Date(),
      },
    });

    // Save document
    const savedDoc = await testDoc.save();
    const docId = savedDoc._id ? savedDoc._id.toString() : '';

    console.log('Document saved with ID:', docId);

    // Generate an embedding
    const embedding = EmbeddingUtils.generateRandomEmbedding();
    console.log('Generated embedding with length:', embedding.length);

    try {
      // Update the document embedding
      const updatedDoc = await VectorSearchService.updateDocumentEmbedding(
        docId,
        embedding
      );
      console.log('Document updated successfully:', updatedDoc ? 'yes' : 'no');

      if (updatedDoc) {
        console.log('Updated embedding length:', updatedDoc.embedding?.length);
        expect(updatedDoc.embedding).toEqual(embedding);
      }
    } catch (error: any) {
      console.error('Error updating document:', error.message);
      throw error;
    }
  });
});
