import axios from 'axios';
import {
  WebhookService,
  WebhookEventType,
  WebhookSubscriber,
} from '../src/webhook';

// Mock utils/logger
jest.mock('../src/utils', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WebhookService', () => {
  let webhookService: WebhookService;
  let mockPost: jest.SpyInstance;

  beforeEach(() => {
    // Configurar mock do axios
    mockPost = jest.fn().mockResolvedValue({
      status: 200,
      data: { success: true },
    });

    mockedAxios.create.mockReturnValue({
      post: mockPost,
    } as any);

    // Criar instância do WebhookService
    webhookService = new WebhookService();

    // Mock para timers
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    webhookService.dispose();
  });

  test('deve adicionar um subscriber corretamente', () => {
    const subscriber: WebhookSubscriber = {
      id: 'test-subscriber',
      url: 'https://example.com/webhook',
      events: [WebhookEventType.ACCOUNT_UPDATED],
      enabled: true,
    };

    const id = webhookService.addSubscriber(subscriber);
    expect(id).toBe('test-subscriber');

    const subscribers = webhookService.listSubscribers();
    expect(subscribers).toHaveLength(1);
    expect(subscribers[0]?.id).toBe('test-subscriber');
  });

  test('deve remover um subscriber corretamente', () => {
    const subscriber: WebhookSubscriber = {
      id: 'test-subscriber',
      url: 'https://example.com/webhook',
      events: [WebhookEventType.ACCOUNT_UPDATED],
      enabled: true,
    };

    webhookService.addSubscriber(subscriber);
    expect(webhookService.listSubscribers()).toHaveLength(1);

    const result = webhookService.removeSubscriber('test-subscriber');
    expect(result).toBe(true);
    expect(webhookService.listSubscribers()).toHaveLength(0);

    // Tentar remover novamente deve retornar false
    expect(webhookService.removeSubscriber('test-subscriber')).toBe(false);
  });

  test('deve atualizar um subscriber corretamente', () => {
    const subscriber: WebhookSubscriber = {
      id: 'test-subscriber',
      url: 'https://example.com/webhook',
      events: [WebhookEventType.ACCOUNT_UPDATED],
      enabled: true,
    };

    webhookService.addSubscriber(subscriber);

    const result = webhookService.updateSubscriber('test-subscriber', {
      url: 'https://updated-example.com/webhook',
      enabled: false,
    });

    expect(result).toBe(true);

    const subscribers = webhookService.listSubscribers();
    expect(subscribers.length).toBe(1);

    const updated = subscribers[0];
    expect(updated?.url).toBe('https://updated-example.com/webhook');
    expect(updated?.enabled).toBe(false);

    // Tentar atualizar um subscriber inexistente deve retornar false
    expect(
      webhookService.updateSubscriber('non-existent', { enabled: false })
    ).toBe(false);
  });

  test('deve publicar eventos apenas para subscribers interessados', async () => {
    // Modificar o comportamento do processQueue para executar imediatamente
    jest
      .spyOn(webhookService as any, 'processQueue')
      .mockImplementation(async function (this: any) {
        if (this.deliveryQueue.length === 0) return;

        const item = this.deliveryQueue.shift();
        await this.deliverWebhook(item.subscriber, item.payload);
      });

    const subscriber1: WebhookSubscriber = {
      id: 'subscriber1',
      url: 'https://example.com/webhook1',
      events: [WebhookEventType.ACCOUNT_UPDATED],
      enabled: true,
    };

    const subscriber2: WebhookSubscriber = {
      id: 'subscriber2',
      url: 'https://example.com/webhook2',
      events: [WebhookEventType.TRANSACTION_CREATED],
      enabled: true,
    };

    const subscriber3: WebhookSubscriber = {
      id: 'subscriber3',
      url: 'https://example.com/webhook3',
      events: [
        WebhookEventType.ACCOUNT_UPDATED,
        WebhookEventType.TRANSACTION_UPDATED,
      ],
      enabled: false, // Desativado
    };

    webhookService.addSubscriber(subscriber1);
    webhookService.addSubscriber(subscriber2);
    webhookService.addSubscriber(subscriber3);

    // Publicar evento de conta atualizada
    const count = webhookService.publish(WebhookEventType.ACCOUNT_UPDATED, {
      accountId: '123',
      balance: 1000,
    });

    // Apenas o subscriber1 deve receber (subscriber3 está desativado)
    expect(count).toBe(1);

    // Invocar processamento da fila diretamente
    await (webhookService as any).processQueue();

    // Verificar se o post foi chamado para o subscriber correto
    expect(mockPost).toHaveBeenCalledTimes(1);
    expect(mockPost.mock.calls[0][0]).toBe('https://example.com/webhook1');
  });

  test('deve gerar e verificar assinaturas corretamente', () => {
    const payload = '{"id":"test","data":{}}';
    const secret = 'mysecretkey';

    // Simular payload já assinado (para teste do verifySignature)
    const signature = webhookService['generateSignature'](payload, secret);

    // Verificar assinatura
    expect(webhookService.verifySignature(payload, signature, secret)).toBe(
      true
    );

    // Assinatura inválida
    expect(
      webhookService.verifySignature(payload, 'invalid-signature', secret)
    ).toBe(false);
  });

  test('deve reintentar envios que falharam', async () => {
    // Modificar o comportamento do processQueue para simular a entrega direta
    const deliverWebhookSpy = jest.spyOn(
      webhookService as any,
      'deliverWebhook'
    );

    const subscriber: WebhookSubscriber = {
      id: 'test-subscriber',
      url: 'https://example.com/webhook',
      events: [WebhookEventType.ACCOUNT_UPDATED],
      enabled: true,
      maxRetries: 2,
      retryDelayMs: 1000,
    };

    webhookService.addSubscriber(subscriber);

    // Primeiro envio falha
    mockPost.mockResolvedValueOnce({
      status: 500,
      data: 'Internal server error',
    });

    // Segundo envio (retry) bem-sucedido
    mockPost.mockResolvedValueOnce({
      status: 200,
      data: { success: true },
    });

    // Publicar evento
    webhookService.publish(WebhookEventType.ACCOUNT_UPDATED, {
      accountId: '123',
    });

    // Acessar a fila diretamente e processar o primeiro item
    const queue = (webhookService as any).deliveryQueue;
    const firstItem = queue[0];

    // Processar o primeiro envio (que falha)
    await (webhookService as any).deliverWebhook(
      firstItem.subscriber,
      firstItem.payload
    );

    expect(mockPost).toHaveBeenCalledTimes(1);
    expect(deliverWebhookSpy).toHaveBeenCalledTimes(1);

    // Simular o processamento do retry
    await (webhookService as any).deliverWebhook(
      firstItem.subscriber,
      firstItem.payload
    );
    expect(mockPost).toHaveBeenCalledTimes(2);
  });
});
