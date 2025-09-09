/**
 * Utilitários para retry logic e rate limiting
 */

import { ApiResponse, RateLimitConfig, RetryConfig } from './types';

/**
 * Calcula o tempo de espera para retry com exponential backoff e jitter
 * 
 * @param attempt Número da tentativa (começando em 1)
 * @param baseDelay Delay base em ms
 * @param maxDelay Delay máximo em ms
 * @returns Tempo de espera em ms
 */
export function calculateBackoff(attempt: number, baseDelay: number = 1000, maxDelay: number = 30000): number {
  // Exponential backoff: baseDelay * 2^(attempt-1)
  const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
  
  // Adicionar jitter (random noise) para evitar thundering herd
  const jitter = Math.random() * baseDelay;
  
  // Limitar ao delay máximo
  return Math.min(exponentialDelay + jitter, maxDelay);
}

/**
 * Cria um delay usando Promise
 * 
 * @param ms Tempo de espera em ms
 * @returns Promise que resolve após o tempo especificado
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Executa uma função com retry automático usando exponential backoff
 * 
 * @param fn Função a ser executada (deve retornar uma Promise)
 * @param config Configuração de retry
 * @returns O resultado da função ou erro após todas as tentativas
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 30000,
    retryableStatusCodes = [408, 429, 500, 502, 503, 504],
    retryableErrors = [],
    onRetry = () => {}
  } = config;

  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Verificar se o erro é retryable baseado no status code
      const isRetryableStatus = error.response?.status && 
        retryableStatusCodes.includes(error.response.status);
      
      // Verificar se o erro é retryable baseado no tipo/mensagem
      const isRetryableError = retryableErrors.some(pattern => {
        if (typeof pattern === 'string') {
          return error.message?.includes(pattern);
        }
        return pattern.test(error.message);
      });
      
      // Não fazer retry se não for um erro retryable ou se for a última tentativa
      if ((!isRetryableStatus && !isRetryableError) || attempt >= maxRetries) {
        throw error;
      }
      
      // Calcular tempo de espera
      const waitTime = calculateBackoff(attempt + 1, baseDelay, maxDelay);
      
      // Callback de retry
      onRetry({
        error,
        attempt: attempt + 1,
        waitTime,
        willRetry: true
      });
      
      // Esperar antes de tentar novamente
      await delay(waitTime);
    }
  }
  
  // Isso nunca deve acontecer devido aos checks acima, mas TypeScript exige um retorno
  throw lastError || new Error('Unknown error during retry');
}

/**
 * Classe para gerenciar rate limiting
 */
export class RateLimiter {
  private queue: Array<() => void> = [];
  private isProcessing = false;
  private lastRequestTime = 0;
  private tokenBucket: number;
  
  /**
   * Cria uma nova instância de RateLimiter
   * 
   * @param config Configuração do rate limiter
   */
  constructor(private config: RateLimitConfig = {}) {
    const {
      tokensPerInterval = 10,
      interval = 1000,
      maxTokens = 10
    } = config;
    
    this.tokenBucket = maxTokens;
    
    // Repõe tokens no bucket periodicamente
    if (tokensPerInterval > 0) {
      setInterval(() => {
        this.tokenBucket = Math.min(
          this.tokenBucket + tokensPerInterval,
          maxTokens
        );
        
        // Processa itens da fila se houver tokens disponíveis
        this.processQueue();
      }, interval);
    }
  }
  
  /**
   * Processa a fila de requisições pendentes
   */
  private processQueue(): void {
    if (this.isProcessing || this.queue.length === 0 || this.tokenBucket <= 0) {
      return;
    }
    
    this.isProcessing = true;
    
    try {
      while (this.queue.length > 0 && this.tokenBucket > 0) {
        const resolve = this.queue.shift();
        if (resolve) {
          this.tokenBucket--;
          resolve();
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }
  
  /**
   * Limita a taxa de execução de uma função
   * 
   * @returns Promise que resolve quando a função pode ser executada
   */
  public async acquire(): Promise<void> {
    // Se houver tokens disponíveis e nenhuma requisição na fila, executa imediatamente
    if (this.tokenBucket > 0 && this.queue.length === 0) {
      this.tokenBucket--;
      return Promise.resolve();
    }
    
    // Caso contrário, adiciona à fila
    return new Promise<void>((resolve) => {
      this.queue.push(resolve);
      this.processQueue();
    });
  }
  
  /**
   * Executa uma função respeitando o rate limit
   * 
   * @param fn Função a ser executada
   * @returns O resultado da função
   */
  public async execute<T>(fn: () => Promise<T>): Promise<T> {
    await this.acquire();
    return fn();
  }
}
