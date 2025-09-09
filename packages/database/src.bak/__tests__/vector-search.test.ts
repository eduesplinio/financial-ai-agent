import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from '@jest/globals';
import mongoose from 'mongoose';
import {
  VectorSearchService,
  EmbeddingUtils,
  VectorSearchQuerySchema,
  HybridSearchQuerySchema,
  VECTOR_SEARCH_INDEX_CONFIG,
} from '../vector-search';
import { KnowledgeDocument, KnowledgeDocumentService } from '../models';
import { mongoConnection } from '../connection';

describe('Vector Search', () => {
  beforeAll(async () => {
    await mongoConnection.connect();
    // Limpar dados apenas uma vez no início dos testes
    try {
      await KnowledgeDocument.deleteMany({});

      // Garantir que o NODE_ENV está configurado para 'test'
      process.env.NODE_ENV = 'test';

      // Criar dados de teste para documentos - Adicionando campos obrigatórios
      const testDocs = [
        {
          title: 'Investment Basics',
          content: 'Learn about investment strategies for beginners',
          category: 'investment',
          source: 'https://test-source.com/investment',  // Usar URL válida
          metadata: {
            language: 'pt-BR',
            relevanceScore: 0.9,
            lastUpdated: new Date(),
          },
          embedding: EmbeddingUtils.generateRandomEmbedding(),
        },
        {
          title: 'Budgeting Tips',
          content: 'How to create and maintain a budget',
          category: 'budgeting',
          source: 'https://test-source.com/budget',  // Usar URL válida
          metadata: {
            language: 'pt-BR',
            relevanceScore: 0.85,
            lastUpdated: new Date(),
          },
          embedding: EmbeddingUtils.generateRandomEmbedding(),
        },
        {
          title: 'Tax Planning',
          content: 'Important tax planning strategies',
          category: 'taxes',
          source: 'https://test-source.com/taxes',  // Usar URL válida
          metadata: {
            language: 'pt-BR',
            relevanceScore: 0.8,
            lastUpdated: new Date(),
          },
          embedding: EmbeddingUtils.generateRandomEmbedding(),
        },
      ];

      // Inserir documentos de teste
      await KnowledgeDocument.insertMany(testDocs);
      console.log('✅ Documentos de teste criados com sucesso');
    } catch (error) {
      console.log('Aviso: Erro ao configurar dados de teste:', error);
    }
  });

  afterAll(async () => {
    await mongoConnection.disconnect();
  });

  beforeEach(async () => {
    // Verificar a conexão entre os testes
    if (!mongoConnection.isConnected()) {
      await mongoConnection.connect();
    }
  });

  describe('EmbeddingUtils', () => {
    describe('validateEmbedding', () => {
      it('should validate correct embedding', () => {
        const validEmbedding = Array.from({ length: 1536 }, () =>
          Math.random()
        );
        expect(EmbeddingUtils.validateEmbedding(validEmbedding)).toBe(true);
      });

      it('should reject embedding with wrong dimensions', () => {
        const invalidEmbedding = Array.from({ length: 512 }, () =>
          Math.random()
        );
        expect(EmbeddingUtils.validateEmbedding(invalidEmbedding)).toBe(false);
      });

      it('should reject non-array input', () => {
        expect(EmbeddingUtils.validateEmbedding('not an array' as any)).toBe(
          false
        );
      });

      it('should reject embedding with NaN values', () => {
        const invalidEmbedding = Array.from({ length: 1536 }, (_, i) =>
          i === 0 ? NaN : Math.random()
        );
        expect(EmbeddingUtils.validateEmbedding(invalidEmbedding)).toBe(false);
      });
    });

    describe('cosineSimilarity', () => {
      it('should calculate cosine similarity correctly', () => {
        const a = [1, 0, 0];
        const b = [0, 1, 0];
        const similarity = EmbeddingUtils.cosineSimilarity(a, b);
        expect(similarity).toBeCloseTo(0, 5);
      });

      it('should return 1 for identical vectors', () => {
        const a = [1, 2, 3];
        const b = [1, 2, 3];
        const similarity = EmbeddingUtils.cosineSimilarity(a, b);
        expect(similarity).toBeCloseTo(1, 5);
      });

      it('should handle zero vectors', () => {
        const a = [0, 0, 0];
        const b = [1, 2, 3];
        const similarity = EmbeddingUtils.cosineSimilarity(a, b);
        expect(similarity).toBe(0);
      });

      it('should throw error for different length vectors', () => {
        const a = [1, 2];
        const b = [1, 2, 3];
        expect(() => EmbeddingUtils.cosineSimilarity(a, b)).toThrow();
      });
    });

    describe('euclideanDistance', () => {
      it('should calculate Euclidean distance correctly', () => {
        const a = [0, 0];
        const b = [3, 4];
        const distance = EmbeddingUtils.euclideanDistance(a, b);
        expect(distance).toBeCloseTo(5, 5);
      });

      it('should return 0 for identical vectors', () => {
        const a = [1, 2, 3];
        const b = [1, 2, 3];
        const distance = EmbeddingUtils.euclideanDistance(a, b);
        expect(distance).toBeCloseTo(0, 5);
      });
    });

    describe('normalizeEmbedding', () => {
      it('should normalize embedding to unit length', () => {
        const embedding = [3, 4, 0];
        const normalized = EmbeddingUtils.normalizeEmbedding(embedding);

        // Calculate magnitude
        const magnitude = Math.sqrt(
          normalized.reduce((sum, val) => sum + val * val, 0)
        );
        expect(magnitude).toBeCloseTo(1, 5);
      });

      it('should handle zero vector', () => {
        const embedding = [0, 0, 0];
        const normalized = EmbeddingUtils.normalizeEmbedding(embedding);
        expect(normalized).toEqual([0, 0, 0]);
      });
    });

    describe('generateRandomEmbedding', () => {
      it('should generate embedding with correct dimensions', () => {
        const embedding = EmbeddingUtils.generateRandomEmbedding(1536);
        expect(embedding).toHaveLength(1536);
        expect(EmbeddingUtils.validateEmbedding(embedding)).toBe(true);
      });

      it('should generate normalized embedding', () => {
        const embedding = EmbeddingUtils.generateRandomEmbedding(100);
        const magnitude = Math.sqrt(
          embedding.reduce((sum, val) => sum + val * val, 0)
        );
        expect(magnitude).toBeCloseTo(1, 5);
      });
    });
  });

  describe('VectorSearchService', () => {
    let testDocuments: any[];

    beforeEach(async () => {
      // Create test documents with embeddings
      testDocuments = [
        {
          title: 'Investment Basics',
          content: 'Learn the fundamentals of investing in stocks and bonds.',
          source: 'https://example.com/investment-basics',
          category: 'investment',
          embedding: EmbeddingUtils.generateRandomEmbedding(),
          metadata: {
            lastUpdated: new Date(),
            relevanceScore: 0.9,
            tags: ['investment', 'basics', 'stocks'],
            language: 'pt-BR',
          },
        },
        {
          title: 'Budgeting Guide',
          content: 'How to create and maintain a personal budget.',
          source: 'https://example.com/budgeting-guide',
          category: 'budgeting',
          embedding: EmbeddingUtils.generateRandomEmbedding(),
          metadata: {
            lastUpdated: new Date(),
            relevanceScore: 0.8,
            tags: ['budgeting', 'personal-finance'],
            language: 'pt-BR',
          },
        },
        {
          title: 'Tax Planning',
          content: 'Strategies for effective tax planning and optimization.',
          source: 'https://example.com/tax-planning',
          category: 'taxes',
          embedding: EmbeddingUtils.generateRandomEmbedding(),
          metadata: {
            lastUpdated: new Date(),
            relevanceScore: 0.7,
            tags: ['taxes', 'planning'],
            language: 'pt-BR',
          },
        },
      ];

      // Insert test documents
      for (const docData of testDocuments) {
        await KnowledgeDocumentService.create(docData);
      }
    });

    describe('Vector Search Index Configuration', () => {
      it('should have correct index configuration', () => {
        expect(VECTOR_SEARCH_INDEX_CONFIG.name).toBe('knowledge_vector_index');
        expect(VECTOR_SEARCH_INDEX_CONFIG.type).toBe('vectorSearch');
        expect(VECTOR_SEARCH_INDEX_CONFIG.definition.fields).toHaveLength(4);

        const vectorField = VECTOR_SEARCH_INDEX_CONFIG.definition.fields[0];
        expect(vectorField.type).toBe('vector');
        expect(vectorField.path).toBe('embedding');
        expect(vectorField.numDimensions).toBe(1536);
        expect(vectorField.similarity).toBe('cosine');
      });
    });

    describe('Validation Schemas', () => {
      it('should validate vector search query', () => {
        const validQuery = {
          queryVector: EmbeddingUtils.generateRandomEmbedding(),
          numCandidates: 100,
          limit: 10,
          filter: {
            category: 'investment',
            language: 'pt-BR',
          },
        };

        const result = VectorSearchQuerySchema.safeParse(validQuery);
        expect(result.success).toBe(true);
      });

      it('should reject invalid vector dimensions', () => {
        const invalidQuery = {
          queryVector: Array.from({ length: 512 }, () => Math.random()),
          limit: 10,
        };

        const result = VectorSearchQuerySchema.safeParse(invalidQuery);
        expect(result.success).toBe(false);
      });

      it('should validate hybrid search query', () => {
        const validQuery = {
          textQuery: 'investment strategies',
          queryVector: EmbeddingUtils.generateRandomEmbedding(),
          textWeight: 0.3,
          vectorWeight: 0.7,
          limit: 10,
        };

        const result = HybridSearchQuerySchema.safeParse(validQuery);
        expect(result.success).toBe(true);
      });
    });

    describe('getVectorSearchStats', () => {
      it('should return correct statistics', async () => {
        const stats = await VectorSearchService.getVectorSearchStats();

        expect(stats.totalDocuments).toBe(3);
        expect(stats.documentsWithEmbeddings).toBe(3);
        expect(stats.averageEmbeddingDimensions).toBe(1536);
        expect(stats.categoriesCount).toEqual({
          investment: 1,
          budgeting: 1,
          taxes: 1,
        });
        expect(stats.languagesCount).toEqual({
          'pt-BR': 3,
        });
      });

      it('should handle empty collection', async () => {
        await KnowledgeDocument.deleteMany({});

        const stats = await VectorSearchService.getVectorSearchStats();

        expect(stats.totalDocuments).toBe(0);
        expect(stats.documentsWithEmbeddings).toBe(0);
        expect(stats.averageEmbeddingDimensions).toBe(0);
        expect(stats.categoriesCount).toEqual({});
        expect(stats.languagesCount).toEqual({});
      });
    });

    describe('updateDocumentEmbedding', () => {
      it('should update document embedding successfully', async () => {
        const doc = await KnowledgeDocument.findOne({
          title: 'Investment Basics',
        });
        expect(doc).toBeDefined();

        const newEmbedding = EmbeddingUtils.generateRandomEmbedding();
        const updatedDoc = await VectorSearchService.updateDocumentEmbedding(
          doc!._id.toString(),
          newEmbedding
        );

        expect(updatedDoc).toBeDefined();
        expect(updatedDoc!.embedding).toEqual(newEmbedding);
      });

      it('should reject embedding with wrong dimensions', async () => {
        const doc = await KnowledgeDocument.findOne({
          title: 'Investment Basics',
        });
        expect(doc).toBeDefined();

        const invalidEmbedding = Array.from({ length: 512 }, () =>
          Math.random()
        );

        await expect(
          VectorSearchService.updateDocumentEmbedding(
            doc!._id.toString(),
            invalidEmbedding
          )
        ).rejects.toThrow('Embedding must have 1536 dimensions');
      });
    });

    describe('batchUpdateEmbeddings', () => {
      it('should update multiple embeddings successfully', async () => {
        const docs = await KnowledgeDocument.find({});
        expect(docs).toHaveLength(3);

        const updates = docs.map(doc => ({
          documentId: doc._id.toString(),
          embedding: EmbeddingUtils.generateRandomEmbedding(),
        }));

        await expect(
          VectorSearchService.batchUpdateEmbeddings(updates)
        ).resolves.not.toThrow();

        // Verify embeddings were updated
        const updatedDocs = await KnowledgeDocument.find({});
        updatedDocs.forEach((doc, index) => {
          expect(doc.embedding).toEqual(updates[index].embedding);
        });
      });
    });

    describe('removeEmbeddings', () => {
      it('should remove embeddings from all documents', async () => {
        await VectorSearchService.removeEmbeddings();

        const docs = await KnowledgeDocument.find({});
        docs.forEach(doc => {
          expect(doc.embedding).toBeUndefined();
        });
      });

      it('should remove embeddings with filter', async () => {
        await VectorSearchService.removeEmbeddings({ category: 'investment' });

        const investmentDoc = await KnowledgeDocument.findOne({
          category: 'investment',
        });
        const budgetingDoc = await KnowledgeDocument.findOne({
          category: 'budgeting',
        });

        expect(investmentDoc?.embedding).toBeUndefined();
        expect(budgetingDoc?.embedding).toBeDefined();
      });
    });

    // Note: The following tests would require MongoDB Atlas with Vector Search enabled
    // They are included for completeness but may be skipped in local testing
    describe('Vector Search Operations (requires Atlas)', () => {
      it.skip('should perform semantic search', async () => {
        const queryVector = EmbeddingUtils.generateRandomEmbedding();

        const results = await VectorSearchService.semanticSearch({
          queryVector,
          numCandidates: 10,
          limit: 5,
        });

        expect(Array.isArray(results)).toBe(true);
        expect(results.length).toBeLessThanOrEqual(5);

        results.forEach(result => {
          expect(result.document).toBeDefined();
          expect(result.score).toBeGreaterThanOrEqual(0);
          expect(result.score).toBeLessThanOrEqual(1);
        });
      });

      it.skip('should perform semantic search with filters', async () => {
        const queryVector = EmbeddingUtils.generateRandomEmbedding();

        const results = await VectorSearchService.semanticSearch({
          queryVector,
          numCandidates: 10,
          limit: 5,
          filter: {
            category: 'investment',
            language: 'pt-BR',
          },
        });

        expect(Array.isArray(results)).toBe(true);
        results.forEach(result => {
          expect(result.document.category).toBe('investment');
          expect(result.document.metadata.language).toBe('pt-BR');
        });
      });

      it.skip('should perform hybrid search', async () => {
        const queryVector = EmbeddingUtils.generateRandomEmbedding();

        const results = await VectorSearchService.hybridSearch({
          textQuery: 'investment strategies',
          queryVector,
          textWeight: 0.3,
          vectorWeight: 0.7,
          limit: 5,
        });

        expect(Array.isArray(results)).toBe(true);
        expect(results.length).toBeLessThanOrEqual(5);

        results.forEach(result => {
          expect(result.document).toBeDefined();
          expect(result.score).toBeGreaterThanOrEqual(0);
        });
      });

      it.skip('should find similar documents', async () => {
        const doc = await KnowledgeDocument.findOne({
          title: 'Investment Basics',
        });
        expect(doc).toBeDefined();

        const results = await VectorSearchService.findSimilarDocuments(
          doc!._id.toString(),
          5,
          true
        );

        expect(Array.isArray(results)).toBe(true);
        expect(results.length).toBeLessThanOrEqual(5);

        // Should not include the original document
        results.forEach(result => {
          expect(result.document._id.toString()).not.toBe(doc!._id.toString());
        });
      });
    });
  });
});
