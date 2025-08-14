export const ERROR_CODES = {
  // Authentication
  AUTH_INVALID_CREDENTIALS: 'AUTH_001',
  AUTH_TOKEN_EXPIRED: 'AUTH_002',
  AUTH_INSUFFICIENT_PERMISSIONS: 'AUTH_003',
  
  // Open Finance
  OF_CONNECTION_FAILED: 'OF_001',
  OF_CONSENT_EXPIRED: 'OF_002',
  OF_RATE_LIMIT_EXCEEDED: 'OF_003',
  
  // Processing
  PROC_CATEGORIZATION_FAILED: 'PROC_001',
  PROC_DUPLICATE_DETECTION_FAILED: 'PROC_002',
  
  // RAG System
  RAG_SEARCH_FAILED: 'RAG_001',
  RAG_GENERATION_FAILED: 'RAG_002',
  RAG_KNOWLEDGE_BASE_UNAVAILABLE: 'RAG_003',
  
  // General
  INTERNAL_SERVER_ERROR: 'GEN_001',
  VALIDATION_ERROR: 'GEN_002',
  NOT_FOUND: 'GEN_003',
} as const;

export const TRANSACTION_CATEGORIES = {
  FOOD: 'alimentacao',
  TRANSPORT: 'transporte',
  HOUSING: 'moradia',
  HEALTHCARE: 'saude',
  EDUCATION: 'educacao',
  ENTERTAINMENT: 'entretenimento',
  SHOPPING: 'compras',
  UTILITIES: 'utilidades',
  INVESTMENT: 'investimento',
  INCOME: 'renda',
  OTHER: 'outros',
} as const;

export const RISK_TOLERANCE_LEVELS = {
  CONSERVATIVE: 'conservative',
  MODERATE: 'moderate',
  AGGRESSIVE: 'aggressive',
} as const;

export const FINANCIAL_KNOWLEDGE_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
} as const;