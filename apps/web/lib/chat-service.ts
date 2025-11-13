/**
 * Chat Service
 *
 * Chat service using the modular architecture.
 * This service focuses on session management and interface coordination.
 */

import {
  EnhancedConversationalAgent,
  ConversationSession,
  ConversationMessage,
  AgentResponse,
} from '@financial-ai/ai/src/services/enhanced-conversational-agent';
import { UserProfile } from '@financial-ai/shared';

export interface ChatServiceConfig {
  openaiApiKey: string;
}

export class ChatService {
  private agent: EnhancedConversationalAgent;
  private sessions: Map<string, ConversationSession> = new Map();

  constructor(config: ChatServiceConfig) {
    this.agent = new EnhancedConversationalAgent(config.openaiApiKey);
  }

  /**
   * Create a new chat session for a user
   */
  createSession(userId: string): ConversationSession {
    const session = this.agent.createSession(userId);
    this.sessions.set(session.sessionId, session);
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

    try {
      // Use the enhanced conversational agent to process the message
      const agentResponse: AgentResponse = await this.agent.processMessage(
        message,
        session,
        userProfile
      );

      // Update the session in our local storage
      this.sessions.set(sessionId, agentResponse.session);

      return {
        message: agentResponse.message,
        session: agentResponse.session,
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
          processingTime: 0,
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
    return this.agent.getConversationHistory(sessionId, this.sessions);
  }

  /**
   * Clear a session (for logout or session reset)
   */
  clearSession(sessionId: string): void {
    this.agent.clearSession(sessionId, this.sessions);
  }

  /**
   * Get all sessions for a user
   */
  getUserSessions(userId: string): ConversationSession[] {
    return this.agent.getUserSessions(userId, this.sessions);
  }

  /**
   * Get user data context for analysis
   */
  async getUserDataContext(
    userId: string,
    options: {
      includeTransactions?: boolean;
      transactionDays?: number | 'all';
      includeProfile?: boolean;
    } = {}
  ) {
    return await this.agent.getUserDataContext(userId, options);
  }

  /**
   * Analyze user's financial situation
   */
  async analyzeFinancialSituation(userId: string) {
    return await this.agent.analyzeFinancialSituation(userId);
  }

  /**
   * Generate a unique message ID
   */
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get session statistics
   */
  getSessionStats(): {
    totalSessions: number;
    activeSessions: number;
    totalMessages: number;
  } {
    const sessions = Array.from(this.sessions.values());
    const totalMessages = sessions.reduce(
      (sum, session) => sum + session.messages.length,
      0
    );

    return {
      totalSessions: sessions.length,
      activeSessions: sessions.filter(
        s => Date.now() - s.updatedAt.getTime() < 30 * 60 * 1000 // Active within last 30 minutes
      ).length,
      totalMessages,
    };
  }

  /**
   * Clean up old sessions (call periodically)
   */
  cleanupOldSessions(maxAgeHours: number = 24): number {
    const cutoffTime = Date.now() - maxAgeHours * 60 * 60 * 1000;
    let cleanedCount = 0;

    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.updatedAt.getTime() < cutoffTime) {
        this.sessions.delete(sessionId);
        cleanedCount++;
      }
    }

    return cleanedCount;
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

// Export types for compatibility
export type {
  ConversationMessage,
  ConversationSession,
} from '@financial-ai/ai/src/services/enhanced-conversational-agent';
export type { UserProfile } from '@financial-ai/shared/src/types';
