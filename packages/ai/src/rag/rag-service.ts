// RAG (Retrieval Augmented Generation) implementation
import {
  EmbeddingProvider,
  OpenAIEmbeddingProvider,
} from './embedding-generator';
import {
  KnowledgeDocument,
  UserProfile,
  MessageRole,
} from '@/shared/src/types';
import { chunkFinancialDocument, DocumentChunk } from './chunking';
import { LLMService } from '../llm/llm-service';

export interface SearchFilters {
  categories?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  sources?: string[];
}

// Extended filters for transaction search
export interface TransactionSearchFilters extends SearchFilters {
  amountRange?: { min?: number; max?: number };
  accountIds?: string[];
  transactionSources?: ('open_finance' | 'manual' | 'csv_import')[];
}

export interface RelevantDocument {
  document: KnowledgeDocument;
  score: number;
}

// Transaction search result interface
export interface RelevantTransaction {
  transaction: any; // ITransaction from database package
  score: number;
  relevanceFactors: {
    semantic: number;
    category?: boolean;
    amount?: boolean;
    date?: boolean;
  };
}

export interface RAGResponse {
  content: string;
  sources: {
    id: string;
    title: string;
    source: string;
    relevance: number;
  }[];
  confidence: number;
  hasSufficientContext: boolean;
}

export interface IndexResult {
  documentId: string;
  chunkCount: number;
  success: boolean;
  metrics?: {
    coverage: number;
    avgChunkSize: number;
  };
}

export interface UpdateResult {
  addedCount: number;
  updatedCount: number;
  deletedCount: number;
  success: boolean;
}

export class RAGService {
  private embeddingProvider: EmbeddingProvider;
  private llmService: LLMService;
  private vectorDb: any; // This would be replaced with actual vector DB client

  constructor(apiKey?: string, llmService?: LLMService, vectorDb?: any) {
    this.embeddingProvider = new OpenAIEmbeddingProvider(
      apiKey || process.env.OPENAI_API_KEY!
    );
    this.llmService = llmService || new LLMService(process.env.OPENAI_API_KEY!); // Default LLM service
    this.vectorDb = vectorDb;
  }

  /**
   * Search transactions using semantic similarity
   *
   * @param query User query string
   * @param userId User ID for security filtering
   * @param filters Optional filters for transactions
   * @returns Array of relevant transactions with scores
   */
  async searchTransactions(
    query: string,
    userId: string,
    filters?: TransactionSearchFilters
  ): Promise<RelevantTransaction[]> {
    try {
      // Dynamic import to avoid circular dependencies
      const { TransactionVectorSearchService } = await import(
        '../../../database/src/transaction-vector-search'
      );

      // Build search query
      const searchQuery = {
        queryText: query,
        userId: userId,
        limit: 10000, // Very high limit to ensure we get all relevant transactions
        filters: filters
          ? {
              dateRange: filters.dateRange,
              amountRange: filters.amountRange,
              categories: filters.categories,
              accountIds: filters.accountIds,
            }
          : undefined,
      };

      // Execute search using TransactionVectorSearchService
      const results =
        await TransactionVectorSearchService.searchTransactions(searchQuery);

      // Convert to RelevantTransaction format
      return results.map(result => ({
        transaction: result.transaction,
        score: result.score,
        relevanceFactors: {
          semantic: result.relevanceFactors.semantic,
          category: result.relevanceFactors.category ?? false,
          amount: result.relevanceFactors.amount ?? false,
          date: result.relevanceFactors.date ?? false,
        },
      }));
    } catch (error) {
      console.error('❌ Transaction search failed:', error);
      // Return empty array instead of throwing to maintain service stability
      return [];
    }
  }

  /**
   * Analyze spending patterns using vector search
   *
   * @param query Natural language query about spending patterns
   * @param userId User ID for security filtering
   * @param timeframe Optional time range for analysis
   * @returns Spending analysis with transactions and summary
   */
  async analyzeSpendingPatterns(
    query: string,
    userId: string,
    timeframe?: { start: Date; end: Date }
  ): Promise<{
    transactions: RelevantTransaction[];
    summary: {
      totalAmount: number;
      transactionCount: number;
      averageAmount: number;
      categories: Record<string, number>;
    };
    insights: string[];
  }> {
    try {
      // Dynamic import
      const { TransactionVectorSearchService } = await import(
        '../../../database/src/transaction-vector-search'
      );

      // Get spending insights
      const insights = await TransactionVectorSearchService.getSpendingInsights(
        userId,
        query,
        timeframe
      );

      // Convert transactions to RelevantTransaction format
      const transactions = insights.transactions.map(result => ({
        transaction: result.transaction,
        score: result.score,
        relevanceFactors: {
          semantic: result.relevanceFactors.semantic,
          category: result.relevanceFactors.category ?? false,
          amount: result.relevanceFactors.amount ?? false,
          date: result.relevanceFactors.date ?? false,
        },
      }));

      // Generate insights based on the data
      const generatedInsights = this.generateSpendingInsights(
        insights.summary,
        query
      );

      return {
        transactions,
        summary: insights.summary,
        insights: generatedInsights,
      };
    } catch (error) {
      console.error('❌ Spending pattern analysis failed:', error);
      return {
        transactions: [],
        summary: {
          totalAmount: 0,
          transactionCount: 0,
          averageAmount: 0,
          categories: {},
        },
        insights: [
          'Não foi possível analisar os padrões de gastos no momento.',
        ],
      };
    }
  }

  /**
   * Get transaction insights for conversational AI
   *
   * @param query User question about their transactions
   * @param userId User ID for security filtering
   * @returns Formatted insights ready for AI response
   */
  async getTransactionInsights(
    query: string,
    userId: string
  ): Promise<{
    transactions: RelevantTransaction[];
    contextualResponse: string;
    confidence: number;
  }> {
    try {
      // Search for relevant transactions
      const transactions = await this.searchTransactions(query, userId);

      if (transactions.length === 0) {
        return {
          transactions: [],
          contextualResponse:
            'Não encontrei transações relacionadas à sua consulta.',
          confidence: 0,
        };
      }

      // Generate contextual response based on transactions found
      const contextualResponse = this.generateContextualResponse(
        transactions,
        query
      );

      // Calculate confidence based on scores and number of results
      const avgScore =
        transactions.reduce((sum, t) => sum + t.score, 0) / transactions.length;
      const confidence = Math.min(avgScore * (transactions.length / 10), 1);

      return {
        transactions,
        contextualResponse,
        confidence,
      };
    } catch (error) {
      console.error('❌ Transaction insights failed:', error);
      return {
        transactions: [],
        contextualResponse:
          'Ocorreu um erro ao buscar informações sobre suas transações.',
        confidence: 0,
      };
    }
  }

  /**
   * Hybrid search combining knowledge documents and transactions
   *
   * @param query User query
   * @param userId User ID for transaction filtering
   * @param options Search options
   * @returns Combined results from documents and transactions
   */
  async hybridFinancialSearch(
    query: string,
    userId: string,
    options?: {
      includeDocuments?: boolean;
      includeTransactions?: boolean;
      documentLimit?: number;
      transactionLimit?: number;
    }
  ): Promise<{
    documents: RelevantDocument[];
    transactions: RelevantTransaction[];
    combinedInsights: string;
  }> {
    try {
      const opts = {
        includeDocuments: true,
        includeTransactions: true,
        documentLimit: 5,
        transactionLimit: 10,
        ...options,
      };

      // Search documents and transactions in parallel
      const [documents, transactions] = await Promise.all([
        opts.includeDocuments
          ? this.semanticSearch(query, { categories: [] }).then(results =>
              results.slice(0, opts.documentLimit)
            )
          : Promise.resolve([]),
        opts.includeTransactions
          ? this.searchTransactions(query, userId).then(results =>
              results.slice(0, opts.transactionLimit)
            )
          : Promise.resolve([]),
      ]);

      // Generate combined insights
      const combinedInsights = this.generateCombinedInsights(
        documents,
        transactions,
        query
      );

      return {
        documents,
        transactions,
        combinedInsights,
      };
    } catch (error) {
      console.error('❌ Hybrid financial search failed:', error);
      return {
        documents: [],
        transactions: [],
        combinedInsights:
          'Não foi possível realizar a busca completa no momento.',
      };
    }
  }

  // =============================================================================
  // PRIVATE HELPER METHODS
  // =============================================================================

  /**
   * Generate spending insights based on summary data
   */
  private generateSpendingInsights(
    summary: {
      totalAmount: number;
      transactionCount: number;
      categories: Record<string, number>;
    },
    query: string
  ): string[] {
    const insights: string[] = [];

    if (summary.transactionCount === 0) {
      insights.push('Nenhuma transação encontrada para esta consulta.');
      return insights;
    }

    // Total amount insight
    insights.push(
      `Encontrei ${summary.transactionCount} transações totalizando R$ ${summary.totalAmount.toFixed(2)}.`
    );

    // Average amount insight
    const avgAmount = summary.totalAmount / summary.transactionCount;
    insights.push(`Valor médio por transação: R$ ${avgAmount.toFixed(2)}.`);

    // Category insights
    const categories = Object.entries(summary.categories)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    if (categories.length > 0) {
      const topCategory = categories[0];
      if (topCategory) {
        insights.push(
          `Categoria com maior gasto: ${topCategory[0]} (R$ ${topCategory[1].toFixed(2)}).`
        );
      }
    }

    return insights;
  }

  /**
   * Generate contextual response for transaction insights
   */
  private generateContextualResponse(
    transactions: RelevantTransaction[],
    query: string
  ): string {
    if (transactions.length === 0) {
      return 'Não encontrei transações relacionadas à sua consulta.';
    }

    const totalAmount = transactions.reduce(
      (sum, t) => sum + Math.abs(t.transaction.amount),
      0
    );
    const categories = new Set(
      transactions.map(t => t.transaction.category?.primary).filter(Boolean)
    );

    let response = `Encontrei ${transactions.length} transações relacionadas`;

    if (categories.size > 0) {
      response += ` nas categorias: ${Array.from(categories).join(', ')}`;
    }

    response += `. Total: R$ ${totalAmount.toFixed(2)}.`;

    // Add top transaction
    const topTransaction = transactions[0];
    if (topTransaction) {
      response += ` Transação mais relevante: "${topTransaction.transaction.description}" (R$ ${Math.abs(topTransaction.transaction.amount).toFixed(2)}).`;
    }

    return response;
  }

  /**
   * Generate combined insights from documents and transactions
   */
  private generateCombinedInsights(
    documents: RelevantDocument[],
    transactions: RelevantTransaction[],
    query: string
  ): string {
    const parts: string[] = [];

    if (transactions.length > 0) {
      const totalAmount = transactions.reduce(
        (sum, t) => sum + Math.abs(t.transaction.amount),
        0
      );
      parts.push(
        `Suas transações: ${transactions.length} encontradas, total de R$ ${totalAmount.toFixed(2)}`
      );
    }

    if (documents.length > 0) {
      parts.push(
        `Conhecimento disponível: ${documents.length} documentos relevantes sobre o tema`
      );
    }

    if (parts.length === 0) {
      return 'Não encontrei informações relevantes para sua consulta.';
    }

    return parts.join('. ') + '.';
  }

  /**
   * Search for documents semantically related to the query
   *
   * @param query User query string
   * @param filters Optional filters to narrow the search
   * @returns Array of relevant documents with scores
   */
  async semanticSearch(
    query: string,
    filters: SearchFilters
  ): Promise<RelevantDocument[]> {
    try {
      // Generate embedding for the query
      const queryEmbedding = await this.embeddingProvider.getEmbedding(query);

      // Use VectorSearchService to search in MongoDB
      const { VectorSearchService } = await import(
        '@financial-ai/database/src/vector-search'
      );

      const results = await VectorSearchService.semanticSearch({
        queryVector: queryEmbedding,
        numCandidates: 100,
        limit: 10,
      });

      return results.map(result => ({
        document: result.document,
        score: result.score,
      }));
    } catch (error) {
      console.error('❌ Semantic search failed:', error);
      // Return empty array instead of mock data
      return [];
    }
  }

  // OLD MOCK CODE REMOVED
  async semanticSearchOLD(
    query: string,
    filters: SearchFilters
  ): Promise<RelevantDocument[]> {
    try {
      // Generate embedding for the query
      const queryEmbedding = await this.embeddingProvider.getEmbedding(query);

      // Mock response for development - DEPRECATED
      const mockDocuments: RelevantDocument[] = [
        {
          document: {
            id: 'doc1',
            title: 'Investimentos em Renda Fixa',
            content:
              'Os investimentos em renda fixa são aqueles que possuem regras de remuneração definidas no momento da aplicação. Geralmente têm menor risco e volatilidade quando comparados à renda variável.',
            source: 'Banco Central do Brasil',
            category: 'investimentos',
            metadata: {
              url: 'https://www.bcb.gov.br/investimentos/renda-fixa',
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          score: 0.89,
        },
      ];
      return mockDocuments; // DEPRECATED - keeping for reference only
    } catch (error) {
      console.error('Error in semantic search OLD:', error);
      return [];
    }
  }

  /**
   * Index a document into the vector database
   *
   * @param document The document to index
   * @returns Indexing result information
   */
  async indexDocument(document: KnowledgeDocument): Promise<IndexResult> {
    try {
      // Step 1: Split document into chunks
      const chunks = chunkFinancialDocument(document.content);

      // Step 2: Generate embeddings for each chunk
      const embeddings = await Promise.all(
        chunks.map(async chunk => {
          try {
            return await this.embeddingProvider.getEmbedding(chunk.content);
          } catch (error) {
            console.error(
              `Error generating embedding for chunk ${chunk.id}:`,
              error
            );
            return undefined;
          }
        })
      );

      // Step 3: Calculate metrics
      const totalChunks = chunks.length;
      const validEmbeddings = embeddings.filter(e => Array.isArray(e)).length;
      const coverage = totalChunks > 0 ? validEmbeddings / totalChunks : 0;
      const avgChunkSize =
        chunks.reduce((acc, c) => acc + c.content.length, 0) / totalChunks;

      // Step 4: Store in vector DB (mock for now)
      // In real implementation, this would insert into MongoDB Atlas Vector Search or similar

      return {
        documentId: document.id,
        chunkCount: totalChunks,
        success: coverage > 0.8, // Success if at least 80% of chunks have embeddings
        metrics: {
          coverage,
          avgChunkSize,
        },
      };
    } catch (error) {
      console.error('Error indexing document:', error);
      return {
        documentId: document.id,
        chunkCount: 0,
        success: false,
      };
    }
  }

  /**
   * Update the knowledge base with new documents
   *
   * @param documents Documents to add or update
   * @returns Update operation results
   */
  async updateKnowledgeBase(
    documents: KnowledgeDocument[]
  ): Promise<UpdateResult> {
    try {
      let addedCount = 0;
      let updatedCount = 0;
      let failedCount = 0;

      for (const doc of documents) {
        // Check if document already exists (mock implementation)
        const isUpdate = doc.id.startsWith('existing_');

        const indexResult = await this.indexDocument(doc);

        if (indexResult.success) {
          isUpdate ? updatedCount++ : addedCount++;
        } else {
          failedCount++;
        }
      }

      return {
        addedCount,
        updatedCount,
        deletedCount: 0, // Not implementing deletion in this version
        success: failedCount === 0,
      };
    } catch (error) {
      console.error('Error updating knowledge base:', error);
      return {
        addedCount: 0,
        updatedCount: 0,
        deletedCount: 0,
        success: false,
      };
    }
  }
}
