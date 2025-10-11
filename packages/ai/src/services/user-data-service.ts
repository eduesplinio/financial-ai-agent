/**
 * User Data Service
 *
 * Service responsible for managing and retrieving user-specific data
 * including profile information and transaction history.
 */

import { UserProfile, Transaction } from '../../../shared/src/types';
import { mongoConnection } from '@financial-ai/database';
import mongoose from 'mongoose';

// Re-export Transaction type for compatibility
export type { Transaction } from '../../../shared/src/types';

export interface TransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  topCategories: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  monthlyTrend: 'increasing' | 'decreasing' | 'stable';
  lastNDaysExpenses: number;
  lastNDaysCategories: Array<{
    category: string;
    amount: number;
  }>;
  period: string; // e.g., "30 days", "all time"
}

export interface UserDataContext {
  profile: UserProfile | null;
  transactionSummary: TransactionSummary | null;
  recentTransactions: Transaction[];
  hasPersonalData: boolean;
}

export class UserDataService {
  constructor() {
    // Use the centralized database connection
  }

  /**
   * Initialize database connection using the centralized connection
   */
  private async ensureConnection(): Promise<void> {
    try {
      if (!mongoConnection.isConnected()) {
        await mongoConnection.connect();
      }
    } catch (error) {
      console.error('Failed to ensure database connection:', error);
      throw error;
    }
  }

  /**
   * Get database instance
   */
  private getDatabase() {
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection is not established');
    }
    return db;
  }

  /**
   * Get user profile by user ID
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      await this.ensureConnection();

      // Handle userId - can be ObjectId or string (email)
      const ObjectId = mongoose.Types.ObjectId;
      const db = this.getDatabase();

      let query: any;
      if (ObjectId.isValid(userId) && userId.length === 24) {
        query = { userId: new ObjectId(userId) };
      } else {
        query = { userId: userId };
      }

      const profile = await db.collection('profiles').findOne(query);

      return profile as UserProfile | null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  /**
   * Get user transactions with optional filtering
   */
  async getUserTransactions(
    userId: string,
    options: {
      days?: number | 'all';
      includeAll?: boolean;
      limit?: number;
      startDate?: Date;
      endDate?: Date;
    } = {}
  ): Promise<Transaction[]> {
    try {
      await this.ensureConnection();

      const { days = 30, includeAll = false, limit = 5000 } = options;

      // Handle userId - can be ObjectId or string (email)
      const ObjectId = mongoose.Types.ObjectId;
      let query: any;

      // Check if userId is a valid ObjectId, otherwise treat as string
      if (ObjectId.isValid(userId) && userId.length === 24) {
        query = { userId: new ObjectId(userId) };
      } else {
        // Treat as string (email or other string identifier)
        query = { userId: userId };
      }

      // Always filter out future dates (transactions should not be in the future)
      const now = new Date();
      query.date = { $lte: now };

      // Apply additional date filtering if specific period requested
      if (days !== 'all' && !includeAll && typeof days === 'number') {
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - days);

        query.date.$gte = daysAgo;
      }

      // Apply custom date range if provided
      if (options.startDate || options.endDate) {
        if (options.startDate) {
          query.date.$gte = options.startDate;
        }
        if (options.endDate) {
          query.date.$lte = options.endDate;
        }
      }

      const db = this.getDatabase();
      const transactions = await db
        .collection('transactions')
        .find(query)
        .sort({ date: -1 })
        .limit(limit)
        .toArray();

      // Convert MongoDB documents to Transaction objects
      return transactions.map(doc => ({
        id: doc._id.toString(),
        userId: doc.userId.toString(),
        accountId: doc.accountId || '',
        amount: doc.amount,
        currency: doc.currency || 'BRL',
        date: doc.date,
        description: doc.description || '',
        category: doc.category || { primary: 'Outros', confidence: 0.5 },
        merchant: doc.merchant,
        location: doc.location,
        metadata: doc.metadata || {},
        createdAt: doc.createdAt || new Date(),
      })) as Transaction[];
    } catch (error) {
      console.error('Error fetching user transactions:', error);
      return [];
    }
  }

  /**
   * Calculate transaction summary for a given period
   */
  async calculateTransactionSummary(
    userId: string,
    days: number | 'all' = 30
  ): Promise<TransactionSummary | null> {
    try {
      const transactions = await this.getUserTransactions(userId, {
        days: days,
        includeAll: days === 'all',
        limit: 5000,
      });

      if (transactions.length === 0) {
        return {
          totalIncome: 0,
          totalExpenses: 0,
          netIncome: 0,
          topCategories: [],
          monthlyTrend: 'stable',
          lastNDaysExpenses: 0,
          lastNDaysCategories: [],
          period: days === 'all' ? 'all time' : `${days} days`,
        };
      }

      let totalIncome = 0;
      let totalExpenses = 0;
      const categoryTotals: Record<string, number> = {};

      // Calculate totals and categories
      transactions.forEach(transaction => {
        const amount = Math.abs(transaction.amount);
        const category = transaction.category?.primary || 'Outros';

        // Determine if it's income or expense
        const isIncome =
          transaction.amount > 0 ||
          category.toLowerCase().includes('receita') ||
          category.toLowerCase().includes('recebimento') ||
          category.toLowerCase().includes('transferência') ||
          category.toLowerCase().includes('pix');

        if (isIncome) {
          totalIncome += amount;
        } else {
          totalExpenses += amount;
          categoryTotals[category] = (categoryTotals[category] || 0) + amount;
        }
      });

      const netIncome = totalIncome - totalExpenses;

      // Calculate top categories
      const topCategories = Object.entries(categoryTotals)
        .map(([category, amount]) => ({
          category,
          amount,
          percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

      // Determine trend
      const monthlyTrend: 'increasing' | 'decreasing' | 'stable' =
        netIncome > 0 ? 'increasing' : netIncome < 0 ? 'decreasing' : 'stable';

      // Calculate last N days expenses (if not all time)
      let lastNDaysExpenses = 0;
      let lastNDaysCategories: Array<{ category: string; amount: number }> = [];

      if (days !== 'all') {
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - days);

        const lastNDaysTotals: Record<string, number> = {};

        transactions.forEach(transaction => {
          const transactionDate = new Date(transaction.date);
          if (transactionDate >= daysAgo && transaction.amount < 0) {
            const amount = Math.abs(transaction.amount);
            const category = transaction.category?.primary || 'Outros';

            lastNDaysExpenses += amount;
            lastNDaysTotals[category] =
              (lastNDaysTotals[category] || 0) + amount;
          }
        });

        lastNDaysCategories = Object.entries(lastNDaysTotals)
          .map(([category, amount]) => ({ category, amount }))
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 5);
      }

      return {
        totalIncome,
        totalExpenses,
        netIncome,
        topCategories,
        monthlyTrend,
        lastNDaysExpenses,
        lastNDaysCategories,
        period: days === 'all' ? 'all time' : `${days} days`,
      };
    } catch (error) {
      console.error('Error calculating transaction summary:', error);
      return null;
    }
  }

  /**
   * Get comprehensive user data context for AI processing
   */
  async getUserDataContext(
    userId: string,
    options: {
      includeTransactions?: boolean;
      transactionDays?: number | 'all';
      includeProfile?: boolean;
    } = {}
  ): Promise<UserDataContext> {
    const {
      includeTransactions = true,
      transactionDays = 30, // Default to 30 days
      includeProfile = true,
    } = options;

    try {
      const [profile, transactionSummary, recentTransactions] =
        await Promise.all([
          includeProfile ? this.getUserProfile(userId) : null,
          includeTransactions
            ? this.calculateTransactionSummary(userId, transactionDays)
            : null,
          includeTransactions
            ? this.getUserTransactions(userId, {
                days: transactionDays,
                includeAll: transactionDays === 'all',
                limit: 20,
              })
            : [],
        ]);

      return {
        profile,
        transactionSummary,
        recentTransactions,
        hasPersonalData: !!(
          profile ||
          transactionSummary ||
          recentTransactions.length > 0
        ),
      };
    } catch (error) {
      console.error('Error getting user data context:', error);
      return {
        profile: null,
        transactionSummary: null,
        recentTransactions: [],
        hasPersonalData: false,
      };
    }
  }

  /**
   * Detect time period from user message
   */
  detectTimePeriod(message: string): number | 'all' {
    const lowerMessage = message.toLowerCase();

    // Check for specific date patterns
    const datePatterns = [
      /\d{1,2}\/\d{1,2}\/\d{4}/, // DD/MM/YYYY
      /\d{4}-\d{2}-\d{2}/, // YYYY-MM-DD
      /\d{1,2}\/\d{1,2}/, // DD/MM
      /em \d{1,2}\/\d{1,2}\/\d{4}/, // "em 22/08/2025"
      /dia \d{1,2}/, // "dia 22"
      /no dia \d{1,2}/, // "no dia 22"
    ];

    if (datePatterns.some(pattern => pattern.test(lowerMessage))) {
      return 'all'; // If specific date mentioned, search all transactions
    }

    // Check for "all time" or "total" patterns
    const allTimePatterns = [
      /todos?\s*os?\s*dados/i,
      /todo\s*o\s*histórico/i,
      /histórico\s*completo/i,
      /todos?\s*os?\s*registros/i,
      /último\s*ano/i,
      /ano\s*passado/i,
      /ano\s*anterior/i,
      /últimos?\s*12\s*meses/i,
      /últimos?\s*365\s*dias/i,
      /total\s*geral/i,
      /tudo/i,
      /completo/i,
    ];

    if (allTimePatterns.some(pattern => pattern.test(lowerMessage))) {
      return 'all';
    }

    // Check for time period patterns
    const patterns = [
      {
        pattern: /últimos?\s*(\d+)\s*dias?/i,
        extract: (match: RegExpMatchArray) => parseInt(match[1] || '0'),
      },
      {
        pattern: /(\d+)\s*dias?\s*atrás/i,
        extract: (match: RegExpMatchArray) => parseInt(match[1] || '0'),
      },
      {
        pattern: /nos?\s*últimos?\s*(\d+)\s*dias?/i,
        extract: (match: RegExpMatchArray) => parseInt(match[1] || '0'),
      },
      {
        pattern: /últimos?\s*(\d+)\s*semanas?/i,
        extract: (match: RegExpMatchArray) => parseInt(match[1] || '0') * 7,
      },
      {
        pattern: /(\d+)\s*semanas?\s*atrás/i,
        extract: (match: RegExpMatchArray) => parseInt(match[1] || '0') * 7,
      },
      { pattern: /última\s*semana/i, extract: () => 7 },
      {
        pattern: /últimos?\s*(\d+)\s*meses?/i,
        extract: (match: RegExpMatchArray) => parseInt(match[1] || '0') * 30,
      },
      {
        pattern: /(\d+)\s*meses?\s*atrás/i,
        extract: (match: RegExpMatchArray) => parseInt(match[1] || '0') * 30,
      },
      { pattern: /último\s*mês/i, extract: () => 30 },
      { pattern: /mês\s*passado/i, extract: () => 30 },
      {
        pattern: /este\s*mês/i,
        extract: () => {
          const now = new Date();
          const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
          return Math.ceil(
            (now.getTime() - firstDay.getTime()) / (1000 * 60 * 60 * 24)
          );
        },
      },
      { pattern: /últimos?\s*30\s*dias?/i, extract: () => 30 },
      { pattern: /últimos?\s*7\s*dias?/i, extract: () => 7 },
      { pattern: /últimos?\s*15\s*dias?/i, extract: () => 15 },
      { pattern: /últimos?\s*60\s*dias?/i, extract: () => 60 },
      { pattern: /últimos?\s*90\s*dias?/i, extract: () => 90 },
      { pattern: /últimos?\s*dias?/i, extract: () => 7 },
      { pattern: /nos?\s*últimos?\s*dias?/i, extract: () => 7 },
    ];

    for (const { pattern, extract } of patterns) {
      const match = lowerMessage.match(pattern);
      if (match) {
        try {
          return extract(match);
        } catch (error) {
          // Skip patterns that don't have the expected structure
          continue;
        }
      }
    }

    return 30; // Default to 30 days
  }

  /**
   * Format user data for AI context
   */
  formatUserDataForAI(context: UserDataContext): string {
    if (!context.hasPersonalData) {
      return 'DADOS PESSOAIS: Nenhum dado pessoal disponível.';
    }

    let formattedData = 'DADOS PESSOAIS DO USUÁRIO:\n\n';

    // Add profile information
    if (context.profile) {
      formattedData += `PERFIL DO USUÁRIO:
- Tolerância a risco: ${context.profile.riskTolerance}
- Nível de conhecimento financeiro: ${context.profile.financialKnowledgeLevel}
- Faixa etária: ${context.profile.ageGroup}
- Faixa de renda: ${context.profile.incomeRange}

METAS FINANCEIRAS:
${
  Array.isArray(context.profile.financialGoals)
    ? context.profile.financialGoals
        .map(
          (goal: any) =>
            `- ${goal.title}: R$ ${goal.currentAmount.toLocaleString('pt-BR')} / R$ ${goal.targetAmount.toLocaleString('pt-BR')} (${goal.status})`
        )
        .join('\n')
    : 'Nenhuma meta definida'
}

CONTAS CONECTADAS:
${
  (context.profile as any).connectedAccounts
    ? (context.profile as any).connectedAccounts
        .map(
          (account: any) =>
            `- ${account.institutionName} (${account.accountType}): ${account.isActive ? 'Ativa' : 'Inativa'}`
        )
        .join('\n')
    : 'Nenhuma conta conectada'
}

`;
    }

    // Add transaction summary
    if (context.transactionSummary) {
      const summary = context.transactionSummary;
      const periodText =
        summary.period === 'all time'
          ? 'TODOS OS DADOS DISPONÍVEIS'
          : summary.period;

      formattedData += `SITUAÇÃO FINANCEIRA (${periodText}):
- Renda total: R$ ${summary.totalIncome.toLocaleString('pt-BR')}
- Gastos totais: R$ ${summary.totalExpenses.toLocaleString('pt-BR')}
- Saldo líquido: R$ ${summary.netIncome.toLocaleString('pt-BR')}
- Tendência: ${summary.monthlyTrend === 'increasing' ? 'Crescimento' : summary.monthlyTrend === 'decreasing' ? 'Declínio' : 'Estável'}

PRINCIPAIS CATEGORIAS DE GASTOS:
${summary.topCategories
  .map(
    cat =>
      `- ${cat.category}: R$ ${cat.amount.toLocaleString('pt-BR')} (${cat.percentage.toFixed(1)}%)`
  )
  .join('\n')}

`;
    }

    // Add recent transactions
    if (context.recentTransactions.length > 0) {
      formattedData += `TRANSAÇÕES RECENTES:
${context.recentTransactions
  .slice(0, 10)
  .map(
    t =>
      `- ${t.description || 'Transação'}: R$ ${Math.abs(t.amount).toLocaleString('pt-BR')} em ${new Date(t.date).toLocaleDateString('pt-BR')} (${t.category?.primary || 'Outros'})`
  )
  .join('\n')}

`;
    }

    formattedData +=
      'IMPORTANTE: Use esses dados pessoais quando a pergunta for sobre gastos, receitas, transações específicas ou análise financeira pessoal.';

    return formattedData;
  }
}

export default UserDataService;
