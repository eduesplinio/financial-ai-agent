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
  riskTolerance: string;
  financialKnowledgeLevel: string;
  ageGroup: string;
}

export interface ChatServiceConfig {
  openaiApiKey: string;
}

export class ChatService {
  private openaiApiKey: string;
  private sessions: Map<string, ConversationSession> = new Map();

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

      // Call OpenAI API directly
      const response = await this.callOpenAI(
        message,
        updatedSession,
        userProfile
      );

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
        context: this.updateConversationContext(
          updatedSession.context,
          message,
          response
        ),
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
   * Call OpenAI API directly
   */
  private async callOpenAI(
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
    const systemPrompt = `Você é um assistente financeiro especializado, treinado para fornecer informações precisas 
e personalizadas sobre finanças pessoais, investimentos e economia brasileira. 

Responda sempre em português brasileiro e seja claro, conciso e didático.
Evite usar jargões financeiros complexos a menos que o usuário demonstre familiaridade com eles.

${
  userProfile
    ? `O usuário tem o seguinte perfil:
- Tolerância a risco: ${userProfile.riskTolerance}
- Nível de conhecimento financeiro: ${userProfile.financialKnowledgeLevel}
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
   * Update conversation context
   */
  private updateConversationContext(
    currentContext: ConversationSession['context'],
    userMessage: string,
    response: any
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
