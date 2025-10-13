import mongoose from 'mongoose';
import { z } from 'zod';
import { KnowledgeDocument, IKnowledgeDocument } from './models';

// =============================================================================
// VECTOR SEARCH CONFIGURATION
// =============================================================================

// Vector search index configuration for MongoDB Atlas
export const VECTOR_SEARCH_INDEX_CONFIG = {
  name: 'knowledge_vector_index',
  type: 'vectorSearch',
  definition: {
    fields: [
      {
        type: 'vector',
        path: 'embedding',
        numDimensions: 1536, // OpenAI embeddings dimension
        similarity: 'cosine',
      },
      {
        type: 'filter',
        path: 'category',
      },
      {
        type: 'filter',
        path: 'metadata.language',
      },
      {
        type: 'filter',
        path: 'metadata.tags',
      },
    ],
  },
};

// =============================================================================
// VALIDATION SCHEMAS
// =============================================================================

export const VectorSearchQuerySchema = z.object({
  queryVector: z
    .array(z.number())
    .length(1536, 'Query vector must have 1536 dimensions'),
  numCandidates: z.number().min(1).max(1000).default(100),
  limit: z.number().min(1).max(100).default(10),
  filter: z
    .object({
      category: z.string().optional(),
      language: z.string().optional(),
      tags: z.array(z.string()).optional(),
      relevanceScore: z
        .object({
          $gte: z.number().min(0).max(1).optional(),
          $lte: z.number().min(0).max(1).optional(),
        })
        .optional(),
    })
    .optional(),
  minScore: z.number().min(0).max(1).optional(),
});

export const HybridSearchQuerySchema = z.object({
  textQuery: z.string().min(1),
  queryVector: z.array(z.number()).length(1536),
  textWeight: z.number().min(0).max(1).default(0.3),
  vectorWeight: z.number().min(0).max(1).default(0.7),
  limit: z.number().min(1).max(100).default(10),
  filter: VectorSearchQuerySchema.shape.filter.optional(),
});

export const SimilaritySearchResultSchema = z.object({
  document: z.any(), // IKnowledgeDocument
  score: z.number().min(0).max(1),
  vectorScore: z.number().min(0).max(1).optional(),
  textScore: z.number().min(0).max(1).optional(),
});

// =============================================================================
// TYPES
// =============================================================================

export type VectorSearchQuery = z.infer<typeof VectorSearchQuerySchema>;
export type HybridSearchQuery = z.infer<typeof HybridSearchQuerySchema>;
export type SimilaritySearchResult = z.infer<
  typeof SimilaritySearchResultSchema
>;

export interface VectorSearchStats {
  totalDocuments: number;
  documentsWithEmbeddings: number;
  averageEmbeddingDimensions: number;
  categoriesCount: Record<string, number>;
  languagesCount: Record<string, number>;
}

// =============================================================================
// VECTOR SEARCH SERVICE
// =============================================================================

export class VectorSearchService {
  /**
   * Ensure database connection is established
   * @private
   */
  private static async ensureConnection(): Promise<void> {
    const { mongoConnection } = await import('./connection');

    if (!mongoConnection.isConnected()) {
      console.log('⚠️ Database not connected, connecting now...');
      await mongoConnection.connect();
    }
  }

  /**
   * Create vector search index in MongoDB Atlas
   * This should be run once during setup or when index configuration changes
   */
  static async createVectorSearchIndex(): Promise<void> {
    try {
      const db = mongoose.connection.db;
      if (!db) {
        throw new Error('Database connection not established');
      }
      const collection = db.collection('knowledgedocuments');

      // Check if index already exists
      const indexes = await collection.listSearchIndexes().toArray();
      const existingIndex = indexes.find(
        idx => idx.name === VECTOR_SEARCH_INDEX_CONFIG.name
      );

      if (existingIndex) {
        console.log('✅ Vector search index already exists');
        return;
      }

      // Create the vector search index
      await collection.createSearchIndex(VECTOR_SEARCH_INDEX_CONFIG);

      console.log('✅ Vector search index created successfully');
      console.log(
        '⚠️  Note: Index creation may take a few minutes to complete in MongoDB Atlas'
      );
    } catch (error) {
      console.error('❌ Failed to create vector search index:', error);
      throw error;
    }
  }

  /**
   * Perform semantic similarity search using vector embeddings
   */
  static async semanticSearch(
    query: VectorSearchQuery
  ): Promise<SimilaritySearchResult[]> {
    try {
      // Ensure database connection before querying
      await this.ensureConnection();

      // Garantir que numCandidates tenha um valor padrão se não for fornecido
      const queryWithDefaults = {
        ...query,
        numCandidates: query.numCandidates || query.limit * 2,
      };

      const validatedQuery = VectorSearchQuerySchema.parse(queryWithDefaults);

      const pipeline: any[] = [
        {
          $vectorSearch: {
            index: VECTOR_SEARCH_INDEX_CONFIG.name,
            path: 'embedding',
            queryVector: validatedQuery.queryVector,
            numCandidates: validatedQuery.numCandidates,
            limit: validatedQuery.limit,
            ...(validatedQuery.filter && {
              filter: this.buildFilterQuery(validatedQuery.filter),
            }),
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            content: 1,
            source: 1,
            category: 1,
            metadata: 1,
            createdAt: 1,
            updatedAt: 1,
            score: { $meta: 'vectorSearchScore' },
          },
        },
      ];

      // Apply minimum score filter if specified
      if (validatedQuery.minScore) {
        pipeline.push({
          $match: {
            score: { $gte: validatedQuery.minScore },
          },
        });
      }

      const results = await KnowledgeDocument.aggregate(pipeline);

      return results.map(result => ({
        document: result,
        score: result.score,
        vectorScore: result.score,
      }));
    } catch (error) {
      console.error('❌ Semantic search failed:', error);
      throw error;
    }
  }

  /**
   * Perform hybrid search combining text and vector search
   */
  static async hybridSearch(
    query: HybridSearchQuery
  ): Promise<SimilaritySearchResult[]> {
    try {
      const validatedQuery = HybridSearchQuerySchema.parse(query);

      // Perform vector search
      const vectorResults = await this.semanticSearch({
        queryVector: validatedQuery.queryVector,
        numCandidates: validatedQuery.limit * 4, // Use more candidates for better results
        limit: validatedQuery.limit * 2, // Get more candidates for reranking
        filter: validatedQuery.filter,
      });

      // Perform text search
      const textResults = await this.textSearch(
        validatedQuery.textQuery,
        validatedQuery.limit * 2,
        validatedQuery.filter
      );

      // Combine and rerank results
      const combinedResults = this.combineSearchResults(
        vectorResults,
        textResults,
        validatedQuery.vectorWeight,
        validatedQuery.textWeight
      );

      // Return top results
      return combinedResults.slice(0, validatedQuery.limit);
    } catch (error) {
      console.error('❌ Hybrid search failed:', error);
      throw error;
    }
  }

  /**
   * Find similar documents to a given document
   */
  static async findSimilarDocuments(
    documentId: string,
    limit: number = 10,
    excludeSelf: boolean = true
  ): Promise<SimilaritySearchResult[]> {
    try {
      const document = await KnowledgeDocument.findById(documentId);

      if (!document || !document.embedding) {
        throw new Error('Document not found or has no embedding');
      }

      const results = await this.semanticSearch({
        queryVector: document.embedding,
        numCandidates: (excludeSelf ? limit + 1 : limit) * 2,
        limit: excludeSelf ? limit + 1 : limit,
      });

      // Exclude the original document if requested
      if (excludeSelf) {
        return results.filter(
          result => result.document._id.toString() !== documentId
        );
      }

      return results;
    } catch (error) {
      console.error('❌ Find similar documents failed:', error);
      throw error;
    }
  }

  /**
   * Get vector search statistics
   */
  static async getVectorSearchStats(): Promise<VectorSearchStats> {
    try {
      // Abordagem mais simples e direta para obter contagens exatas
      const totalDocuments = await KnowledgeDocument.countDocuments();

      const documentsWithEmbeddingsCount =
        await KnowledgeDocument.countDocuments({
          embedding: { $exists: true, $ne: null },
        });

      // Consulta para categorias e idiomas
      const categoryCounts = await KnowledgeDocument.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]);

      const languageCounts = await KnowledgeDocument.aggregate([
        { $group: { _id: '$metadata.language', count: { $sum: 1 } } },
      ]);

      // Consulta para obter a média de dimensões de embedding
      const embeddingDimensions = await KnowledgeDocument.aggregate([
        {
          $match: {
            embedding: { $exists: true, $ne: null },
          },
        },
        {
          $project: {
            dimensions: { $size: '$embedding' },
          },
        },
      ]);

      // Converter resultados em formato esperado
      const categoriesCount: Record<string, number> = {};
      categoryCounts.forEach((item: any) => {
        if (item._id) {
          categoriesCount[item._id] = item.count;
        }
      });

      // Converter contagens de idioma
      const languagesCount: Record<string, number> = {};
      languageCounts.forEach((item: any) => {
        if (item._id) {
          languagesCount[item._id] = item.count;
        }
      });

      // Calcular média de dimensões
      const totalDimensions = embeddingDimensions.reduce(
        (sum: number, item: any) => sum + (item.dimensions || 0),
        0
      );

      const averageEmbeddingDimensions =
        embeddingDimensions.length > 0
          ? totalDimensions / embeddingDimensions.length
          : 0;

      return {
        totalDocuments,
        documentsWithEmbeddings: documentsWithEmbeddingsCount,
        averageEmbeddingDimensions,
        categoriesCount,
        languagesCount,
      };
    } catch (error) {
      console.error('❌ Failed to get vector search stats:', error);
      throw error;
    }
  }

  /**
   * Update document embedding
   */
  static async updateDocumentEmbedding(
    documentId: string,
    embedding: number[]
  ): Promise<IKnowledgeDocument> {
    try {
      if (!documentId) {
        throw new Error('Document ID is required');
      }

      if (!embedding || !Array.isArray(embedding)) {
        throw new Error('Embedding must be an array');
      }

      if (embedding.length !== 1536) {
        throw new Error('Embedding must have 1536 dimensions');
      }

      const updatedDoc = await KnowledgeDocument.findByIdAndUpdate(
        documentId,
        { $set: { embedding } },
        { new: true, runValidators: true }
      );

      if (!updatedDoc) {
        throw new Error(`Document with ID ${documentId} not found`);
      }

      return updatedDoc;
    } catch (error) {
      console.error('❌ Failed to update document embedding:', error);
      throw error;
    }
  }

  /**
   * Batch update embeddings for multiple documents
   */
  static async batchUpdateEmbeddings(
    updates: Array<{ documentId: string; embedding: number[] }>
  ): Promise<IKnowledgeDocument[]> {
    try {
      // Verificar todas as dimensões de embedding primeiro
      for (const update of updates) {
        if (update.embedding.length !== 1536) {
          throw new Error(
            `Embedding for document ${update.documentId} must have 1536 dimensions`
          );
        }
      }

      // Atualizar documentos individualmente para poder retornar os resultados
      const updatedDocs: IKnowledgeDocument[] = [];

      for (const update of updates) {
        const doc = await KnowledgeDocument.findByIdAndUpdate(
          update.documentId,
          { $set: { embedding: update.embedding } },
          { new: true, runValidators: true }
        );

        if (doc) {
          updatedDocs.push(doc);
        }
      }

      console.log(`✅ Updated embeddings for ${updates.length} documents`);
      return updatedDocs;
    } catch (error) {
      console.error('❌ Batch update embeddings failed:', error);
      throw error;
    }
  }

  /**
   * Remove embeddings from documents (useful for testing or cleanup)
   *
   * @param filter - Filtro MongoDB para selecionar documentos
   * @param keepEmbeddingsWhere - Opcional: filtro para documentos que devem manter embeddings
   */
  static async removeEmbeddings(
    filter: any = {},
    keepEmbeddingsWhere?: any
  ): Promise<void> {
    try {
      let finalFilter = { ...filter };

      // Se houver um filtro para manter embeddings, excluir esses documentos
      if (keepEmbeddingsWhere) {
        finalFilter = {
          ...filter,
          $nor: [keepEmbeddingsWhere],
        };
      }

      const result = await KnowledgeDocument.updateMany(finalFilter, {
        $unset: { embedding: 1 },
      });

      console.log(
        `✅ Removed embeddings from ${result.modifiedCount} documents`
      );
    } catch (error) {
      console.error('❌ Failed to remove embeddings:', error);
      throw error;
    }
  }

  // =============================================================================
  // PRIVATE HELPER METHODS
  // =============================================================================

  /**
   * Build MongoDB filter query from search filters
   */
  private static buildFilterQuery(filter: VectorSearchQuery['filter']): any {
    const mongoFilter: any = {};

    if (filter?.category) {
      mongoFilter.category = filter.category;
    }

    if (filter?.language) {
      mongoFilter['metadata.language'] = filter.language;
    }

    if (filter?.tags && filter.tags.length > 0) {
      mongoFilter['metadata.tags'] = { $in: filter.tags };
    }

    if (filter?.relevanceScore) {
      mongoFilter['metadata.relevanceScore'] = filter.relevanceScore;
    }

    return mongoFilter;
  }

  /**
   * Perform text search using MongoDB text index
   */
  private static async textSearch(
    query: string,
    limit: number,
    filter?: VectorSearchQuery['filter']
  ): Promise<SimilaritySearchResult[]> {
    const searchQuery: any = { $text: { $search: query } };

    if (filter) {
      Object.assign(searchQuery, this.buildFilterQuery(filter));
    }

    const results = await KnowledgeDocument.find(searchQuery, {
      score: { $meta: 'textScore' },
    })
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit);

    return results.map(doc => ({
      document: doc.toObject(),
      score: (doc as any).score || 0,
      textScore: (doc as any).score || 0,
    }));
  }

  /**
   * Combine vector and text search results with weighted scoring
   */
  private static combineSearchResults(
    vectorResults: SimilaritySearchResult[],
    textResults: SimilaritySearchResult[],
    vectorWeight: number,
    textWeight: number
  ): SimilaritySearchResult[] {
    const combinedMap = new Map<string, SimilaritySearchResult>();

    // Add vector results
    vectorResults.forEach(result => {
      const id = result.document._id.toString();
      combinedMap.set(id, {
        ...result,
        score: (result.vectorScore || result.score) * vectorWeight,
      });
    });

    // Add or merge text results
    textResults.forEach(result => {
      const id = result.document._id.toString();
      const existing = combinedMap.get(id);

      if (existing) {
        // Combine scores
        existing.score += (result.textScore || result.score) * textWeight;
        existing.textScore = result.textScore || result.score;
      } else {
        combinedMap.set(id, {
          ...result,
          score: (result.textScore || result.score) * textWeight,
        });
      }
    });

    // Sort by combined score and return
    return Array.from(combinedMap.values()).sort((a, b) => b.score - a.score);
  }
}

// =============================================================================
// EMBEDDING UTILITIES
// =============================================================================

/**
 * Utility class for embedding operations
 */
export class EmbeddingUtils {
  /**
   * Validate embedding vector
   */
  static validateEmbedding(embedding: number[]): boolean {
    return (
      Array.isArray(embedding) &&
      embedding.length === 1536 &&
      embedding.every(val => typeof val === 'number' && !isNaN(val))
    );
  }

  /**
   * Calculate cosine similarity between two embeddings
   */
  static cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Embeddings must have the same length');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      // Garantir que os índices são números válidos
      const valA = a[i] ?? 0;
      const valB = b[i] ?? 0;

      dotProduct += valA * valB;
      normA += valA * valA;
      normB += valB * valB;
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (normA * normB);
  }

  /**
   * Calculate Euclidean distance between two embeddings
   */
  static euclideanDistance(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Embeddings must have the same length');
    }

    let sum = 0;
    for (let i = 0; i < a.length; i++) {
      // Garantir que os índices são números válidos
      const valA = a[i] ?? 0;
      const valB = b[i] ?? 0;
      const diff = valA - valB;
      sum += diff * diff;
    }

    return Math.sqrt(sum);
  }

  /**
   * Normalize embedding vector
   */
  static normalizeEmbedding(embedding: number[]): number[] {
    const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));

    if (norm === 0) {
      return embedding;
    }

    return embedding.map(val => val / norm);
  }

  /**
   * Generate random embedding for testing purposes
   */
  static generateRandomEmbedding(dimensions: number = 1536): number[] {
    const embedding = Array.from(
      { length: dimensions },
      () => Math.random() * 2 - 1
    );
    return this.normalizeEmbedding(embedding);
  }
}

// =============================================================================
// EXPORTS
// =============================================================================

// Exportar como default para manter compatibilidade com importações existentes
export default VectorSearchService;
