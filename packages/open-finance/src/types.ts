import { AxiosRequestConfig, AxiosResponseHeaders, RawAxiosResponseHeaders } from 'axios';

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
export interface RequestOptions extends Omit<AxiosRequestConfig, 'url' | 'method'> {
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
  PENSION = 'pension'
}

/**
 * Status de consentimento
 */
export enum ConsentStatus {
  AWAITING_AUTHORIZATION = 'AWAITING_AUTHORIZATION',
  AUTHORIZED = 'AUTHORIZED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  REVOKED = 'REVOKED'
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
