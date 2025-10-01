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

  constructor(apiKey: string, llmService: LLMService, vectorDb?: any) {
    this.embeddingProvider = new OpenAIEmbeddingProvider(apiKey);
    this.llmService = llmService;
    this.vectorDb = vectorDb;
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

      // This is a placeholder implementation until vector DB is integrated
      // In a real implementation, this would call the vector DB search

      // Mock response for development
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
        {
          document: {
            id: 'doc2',
            title: 'Tesouro Direto - Títulos Públicos',
            content:
              'O Tesouro Direto é um programa de negociação de títulos públicos para pessoas físicas. É considerado um investimento de baixo risco, pois os títulos são garantidos pelo Tesouro Nacional.',
            source: 'Tesouro Nacional',
            category: 'investimentos',
            metadata: { url: 'https://www.tesourodireto.com.br/' },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          score: 0.78,
        },
        {
          document: {
            id: 'doc3',
            title: 'Perfis de Investidor',
            content:
              'Existem três perfis principais de investidor: conservador, moderado e arrojado. Cada perfil tem diferentes níveis de tolerância ao risco e objetivos de retorno.',
            source: 'CVM - Comissão de Valores Mobiliários',
            category: 'perfil-investidor',
            metadata: {
              url: 'https://www.investidor.gov.br/menu/Menu_Investidor/perfil_investidor/perfil_investidor.html',
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          score: 0.65,
        },
      ];

      // Apply filters if provided
      let filteredDocs = [...mockDocuments];

      if (filters.categories && filters.categories.length > 0) {
        filteredDocs = filteredDocs.filter(doc =>
          filters.categories?.includes(doc.document.category)
        );
      }

      if (filters.sources && filters.sources.length > 0) {
        filteredDocs = filteredDocs.filter(doc =>
          filters.sources?.includes(doc.document.source)
        );
      }

      if (filters.dateRange) {
        filteredDocs = filteredDocs.filter(doc => {
          const docDate = doc.document.createdAt;
          return (
            docDate >= filters.dateRange!.start &&
            docDate <= filters.dateRange!.end
          );
        });
      }

      return filteredDocs;
    } catch (error) {
      console.error('Error in semantic search:', error);
      throw new Error(`Semantic search failed: ${(error as Error).message}`);
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

  // =============================================================================
  // TRANSACTION SEARCH METHODS
  // =============================================================================

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
      // Dynamic import to avoid build issues
      const { TransactionVectorSearchService } = await import(
        '../../../database/src/transaction-vector-search'
      );

      // Convert RAG filters to TransactionVectorQuery format
      const transactionQuery = {
        queryText: query,
        userId: userId,
        limit: 10,
        filters: {
          dateRange: filters?.dateRange,
          amountRange: filters?.amountRange,
          categories: filters?.categories,
          accountIds: filters?.accountIds,
        },
      };

      // Use TransactionVectorSearchService to perform the search
      const results =
        await TransactionVectorSearchService.searchTransactions(
          transactionQuery
        );

      // Convert results to RelevantTransaction format
      return results.map(result => ({
        transaction: result.transaction,
        score: result.score,
        relevanceFactors: result.relevanceFactors,
      }));
    } catch (error) {
      console.error('Error in transaction search:', error);
      throw new Error(`Transaction search failed: ${(error as Error).message}`);
    }
  }

  /**
   * Analyze spending patterns using semantic search
   *
   * @param query User query describing spending pattern
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
      // Dynamic import to avoid build issues
      const { TransactionVectorSearchService } = await import(
        '../../../database/src/transaction-vector-search'
      );

      // Get spending insights using the vector search service
      const insights = await TransactionVectorSearchService.getSpendingInsights(
        userId,
        query,
        timeframe
      );

      // Convert transactions to RelevantTransaction format
      const relevantTransactions = insights.transactions.map(result => ({
        transaction: result.transaction,
        score: result.score,
        relevanceFactors: result.relevanceFactors,
      }));

      // Generate AI insights based on the data
      const aiInsights = this.generateSpendingInsights(insights.summary, query);

      return {
        transactions: relevantTransactions,
        summary: insights.summary,
        insights: aiInsights,
      };
    } catch (error) {
      console.error('Error in spending pattern analysis:', error);
      throw new Error(`Spending analysis failed: ${(error as Error).message}`);
    }
  }

  /**
   * Get transaction insights with natural language explanations
   *
   * @param query User query about their transactions
   * @param userId User ID for security filtering
   * @returns Insights with transactions and explanations
   */
  async getTransactionInsights(
    query: string,
    userId: string
  ): Promise<{
    transactions: RelevantTransaction[];
    explanation: string;
    recommendations: string[];
  }> {
    try {
      // Search for relevant transactions
      const transactions = await this.searchTransactions(query, userId);

      // Generate explanation based on found transactions
      const explanation = this.generateTransactionExplanation(
        transactions,
        query
      );

      // Generate recommendations
      const recommendations = this.generateRecommendations(transactions, query);

      return {
        transactions,
        explanation,
        recommendations,
      };
    } catch (error) {
      console.error('Error in transaction insights:', error);
      throw new Error(
        `Transaction insights failed: ${(error as Error).message}`
      );
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
      filters?: TransactionSearchFilters;
    }
  ): Promise<{
    documents: RelevantDocument[];
    transactions: RelevantTransaction[];
    combinedInsights: string;
  }> {
    try {
      const results = {
        documents: [] as RelevantDocument[],
        transactions: [] as RelevantTransaction[],
        combinedInsights: '',
      };

      // Search documents if requested
      if (options?.includeDocuments !== false) {
        results.documents = await this.semanticSearch(
          query,
          options?.filters || {}
        );
        if (options?.documentLimit) {
          results.documents = results.documents.slice(0, options.documentLimit);
        }
      }

      // Search transactions if requested
      if (options?.includeTransactions !== false) {
        results.transactions = await this.searchTransactions(
          query,
          userId,
          options?.filters
        );
        if (options?.transactionLimit) {
          results.transactions = results.transactions.slice(
            0,
            options.transactionLimit
          );
        }
      }

      // Generate combined insights
      results.combinedInsights = this.generateCombinedInsights(
        results.documents,
        results.transactions,
        query
      );

      return results;
    } catch (error) {
      console.error('Error in hybrid financial search:', error);
      throw new Error(`Hybrid search failed: ${(error as Error).message}`);
    }
  }

  // =============================================================================
  // PRIVATE HELPER METHODS
  // =============================================================================

  /**
   * Generate AI insights based on spending summary
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
      insights.push(`Não encontrei transações relacionadas a "${query}".`);
      return insights;
    }

    insights.push(
      `Encontrei ${summary.transactionCount} transações relacionadas a "${query}".`
    );
    insights.push(`Valor total: R$ ${summary.totalAmount.toFixed(2)}`);

    if (summary.transactionCount > 1) {
      const avgAmount = summary.totalAmount / summary.transactionCount;
      insights.push(`Valor médio por transação: R$ ${avgAmount.toFixed(2)}`);
    }

    // Category insights
    const categories = Object.entries(summary.categories)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    if (categories.length > 0) {
      insights.push(
        `Principais categorias: ${categories
          .map(([cat, amount]) => `${cat} (R$ ${amount.toFixed(2)})`)
          .join(', ')}`
      );
    }

    return insights;
  }

  /**
   * Generate explanation for transaction search results
   */
  private generateTransactionExplanation(
    transactions: RelevantTransaction[],
    query: string
  ): string {
    if (transactions.length === 0) {
      return `Não encontrei transações relacionadas a "${query}" no seu histórico.`;
    }

    const totalAmount = transactions.reduce(
      (sum, t) => sum + Math.abs(t.transaction.amount),
      0
    );
    const categories = [
      ...new Set(
        transactions.map(t => t.transaction.category?.primary).filter(Boolean)
      ),
    ];

    let explanation = `Encontrei ${transactions.length} transações relacionadas a "${query}". `;
    explanation += `O valor total é de R$ ${totalAmount.toFixed(2)}`;

    if (categories.length > 0) {
      explanation += ` distribuído nas categorias: ${categories.join(', ')}`;
    }

    explanation += '.';

    return explanation;
  }

  /**
   * Generate recommendations based on transaction patterns
   */
  private generateRecommendations(
    transactions: RelevantTransaction[],
    query: string
  ): string[] {
    const recommendations: string[] = [];

    if (transactions.length === 0) {
      recommendations.push(
        'Considere categorizar melhor suas transações para obter insights mais precisos.'
      );
      return recommendations;
    }

    // Analyze spending patterns
    const totalAmount = transactions.reduce(
      (sum, t) => sum + Math.abs(t.transaction.amount),
      0
    );
    const avgAmount = totalAmount / transactions.length;

    if (avgAmount > 500) {
      recommendations.push(
        'Considere revisar gastos de alto valor para identificar oportunidades de economia.'
      );
    }

    if (transactions.length > 10) {
      recommendations.push(
        'Você tem muitas transações nesta categoria. Considere criar um orçamento específico.'
      );
    }

    // Category-specific recommendations
    const categories = transactions
      .map(t => t.transaction.category?.primary)
      .filter(Boolean);
    const uniqueCategories = [...new Set(categories)];

    if (uniqueCategories.includes('Investimento')) {
      recommendations.push(
        'Ótimo! Você está investindo regularmente. Continue diversificando sua carteira.'
      );
    }

    if (uniqueCategories.includes('Vestuário')) {
      recommendations.push(
        'Considere definir um limite mensal para gastos com vestuário.'
      );
    }

    return recommendations;
  }

  /**
   * Generate combined insights from documents and transactions
   */
  private generateCombinedInsights(
    documents: RelevantDocument[],
    transactions: RelevantTransaction[],
    query: string
  ): string {
    let insights = `Análise completa para "${query}":\n\n`;

    if (documents.length > 0) {
      insights += `📚 Conhecimento: Encontrei ${documents.length} documentos relevantes sobre o tema.\n`;
    }

    if (transactions.length > 0) {
      const totalAmount = transactions.reduce(
        (sum, t) => sum + Math.abs(t.transaction.amount),
        0
      );
      insights += `💰 Transações: Encontrei ${transactions.length} transações relacionadas, totalizando R$ ${totalAmount.toFixed(2)}.\n`;
    }

    if (documents.length === 0 && transactions.length === 0) {
      insights +=
        'Não encontrei informações relevantes sobre este tema no seu histórico ou na base de conhecimento.';
    }

    return insights;
  }
}
