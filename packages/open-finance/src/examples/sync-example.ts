/**
 * Exemplo de uso do sistema de sincronização do Open Finance
 * Este arquivo mostra como configurar e usar o SyncService, SyncScheduler e WebhookService
 */

import { OpenFinanceClient } from '../client';
import { OpenFinanceAuth } from '../auth';
import { SyncService } from '../sync';
import { SyncScheduler } from '../scheduler';
import {
  WebhookService,
  WebhookEventType,
  WebhookSubscriber,
} from '../webhook';

// Logger tipado
type LogLevel = 'info' | 'warn' | 'error';
type LoggerFn = (message: string, level: LogLevel) => void;

/**
 * Configurar serviço de sincronização com agendamento e webhooks
 */
async function setupSyncServices(config: {
  apiBaseUrl: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}) {
  // Inicializar cliente do Open Finance
  const client = new OpenFinanceClient({
    baseUrl: config.apiBaseUrl,
    clientId: config.clientId,
    clientSecret: config.clientSecret,
  });

  // Inicializar autenticação
  const auth = new OpenFinanceAuth({
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    // A API atual não tem redirectUri na interface OpenFinanceConfig
    // Usando inicialização parcial para fins de exemplo
  } as any);

  // Criar serviço de sincronização
  const syncService = new SyncService({
    client: client,
    auth: auth,
  });

  // Logger tipado para webhooks
  const webhookLogger: LoggerFn = (message, level) => {
    if (level === 'info') console.info(`[Webhook] ${message}`);
    else if (level === 'warn') console.warn(`[Webhook] ${message}`);
    else if (level === 'error') console.error(`[Webhook] ${message}`);
  };

  // Criar serviço de webhooks
  const webhookService = new WebhookService();

  // Nota: A implementação atual do WebhookService pode não ter o método setSyncService
  // Nesse caso, você precisaria inicializar com syncService diretamente ou usar qualquer método
  // disponível na sua implementação atual para integrar os dois serviços

  // Registrar um destinatário de webhook externo (opcional)
  const subscriber: WebhookSubscriber = {
    id: 'app-backend',
    url: 'https://sua-aplicacao.com/webhooks/open-finance',
    events: [
      WebhookEventType.ACCOUNT_UPDATED,
      WebhookEventType.TRANSACTION_CREATED,
      WebhookEventType.CONSENT_UPDATED,
    ],
    enabled: true,
    secret: 'outra-chave-secreta', // Para assinar os eventos
    maxRetries: 5,
  };

  webhookService.addSubscriber(subscriber);

  // Logger tipado para o agendador
  const schedulerLogger: LoggerFn = (message, level) => {
    if (level === 'info') console.info(`[Scheduler] ${message}`);
    else if (level === 'warn') console.warn(`[Scheduler] ${message}`);
    else if (level === 'error') console.error(`[Scheduler] ${message}`);
  };

  // Configurar agendador de sincronização
  const scheduler = new SyncScheduler(syncService, {
    // Configurações personalizadas
    accountSyncInterval: 12 * 60 * 60 * 1000, // 12 horas
    transactionSyncInterval: 6 * 60 * 60 * 1000, // 6 horas
    logger: schedulerLogger,
    onError: (error: Error, context: string) => {
      console.error(`[Scheduler Error] ${context}:`, error);

      // Publicar evento de falha para webhooks (opcional)
      webhookService.publish(WebhookEventType.SYNC_FAILED, {
        context,
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    },
  });

  // Registrar instituições para sincronização automática
  const institutionIds = ['banco1', 'banco2', 'banco3'];
  scheduler.registerInstitutions(institutionIds);

  return {
    client,
    auth,
    syncService,
    webhookService,
    scheduler,
  };
}

/**
 * Iniciar os serviços
 */
async function startServices() {
  const services = await setupSyncServices({
    apiBaseUrl: 'https://api.openfinance.com.br',
    clientId: 'seu-client-id',
    clientSecret: 'seu-client-secret',
    redirectUri: 'https://sua-aplicacao.com/callback',
  });

  // Iniciar agendador
  services.scheduler.start();

  console.log('Serviços de sincronização iniciados com sucesso!');

  // Exemplo: publicar manualmente um evento de webhook (para testes)
  services.webhookService.publish(WebhookEventType.SYNC_COMPLETED, {
    institutionId: 'banco1',
    completedAt: new Date().toISOString(),
    status: 'success',
  });

  return services;
}

// Exportar funções de exemplo
export { setupSyncServices, startServices };
