/**
 * Serviço de sincronização de dados bancários do Open Finance
 */

import { OpenFinanceClient } from './client';
import { OpenFinanceAuth } from './auth';
import { RateLimiter } from './retry';
import {
  AccountData,
  SyncConfig,
  SyncResult,
  TransactionData,
  SyncStatus,
  TransactionSyncOptions,
  AccountSyncOptions,
  OpenFinanceClient as IOpenFinanceClient,
  OpenFinanceAuth as IOpenFinanceAuth,
} from './types';

/**
 * Classe responsável pela sincronização de dados bancários do Open Finance
 * Implementa lógica para sincronizar contas e transações com cache
 */
export class SyncService {
  private client: IOpenFinanceClient;
  private auth: IOpenFinanceAuth;
  private rateLimiter: RateLimiter;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheLifetime: number; // tempo de vida do cache em ms

  /**
   * Cria uma nova instância do serviço de sincronização
   *
   * @param config Configurações de sincronização
   */
  constructor(config: SyncConfig) {
    // Verificar se client ou clientConfig estão disponíveis
    if (config.client) {
      this.client = config.client as IOpenFinanceClient;
    } else if (config.clientConfig) {
      this.client = new OpenFinanceClient(
        config.clientConfig
      ) as unknown as IOpenFinanceClient;
    } else {
      throw new Error('É necessário fornecer um client ou clientConfig');
    }

    // Verificar se auth ou authConfig estão disponíveis
    if (config.auth) {
      this.auth = config.auth as IOpenFinanceAuth;
    } else if (config.authConfig) {
      this.auth = new OpenFinanceAuth(
        config.authConfig
      ) as unknown as IOpenFinanceAuth;
    } else {
      throw new Error('É necessário fornecer um auth ou authConfig');
    }

    this.rateLimiter = new RateLimiter(config.rateLimitConfig || {});
    this.cacheLifetime = config.cacheLifetime || 5 * 60 * 1000; // 5 minutos por padrão
  }

  /**
   * Sincroniza dados de contas bancárias
   *
   * @param institutionId ID da instituição financeira
   * @param options Opções de sincronização
   * @returns Resultado da sincronização
   */
  public async syncAccounts(
    institutionId: string,
    options: AccountSyncOptions = {}
  ): Promise<SyncResult<AccountData[]>> {
    const cacheKey = `accounts:${institutionId}`;

    // Verifica se existe cache válido
    const cachedData = this.getFromCache<AccountData[]>(cacheKey);
    if (cachedData && !options.forceRefresh) {
      return {
        data: cachedData,
        status: SyncStatus.CACHED,
        timestamp: Date.now(),
      };
    }

    try {
      // Obtém token de acesso atualizado
      const token = await this.auth.getToken(institutionId);

      // Realiza a requisição respeitando o rate limit
      const accounts = await this.rateLimiter.execute(async () => {
        return this.client.getAccounts(institutionId, token);
      });

      // Salva no cache
      this.saveToCache(cacheKey, accounts);

      return {
        data: accounts,
        status: SyncStatus.SUCCESS,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      return {
        status: SyncStatus.ERROR,
        error: error.message || 'Erro ao sincronizar contas',
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Sincroniza transações de uma conta bancária
   *
   * @param institutionId ID da instituição financeira
   * @param accountId ID da conta bancária
   * @param options Opções de sincronização
   * @returns Resultado da sincronização
   */
  public async syncTransactions(
    institutionId: string,
    accountId: string,
    options: TransactionSyncOptions = {}
  ): Promise<SyncResult<TransactionData[]>> {
    const fromDate = options.fromDate || this.getDefaultFromDate();
    const toDate = options.toDate || new Date();

    const cacheKey = `transactions:${institutionId}:${accountId}:${fromDate.toISOString()}:${toDate.toISOString()}`;

    // Verifica se existe cache válido
    const cachedData = this.getFromCache<TransactionData[]>(cacheKey);
    if (cachedData && !options.forceRefresh) {
      return {
        data: cachedData,
        status: SyncStatus.CACHED,
        timestamp: Date.now(),
      };
    }

    try {
      // Obtém token de acesso atualizado
      const token = await this.auth.getToken(institutionId);

      // Realiza a requisição respeitando o rate limit
      const transactions = await this.rateLimiter.execute(async () => {
        return this.client.getTransactions(institutionId, accountId, token, {
          fromDate,
          toDate,
          ...options,
        });
      });

      // Salva no cache
      this.saveToCache(cacheKey, transactions);

      return {
        data: transactions,
        status: SyncStatus.SUCCESS,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      return {
        status: SyncStatus.ERROR,
        error: error.message || 'Erro ao sincronizar transações',
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Limpa o cache por chave ou todo o cache se não for especificada uma chave
   *
   * @param cacheKey Chave opcional para limpar apenas uma entrada específica
   * @returns Número de entradas removidas do cache
   */
  public clearCache(cacheKey?: string): number {
    if (cacheKey) {
      const hadKey = this.cache.has(cacheKey);
      this.cache.delete(cacheKey);
      return hadKey ? 1 : 0;
    }

    const size = this.cache.size;
    this.cache.clear();
    return size;
  }

  /**
   * Obtém uma data padrão de 90 dias atrás para busca de transações
   *
   * @returns Data de 90 dias atrás
   */
  private getDefaultFromDate(): Date {
    const date = new Date();
    date.setDate(date.getDate() - 90); // 90 dias atrás
    return date;
  }

  /**
   * Salva dados no cache com timestamp atual
   *
   * @param key Chave do cache
   * @param data Dados a serem armazenados
   */
  private saveToCache<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });

    // Limpa entradas expiradas do cache periodicamente
    this.cleanExpiredCache();
  }

  /**
   * Obtém dados do cache se estiverem dentro do tempo de vida
   *
   * @param key Chave do cache
   * @returns Dados do cache ou undefined se expirado ou não existente
   */
  private getFromCache<T>(key: string): T | undefined {
    const cached = this.cache.get(key);

    if (!cached) {
      return undefined;
    }

    const isExpired = Date.now() - cached.timestamp > this.cacheLifetime;

    if (isExpired) {
      this.cache.delete(key);
      return undefined;
    }

    return cached.data as T;
  }

  /**
   * Remove entradas expiradas do cache
   */
  private cleanExpiredCache(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    // Primeiro coletamos todas as chaves que precisam ser deletadas
    this.cache.forEach((value, key) => {
      if (now - value.timestamp > this.cacheLifetime) {
        keysToDelete.push(key);
      }
    });

    // Depois removemos as entradas expiradas
    keysToDelete.forEach(key => {
      this.cache.delete(key);
    });
  }

  /**
   * Libera recursos utilizados pelo serviço
   */
  public dispose(): void {
    this.rateLimiter.dispose();
    this.cache.clear();
  }
}
