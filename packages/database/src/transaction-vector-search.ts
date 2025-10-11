import mongoose from 'mongoose';
import { z } from 'zod';
import { Transaction, ITransaction } from './models/transaction';
// Import will be resolved at runtime
// import { OpenAIEmbeddingProvider } from '../../ai/src/rag/embedding-generator';

// =============================================================================
// VALIDATION SCHEMAS
// =============================================================================

export const TransactionVectorQuerySchema = z.object({
  queryText: z.string().min(1, 'Query text is required'),
  userId: z.string().min(1, 'User ID is required for security'),
  limit: z.number().min(1).max(10000).default(1000),
  filters: z
    .object({
      dateRange: z
        .object({
          start: z.date().optional(),
          end: z.date().optional(),
        })
        .optional(),
      amountRange: z
        .object({
          min: z.number().optional(),
          max: z.number().optional(),
        })
        .optional(),
      categories: z.array(z.string()).optional(),
      accountIds: z.array(z.string()).optional(),
    })
    .optional(),
});

export const TransactionSearchResultSchema = z.object({
  transaction: z.any(), // ITransaction
  score: z.number().min(0).max(1),
  relevanceFactors: z.object({
    semantic: z.number(),
    category: z.boolean().optional(),
    amount: z.boolean().optional(),
    date: z.boolean().optional(),
  }),
});

// =============================================================================
// TYPES
// =============================================================================

export type TransactionVectorQuery = z.infer<
  typeof TransactionVectorQuerySchema
>;
export type TransactionSearchResult = z.infer<
  typeof TransactionSearchResultSchema
>;

// =============================================================================
// TRANSACTION VECTOR SEARCH SERVICE
// =============================================================================

export class TransactionVectorSearchService {
  private static embeddingProvider: any = null;

  /**
   * Initialize the embedding provider
   */
  private static async getEmbeddingProvider(): Promise<any> {
    if (!this.embeddingProvider) {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OPENAI_API_KEY environment variable is required');
      }
      // Use dynamic import to avoid circular dependencies
      // @ts-ignore - Dynamic import path resolved at runtime
      const { OpenAIEmbeddingProvider } = await import(
        '../../ai/src/rag/embedding-generator'
      );
      this.embeddingProvider = new OpenAIEmbeddingProvider(apiKey);
    }
    return this.embeddingProvider;
  }

  /**
   * Search transactions using semantic similarity
   */
  static async searchTransactions(
    query: TransactionVectorQuery
  ): Promise<TransactionSearchResult[]> {
    try {
      // Ensure MongoDB connection
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_URI!);
      }

      // Validate input
      const validatedQuery = TransactionVectorQuerySchema.parse(query);

      // Generate embedding for the query
      const embeddingProvider = await this.getEmbeddingProvider();
      const queryVector = await embeddingProvider.getEmbedding(
        validatedQuery.queryText
      );

      // Build MongoDB aggregation pipeline
      const pipeline: any[] = [
        {
          $vectorSearch: {
            index: 'transaction_vector_search',
            path: 'embedding',
            queryVector: queryVector,
            numCandidates: validatedQuery.limit * 4,
            limit: validatedQuery.limit * 2,
            filter: {
              userId: validatedQuery.userId,
            },
          },
        },
        {
          $addFields: {
            score: { $meta: 'vectorSearchScore' },
          },
        },
      ];

      // Add additional filters if provided
      if (validatedQuery.filters) {
        const matchFilters: any = {};

        // Date range filter
        if (validatedQuery.filters.dateRange) {
          const dateFilter: any = {};
          const { start, end } = validatedQuery.filters.dateRange;
          if (start) {
            dateFilter.$gte = start;
          }
          if (end) {
            dateFilter.$lte = end;
          }
          if (Object.keys(dateFilter).length > 0) {
            matchFilters.date = dateFilter;
          }
        }

        // Amount range filter
        if (validatedQuery.filters.amountRange) {
          const amountFilter: any = {};
          const { min, max } = validatedQuery.filters.amountRange;
          if (min !== undefined) {
            amountFilter.$gte = min;
          }
          if (max !== undefined) {
            amountFilter.$lte = max;
          }
          if (Object.keys(amountFilter).length > 0) {
            matchFilters.amount = amountFilter;
          }
        }

        // Category filter
        if (
          validatedQuery.filters.categories &&
          validatedQuery.filters.categories.length > 0
        ) {
          matchFilters['category.primary'] = {
            $in: validatedQuery.filters.categories,
          };
        }

        // Account IDs filter
        if (
          validatedQuery.filters.accountIds &&
          validatedQuery.filters.accountIds.length > 0
        ) {
          matchFilters.accountId = { $in: validatedQuery.filters.accountIds };
        }

        // Add match stage if we have filters
        if (Object.keys(matchFilters).length > 0) {
          pipeline.push({ $match: matchFilters });
        }
      }

      // Limit results
      pipeline.push({ $limit: validatedQuery.limit });

      // Execute the search
      const results = await Transaction.aggregate(pipeline);

      // Format results
      return results.map(result => ({
        transaction: result,
        score: result.score || 0,
        relevanceFactors: {
          semantic: result.score || 0,
          category:
            validatedQuery.filters?.categories?.includes(
              result.category?.primary
            ) ?? false,
          amount: this.isAmountInRange(
            result.amount,
            validatedQuery.filters?.amountRange
          ),
          date: this.isDateInRange(
            result.date,
            validatedQuery.filters?.dateRange
          ),
        },
      }));
    } catch (error) {
      console.error('❌ Transaction vector search failed:', error);
      throw new Error(`Transaction search failed: ${(error as Error).message}`);
    }
  }

  /**
   * Find similar transactions to a given transaction
   */
  static async findSimilarTransactions(
    transactionId: string,
    userId: string,
    limit: number = 5
  ): Promise<TransactionSearchResult[]> {
    try {
      // Get the source transaction using aggregation to avoid type issues
      const sourceResults = await Transaction.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(transactionId),
            userId: userId,
          },
        },
        { $limit: 1 },
      ]);

      const sourceTransaction = sourceResults[0];

      if (!sourceTransaction || !(sourceTransaction as any).embedding) {
        throw new Error('Transaction not found or has no embedding');
      }

      // Search for similar transactions
      const pipeline = [
        {
          $vectorSearch: {
            index: 'transaction_vector_search',
            path: 'embedding',
            queryVector: (sourceTransaction as any).embedding,
            numCandidates: limit * 4,
            limit: limit + 1,
            filter: {
              userId: userId,
            },
          },
        },
        {
          $addFields: {
            score: { $meta: 'vectorSearchScore' },
          },
        },
        {
          $match: {
            _id: { $ne: sourceTransaction._id },
          },
        },
        {
          $limit: limit,
        },
      ];

      const results = await Transaction.aggregate(pipeline);

      return results.map(result => ({
        transaction: result,
        score: result.score || 0,
        relevanceFactors: {
          semantic: result.score || 0,
        },
      }));
    } catch (error) {
      console.error('❌ Find similar transactions failed:', error);
      throw new Error(
        `Find similar transactions failed: ${(error as Error).message}`
      );
    }
  }

  /**
   * Get spending insights using vector search
   */
  static async getSpendingInsights(
    userId: string,
    query: string,
    timeframe?: { start: Date; end: Date }
  ): Promise<{
    transactions: TransactionSearchResult[];
    summary: {
      totalAmount: number;
      transactionCount: number;
      averageAmount: number;
      categories: Record<string, number>;
    };
  }> {
    try {
      // Search for relevant transactions
      const searchQuery: TransactionVectorQuery = {
        queryText: query,
        userId,
        limit: 20,
        filters: timeframe ? { dateRange: timeframe } : undefined,
      };

      const transactions = await this.searchTransactions(searchQuery);

      // Calculate summary
      const totalAmount = transactions.reduce(
        (sum, result) => sum + Math.abs(result.transaction.amount),
        0
      );

      const categories: Record<string, number> = {};
      transactions.forEach(result => {
        const category =
          result.transaction.category?.primary || 'Uncategorized';
        categories[category] =
          (categories[category] || 0) + Math.abs(result.transaction.amount);
      });

      return {
        transactions,
        summary: {
          totalAmount,
          transactionCount: transactions.length,
          averageAmount:
            transactions.length > 0 ? totalAmount / transactions.length : 0,
          categories,
        },
      };
    } catch (error) {
      console.error('❌ Get spending insights failed:', error);
      throw new Error(
        `Get spending insights failed: ${(error as Error).message}`
      );
    }
  }

  // =============================================================================
  // HELPER METHODS
  // =============================================================================

  private static isAmountInRange(
    amount: number,
    range?: { min?: number | undefined; max?: number | undefined }
  ): boolean {
    if (!range) return false;

    const absAmount = Math.abs(amount);

    if (range.min !== undefined && absAmount < range.min) return false;
    if (range.max !== undefined && absAmount > range.max) return false;

    return true;
  }

  private static isDateInRange(
    date: Date,
    range?: { start?: Date | undefined; end?: Date | undefined }
  ): boolean {
    if (!range) return false;

    const transactionDate = new Date(date);

    if (range.start && transactionDate < range.start) return false;
    if (range.end && transactionDate > range.end) return false;

    return true;
  }
}

export default TransactionVectorSearchService;
