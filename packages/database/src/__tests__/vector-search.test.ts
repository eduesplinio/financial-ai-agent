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

    // Limpar todos os dados antes de iniciar os testes
    await KnowledgeDocument.deleteMany({});

    // Clean up collections before tests
    if ((global as any).clearAllCollections) {
      await (global as any).clearAllCollections();
    }

    try {
      // Criar exatamente 3 documentos de teste - quantidade esperada nos testes
      const testDocs = [
        {
          title: 'Investment Basics',
          content: 'Learn about investment strategies for beginners',
          category: 'investment',
          source: 'test-source-investment',
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
          source: 'test-source-budget',
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
          source: 'test-source-taxes',
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

      // Verificar quantos documentos foram inseridos
      const count = await KnowledgeDocument.countDocuments();
      console.log(`✅ ${count} documentos de teste criados com sucesso`);
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
        expect(vectorField?.type).toBe('vector');
        expect(vectorField?.path).toBe('embedding');
        expect(vectorField?.numDimensions).toBe(1536);
        expect(vectorField?.similarity).toBe('cosine');
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
        // Limpar todos os documentos primeiro
        await KnowledgeDocument.deleteMany({});

        // Criar exatamente 3 documentos de teste com dados conhecidos
        const testDocs = [
          {
            title: 'Test Doc 1',
            content: 'Content 1',
            category: 'investment',
            source: 'test-source-1',
            metadata: {
              language: 'pt-BR',
              lastUpdated: new Date(),
            },
            embedding: EmbeddingUtils.generateRandomEmbedding(),
          },
          {
            title: 'Test Doc 2',
            content: 'Content 2',
            category: 'budgeting',
            source: 'test-source-2',
            metadata: {
              language: 'pt-BR',
              lastUpdated: new Date(),
            },
            embedding: EmbeddingUtils.generateRandomEmbedding(),
          },
          {
            title: 'Test Doc 3',
            content: 'Content 3',
            category: 'taxes',
            source: 'test-source-3',
            metadata: {
              language: 'pt-BR',
              lastUpdated: new Date(),
            },
            embedding: EmbeddingUtils.generateRandomEmbedding(),
          },
        ];

        await KnowledgeDocument.insertMany(testDocs);

        // Verificar contagem correta
        const count = await KnowledgeDocument.countDocuments();
        expect(count).toBe(3);

        // Obter estatísticas
        const stats = await VectorSearchService.getVectorSearchStats();

        // Verificar estatísticas
        expect(stats.totalDocuments).toBe(3);
        expect(stats.documentsWithEmbeddings).toBe(3);
        expect(stats.averageEmbeddingDimensions).toBe(1536);

        // Verificar contagens de categorias
        expect(Object.keys(stats.categoriesCount).length).toBe(3);
        expect(stats.categoriesCount).toHaveProperty('investment');
        expect(stats.categoriesCount).toHaveProperty('budgeting');
        expect(stats.categoriesCount).toHaveProperty('taxes');

        // Verificar contagens de idiomas
        expect(Object.keys(stats.languagesCount).length).toBe(1);
        expect(stats.languagesCount).toHaveProperty('pt-BR');
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
        // Criar novo documento para o teste
        const testDoc = new KnowledgeDocument({
          title: 'Test Document for Update',
          content: 'Content for testing embedding update',
          category: 'investment',
          source: 'test-source-update',
          metadata: {
            language: 'pt-BR',
            relevanceScore: 0.9,
            lastUpdated: new Date(),
          },
        });

        const savedDoc = await testDoc.save();
        const docId = savedDoc._id ? savedDoc._id.toString() : '';
        expect(docId).toBeDefined();

        const newEmbedding = EmbeddingUtils.generateRandomEmbedding();
        const updatedDoc = await VectorSearchService.updateDocumentEmbedding(
          docId,
          newEmbedding
        );

        expect(updatedDoc).toBeDefined();

        // Buscar o documento atualizado diretamente do banco para confirmar
        const retrievedDoc = await KnowledgeDocument.findById(docId);
        expect(retrievedDoc).toBeDefined();
        expect(retrievedDoc?.embedding).toEqual(newEmbedding);

        it('should reject embedding with wrong dimensions', async () => {
          // Criar novo documento para o teste
          const testDoc = new KnowledgeDocument({
            title: 'Test Document for Invalid Embedding',
            content: 'Content for testing invalid embedding',
            category: 'investment',
            source: 'test-source-invalid',
            metadata: {
              language: 'pt-BR',
              relevanceScore: 0.9,
              lastUpdated: new Date(),
            },
          });

          await testDoc.save();
          expect(testDoc._id).toBeDefined();

          const invalidEmbedding = Array.from({ length: 512 }, () =>
            Math.random()
          );

          await expect(
            VectorSearchService.updateDocumentEmbedding(
              testDoc._id ? testDoc._id.toString() : '',
              invalidEmbedding
            )
          ).rejects.toThrow('Embedding must have 1536 dimensions');
        });
      });

      describe('batchUpdateEmbeddings', () => {
        it('should update multiple embeddings successfully', async () => {
          // Criar documentos para o teste
          const docsToCreate = [
            {
              title: 'Batch Test Document 1',
              content: 'Content for batch test 1',
              category: 'investment',
              source: 'test-source-batch-1',
              metadata: {
                language: 'pt-BR',
                relevanceScore: 0.9,
                lastUpdated: new Date(),
              },
            },
            {
              title: 'Batch Test Document 2',
              content: 'Content for batch test 2',
              category: 'budgeting',
              source: 'test-source-batch-2',
              metadata: {
                language: 'pt-BR',
                relevanceScore: 0.8,
                lastUpdated: new Date(),
              },
            },
            {
              title: 'Batch Test Document 3',
              content: 'Content for batch test 3',
              category: 'taxes',
              source: 'test-source-batch-3',
              metadata: {
                language: 'pt-BR',
                relevanceScore: 0.7,
                lastUpdated: new Date(),
              },
            },
          ];

          const createdDocs = await KnowledgeDocument.insertMany(docsToCreate);
          expect(createdDocs).toHaveLength(3);

          // Update embeddings
          const updates = createdDocs.map((doc: any) => ({
            documentId: doc._id ? doc._id.toString() : '',
            embedding: EmbeddingUtils.generateRandomEmbedding(),
          }));

          const results =
            await VectorSearchService.batchUpdateEmbeddings(updates);
          expect(results).toHaveLength(createdDocs.length);

          // Verify embeddings were updated
          for (let i = 0; i < updates.length; i++) {
            const doc = await KnowledgeDocument.findById(
              updates[i]?.documentId
            );
            expect(doc?.embedding).toEqual(updates[i]?.embedding);
          }
        });
      });

      describe('batchUpdateEmbeddings', () => {
        it('should update multiple embeddings successfully', async () => {
          const docs = await KnowledgeDocument.find({});
          expect(docs).toHaveLength(3);

          const updates = docs.map((doc: any) => ({
            documentId: doc._id ? doc._id.toString() : '',
            embedding: EmbeddingUtils.generateRandomEmbedding(),
          }));

          await expect(
            VectorSearchService.batchUpdateEmbeddings(updates)
          ).resolves.not.toThrow();

          // Verify embeddings were updated
          const updatedDocs = await KnowledgeDocument.find({});
          updatedDocs.forEach((doc, index) => {
            expect(doc?.embedding).toEqual(updates[index]?.embedding);
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

        it('should remove embeddings with filter and keep others', async () => {
          // Primeiro, garantir que todos os documentos têm embedding
          const allDocs = await KnowledgeDocument.find({});
          for (const doc of allDocs) {
            doc.embedding = EmbeddingUtils.generateRandomEmbedding();
            await doc.save();
          }

          // Remover embeddings apenas da categoria 'investment'
          await VectorSearchService.removeEmbeddings({
            category: 'investment',
          });

          // Verificar se os embeddings foram removidos apenas dos documentos filtrados
          const investmentDoc = await KnowledgeDocument.findOne({
            category: 'investment',
          });

          // Esse documento não deve ter embedding
          expect(investmentDoc).toBeDefined();
          expect(investmentDoc?.embedding).toBeUndefined();

          // Verificar que outros documentos mantiveram seus embeddings
          const otherDocs = await KnowledgeDocument.find({
            category: { $ne: 'investment' },
          });

          expect(otherDocs.length).toBeGreaterThan(0);
          for (const doc of otherDocs) {
            expect(doc.embedding).toBeDefined();
          }
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
            doc && doc._id ? doc._id.toString() : '',
            5,
            true
          );

          expect(Array.isArray(results)).toBe(true);
          expect(results.length).toBeLessThanOrEqual(5);

          // Should not include the original document
          results.forEach(result => {
            expect(result.document._id.toString()).not.toBe(
              doc && doc._id ? doc._id.toString() : ''
            );
          });
        });
      });
    });
  });
});
