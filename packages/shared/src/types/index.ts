import { z } from 'zod';

// User Types
export const RiskToleranceSchema = z.enum(['conservative', 'moderate', 'aggressive']);
export type RiskTolerance = z.infer<typeof RiskToleranceSchema>;

export const UserProfileSchema = z.object({
  riskTolerance: RiskToleranceSchema,
  financialGoals: z.array(z.string()),
  incomeRange: z.string(),
  ageGroup: z.string(),
  financialKnowledgeLevel: z.enum(['beginner', 'intermediate', 'advanced']),
});
export type UserProfile = z.infer<typeof UserProfileSchema>;

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  profile: UserProfileSchema,
  preferences: z.record(z.unknown()),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type User = z.infer<typeof UserSchema>;

// Transaction Types
export const TransactionCategorySchema = z.object({
  primary: z.string(),
  secondary: z.string().optional(),
  confidence: z.number().min(0).max(1),
});
export type TransactionCategory = z.infer<typeof TransactionCategorySchema>;

export const TransactionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  accountId: z.string(),
  amount: z.number(),
  currency: z.string().length(3),
  date: z.date(),
  description: z.string(),
  category: TransactionCategorySchema,
  merchant: z.object({
    name: z.string(),
    category: z.string(),
  }).optional(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string(),
  }).optional(),
  metadata: z.record(z.unknown()),
  createdAt: z.date(),
});
export type Transaction = z.infer<typeof TransactionSchema>;

// Knowledge Base Types
export const KnowledgeDocumentSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  source: z.string(),
  category: z.string(),
  embedding: z.array(z.number()).optional(),
  metadata: z.record(z.unknown()),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type KnowledgeDocument = z.infer<typeof KnowledgeDocumentSchema>;

// Conversation Types
export const MessageRoleSchema = z.enum(['user', 'assistant', 'system']);
export type MessageRole = z.infer<typeof MessageRoleSchema>;

export const MessageSchema = z.object({
  id: z.string(),
  content: z.string(),
  role: MessageRoleSchema,
  timestamp: z.date(),
  sources: z.array(z.object({
    title: z.string(),
    url: z.string(),
    relevance: z.number(),
  })).optional(),
});
export type Message = z.infer<typeof MessageSchema>;

export const ConversationSessionSchema = z.object({
  sessionId: z.string(),
  userId: z.string(),
  messages: z.array(MessageSchema),
  context: z.record(z.unknown()),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type ConversationSession = z.infer<typeof ConversationSessionSchema>;

// API Response Types
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }).optional(),
  timestamp: z.date(),
});
export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: Date;
};