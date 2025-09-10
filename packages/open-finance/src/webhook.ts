/**
 * Sistema de webhooks para atualizações em tempo real
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { createHash, createHmac } from 'crypto';
import { logger } from './utils';

/**
 * Evento de webhook
 */
export enum WebhookEventType {
  ACCOUNT_UPDATED = 'account.updated',
  TRANSACTION_CREATED = 'transaction.created',
  TRANSACTION_UPDATED = 'transaction.updated',
  CONSENT_UPDATED = 'consent.updated',
  SYNC_COMPLETED = 'sync.completed',
  SYNC_FAILED = 'sync.failed',
}

/**
 * Payload de um evento de webhook
 */
export interface WebhookPayload<T = any> {
  id: string;
  event: WebhookEventType;
  createdAt: string;
  data: T;
}

/**
 * Configuração para destinatário de webhook
 */
export interface WebhookSubscriber {
  id: string;
  url: string;
  events: WebhookEventType[];
  secret?: string;
  headers?: Record<string, string>;
  enabled: boolean;
  maxRetries?: number;
  retryDelayMs?: number;
}

/**
 * Resposta do envio de webhook
 */
export interface WebhookDeliveryResult {
  success: boolean;
  statusCode?: number;
  error?: string;
  retryCount: number;
  timestamp: string;
}

/**
 * Serviço de webhooks para notificações em tempo real
 */
export class WebhookService {
  private subscribers: Map<string, WebhookSubscriber> = new Map();
  private httpClient: AxiosInstance;
  private deliveryQueue: Array<{
    subscriber: WebhookSubscriber;
    payload: WebhookPayload;
    retries: number;
  }> = [];
  private isProcessing = false;

  /**
   * Cria uma nova instância do serviço de webhooks
   */
  constructor() {
    this.httpClient = axios.create({
      timeout: 10000,
    });

    // Processar fila a cada 1 segundo
    setInterval(() => this.processQueue(), 1000);
  }

  /**
   * Adiciona um novo destinatário de webhook
   *
   * @param subscriber Configuração do destinatário
   * @returns ID do destinatário
   */
  addSubscriber(subscriber: WebhookSubscriber): string {
    if (this.subscribers.has(subscriber.id)) {
      throw new Error(`Subscriber com ID ${subscriber.id} já existe`);
    }

    this.subscribers.set(subscriber.id, {
      ...subscriber,
      maxRetries: subscriber.maxRetries ?? 5,
      retryDelayMs: subscriber.retryDelayMs ?? 60000, // 1 minuto
    });

    logger.info(`Webhook subscriber adicionado: ${subscriber.id}`);
    return subscriber.id;
  }

  /**
   * Remove um destinatário de webhook
   *
   * @param id ID do destinatário
   * @returns true se removido, false se não existia
   */
  removeSubscriber(id: string): boolean {
    const result = this.subscribers.delete(id);
    if (result) {
      logger.info(`Webhook subscriber removido: ${id}`);
    }
    return result;
  }

  /**
   * Atualiza a configuração de um destinatário
   *
   * @param id ID do destinatário
   * @param updates Atualizações a serem aplicadas
   * @returns true se atualizado, false se não existia
   */
  updateSubscriber(id: string, updates: Partial<WebhookSubscriber>): boolean {
    const subscriber = this.subscribers.get(id);
    if (!subscriber) {
      return false;
    }

    this.subscribers.set(id, { ...subscriber, ...updates });
    logger.info(`Webhook subscriber atualizado: ${id}`);
    return true;
  }

  /**
   * Lista todos os destinatários
   */
  listSubscribers(): WebhookSubscriber[] {
    return Array.from(this.subscribers.values());
  }

  /**
   * Publica um evento para todos os destinatários interessados
   *
   * @param event Tipo de evento
   * @param data Dados do evento
   * @returns Número de destinatários notificados
   */
  publish<T>(event: WebhookEventType, data: T): number {
    const payload: WebhookPayload<T> = {
      id: this.generateEventId(),
      event,
      createdAt: new Date().toISOString(),
      data,
    };

    let count = 0;

    // Adicionar à fila para cada subscriber interessado
    for (const subscriber of this.subscribers.values()) {
      if (subscriber.enabled && subscriber.events.includes(event)) {
        this.deliveryQueue.push({
          subscriber,
          payload,
          retries: 0,
        });
        count++;
      }
    }

    if (count > 0) {
      logger.info(`Evento ${event} publicado para ${count} destinatários`);
    }

    return count;
  }

  /**
   * Processa a fila de entrega de webhooks
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.deliveryQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      const item = this.deliveryQueue.shift();
      if (!item) {
        this.isProcessing = false;
        return;
      }

      const { subscriber, payload, retries } = item;

      // Verificar se o subscriber ainda existe e está ativo
      const currentSubscriber = this.subscribers.get(subscriber.id);
      if (!currentSubscriber || !currentSubscriber.enabled) {
        this.isProcessing = false;
        return;
      }

      try {
        const result = await this.deliverWebhook(subscriber, payload);

        if (!result.success && retries < (subscriber.maxRetries || 5)) {
          // Reagendar com exponential backoff
          const delay = Math.min(
            (subscriber.retryDelayMs || 60000) * Math.pow(2, retries),
            3600000 // Máximo de 1 hora
          );

          setTimeout(() => {
            this.deliveryQueue.push({
              subscriber,
              payload,
              retries: retries + 1,
            });
          }, delay);

          logger.warn(
            `Webhook para ${subscriber.id} falhou, reagendando tentativa ${retries + 1} em ${delay}ms`
          );
        } else if (!result.success) {
          logger.error(
            `Webhook para ${subscriber.id} falhou após ${retries} tentativas: ${result.error}`
          );
        } else {
          logger.info(`Webhook entregue com sucesso para ${subscriber.id}`);
        }
      } catch (error) {
        logger.error(
          `Erro ao processar webhook para ${subscriber.id}: ${error}`
        );
      }
    } finally {
      this.isProcessing = false;

      // Continuar processando se houver mais itens
      if (this.deliveryQueue.length > 0) {
        setImmediate(() => this.processQueue());
      }
    }
  }

  /**
   * Entrega um webhook para um destinatário
   *
   * @param subscriber Destinatário
   * @param payload Dados do evento
   * @returns Resultado da entrega
   */
  private async deliverWebhook(
    subscriber: WebhookSubscriber,
    payload: WebhookPayload
  ): Promise<WebhookDeliveryResult> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Webhook-Id': payload.id,
      'X-Webhook-Timestamp': Date.now().toString(),
      ...subscriber.headers,
    };

    // Adicionar assinatura se houver secret
    if (subscriber.secret) {
      const signature = this.generateSignature(
        JSON.stringify(payload),
        subscriber.secret
      );
      headers['X-Webhook-Signature'] = signature;
    }

    try {
      const response = await this.httpClient.post(subscriber.url, payload, {
        headers,
        validateStatus: () => true, // Não lançar erro para qualquer status HTTP
      });

      const result: WebhookDeliveryResult = {
        success: response.status >= 200 && response.status < 300,
        statusCode: response.status,
        retryCount: 0,
        timestamp: new Date().toISOString(),
      };

      if (!result.success) {
        result.error = `HTTP status ${response.status}: ${
          typeof response.data === 'string'
            ? response.data.substring(0, 100)
            : JSON.stringify(response.data).substring(0, 100)
        }`;
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        retryCount: 0,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Gera um ID único para um evento
   */
  private generateEventId(): string {
    return `wh_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Gera uma assinatura HMAC para o payload
   *
   * @param payload Payload a ser assinado
   * @param secret Chave secreta
   * @returns Assinatura gerada
   */
  private generateSignature(payload: string, secret: string): string {
    return createHmac('sha256', secret).update(payload).digest('hex');
  }

  /**
   * Verifica se uma assinatura de webhook é válida
   *
   * @param payload Payload recebido
   * @param signature Assinatura recebida
   * @param secret Chave secreta
   * @returns true se a assinatura for válida
   */
  verifySignature(payload: string, signature: string, secret: string): boolean {
    const expectedSignature = this.generateSignature(payload, secret);
    return expectedSignature === signature;
  }

  /**
   * Libera recursos utilizados pelo serviço
   */
  dispose(): void {
    this.deliveryQueue = [];
    this.subscribers.clear();
  }
}
