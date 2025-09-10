import {
  AxiosRequestConfig,
  AxiosResponseHeaders,
  RawAxiosResponseHeaders,
} from 'axios';

/**
 * Configuração para o cliente Open Finance
 */
export interface OpenFinanceConfig {
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  authUrl?: string;
  useAuth?: boolean;
  timeout?: number;
  maxRetries?: number;
  scope?: string;
}

/**
 * Opções adicionais para requisições
 */
export interface RequestOptions
  extends Omit<AxiosRequestConfig, 'url' | 'method'> {
  retries?: number;
  retryDelay?: number;
}

/**
 * Resposta padrão da API
 */
export interface ApiResponse<T> {
  data?: T;
  status?: number;
  headers?: RawAxiosResponseHeaders | AxiosResponseHeaders;
  success: boolean;
  error?: {
    message: string;
    code: string;
    response?: any;
  };
}

/**
 * Dados de Autenticação OAuth2
 */
export interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
  refresh_token?: string;
}

/**
 * Tipos de consentimento Open Finance
 */
export enum ConsentType {
  ACCOUNTS = 'accounts',
  CREDIT_CARDS = 'credit-cards',
  LOANS = 'loans',
  INVESTMENTS = 'investments',
  FINANCINGS = 'financings',
  INSURANCE = 'insurance',
  PENSION = 'pension',
}

/**
 * Status de consentimento
 */
export enum ConsentStatus {
  AWAITING_AUTHORIZATION = 'AWAITING_AUTHORIZATION',
  AUTHORIZED = 'AUTHORIZED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  REVOKED = 'REVOKED',
}

/**
 * Detalhes do consentimento
 */
export interface Consent {
  consentId: string;
  creationDateTime: string;
  expirationDateTime: string;
  statusUpdateDateTime: string;
  status: ConsentStatus;
  permissions: string[];
  consentTypes: ConsentType[];
  transactionFromDateTime?: string;
  transactionToDateTime?: string;
}

/**
 * Detalhes da conta bancária
 */
export interface Account {
  accountId: string;
  accountType: string;
  accountSubType: string;
  currency: string;
  nickname?: string;
  name: string;
  balance: number;
  available: number;
  blocked?: number;
  overdraftLimit?: number;
  openingDate?: string;
  status: string;
  branch?: string;
  number: string;
  institution: {
    name: string;
    compeCode?: string;
    ispb?: string;
  };
}

/**
 * Detalhes de transação bancária
 */
export interface Transaction {
  transactionId: string;
  accountId: string;
  type: string;
  creditDebitType: 'CREDIT' | 'DEBIT';
  transactionAmount: number;
  currency: string;
  transactionDate: string;
  valueDate: string;
  description: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  category?: string;
  merchant?: {
    name: string;
    documentNumber?: string;
    documentType?: string;
  };
  partyType?: string;
  counterparty?: {
    name?: string;
    documentNumber?: string;
    documentType?: string;
    accountInfo?: {
      accountType?: string;
      branch?: string;
      number?: string;
      ispb?: string;
      bankName?: string;
    };
  };
}

/**
 * Tipo para armazenamento de credenciais de instituição
 */
export interface FinancialInstitution {
  id: string;
  name: string;
  logoUrl?: string;
  authUrl: string;
  apiUrl: string;
  type: 'BANK' | 'INVESTMENT' | 'CREDIT_CARD' | 'OTHER';
}

/**
 * Configuração para retry logic
 */
export interface RetryConfig {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  retryableStatusCodes?: number[];
  retryableErrors?: Array<string | RegExp>;
  onRetry?: (info: {
    error: Error;
    attempt: number;
    waitTime: number;
    willRetry: boolean;
  }) => void;
}

/**
 * Configuração para rate limiting
 */
export interface RateLimitConfig {
  tokensPerInterval?: number;
  interval?: number;
  maxTokens?: number;
}

/**
 * Configuração OAuth para uma instituição financeira
 */
export interface OAuthConfig {
  institutionId: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  apiBaseUrl: string;
  scopes: string | string[];
  certificateUrl?: string;
  additionalParams?: Record<string, string>;
}

/**
 * Requisição de consentimento
 */
export interface ConsentRequest {
  data: {
    loggedUser: {
      document: {
        identification: string;
        rel: string;
      };
    };
    permissions: string[];
    expirationDateTime: string;
    transactionFromDateTime?: string;
    transactionToDateTime?: string;
  };
}

/**
 * Resposta de consentimento
 */
export interface ConsentResponse {
  data: {
    consentId: string;
    creationDateTime: string;
    expirationDateTime: string;
    statusUpdateDateTime: string;
    status: string;
    permissions: string[];
    links: {
      self: string;
      first?: string;
      prev?: string;
      next?: string;
      last?: string;
    };
    meta: {
      totalRecords: number;
      totalPages: number;
      requestDateTime: string;
    };
  };
}

/**
 * Configuração para o ambiente sandbox
 */
export interface SandboxConfig {
  /**
   * Se deve usar URLs reais ou simuladas
   */
  useRealUrls?: boolean;

  /**
   * Se deve gerar respostas simuladas em vez de fazer chamadas reais
   */
  mockResponses?: boolean;

  /**
   * Se deve registrar requisições para debug
   */
  logRequests?: boolean;

  /**
   * Delay artificial em milissegundos para simular latência de rede
   */
  delayResponseMs?: number;

  /**
   * URL de redirecionamento para fluxo OAuth
   */
  redirectUri?: string;
}

/**
 * Detalhes de uma instituição financeira no sandbox
 */
export interface SandboxInstitution {
  /**
   * Identificador único da instituição
   */
  id: string;

  /**
   * Nome da instituição
   */
  name: string;

  /**
   * Tipo da instituição
   */
  type: 'BANK' | 'INVESTMENT' | 'CREDIT_CARD' | 'OTHER';

  /**
   * URL base da API da instituição
   */
  apiBaseUrl: string;

  /**
   * URL base para autenticação
   */
  authUrl: string;

  /**
   * ID do cliente para autenticação
   */
  clientId: string;

  /**
   * Segredo do cliente para autenticação
   */
  clientSecret: string;

  /**
   * Versão da API
   */
  apiVersion: string;

  /**
   * Escopos disponíveis para autenticação
   */
  scopes: string[];

  /**
   * Se a instituição requer certificado para autenticação
   */
  certificateRequired: boolean;
}

/**
 * Status de sincronização de dados
 */
export enum SyncStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  CACHED = 'cached',
  IN_PROGRESS = 'in_progress',
}

/**
 * Resultado de uma operação de sincronização
 */
export interface SyncResult<T> {
  data?: T;
  status: SyncStatus;
  error?: string;
  timestamp: number;
}

/**
 * Configuração para o serviço de sincronização
 */
export interface SyncConfig {
  client?: OpenFinanceClient;
  auth?: OpenFinanceAuth;
  clientConfig?: OpenFinanceConfig;
  authConfig?: OpenFinanceConfig;
  rateLimitConfig?: RateLimitConfig;
  cacheLifetime?: number; // em ms
}

/**
 * Opções para sincronização de contas
 */
export interface AccountSyncOptions {
  forceRefresh?: boolean;
  includeBalances?: boolean;
  includeCreditCards?: boolean;
}

/**
 * Opções para sincronização de transações
 */
export interface TransactionSyncOptions {
  forceRefresh?: boolean;
  fromDate?: Date;
  toDate?: Date;
  pageSize?: number;
  pageNumber?: number;
  includeDetails?: boolean;
}

/**
 * Dados de conta bancária retornados pelo serviço de sincronização
 */
export interface AccountData extends Account {
  institution: {
    id: string;
    name: string;
    compeCode?: string;
    ispb?: string;
  };
  updatedAt: string;
}

/**
 * Dados de transação bancária retornados pelo serviço de sincronização
 */
export interface TransactionData extends Transaction {
  correlationId?: string;
  details?: Record<string, any>;
}

// Definição forward das classes para resolver referências circulares
// Estas são apenas declarações de tipo, as implementações estão em seus respectivos arquivos
export interface OpenFinanceClient {
  get<T = any>(path: string, options?: RequestOptions): Promise<ApiResponse<T>>;
  post<T = any, D = any>(
    path: string,
    data: D,
    options?: RequestOptions
  ): Promise<ApiResponse<T>>;
  put<T = any, D = any>(
    path: string,
    data: D,
    options?: RequestOptions
  ): Promise<ApiResponse<T>>;
  delete<T = any>(
    path: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>>;
  getAccounts(institutionId: string, token: string): Promise<AccountData[]>;
  getTransactions(
    institutionId: string,
    accountId: string,
    token: string,
    options?: TransactionSyncOptions
  ): Promise<TransactionData[]>;
}

export interface OpenFinanceAuth {
  getToken(institutionId: string): Promise<string>;
}
