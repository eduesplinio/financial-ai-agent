/**
 * Serviço de agendamento de sincronização para dados do Open Finance
 * Implementa jobs periódicos para atualização automática de dados bancários
 */

import { SyncService } from './sync';
import { OpenFinanceConfig } from './types';

export interface SchedulerConfig {
  /**
   * Intervalo em ms para sincronização de contas
   * @default 24 horas (86400000 ms)
   */
  accountSyncInterval?: number;

  /**
   * Intervalo em ms para sincronização de transações
   * @default 12 horas (43200000 ms)
   */
  transactionSyncInterval?: number;

  /**
   * Função de callback para registrar logs
   */
  logger?: (message: string, level: 'info' | 'warn' | 'error') => void;

  /**
   * Função de callback para notificar erros
   */
  onError?: (error: Error, context: string) => void;
}

export class SyncScheduler {
  private syncService: SyncService;
  private config: SchedulerConfig;
  private accountIntervalId: NodeJS.Timeout | null = null;
  private transactionIntervalId: NodeJS.Timeout | null = null;
  private institutionIds: string[] = [];

  /**
   * Cria uma nova instância do agendador de sincronização
   *
   * @param syncService Instância do serviço de sincronização
   * @param config Configuração do agendador
   */
  constructor(syncService: SyncService, config: SchedulerConfig = {}) {
    this.syncService = syncService;
    this.config = {
      accountSyncInterval: 86400000, // 24 horas
      transactionSyncInterval: 43200000, // 12 horas
      logger: (message: string, level: 'info' | 'warn' | 'error') => {
        console[level](`[SyncScheduler] ${message}`);
      },
      onError: (error: Error, context: string) => {
        console.error(`[SyncScheduler] Error in ${context}:`, error);
      },
      ...config,
    };
  }

  /**
   * Registra instituições para sincronização automática
   *
   * @param institutionIds Array de IDs de instituições para sincronizar
   */
  public registerInstitutions(institutionIds: string[]): void {
    this.institutionIds = [
      ...new Set([...this.institutionIds, ...institutionIds]),
    ];
    this.config.logger?.(
      `Registered institutions for sync: ${institutionIds.join(', ')}`,
      'info'
    );
  }

  /**
   * Inicia os jobs de sincronização automática
   */
  public start(): void {
    if (this.institutionIds.length === 0) {
      this.config.logger?.(
        'No institutions registered for sync. Use registerInstitutions() first.',
        'warn'
      );
      return;
    }

    // Cancelar jobs existentes se houver
    this.stop();

    // Iniciar sincronização de contas
    this.accountIntervalId = setInterval(() => {
      this.syncAccounts().catch(error => {
        this.config.onError?.(error, 'account sync interval');
      });
    }, this.config.accountSyncInterval);

    // Iniciar sincronização de transações
    this.transactionIntervalId = setInterval(() => {
      this.syncTransactions().catch(error => {
        this.config.onError?.(error, 'transaction sync interval');
      });
    }, this.config.transactionSyncInterval);

    // Executar sincronização inicial
    this.syncAccounts().catch(error => {
      this.config.onError?.(error, 'initial account sync');
    });

    this.config.logger?.('Sync scheduler started', 'info');
  }

  /**
   * Para todos os jobs de sincronização
   */
  public stop(): void {
    if (this.accountIntervalId) {
      clearInterval(this.accountIntervalId);
      this.accountIntervalId = null;
    }

    if (this.transactionIntervalId) {
      clearInterval(this.transactionIntervalId);
      this.transactionIntervalId = null;
    }

    this.config.logger?.('Sync scheduler stopped', 'info');
  }

  /**
   * Sincroniza contas para todas as instituições registradas
   */
  private async syncAccounts(): Promise<void> {
    this.config.logger?.('Starting scheduled account sync', 'info');

    for (const institutionId of this.institutionIds) {
      try {
        const result = await this.syncService.syncAccounts(institutionId);

        if (result.status === 'error') {
          this.config.logger?.(
            `Error syncing accounts for institution ${institutionId}: ${result.error}`,
            'error'
          );
        } else {
          const accounts = result.data || [];
          this.config.logger?.(
            `Successfully synced ${accounts.length} accounts for institution ${institutionId} (${result.status})`,
            'info'
          );
        }
      } catch (error) {
        this.config.onError?.(
          error instanceof Error ? error : new Error(String(error)),
          `account sync for institution ${institutionId}`
        );
      }
    }
  }

  /**
   * Sincroniza transações para todas as instituições registradas
   */
  private async syncTransactions(): Promise<void> {
    this.config.logger?.('Starting scheduled transaction sync', 'info');

    for (const institutionId of this.institutionIds) {
      try {
        // Primeiro precisamos obter as contas
        const accountsResult =
          await this.syncService.syncAccounts(institutionId);

        if (accountsResult.status === 'error' || !accountsResult.data) {
          this.config.logger?.(
            `Could not sync transactions: failed to get accounts for ${institutionId}: ${accountsResult.error}`,
            'error'
          );
          continue;
        }

        const accounts = accountsResult.data;

        // Para cada conta, sincronizar transações
        for (const account of accounts) {
          try {
            const result = await this.syncService.syncTransactions(
              institutionId,
              account.accountId,
              // Sincronizar transações dos últimos 30 dias
              {
                fromDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
              }
            );

            if (result.status === 'error') {
              this.config.logger?.(
                `Error syncing transactions for account ${account.accountId}: ${result.error}`,
                'error'
              );
            } else {
              const transactions = result.data || [];
              this.config.logger?.(
                `Successfully synced ${transactions.length} transactions for account ${account.accountId} (${result.status})`,
                'info'
              );
            }
          } catch (error) {
            this.config.onError?.(
              error instanceof Error ? error : new Error(String(error)),
              `transaction sync for account ${account.accountId}`
            );
          }
        }
      } catch (error) {
        this.config.onError?.(
          error instanceof Error ? error : new Error(String(error)),
          `transaction sync process for institution ${institutionId}`
        );
      }
    }
  }

  /**
   * Libera recursos utilizados pelo agendador
   */
  public dispose(): void {
    this.stop();
    this.institutionIds = [];
    this.config.logger?.('Sync scheduler disposed', 'info');
  }
}
