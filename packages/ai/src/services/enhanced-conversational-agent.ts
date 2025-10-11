/**
 * Enhanced Conversational Agent
 *
 * This agent orchestrates all services to provide comprehensive financial assistance
 * by integrating user personal data with general knowledge.
 */

import { LLMService, LLMMessage } from '../llm/llm-service';
import { RAGService, RAGResponse } from './rag-service';
import { UserDataService, UserDataContext } from './user-data-service';
import { UserProfile, MessageRole } from '../../../shared/src/types';

export interface ConversationMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  sources?: Array<{
    id: string;
    title: string;
    source: string;
    url?: string;
    relevance: number;
    type: 'personal' | 'knowledge' | 'general';
  }>;
  metadata?: {
    confidence?: number;
    processingTime?: number;
    hasSufficientContext?: boolean;
    dataTypesUsed?: ('profile' | 'transactions' | 'knowledge')[];
  };
}

export interface ConversationSession {
  sessionId: string;
  userId: string;
  messages: ConversationMessage[];
  context: {
    currentTopic?: string;
    userIntent?: string;
    lastFinancialQuery?: string;
    userDataContext?: UserDataContext;
    conversationSummary?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentResponse {
  message: ConversationMessage;
  session: ConversationSession;
  shouldUpdateContext: boolean;
}

export class EnhancedConversationalAgent {
  private llmService: LLMService;
  private ragService: RAGService;
  private userDataService: UserDataService;

  constructor(openaiApiKey: string) {
    this.llmService = new LLMService(openaiApiKey, 'openai', {
      model: 'gpt-4o',
      temperature: 0.2,
      maxTokens: 2048,
    });

    this.ragService = new RAGService(openaiApiKey);
    this.userDataService = new UserDataService();
  }

  /**
   * Process a user message and generate an appropriate response
   */
  async processMessage(
    userMessage: string,
    session: ConversationSession,
    userProfile?: UserProfile
  ): Promise<AgentResponse> {
    const startTime = Date.now();

    try {
      // Add user message to session
      const userMsg: ConversationMessage = {
        id: this.generateMessageId(),
        role: 'user',
        content: userMessage,
        timestamp: new Date(),
      };

      const updatedSession = {
        ...session,
        messages: [...session.messages, userMsg],
        updatedAt: new Date(),
      };

      // Generate enhanced response using all available data
      const conversationHistory = session.messages.slice(-5).map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const enhancedResponse = await this.ragService.generateEnhancedResponse(
        userMessage,
        session.userId,
        conversationHistory
      );

      // Create assistant message
      const assistantMsg: ConversationMessage = {
        id: this.generateMessageId(),
        role: 'assistant',
        content: enhancedResponse.response,
        timestamp: new Date(),
        sources: enhancedResponse.sources.map((source, index) => ({
          id: `source-${index}`,
          title: source.title,
          source: source.type,
          url: source.url || '',
          relevance: 0.8,
          type: source.type as 'knowledge' | 'personal' | 'general',
        })),
        metadata: {
          confidence: enhancedResponse.confidence,
          processingTime: Date.now() - startTime,
          hasSufficientContext: true,
          dataTypesUsed: enhancedResponse.dataTypesUsed as (
            | 'knowledge'
            | 'profile'
            | 'transactions'
          )[],
        },
      };

      // Update session with assistant response
      const finalSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, assistantMsg],
        context: await this.updateConversationContext(
          updatedSession.context,
          userMessage,
          enhancedResponse,
          session.userId
        ),
      };

      return {
        message: assistantMsg,
        session: finalSession,
        shouldUpdateContext: true,
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
        content: userMessage,
        timestamp: new Date(),
      };

      const errorSession = {
        ...session,
        messages: [...session.messages, userMsg, errorMsg],
        updatedAt: new Date(),
      };

      return {
        message: errorMsg,
        session: errorSession,
        shouldUpdateContext: false,
      };
    }
  }

  /**
   * Create a new conversation session
   */
  createSession(userId: string): ConversationSession {
    const sessionId = this.generateSessionId();

    const welcomeMessage: ConversationMessage = {
      id: this.generateMessageId(),
      role: 'assistant',
      content:
        'Olá! Sou seu assistente financeiro pessoal inteligente. Posso ajudá-lo com:\n\n' +
        '• Análise das suas transações e gastos\n' +
        '• Consultas sobre investimentos e planejamento financeiro\n' +
        '• Recomendações personalizadas baseadas no seu perfil\n' +
        '• Orientações sobre conceitos financeiros\n\n' +
        'Como posso ajudá-lo hoje?',
      timestamp: new Date(),
      metadata: {
        confidence: 1.0,
        processingTime: 0,
        hasSufficientContext: true,
      },
    };

    return {
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
  }

  /**
   * Update conversation context based on user message and response
   */
  private async updateConversationContext(
    currentContext: ConversationSession['context'],
    userMessage: string,
    response: RAGResponse,
    userId: string
  ): Promise<ConversationSession['context']> {
    const lowerMessage = userMessage.toLowerCase();

    // Detect financial topics
    let currentTopic = currentContext.currentTopic;
    if (
      lowerMessage.includes('investimento') ||
      lowerMessage.includes('aplicar') ||
      lowerMessage.includes('bolsa') ||
      lowerMessage.includes('ações')
    ) {
      currentTopic = 'investments';
    } else if (
      lowerMessage.includes('gasto') ||
      lowerMessage.includes('despesa') ||
      lowerMessage.includes('transação')
    ) {
      currentTopic = 'expenses';
    } else if (
      lowerMessage.includes('saldo') ||
      lowerMessage.includes('conta') ||
      lowerMessage.includes('extrato')
    ) {
      currentTopic = 'account_balance';
    } else if (
      lowerMessage.includes('meta') ||
      lowerMessage.includes('objetivo') ||
      lowerMessage.includes('planejamento')
    ) {
      currentTopic = 'financial_goals';
    } else if (
      lowerMessage.includes('orçamento') ||
      lowerMessage.includes('budget')
    ) {
      currentTopic = 'budgeting';
    }

    // Detect user intent
    let userIntent = currentContext.userIntent;
    if (lowerMessage.includes('como') || lowerMessage.includes('o que')) {
      userIntent = 'information_seeking';
    } else if (
      lowerMessage.includes('analise') ||
      lowerMessage.includes('mostre') ||
      lowerMessage.includes('quanto')
    ) {
      userIntent = 'analysis_request';
    } else if (
      lowerMessage.includes('recomende') ||
      lowerMessage.includes('sugira') ||
      lowerMessage.includes('devo')
    ) {
      userIntent = 'recommendation_request';
    }

    // Update user data context if personal data was used
    let userDataContext = currentContext.userDataContext;
    if (
      response.dataTypesUsed.includes('profile') ||
      response.dataTypesUsed.includes('transactions')
    ) {
      // Refresh user data context with all available data
      userDataContext = await this.userDataService.getUserDataContext(userId, {
        includeTransactions: true,
        transactionDays: 30, // Use 30 days by default
        includeProfile: true,
      });
    }

    // Generate conversation summary if needed
    let conversationSummary = currentContext.conversationSummary;
    // Note: We don't have access to messages in context, so we'll skip summary generation for now

    return {
      ...currentContext,
      ...(currentTopic && { currentTopic }),
      ...(userIntent && { userIntent }),
      ...(userDataContext && { userDataContext }),
      ...(conversationSummary && { conversationSummary }),
      ...(lowerMessage.includes('financeiro') ||
      lowerMessage.includes('dinheiro') ||
      lowerMessage.includes('investimento')
        ? { lastFinancialQuery: userMessage }
        : {}),
    };
  }

  /**
   * Generate conversation summary for context
   */
  private async generateConversationSummary(
    messages: ConversationMessage[]
  ): Promise<string> {
    if (messages.length <= 1) {
      return 'Nova conversa iniciada.';
    }

    const recentMessages = messages.slice(-6); // Last 6 messages
    const conversationText = recentMessages
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    const summaryPrompt: LLMMessage[] = [
      {
        role: 'system',
        content:
          'Você é um assistente que resume conversas financeiras. Crie um resumo conciso (máximo 200 caracteres) do tópico principal da conversa.',
      },
      {
        role: 'user',
        content: `Resuma esta conversa:\n\n${conversationText}`,
      },
    ];

    try {
      const response = await this.llmService.generateResponse(summaryPrompt, {
        temperature: 0.1,
        maxTokens: 100,
      });
      return response.content;
    } catch (error) {
      console.error('Error generating conversation summary:', error);
      return 'Conversa sobre finanças pessoais.';
    }
  }

  /**
   * Get conversation history for a session
   */
  getConversationHistory(
    sessionId: string,
    sessions: Map<string, ConversationSession>
  ): ConversationMessage[] {
    const session = sessions.get(sessionId);
    return session?.messages || [];
  }

  /**
   * Clear a session (for logout or session reset)
   */
  clearSession(
    sessionId: string,
    sessions: Map<string, ConversationSession>
  ): void {
    sessions.delete(sessionId);
  }

  /**
   * Get all sessions for a user
   */
  getUserSessions(
    userId: string,
    sessions: Map<string, ConversationSession>
  ): ConversationSession[] {
    return Array.from(sessions.values()).filter(
      session => session.userId === userId
    );
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

  /**
   * Get user data context for a specific user
   */
  async getUserDataContext(
    userId: string,
    options: {
      includeTransactions?: boolean;
      transactionDays?: number | 'all';
      includeProfile?: boolean;
    } = {}
  ): Promise<UserDataContext> {
    return await this.userDataService.getUserDataContext(userId, options);
  }

  /**
   * Analyze user's financial situation
   */
  async analyzeFinancialSituation(userId: string): Promise<{
    summary: string;
    recommendations: string[];
    concerns: string[];
  }> {
    try {
      const userDataContext = await this.userDataService.getUserDataContext(
        userId,
        {
          includeTransactions: true,
          transactionDays: 30, // Use 30 days by default for comprehensive analysis
          includeProfile: true,
        }
      );

      if (!userDataContext.hasPersonalData) {
        return {
          summary: 'Não há dados suficientes para análise financeira.',
          recommendations: [
            'Conecte suas contas bancárias para obter insights personalizados.',
          ],
          concerns: [],
        };
      }

      const analysisPrompt: LLMMessage[] = [
        {
          role: 'system',
          content: `Você é um analista financeiro especializado. Analise os dados do usuário e forneça:
1. Um resumo da situação financeira
2. Recomendações específicas
3. Possíveis preocupações

Seja objetivo, prático e focado em ações concretas.`,
        },
        {
          role: 'user',
          content: `Analise a situação financeira deste usuário:

${this.userDataService.formatUserDataForAI(userDataContext)}

Forneça uma análise estruturada com resumo, recomendações e preocupações.`,
        },
      ];

      const response = await this.llmService.generateResponse(analysisPrompt);

      // Parse the response to extract structured data
      const content = response.content;

      return {
        summary:
          this.extractSection(content, 'resumo') || 'Análise não disponível.',
        recommendations: this.extractList(content, 'recomendações') || [
          'Conecte mais dados para obter recomendações específicas.',
        ],
        concerns: this.extractList(content, 'preocupações') || [],
      };
    } catch (error) {
      console.error('Error analyzing financial situation:', error);
      return {
        summary: 'Erro ao analisar situação financeira.',
        recommendations: ['Tente novamente mais tarde.'],
        concerns: ['Erro técnico na análise.'],
      };
    }
  }

  /**
   * Extract section from text
   */
  private extractSection(text: string, sectionName: string): string | null {
    const patterns = [
      new RegExp(`${sectionName}[:\-]?\\s*([^\\n]+)`, 'i'),
      new RegExp(`${sectionName}[:\-]?\\s*\\n([^\\n]+)`, 'i'),
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return null;
  }

  /**
   * Extract list from text
   */
  private extractList(text: string, listName: string): string[] | null {
    const patterns = [
      new RegExp(`${listName}[:\-]?\\s*\\n([\\s\\S]*?)(?=\\n\\n|$)`, 'i'),
      new RegExp(`${listName}[:\-]?\\s*([\\s\\S]*?)(?=\\n\\n|$)`, 'i'),
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const listText = match[1];
        const items = listText
          .split('\n')
          .map(item => item.replace(/^[-•*]\s*/, '').trim())
          .filter(item => item.length > 0);

        if (items.length > 0) {
          return items;
        }
      }
    }

    return null;
  }
}

export default EnhancedConversationalAgent;
