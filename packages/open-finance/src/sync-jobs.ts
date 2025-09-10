/**
 * Sistema de jobs agendados para sincronização automática de dados bancários
 */

import { CronJob } from 'cron';
import { SyncService } from './sync';
import { OpenFinanceClient } from './client';
import { OpenFinanceAuth } from './auth';
import { logger } from './utils';
import { SyncConfig } from './types';

/**
 * Configurações para jobs de sincronização
 */
export interface SyncJobConfig {
  // ID único para o job
  id: string;
  // Expressão cron para agendamento
  schedule: string;
  // ID da instituição financeira
  institutionId: string;
  // IDs de contas para sincronizar (opcional - se não fornecido, sincroniza todas)
  accountIds?: string[];
  // Data de início para transações (opcional)
  fromDate?: Date;
  // Data de término para transações (opcional - padrão é data atual)
  toDate?: Date;
  // Callback para notificação quando a sincronização for concluída (opcional)
  onComplete?: (success: boolean, error?: string) => void;
}

/**
 * Gerenciador de jobs de sincronização
 * Permite criar, agendar e gerenciar jobs para sincronização automática de dados bancários
 */
export class SyncJobManager {
  private jobs: Map<string, CronJob> = new Map();
  private syncService: SyncService;

  /**
   * Cria uma nova instância do gerenciador de jobs de sincronização
   *
   * @param config Configurações do gerenciador
   */
  constructor(config: SyncConfig) {
    this.syncService = new SyncService(config);
  }

  /**
   * Agenda um novo job de sincronização
   *
   * @param config Configurações do job
   * @returns ID do job criado
   */
  scheduleJob(config: SyncJobConfig): string {
    // Verificar se já existe um job com o mesmo ID
    if (this.jobs.has(config.id)) {
      throw new Error(`Job com ID ${config.id} já existe`);
    }

    // Criar job CRON
    const job = new CronJob(
      config.schedule,
      async () => {
        try {
          logger.info(`Iniciando sincronização agendada: ${config.id}`);

          // Sincronizar contas
          const accountResult = await this.syncService.syncAccounts(
            config.institutionId,
            { forceRefresh: true }
          );

          if (accountResult.status !== 'success') {
            logger.error(`Erro ao sincronizar contas: ${accountResult.error}`);
            config.onComplete?.(false, accountResult.error);
            return;
          }

          // Se accountIds não for fornecido, usa todas as contas retornadas
          const accountsToSync =
            config.accountIds ||
            accountResult.data?.map(account => account.accountId) ||
            [];

          // Sincronizar transações para cada conta
          for (const accountId of accountsToSync) {
            // Preparar as opções de sincronização com tipos corretos
            const syncOptions: any = {
              forceRefresh: true,
            };

            // Adicionar fromDate apenas se estiver definido
            if (config.fromDate) {
              syncOptions.fromDate = config.fromDate;
            }

            // Adicionar toDate, com valor padrão se não estiver definido
            syncOptions.toDate = config.toDate || new Date();

            const transactionResult = await this.syncService.syncTransactions(
              config.institutionId,
              accountId,
              syncOptions
            );

            if (transactionResult.status !== 'success') {
              logger.warn(
                `Erro ao sincronizar transações da conta ${accountId}: ${transactionResult.error}`
              );
            }
          }

          logger.info(`Sincronização agendada concluída: ${config.id}`);
          config.onComplete?.(true);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          logger.error(`Erro na execução do job ${config.id}: ${errorMessage}`);
          config.onComplete?.(false, errorMessage);
        }
      },
      null, // onComplete
      true, // start
      'America/Sao_Paulo' // timezone
    );

    // Armazenar job
    this.jobs.set(config.id, job);
    logger.info(`Job de sincronização agendado: ${config.id}`);

    return config.id;
  }

  /**
   * Cancela um job de sincronização
   *
   * @param id ID do job a ser cancelado
   * @returns true se o job foi cancelado, false se não existia
   */
  cancelJob(id: string): boolean {
    const job = this.jobs.get(id);

    if (!job) {
      return false;
    }

    job.stop();
    this.jobs.delete(id);
    logger.info(`Job de sincronização cancelado: ${id}`);

    return true;
  }

  /**
   * Executa um job imediatamente, independente do agendamento
   *
   * @param id ID do job a ser executado
   * @returns true se o job foi executado, false se não existia
   */
  runJobNow(id: string): boolean {
    const job = this.jobs.get(id);

    if (!job) {
      return false;
    }

    job.fireOnTick();
    logger.info(`Job de sincronização executado manualmente: ${id}`);

    return true;
  }

  /**
   * Lista todos os jobs agendados
   *
   * @returns Array com IDs de todos os jobs
   */
  listJobs(): string[] {
    return Array.from(this.jobs.keys());
  }

  /**
   * Verifica se um job está em execução
   *
   * @param id ID do job
   * @returns true se o job está em execução, false caso contrário
   */
  isJobRunning(id: string): boolean {
    const job = this.jobs.get(id);
    // O tipo CronJob mudou nas versões mais recentes, verificamos se está ativo
    return job ? job.lastDate() !== undefined : false;
  }

  /**
   * Pausa um job (interrompe sem remover)
   *
   * @param id ID do job a ser pausado
   * @returns true se o job foi pausado, false se não existia
   */
  pauseJob(id: string): boolean {
    const job = this.jobs.get(id);

    if (!job) {
      return false;
    }

    job.stop();
    logger.info(`Job de sincronização pausado: ${id}`);

    return true;
  }

  /**
   * Resume um job previamente pausado
   *
   * @param id ID do job a ser resumido
   * @returns true se o job foi resumido, false se não existia
   */
  resumeJob(id: string): boolean {
    const job = this.jobs.get(id);

    if (!job) {
      return false;
    }

    job.start();
    logger.info(`Job de sincronização resumido: ${id}`);

    return true;
  }

  /**
   * Libera recursos utilizados pelo gerenciador de jobs
   */
  dispose(): void {
    // Parar todos os jobs
    for (const [id, job] of this.jobs.entries()) {
      job.stop();
      logger.info(`Job de sincronização interrompido: ${id}`);
    }

    this.jobs.clear();
    this.syncService.dispose();

    logger.info('Gerenciador de jobs de sincronização encerrado');
  }
}
