/**
 * Conversational Agent
 *
 * This service orchestrates the conversation flow, integrating LLM, RAG, and user context
 * to provide intelligent financial assistance.
 */

import { LLMService, LLMMessage } from '../llm/llm-service';
import { RAGService, RAGResponse } from '../rag/rag-service';
import {
  AugmentedResponseGenerator,
  AugmentedResponse,
} from '../rag/augmented-response-generator';
import { UserProfile, MessageRole } from '@financial-ai/shared/src/types';

export interface ConversationMessage {
  id: string;
  role: MessageRole;
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

export interface AgentResponse {
  message: ConversationMessage;
  session: ConversationSession;
  shouldUpdateContext: boolean;
}

export class ConversationalAgent {
  private llmService: LLMService;
  private ragService: RAGService;
  private responseGenerator: AugmentedResponseGenerator;

  constructor(openaiApiKey: string) {
    this.llmService = new LLMService(openaiApiKey, 'openai', {
      model: 'gpt-4o',
      temperature: 0.2,
      maxTokens: 2048,
    });

    this.ragService = new RAGService(openaiApiKey, this.llmService);
    this.responseGenerator = new AugmentedResponseGenerator(
      this.llmService,
      this.ragService
    );
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

      // Generate response using RAG
      const augmentedResponse = await this.responseGenerator.generateResponse(
        userMessage,
        userProfile
      );

      // Create assistant message
      const assistantMsg: ConversationMessage = {
        id: this.generateMessageId(),
        role: 'assistant',
        content: augmentedResponse.content,
        timestamp: new Date(),
        sources: augmentedResponse.sources.map(source => ({
          id: source.id,
          title: source.title,
          source: source.source,
          ...(source.url && { url: source.url }),
          relevance: source.relevance,
        })),
        metadata: {
          confidence: augmentedResponse.confidence,
          processingTime: Date.now() - startTime,
          hasSufficientContext: augmentedResponse.hasSufficientContext,
        },
      };

      // Update session with assistant response
      const finalSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, assistantMsg],
        context: this.updateConversationContext(
          updatedSession.context,
          userMessage,
          augmentedResponse
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
        'Olá! Sou seu assistente financeiro pessoal. Posso ajudá-lo com consultas sobre transações, investimentos, planejamento financeiro e muito mais. Como posso ajudá-lo hoje?',
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
  private updateConversationContext(
    currentContext: ConversationSession['context'],
    userMessage: string,
    response: AugmentedResponse
  ): ConversationSession['context'] {
    const lowerMessage = userMessage.toLowerCase();

    // Detect financial topics
    let currentTopic = currentContext.currentTopic;
    if (
      lowerMessage.includes('investimento') ||
      lowerMessage.includes('aplicar')
    ) {
      currentTopic = 'investments';
    } else if (
      lowerMessage.includes('gasto') ||
      lowerMessage.includes('despesa')
    ) {
      currentTopic = 'expenses';
    } else if (
      lowerMessage.includes('saldo') ||
      lowerMessage.includes('conta')
    ) {
      currentTopic = 'account_balance';
    } else if (
      lowerMessage.includes('meta') ||
      lowerMessage.includes('objetivo')
    ) {
      currentTopic = 'financial_goals';
    }

    // Detect user intent
    let userIntent = currentContext.userIntent;
    if (lowerMessage.includes('como') || lowerMessage.includes('o que')) {
      userIntent = 'information_seeking';
    } else if (
      lowerMessage.includes('analise') ||
      lowerMessage.includes('mostre')
    ) {
      userIntent = 'analysis_request';
    } else if (
      lowerMessage.includes('recomende') ||
      lowerMessage.includes('sugira')
    ) {
      userIntent = 'recommendation_request';
    }

    return {
      ...currentContext,
      ...(currentTopic && { currentTopic }),
      ...(userIntent && { userIntent }),
      ...(lowerMessage.includes('financeiro') ||
      lowerMessage.includes('dinheiro')
        ? { lastFinancialQuery: userMessage }
        : {}),
    };
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
   * Get conversation summary for context
   */
  async getConversationSummary(session: ConversationSession): Promise<string> {
    if (session.messages.length <= 1) {
      return 'Nova conversa iniciada.';
    }

    const recentMessages = session.messages.slice(-6); // Last 6 messages
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
}

export default ConversationalAgent;
