// Gerenciamento de contexto conversacional com Redis
import Redis from 'ioredis';

export interface ConversationContext {
  userId: string;
  messages: Array<{
    text: string;
    timestamp: number;
    nlp?: any;
  }>;
  profile?: Record<string, any>;
}

export class ConversationMemoryRedis {
  private redis: Redis;
  constructor(redisUrl?: string) {
    this.redis = new Redis(redisUrl || process.env.REDIS_URL);
  }

  async getContext(userId: string): Promise<ConversationContext> {
    const data = await this.redis.get(`convctx:${userId}`);
    if (data) return JSON.parse(data);
    const ctx: ConversationContext = { userId, messages: [], profile: {} };
    await this.redis.set(`convctx:${userId}`, JSON.stringify(ctx));
    return ctx;
  }

  async addMessage(userId: string, text: string, nlp?: any) {
    const ctx = await this.getContext(userId);
    ctx.messages.push({ text, timestamp: Date.now(), nlp });
    await this.redis.set(`convctx:${userId}`, JSON.stringify(ctx));
  }

  async setProfile(userId: string, profile: Record<string, any>) {
    const ctx = await this.getContext(userId);
    ctx.profile = profile;
    await this.redis.set(`convctx:${userId}`, JSON.stringify(ctx));
  }

  async getHistory(
    userId: string
  ): Promise<Array<{ text: string; timestamp: number; nlp?: any }>> {
    const ctx = await this.getContext(userId);
    return ctx.messages;
  }

  async clearContext(userId: string) {
    await this.redis.del(`convctx:${userId}`);
  }
}
