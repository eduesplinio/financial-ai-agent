/**
 * Chat Service
 *
 * Service layer for handling chat conversations with the AI agent
 */

// Removed direct database imports to avoid Mongoose model conflicts

// Define types locally to avoid bundling issues
export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: {
    id: string;
    title: string;
    source: string;
    url?: string;
    relevance: number;
  }[];
  metadata?: {
    confidence?: number;
    processingTime?: number;
    hasSufficientContext?: boolean;
  };
}

export interface ConversationSession {
  sessionId: string;
  userId: string;
  messages: ConversationMessage[];
  context: {
    currentTopic?: string;
    userIntent?: string;
    relevantTransactions?: string[];
    lastFinancialQuery?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  // Dados básicos do perfil
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  financialKnowledgeLevel: 'beginner' | 'intermediate' | 'advanced';
  ageGroup: '18-25' | '26-35' | '36-45' | '46-55' | '56-65' | '65+';
  incomeRange: '0-2k' | '2k-5k' | '5k-10k' | '10k-20k' | '20k+';

  // Metas financeiras
  financialGoals: Array<{
    id: string;
    title: string;
    description?: string;
    targetAmount: number;
    currentAmount: number;
    targetDate: Date;
    category:
      | 'savings'
      | 'investment'
      | 'debt_payment'
      | 'purchase'
      | 'emergency_fund';
    priority: 'low' | 'medium' | 'high';
    status: 'active' | 'completed' | 'paused' | 'cancelled';
  }>;

  // Contas conectadas
  connectedAccounts: Array<{
    id: string;
    institutionId: string;
    institutionName: string;
    accountType: 'checking' | 'savings' | 'credit_card' | 'investment' | 'loan';
    accountNumber?: string;
    balance?: number;
    currency: string;
    isActive: boolean;
    lastSyncAt?: Date;
  }>;

  // Preferências
  preferences: {
    currency: string;
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
      budgetAlerts: boolean;
      goalReminders: boolean;
      anomalyDetection: boolean;
    };
  };

  // Dados de transações recentes (resumo)
  recentTransactions?: {
    totalIncome: number;
    totalExpenses: number;
    netIncome: number;
    topCategories: Array<{
      category: string;
      amount: number;
      percentage: number;
    }>;
    monthlyTrend: 'increasing' | 'decreasing' | 'stable';
    last7DaysExpenses: number;
    last7DaysCategories: Array<{
      category: string;
      amount: number;
    }>;
  };
}

export interface ChatServiceConfig {
  openaiApiKey: string;
}

export class ChatService {
  private openaiApiKey: string;
  private sessions: Map<string, ConversationSession> = new Map();

  /**
   * Buscar apenas transações do banco de dados
   */
  private async fetchTransactions(): Promise<any[]> {
    try {
      // Import mongoose dynamically to avoid bundling issues
      const mongoose = await import('mongoose');

      // Connect to database
      const uri =
        'mongodb+srv://esplinone_db_user:XyY0siKX2Ib2LZCw@cluster0.ih76fqj.mongodb.net/financial_ai?retryWrites=true&w=majority&appName=Cluster0';

      // Check if already connected
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(uri);
      }

      const db = mongoose.connection.db;

      if (!db) {
        throw new Error('Database connection not established');
      }

      // Buscar transações dos últimos 7 dias (mesmo filtro da página)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      console.log('🔍 fetchTransactions - Data de 7 dias atrás:', sevenDaysAgo);

      const transactions = await db
        .collection('transactions')
        .find({
          date: { $gte: sevenDaysAgo },
        })
        .sort({ date: -1 })
        .limit(100)
        .toArray();

      console.log(
        '🔍 fetchTransactions - Transações encontradas:',
        transactions.length
      );
      console.log(
        '🔍 fetchTransactions - Primeira transação:',
        transactions[0]
      );

      return transactions;
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      return [];
    }
  }

  /**
   * Calcular resumo das transações do usuário
   */
  private calculateTransactionSummary(
    transactions: any[]
  ): UserProfile['recentTransactions'] {
    if (transactions.length === 0) {
      console.log(
        '⚠️ calculateTransactionSummary - Nenhuma transação encontrada'
      );
      return {
        totalIncome: 0,
        totalExpenses: 0,
        netIncome: 0,
        topCategories: [],
        monthlyTrend: 'stable' as const,
        last7DaysExpenses: 0,
        last7DaysCategories: [],
      };
    }

    console.log(
      '📊 calculateTransactionSummary - Processando',
      transactions.length,
      'transações'
    );

    let totalIncome = 0;
    let totalExpenses = 0;
    const categoryTotals: Record<string, number> = {};

    // Calcular gastos dos últimos 7 dias
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    let last7DaysExpenses = 0;
    const last7DaysCategories: Record<string, number> = {};

    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      const amount = Math.abs(transaction.amount);
      const category = transaction.category?.primary || 'Outros';

      // Determinar se é receita ou despesa baseado no amount e categoria
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

        // Calcular gastos dos últimos 7 dias
        if (transactionDate >= sevenDaysAgo) {
          last7DaysExpenses += amount;
          last7DaysCategories[category] =
            (last7DaysCategories[category] || 0) + amount;
        }
      }
    });

    const netIncome = totalIncome - totalExpenses;

    // Calcular top 5 categorias
    const topCategories = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / totalExpenses) * 100,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    // Determinar tendência mensal (simplificado)
    const monthlyTrend =
      netIncome > 0 ? 'increasing' : netIncome < 0 ? 'decreasing' : 'stable';

    const result = {
      totalIncome,
      totalExpenses,
      netIncome,
      topCategories,
      monthlyTrend,
      last7DaysExpenses,
      last7DaysCategories: Object.entries(last7DaysCategories)
        .map(([category, amount]) => ({ category, amount }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5),
    };

    console.log('📊 calculateTransactionSummary - Resultado:', result);
    return result;
  }

  constructor(config: ChatServiceConfig) {
    this.openaiApiKey = config.openaiApiKey;
  }

  /**
   * Create a new chat session for a user
   */
  createSession(userId: string): ConversationSession {
    const sessionId = this.generateSessionId();

    const welcomeMessage: ConversationMessage = {
      id: this.generateMessageId(),
      role: 'assistant',
      content:
        'Olá! Sou seu assistente financeiro pessoal. Posso ajudá-lo com consultas sobre transações, investimentos, planejamento financeiro e muito mais. Como posso ajudá-lo hoje?',
      timestamp: new Date(),
      metadata: {
        confidence: 1.0,
        processingTime: 0,
        hasSufficientContext: true,
      },
    };

    const session: ConversationSession = {
      sessionId,
      userId,
      messages: [welcomeMessage],
      context: {
        currentTopic: 'greeting',
        userIntent: 'initial_contact',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Get an existing session
   */
  getSession(sessionId: string): ConversationSession | null {
    return this.sessions.get(sessionId) || null;
  }

  /**
   * Process a message in a conversation
   */
  async processMessage(
    sessionId: string,
    message: string,
    userProfile?: UserProfile
  ): Promise<{
    message: ConversationMessage;
    session: ConversationSession;
  }> {
    const session = this.getSession(sessionId);

    if (!session) {
      throw new Error('Session not found');
    }

    const startTime = Date.now();

    try {
      // Add user message to session
      const userMsg: ConversationMessage = {
        id: this.generateMessageId(),
        role: 'user',
        content: message,
        timestamp: new Date(),
      };

      const updatedSession = {
        ...session,
        messages: [...session.messages, userMsg],
        updatedAt: new Date(),
      };

      // Buscar transações
      const transactions = await this.fetchTransactions();
      console.log(
        '🔍 Chat Service - Transações encontradas:',
        transactions.length
      );

      // Calcular resumo das transações
      const transactionSummary = this.calculateTransactionSummary(transactions);
      console.log('📊 Chat Service - Resumo calculado:', transactionSummary);

      // Use RAG with direct database access
      const agentResponse = await this.callRAGDirect(
        message,
        updatedSession,
        transactionSummary
      );

      const response = {
        content: agentResponse.content,
        sources: agentResponse.sources || [],
        confidence: agentResponse.confidence || 0.8,
        hasSufficientContext: agentResponse.hasSufficientContext || true,
      };

      // Create assistant message
      const assistantMsg: ConversationMessage = {
        id: this.generateMessageId(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        sources: response.sources,
        metadata: {
          confidence: response.confidence,
          processingTime: Date.now() - startTime,
          hasSufficientContext: response.hasSufficientContext,
        },
      };

      // Update session with assistant response
      const finalSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, assistantMsg],
        context: agentResponse.context || updatedSession.context,
      };

      // Update the session in memory
      this.sessions.set(sessionId, finalSession);

      return {
        message: assistantMsg,
        session: finalSession,
      };
    } catch (error) {
      console.error('Error processing message:', error);

      // Create error response
      const errorMsg: ConversationMessage = {
        id: this.generateMessageId(),
        role: 'assistant',
        content:
          'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente ou reformule sua pergunta.',
        timestamp: new Date(),
        metadata: {
          confidence: 0,
          processingTime: Date.now() - startTime,
          hasSufficientContext: false,
        },
      };

      const userMsg: ConversationMessage = {
        id: this.generateMessageId(),
        role: 'user',
        content: message,
        timestamp: new Date(),
      };

      const errorSession = {
        ...session,
        messages: [...session.messages, userMsg, errorMsg],
        updatedAt: new Date(),
      };

      this.sessions.set(sessionId, errorSession);

      return {
        message: errorMsg,
        session: errorSession,
      };
    }
  }

  /**
   * Get conversation history for a session
   */
  getConversationHistory(sessionId: string): ConversationMessage[] {
    const session = this.getSession(sessionId);
    return session?.messages || [];
  }

  /**
   * Clear a session (for logout or session reset)
   */
  clearSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  /**
   * Get all sessions for a user
   */
  getUserSessions(userId: string): ConversationSession[] {
    return Array.from(this.sessions.values()).filter(
      session => session.userId === userId
    );
  }

  /**
   * Call RAG directly with database access
   */
  private async callRAGDirect(
    message: string,
    session: ConversationSession,
    transactionSummary?: any
  ): Promise<{
    content: string;
    sources: any[];
    confidence: number;
    hasSufficientContext: boolean;
    context?: any;
  }> {
    try {
      console.log(
        '🤖 callRAGDirect - transactionSummary recebido:',
        transactionSummary
      );
      // Import mongoose dynamically to avoid bundling issues
      const mongoose = await import('mongoose');

      // Connect to database
      const uri =
        'mongodb+srv://esplinone_db_user:XyY0siKX2Ib2LZCw@cluster0.ih76fqj.mongodb.net/financial_ai?retryWrites=true&w=majority&appName=Cluster0';

      // Check if already connected
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(uri);
      }

      const db = mongoose.connection.db;

      if (!db) {
        throw new Error('Database connection not established');
      }

      // Enhanced search strategy - try multiple approaches
      let relevantDocs = [];

      // 1. Try semantic search with embeddings if available
      try {
        const { VectorSearchService } = await import('@financial-ai/database');

        // Generate embedding for the query
        const queryEmbedding = await this.generateEmbedding(message);

        const vectorResults = await VectorSearchService.semanticSearch({
          queryVector: queryEmbedding,
          limit: 5,
          numCandidates: 20,
          minScore: 0.3,
        });

        relevantDocs = vectorResults.map(result => result.document);
        console.log('Vector search found', relevantDocs.length, 'documents');
      } catch (vectorError) {
        console.log(
          'Vector search failed, falling back to text search:',
          vectorError.message
        );
      }

      // 2. If no vector results, use enhanced text search
      if (relevantDocs.length === 0) {
        const searchTerms = this.extractSearchTerms(message);

        // Try multiple search strategies with different priorities
        const searchResults = [];

        // Priority 1: Exact phrase match
        const exactMatches = await db
          .collection('knowledge_documents')
          .find({
            $or: [
              { title: { $regex: message, $options: 'i' } },
              { content: { $regex: message, $options: 'i' } },
            ],
          })
          .toArray();
        searchResults.push(...exactMatches);

        // Priority 2: Individual term matches in title (higher priority)
        for (const term of searchTerms) {
          const termMatches = await db
            .collection('knowledge_documents')
            .find({
              title: { $regex: term, $options: 'i' },
            })
            .toArray();
          searchResults.push(
            ...termMatches.filter(
              doc =>
                !searchResults.some(
                  existing => existing._id.toString() === doc._id.toString()
                )
            )
          );
        }

        // Priority 3: Individual term matches in content
        for (const term of searchTerms) {
          const termMatches = await db
            .collection('knowledge_documents')
            .find({
              content: { $regex: term, $options: 'i' },
            })
            .toArray();
          searchResults.push(
            ...termMatches.filter(
              doc =>
                !searchResults.some(
                  existing => existing._id.toString() === doc._id.toString()
                )
            )
          );
        }

        // Priority 4: Category-based search
        const categories = this.inferCategories(message);
        if (categories.length > 0) {
          const categoryMatches = await db
            .collection('knowledge_documents')
            .find({
              category: { $in: categories },
            })
            .toArray();
          searchResults.push(
            ...categoryMatches.filter(
              doc =>
                !searchResults.some(
                  existing => existing._id.toString() === doc._id.toString()
                )
            )
          );
        }

        relevantDocs = searchResults.slice(0, 5);
        console.log('Text search found', relevantDocs.length, 'documents');
      }

      // Build context from relevant documents
      let context = '';
      const sources = [];

      if (relevantDocs.length > 0) {
        context = 'INFORMAÇÕES RELEVANTES DA BASE DE CONHECIMENTO:\n\n';

        relevantDocs.forEach((doc, index) => {
          context += `${index + 1}. ${doc.title}\n`;
          context += `   Categoria: ${doc.category}\n`;
          context += `   Conteúdo: ${doc.content}\n\n`;

          sources.push({
            id: doc._id.toString(),
            title: doc.title,
            source: 'Base de Conhecimento RAG',
            url: doc.source || 'Conhecimento interno',
            relevance: 0.9,
          });
        });

        context +=
          'IMPORTANTE: Use essas informações específicas da base de conhecimento para responder à pergunta do usuário.';
      }

      // Build enhanced prompt with RAG context
      const systemPrompt = `Você é um assistente financeiro especializado em investimentos e planejamento financeiro brasileiro.

${context}

ESPECIALIZAÇÃO:
- Investimentos na bolsa de valores (análise técnica e fundamentalista)
- Tesouro Direto e títulos públicos
- Planejamento financeiro pessoal
- Diversificação de carteira
- Gestão de risco

DIRETRIZES:
- PRIORIZE as informações da base de conhecimento acima quando disponíveis
- Responda sempre em português brasileiro
- Seja específico e técnico sobre conceitos financeiros
- Mencione estratégias como análise técnica, fundamentalista, diversificação
- Foque em investimentos brasileiros (B3, Tesouro Direto, etc.)
- Seja didático mas não simplifique demais
- Se houver informações específicas na base de conhecimento, use-as como base principal da resposta

REGRA CRÍTICA PARA DADOS PESSOAIS:
- Quando o usuário perguntar sobre SEUS PRÓPRIOS gastos, receitas, transações ou situação financeira pessoal, SEMPRE use os dados das transações abaixo como fonte principal
- NUNCA diga que não tem acesso aos dados pessoais se eles estão disponíveis abaixo
- Use os valores específicos das transações para responder perguntas como "quanto gastei", "quanto recebi", "quais foram meus gastos", etc.

DADOS DAS TRANSAÇÕES (ÚLTIMOS 7 DIAS):

SITUAÇÃO FINANCEIRA RECENTE:
- Renda total: R$ ${transactionSummary?.totalIncome?.toLocaleString('pt-BR') || '0,00'}
- Gastos totais: R$ ${transactionSummary?.totalExpenses?.toLocaleString('pt-BR') || '0,00'}
- Saldo líquido: R$ ${transactionSummary?.netIncome?.toLocaleString('pt-BR') || '0,00'}
- Tendência: ${transactionSummary?.monthlyTrend === 'increasing' ? 'Crescimento' : transactionSummary?.monthlyTrend === 'decreasing' ? 'Declínio' : 'Estável'}

PRINCIPAIS CATEGORIAS DE GASTOS:
${
  transactionSummary?.topCategories
    ?.map(
      cat =>
        `- ${cat.category}: R$ ${cat.amount.toLocaleString('pt-BR')} (${cat.percentage.toFixed(1)}%)`
    )
    .join('\n') || '- Nenhuma categoria encontrada'
}

GASTOS DOS ÚLTIMOS 7 DIAS:
- Total gasto: R$ ${transactionSummary?.last7DaysExpenses?.toLocaleString('pt-BR') || '0,00'}
- Principais categorias:
${transactionSummary?.last7DaysCategories?.map(cat => `- ${cat.category}: R$ ${cat.amount.toLocaleString('pt-BR')}`).join('\n') || '- Nenhuma categoria encontrada'}

EXEMPLOS DE TRANSAÇÕES ESPECÍFICAS:
- Água e Esgoto (Moradia): R$ 221,13 em 20/09/2025
- PIX Freelance (PIX): R$ 205,13 em 16/09/2025
- E outras transações detalhadas disponíveis

IMPORTANTE: 
- Use esses dados específicos das transações para responder perguntas sobre gastos, receitas e análise financeira
- Quando perguntarem sobre transações específicas (como "Água e Esgoto", "PIX Freelance"), forneça os valores exatos
- Para perguntas sobre gastos totais, use os valores calculados acima
- NUNCA diga que não tem acesso aos dados se eles estão listados aqui`;

      console.log('🤖 PROMPT FINAL CONSTRUÍDO:', systemPrompt);

      // Call OpenAI with enhanced prompt
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: message },
            ],
            temperature: 0.2,
            max_tokens: 2048,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';

      // Don't disconnect from database to avoid connection issues
      // The connection will be reused for subsequent requests

      return {
        content,
        sources:
          sources.length > 0
            ? sources
            : [
                {
                  id: 'openai-gpt4',
                  title: 'OpenAI GPT-4',
                  source: 'OpenAI',
                  url: 'https://openai.com',
                  relevance: 0.9,
                },
              ],
        confidence: sources.length > 0 ? 0.95 : 0.8,
        hasSufficientContext: sources.length > 0,
        context: session.context,
      };
    } catch (error) {
      console.error('Error in RAG direct call:', error);

      // Fallback to OpenAI
      return await this.callOpenAIFallback(message, session, userProfile);
    }
  }

  /**
   * Generate embedding for text using OpenAI
   */
  private async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: text,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI Embeddings API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }

  /**
   * Extract search terms from user message
   */
  private extractSearchTerms(message: string): string[] {
    const stopWords = [
      'o',
      'a',
      'os',
      'as',
      'um',
      'uma',
      'de',
      'da',
      'do',
      'das',
      'dos',
      'em',
      'na',
      'no',
      'nas',
      'nos',
      'para',
      'por',
      'com',
      'sem',
      'sobre',
      'entre',
      'como',
      'que',
      'qual',
      'quais',
      'quando',
      'onde',
      'porque',
      'porquê',
      'é',
      'são',
      'foi',
      'foram',
      'ser',
      'estar',
      'ter',
      'ter',
      'fazer',
      'dizer',
      'poder',
      'querer',
      'saber',
      'ver',
      'dar',
      'ir',
      'vir',
      'chegar',
      'ficar',
      'passar',
      'levar',
      'trazer',
      'deixar',
      'começar',
      'acabar',
      'continuar',
      'voltar',
      'entrar',
      'sair',
      'subir',
      'descer',
      'abrir',
      'fechar',
      'ligar',
      'desligar',
      'acender',
      'apagar',
      'colocar',
      'tirar',
      'pegar',
      'largar',
      'jogar',
      'correr',
      'andar',
      'parar',
      'sentar',
      'levantar',
      'deitar',
      'dormir',
      'acordar',
      'comer',
      'beber',
      'falar',
      'ouvir',
      'escutar',
      'olhar',
      'ver',
      'sentir',
      'pensar',
      'lembrar',
      'esquecer',
      'aprender',
      'ensinar',
      'estudar',
      'trabalhar',
      'brincar',
      'jogar',
      'cantar',
      'dançar',
      'rir',
      'chorar',
      'amar',
      'odiar',
      'gostar',
      'querer',
      'precisar',
      'dever',
      'poder',
      'conseguir',
      'tentar',
      'começar',
      'acabar',
      'terminar',
      'parar',
      'continuar',
      'seguir',
      'prosseguir',
      'avançar',
      'retroceder',
      'voltar',
      'ir',
      'vir',
      'chegar',
      'partir',
      'sair',
      'entrar',
      'ficar',
      'permanecer',
      'mudar',
      'alterar',
      'transformar',
      'criar',
      'fazer',
      'construir',
      'destruir',
      'quebrar',
      'consertar',
      'reparar',
      'ajudar',
      'atrapalhar',
      'facilitar',
      'dificultar',
      'melhorar',
      'piorar',
      'aumentar',
      'diminuir',
      'crescer',
      'decrescer',
      'subir',
      'descer',
      'elevar',
      'abaixar',
      'levantar',
      'baixar',
      'colocar',
      'tirar',
      'adicionar',
      'remover',
      'incluir',
      'excluir',
      'aceitar',
      'rejeitar',
      'aprovar',
      'desaprovar',
      'concordar',
      'discordar',
      'aceitar',
      'recusar',
      'permitir',
      'proibir',
      'autorizar',
      'negar',
      'confirmar',
      'negar',
      'afirmar',
      'negar',
      'dizer',
      'falar',
      'comunicar',
      'informar',
      'avisar',
      'alertar',
      'advertir',
      'aconselhar',
      'recomendar',
      'sugerir',
      'propor',
      'oferecer',
      'pedir',
      'solicitar',
      'exigir',
      'demandar',
      'requerer',
      'necessitar',
      'precisar',
      'depender',
      'confiar',
      'acreditar',
      'duvidar',
      'suspeitar',
      'desconfiar',
      'esperar',
      'aguardar',
      'esperar',
      'desejar',
      'querer',
      'preferir',
      'escolher',
      'decidir',
      'resolver',
      'determinar',
      'estabelecer',
      'definir',
      'especificar',
      'detalhar',
      'explicar',
      'clarificar',
      'esclarecer',
      'entender',
      'compreender',
      'interpretar',
      'traduzir',
      'converter',
      'transformar',
      'mudar',
      'alterar',
      'modificar',
      'ajustar',
      'adaptar',
      'adequar',
      'corrigir',
      'retificar',
      'revisar',
      'verificar',
      'checar',
      'confirmar',
      'validar',
      'aprovar',
      'autorizar',
      'permitir',
      'liberar',
      'desbloquear',
      'abrir',
      'fechar',
      'bloquear',
      'trancar',
      'destrancar',
      'destravar',
      'travar',
      'destravar',
      'soltar',
      'prender',
      'segurar',
      'agarrar',
      'pegar',
      'largar',
      'soltar',
      'liberar',
      'soltar',
      'prender',
      'segurar',
      'agarrar',
      'pegar',
      'largar',
      'soltar',
      'liberar',
    ];

    return message
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.includes(word))
      .slice(0, 5); // Limit to 5 terms
  }

  /**
   * Infer categories from user message
   */
  private inferCategories(message: string): string[] {
    const categories = [];
    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes('investimento') ||
      lowerMessage.includes('bolsa') ||
      lowerMessage.includes('ação') ||
      lowerMessage.includes('ações')
    ) {
      categories.push('investment');
    }
    if (
      lowerMessage.includes('planejamento') ||
      lowerMessage.includes('orçamento') ||
      lowerMessage.includes('financeiro')
    ) {
      categories.push('financial_planning');
    }
    if (
      lowerMessage.includes('juros') ||
      lowerMessage.includes('rendimento') ||
      lowerMessage.includes('rentabilidade')
    ) {
      categories.push('investment', 'financial_planning');
    }
    if (
      lowerMessage.includes('tesouro') ||
      lowerMessage.includes('título') ||
      lowerMessage.includes('renda fixa')
    ) {
      categories.push('investment');
    }
    if (
      lowerMessage.includes('compostos') ||
      lowerMessage.includes('composto')
    ) {
      categories.push('financial_planning');
    }

    return categories;
  }

  /**
   * Call ConversationalAgent via internal API route
   */
  private async callConversationalAgent(
    message: string,
    session: ConversationSession,
    userProfile?: UserProfile
  ): Promise<{
    content: string;
    sources: any[];
    confidence: number;
    hasSufficientContext: boolean;
    context?: any;
  }> {
    try {
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/api/chat/agent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          session,
          userProfile,
        }),
      });

      if (!response.ok) {
        throw new Error(`Agent API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error calling ConversationalAgent:', error);

      // Fallback to direct OpenAI call
      return await this.callOpenAIFallback(message, session, userProfile);
    }
  }

  /**
   * Fallback to direct OpenAI call
   */
  private async callOpenAIFallback(
    message: string,
    session: ConversationSession,
    userProfile?: UserProfile
  ): Promise<{
    content: string;
    sources: any[];
    confidence: number;
    hasSufficientContext: boolean;
  }> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: this.buildMessages(message, session, userProfile),
        temperature: 0.2,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';

    return {
      content,
      sources: [
        {
          id: 'openai-gpt4',
          title: 'OpenAI GPT-4',
          source: 'OpenAI',
          url: 'https://openai.com',
          relevance: 0.9,
        },
      ],
      confidence: 0.9,
      hasSufficientContext: true,
    };
  }

  /**
   * Build messages for OpenAI API
   */
  private buildMessages(
    message: string,
    session: ConversationSession,
    userProfile?: UserProfile
  ): any[] {
    const systemPrompt = `Você é um assistente financeiro especializado em investimentos e planejamento financeiro brasileiro. 

ESPECIALIZAÇÃO:
- Investimentos na bolsa de valores (análise técnica e fundamentalista)
- Tesouro Direto e títulos públicos
- Planejamento financeiro pessoal
- Diversificação de carteira
- Gestão de risco

DIRETRIZES:
- Responda sempre em português brasileiro
- Seja específico e técnico sobre conceitos financeiros
- Mencione estratégias como análise técnica, fundamentalista, diversificação
- Foque em investimentos brasileiros (B3, Tesouro Direto, etc.)
- Seja didático mas não simplifique demais

${
  userProfile
    ? `PERFIL DO USUÁRIO:
- Tolerância a risco: ${userProfile.riskTolerance}
- Nível de conhecimento: ${userProfile.financialKnowledgeLevel}
- Faixa etária: ${userProfile.ageGroup}
Adapte sua resposta para esse perfil.`
    : ''
}`;

    const messages = [{ role: 'system', content: systemPrompt }];

    // Add recent conversation history (last 10 messages)
    const recentMessages = session.messages.slice(-10);
    for (const msg of recentMessages) {
      messages.push({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      });
    }

    // Add current message
    messages.push({ role: 'user', content: message });

    return messages;
  }

  /**
   * Generate a unique message ID
   */
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Singleton instance
let chatServiceInstance: ChatService | null = null;

export function getChatService(): ChatService {
  if (!chatServiceInstance) {
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }

    chatServiceInstance = new ChatService({
      openaiApiKey,
    });
  }

  return chatServiceInstance;
}
