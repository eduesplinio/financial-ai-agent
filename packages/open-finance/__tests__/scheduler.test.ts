import { SyncScheduler } from '../src/scheduler';
import { SyncService } from '../src/sync';
import { OpenFinanceClient } from '../src/client';
import { OpenFinanceAuth } from '../src/auth';
import { SyncStatus } from '../src/types';

// Mocks
jest.mock('../src/sync');
jest.mock('../src/client');
jest.mock('../src/auth');

describe('SyncScheduler', () => {
  let mockSyncService: jest.Mocked<SyncService>;
  let scheduler: SyncScheduler;

  const mockLogger = jest.fn();
  const mockErrorHandler = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();

    // Criar mock do SyncService
    mockSyncService = new SyncService({} as any) as jest.Mocked<SyncService>;

    // Configurar mocks para os métodos do syncService
    mockSyncService.syncAccounts = jest.fn().mockResolvedValue({
      status: 'success',
      data: [
        { accountId: 'account1', balance: 1000 },
        { accountId: 'account2', balance: 2000 },
      ],
    });

    mockSyncService.syncTransactions = jest.fn().mockResolvedValue({
      status: 'success',
      data: [{ transactionId: 'tx1' }, { transactionId: 'tx2' }],
    });

    // Criar o scheduler com os mocks
    scheduler = new SyncScheduler(mockSyncService, {
      accountSyncInterval: 1000, // 1 segundo para testes
      transactionSyncInterval: 2000, // 2 segundos para testes
      logger: mockLogger,
      onError: mockErrorHandler,
    });

    // Registrar instituições para teste
    scheduler.registerInstitutions(['bank1', 'bank2']);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
    scheduler.dispose();
  });

  test('deve registrar instituições corretamente', () => {
    // Verificar se os logs foram gerados
    expect(mockLogger).toHaveBeenCalledWith(
      'Registered institutions for sync: bank1, bank2',
      'info'
    );

    // Registrar uma nova instituição
    scheduler.registerInstitutions(['bank3']);

    // Verificar se o log foi chamado novamente
    expect(mockLogger).toHaveBeenCalledWith(
      'Registered institutions for sync: bank3',
      'info'
    );
  });

  test('deve iniciar os jobs de sincronização', async () => {
    // Para o teste, não vamos usar os intervalos reais
    jest.spyOn(global, 'setInterval').mockReturnValue({} as any);

    // Limpar chamadas anteriores para começar com contagem limpa
    mockSyncService.syncAccounts.mockClear();

    scheduler.start();

    // Aguardar processamento assíncrono
    await Promise.resolve();

    // Verificar se a sincronização inicial foi chamada (pode ser chamada mais vezes
    // dependendo da implementação, então verificamos se foi chamada pelo menos uma vez)
    expect(mockSyncService.syncAccounts).toHaveBeenCalled();

    // Avançar o tempo para verificar as chamadas periódicas
    jest.advanceTimersByTime(1000); // Avançar 1 segundo para acionar o sync de contas

    // Aguardar processamento assíncrono
    await Promise.resolve();

    expect(mockSyncService.syncAccounts).toHaveBeenCalledTimes(2);

    // O syncTransactions é chamado após syncAccounts retornar os dados das contas
    // Precisamos avançar mais tempo para garantir que o processo completo aconteça
    // e que o intervalo do syncTransactions seja acionado
    jest.advanceTimersByTime(2000); // Total: 3 segundos

    // Aguardar processamento assíncrono
    await Promise.resolve();

    // Verificar se o logger foi chamado com mensagem de início
    expect(mockLogger).toHaveBeenCalledWith('Sync scheduler started', 'info');
  });

  test('deve parar os jobs de sincronização', () => {
    // Iniciar e depois parar o scheduler
    scheduler.start();
    scheduler.stop();

    // Verificar se o log foi chamado
    expect(mockLogger).toHaveBeenCalledWith('Sync scheduler stopped', 'info');

    // Avançar o tempo para verificar que não ocorrem mais chamadas
    const syncAccountsCallCount =
      mockSyncService.syncAccounts.mock.calls.length;

    jest.advanceTimersByTime(3000); // Avançar 3 segundos

    // O número de chamadas deve permanecer o mesmo
    expect(mockSyncService.syncAccounts).toHaveBeenCalledTimes(
      syncAccountsCallCount
    );
  });

  test('deve lidar com erros durante a sincronização de contas', async () => {
    // Configurar o mock para lançar um erro
    const error = new Error('API error');
    mockSyncService.syncAccounts.mockRejectedValueOnce(error);

    // Ajustar o comportamento do onError para que possamos testar
    const errorHandlerSpy = jest.fn();
    scheduler = new SyncScheduler(mockSyncService, {
      accountSyncInterval: 1000,
      transactionSyncInterval: 2000,
      logger: mockLogger,
      onError: errorHandlerSpy,
    });

    // Registrar instituições para teste
    scheduler.registerInstitutions(['bank1']);

    // Iniciar o scheduler
    scheduler.start();

    // Permitir um tempo para que as promises sejam processadas
    await Promise.resolve();
    await Promise.resolve();

    // Verificar se a sincronização foi tentada
    expect(mockSyncService.syncAccounts).toHaveBeenCalled();

    // Verificar se o errorHandler foi chamado
    expect(errorHandlerSpy).toHaveBeenCalled();
    expect(errorHandlerSpy.mock.calls[0][0]).toEqual(error);
    // A mensagem exata pode variar dependendo da implementação, mas deve conter 'account sync'
    expect(errorHandlerSpy.mock.calls[0][1]).toContain('account sync');
  });

  test('deve lidar com erros durante a sincronização de transações', async () => {
    // Ajustar o mock de syncAccounts para retornar dados que serão usados pelo syncTransactions
    mockSyncService.syncAccounts.mockResolvedValue({
      status: SyncStatus.SUCCESS,
      data: [
        {
          accountId: 'test-account',
          institution: { id: 'bank1', name: 'Test Bank' },
          updatedAt: new Date().toISOString(),
          accountType: 'CACC',
          accountSubType: 'CHECKING',
          name: 'Conta corrente',
          number: '12345',
          currency: 'BRL',
          balance: 1000,
          available: 1000,
          overdraftLimit: 0,
          status: 'AVAILABLE',
        },
      ],
      timestamp: Date.now(),
    });

    // Configurar o mock para lançar um erro na sincronização de transações
    const transactionError = new Error('Transaction API error');
    mockSyncService.syncTransactions.mockRejectedValueOnce(transactionError);

    // Ajustar o comportamento do onError para que possamos testar
    const errorHandlerSpy = jest.fn();
    scheduler = new SyncScheduler(mockSyncService, {
      accountSyncInterval: 1000,
      transactionSyncInterval: 2000,
      logger: mockLogger,
      onError: errorHandlerSpy,
    });

    // Registrar instituições para teste
    scheduler.registerInstitutions(['bank1']);

    // Iniciar o scheduler
    scheduler.start();

    // Avançar o tempo para acionar a sincronização de transações
    jest.advanceTimersByTime(2000);

    // Permitir um tempo para que as promises sejam processadas
    await Promise.resolve();
    await Promise.resolve();

    // Verificar se o handler de erro foi chamado para a transação
    expect(errorHandlerSpy).toHaveBeenCalledWith(
      expect.any(Error),
      expect.stringContaining('transaction sync')
    );

    // Permitir um tempo para que as promises sejam processadas
    await Promise.resolve();

    // Verificar se as contas foram sincronizadas antes de tentar as transações
    expect(mockSyncService.syncAccounts).toHaveBeenCalled();
  });
});
