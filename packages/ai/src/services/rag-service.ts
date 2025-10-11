import {
  UserDataService,
  UserDataContext,
  TransactionSummary,
  Transaction,
} from './user-data-service';
import { LLMService, LLMMessage } from '../llm/llm-service';

export interface QueryAnalysis {
  requiresPersonalData: boolean;
  entities: {
    timePeriod?: string;
    categories?: string[];
    amounts?: number[];
    dates?: Date[];
  };
}

export interface RAGResponse {
  response: string;
  sources: Array<{
    title: string;
    url?: string;
    type: 'knowledge' | 'personal';
  }>;
  dataTypesUsed: string[];
  confidence: number;
}

export class RAGService {
  private userDataService: UserDataService;
  private llmService: LLMService;

  constructor(openaiApiKey: string) {
    this.userDataService = new UserDataService();
    this.llmService = new LLMService(openaiApiKey);
  }

  /**
   * Generate enhanced response using both knowledge base and user data
   */
  async generateEnhancedResponse(
    query: string,
    userId: string,
    conversationHistory: Array<{ role: string; content: string }> = []
  ): Promise<RAGResponse> {
    try {
      // Analyze the query
      const analysis = await this.analyzeQuery(query);

      // Gather user data if needed
      let userDataContext: UserDataContext | null = null;
      if (analysis.requiresPersonalData) {
        userDataContext = await this.gatherUserData(userId, analysis);
      }

      // Generate response using LLM
      const response = await this.generateResponse(
        query,
        userDataContext,
        conversationHistory
      );

      // Determine data types used
      const dataTypesUsed: string[] = [];
      if (userDataContext?.profile) dataTypesUsed.push('profile');
      if (userDataContext?.recentTransactions)
        dataTypesUsed.push('transactions');
      if (userDataContext?.transactionSummary) dataTypesUsed.push('summary');

      return {
        response,
        sources: this.buildSources(userDataContext),
        dataTypesUsed,
        confidence: 0.8,
      };
    } catch (error) {
      console.error('Error generating enhanced response:', error);
      return {
        response:
          'Desculpe, ocorreu um erro ao processar sua solicitação. Tente novamente.',
        sources: [],
        dataTypesUsed: [],
        confidence: 0.1,
      };
    }
  }

  /**
   * Analyze query to determine what data is needed
   */
  private async analyzeQuery(query: string): Promise<QueryAnalysis> {
    const lowerQuery = query.toLowerCase();

    const requiresPersonalData =
      lowerQuery.includes('meu') ||
      lowerQuery.includes('minha') ||
      lowerQuery.includes('meus') ||
      lowerQuery.includes('minhas') ||
      lowerQuery.includes('gasto') ||
      lowerQuery.includes('receita') ||
      lowerQuery.includes('saldo') ||
      lowerQuery.includes('transação') ||
      lowerQuery.includes('investimento') ||
      lowerQuery.includes('perfil');

    const entities = this.extractEntities(query);

    return {
      requiresPersonalData,
      entities,
    };
  }

  /**
   * Extract entities from query
   */
  private extractEntities(query: string): QueryAnalysis['entities'] {
    const entities: QueryAnalysis['entities'] = {};

    // Time period detection - mais específica
    const lowerQuery = query.toLowerCase();

    if (
      lowerQuery.includes('último mês') ||
      lowerQuery.includes('mês passado')
    ) {
      entities.timePeriod = '30';
    } else if (
      lowerQuery.includes('último ano') ||
      lowerQuery.includes('últimos 12 meses')
    ) {
      entities.timePeriod = 'all';
    } else if (
      lowerQuery.includes('últimos 30 dias') ||
      lowerQuery.includes('últimos trinta dias')
    ) {
      entities.timePeriod = '30';
    } else if (
      lowerQuery.includes('última semana') ||
      lowerQuery.includes('últimos 7 dias')
    ) {
      entities.timePeriod = '7';
    } else if (
      lowerQuery.includes('todos os dados') ||
      lowerQuery.includes('tudo')
    ) {
      entities.timePeriod = 'all';
    } else {
      // Se não detectar período específico, usar o período da query completa
      entities.timePeriod = query;
    }

    return entities;
  }

  /**
   * Gather user data based on query analysis
   */
  private async gatherUserData(
    userId: string,
    analysis: QueryAnalysis
  ): Promise<UserDataContext | null> {
    if (!analysis.requiresPersonalData) {
      return null;
    }

    let transactionDays: number | 'all' = 30; // Default to 30 days
    if (analysis.entities.timePeriod) {
      transactionDays = this.userDataService.detectTimePeriod(
        analysis.entities.timePeriod
      );
    } else if (analysis.entities.dates && analysis.entities.dates.length > 0) {
      transactionDays = 'all';
    }

    return await this.userDataService.getUserDataContext(userId, {
      includeTransactions: true,
      transactionDays,
      includeProfile: true,
    });
  }

  /**
   * Generate response using LLM
   */
  private async generateResponse(
    query: string,
    userDataContext: UserDataContext | null,
    conversationHistory: Array<{ role: string; content: string }>
  ): Promise<string> {
    let systemPrompt = `Você é um assistente financeiro especializado em análise de dados pessoais. 
    Responda de forma clara, objetiva e útil.`;

    if (userDataContext) {
      systemPrompt += `\n\nDADOS DO USUÁRIO DISPONÍVEIS:\n${this.formatUserDataForAI(userDataContext)}`;
    }

    const messages: LLMMessage[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-5).map(msg => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content,
      })),
      { role: 'user', content: query },
    ];

    const response = await this.llmService.generateResponse(messages);
    return response.content || 'Não foi possível gerar uma resposta.';
  }

  /**
   * Format user data for AI consumption
   */
  private formatUserDataForAI(userData: UserDataContext): string {
    let formatted = '';

    if (userData.profile) {
      formatted += `PERFIL DO USUÁRIO:\n`;
      formatted += `- Tolerância ao Risco: ${userData.profile.riskTolerance}\n`;
      formatted += `- Faixa de Renda: ${userData.profile.incomeRange}\n`;
      formatted += `- Faixa Etária: ${userData.profile.ageGroup}\n`;
      formatted += `- Nível de Conhecimento: ${userData.profile.financialKnowledgeLevel}\n`;
      if (
        userData.profile.financialGoals &&
        userData.profile.financialGoals.length > 0
      ) {
        formatted += `- Metas Financeiras: ${userData.profile.financialGoals.join(', ')}\n`;
      }
      formatted += '\n';
    }

    if (userData.transactionSummary) {
      formatted += `RESUMO FINANCEIRO (TODOS OS DADOS DISPONÍVEIS):\n`;
      formatted += `- Receitas Totais: R$ ${userData.transactionSummary.totalIncome.toFixed(2)}\n`;
      formatted += `- Gastos Totais: R$ ${userData.transactionSummary.totalExpenses.toFixed(2)}\n`;
      formatted += `- Saldo Líquido: R$ ${userData.transactionSummary.netIncome.toFixed(2)}\n`;
      formatted += `- Total de Transações: ${userData.transactionSummary.topCategories.length}\n`;

      if (
        userData.transactionSummary.topCategories &&
        userData.transactionSummary.topCategories.length > 0
      ) {
        formatted += `- Gastos por Categoria:\n`;
        for (const category of userData.transactionSummary.topCategories) {
          formatted += `  * ${category.category}: R$ ${category.amount.toFixed(2)}\n`;
        }
      }
      formatted += '\n';
    }

    if (userData.recentTransactions && userData.recentTransactions.length > 0) {
      formatted += `TRANSAÇÕES RECENTES (${userData.recentTransactions.length} transações):\n`;
      const recentTransactions = userData.recentTransactions.slice(0, 10);
      for (const transaction of recentTransactions) {
        const date = new Date(transaction.date).toLocaleDateString('pt-BR');
        const amount = transaction.amount.toFixed(2);
        const type = transaction.amount > 0 ? 'Receita' : 'Despesa';
        formatted += `- ${date}: ${type} - ${transaction.description || 'Sem descrição'} - R$ ${amount}\n`;
      }
      formatted += '\n';
    }

    return formatted;
  }

  /**
   * Build sources array
   */
  private buildSources(userDataContext: UserDataContext | null): Array<{
    title: string;
    url?: string;
    type: 'knowledge' | 'personal';
  }> {
    const sources: Array<{
      title: string;
      url?: string;
      type: 'knowledge' | 'personal';
    }> = [];

    if (userDataContext) {
      if (userDataContext.profile) {
        sources.push({
          title: 'Dados Pessoais do Usuário',
          type: 'personal',
        });
      }
      if (userDataContext.recentTransactions) {
        sources.push({
          title: 'Dados Pessoais das Transações',
          type: 'personal',
        });
      }
    }

    // Add some general knowledge sources
    sources.push({
      title: 'Planejamento financeiro pessoal',
      type: 'knowledge',
    });

    return sources;
  }
}

export default RAGService;
