// Gerenciamento de contexto conversacional para agente financeiro
// Estrutura inicial para integração com Redis e histórico de conversas

export interface ConversationContext {
  userId: string;
  messages: Array<{
    text: string;
    timestamp: number;
    nlp?: any;
  }>;
  profile?: Record<string, any>;
}

export class ConversationMemory {
  private contextMap: Map<string, ConversationContext> = new Map();

  getContext(userId: string): ConversationContext {
    if (!this.contextMap.has(userId)) {
      this.contextMap.set(userId, {
        userId,
        messages: [],
        profile: {},
      });
    }
    return this.contextMap.get(userId)!;
  }

  addMessage(userId: string, text: string, nlp?: any) {
    const ctx = this.getContext(userId);
    ctx.messages.push({ text, timestamp: Date.now(), nlp });
  }

  setProfile(userId: string, profile: Record<string, any>) {
    const ctx = this.getContext(userId);
    ctx.profile = profile;
  }

  getHistory(
    userId: string
  ): Array<{ text: string; timestamp: number; nlp?: any }> {
    return this.getContext(userId).messages;
  }
}
