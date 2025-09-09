/**
 * Testes para o serviço de sincronização de dados bancários
 */
import { SyncService } from '../src/sync';
import { OpenFinanceClient } from '../src/client';
import { OpenFinanceAuth } from '../src/auth';
import { AccountData, SyncStatus, TransactionData } from '../src/types';

// Mock do cliente Open Finance
jest.mock('../src/client');
const MockedOpenFinanceClient = OpenFinanceClient as jest.MockedClass<
  typeof OpenFinanceClient
>;

// Mock da autenticação Open Finance
jest.mock('../src/auth');
const MockedOpenFinanceAuth = OpenFinanceAuth as jest.MockedClass<
  typeof OpenFinanceAuth
>;

describe('SyncService', () => {
  // Dados de teste
  const institutionId = 'test-institution';
  const accountId = 'test-account-123';
  const mockToken = 'test-token-123';

  // Mock das contas
  const mockAccounts: AccountData[] = [
    {
      accountId: 'test-account-123',
      accountType: 'CURRENT_ACCOUNT',
      accountSubType: 'INDIVIDUAL',
      currency: 'BRL',
      name: 'Conta Corrente',
      balance: 1200,
      available: 1000,
      status: 'AVAILABLE',
      number: '12345678',
      institution: {
        id: 'test-institution',
        name: 'Banco de Teste',
        compeCode: '123',
        ispb: '12345678',
      },
      updatedAt: '2023-02-01T14:30:00Z',
    },
  ];

  // Mock das transações
  const mockTransactions: TransactionData[] = [
    {
      transactionId: 'tx-123',
      accountId: 'test-account-123',
      type: 'PIX',
      creditDebitType: 'CREDIT',
      transactionAmount: 500,
      currency: 'BRL',
      transactionDate: '2023-02-15T10:30:00Z',
      valueDate: '2023-02-15T10:30:00Z',
      description: 'Transferência PIX recebida',
      status: 'COMPLETED',
      merchant: {
        name: 'Maria Souza',
      },
      correlationId: 'pix-123',
    },
    {
      transactionId: 'tx-456',
      accountId: 'test-account-123',
      type: 'PAYMENT',
      creditDebitType: 'DEBIT',
      transactionAmount: 120.5,
      currency: 'BRL',
      transactionDate: '2023-02-16T14:45:00Z',
      valueDate: '2023-02-16T14:45:00Z',
      description: 'Pagamento conta de luz',
      status: 'COMPLETED',
    },
  ];

  // Mock config para os construtores
  const mockConfig = {
    baseUrl: 'https://api.mock.com',
    clientId: 'test-client-id',
    clientSecret: 'test-client-secret',
  };

  // Setup e Teardown
  beforeEach(() => {
    jest.clearAllMocks();

    // Configurar mocks
    MockedOpenFinanceAuth.prototype.getToken.mockResolvedValue(mockToken);
    MockedOpenFinanceClient.prototype.getAccounts.mockResolvedValue(
      mockAccounts
    );
    MockedOpenFinanceClient.prototype.getTransactions.mockResolvedValue(
      mockTransactions
    );
  });

  // Testes
  it('deve sincronizar contas corretamente', async () => {
    // Arrange
    const syncService = new SyncService({
      client: new MockedOpenFinanceClient(mockConfig),
      auth: new MockedOpenFinanceAuth(mockConfig),
    });

    // Act
    const result = await syncService.syncAccounts(institutionId);

    // Assert
    expect(result.status).toBe(SyncStatus.SUCCESS);
    expect(result.data).toEqual(mockAccounts);
    expect(MockedOpenFinanceAuth.prototype.getToken).toHaveBeenCalledWith(
      institutionId
    );
    expect(MockedOpenFinanceClient.prototype.getAccounts).toHaveBeenCalledWith(
      institutionId,
      mockToken
    );
  });

  it('deve retornar dados em cache quando disponíveis', async () => {
    // Arrange
    const syncService = new SyncService({
      client: new MockedOpenFinanceClient(mockConfig),
      auth: new MockedOpenFinanceAuth(mockConfig),
      cacheLifetime: 60000, // 1 minuto
    });

    // Act - primeira chamada para popular o cache
    await syncService.syncAccounts(institutionId);

    // Limpar mocks para verificar se a segunda chamada não acessa a API
    jest.clearAllMocks();

    // Act - segunda chamada que deve usar o cache
    const result = await syncService.syncAccounts(institutionId);

    // Assert
    expect(result.status).toBe(SyncStatus.CACHED);
    expect(result.data).toEqual(mockAccounts);
    expect(MockedOpenFinanceAuth.prototype.getToken).not.toHaveBeenCalled();
    expect(
      MockedOpenFinanceClient.prototype.getAccounts
    ).not.toHaveBeenCalled();
  });

  it('deve forçar atualização quando forceRefresh=true', async () => {
    // Arrange
    const syncService = new SyncService({
      client: new MockedOpenFinanceClient(mockConfig),
      auth: new MockedOpenFinanceAuth(mockConfig),
      cacheLifetime: 60000, // 1 minuto
    });

    // Act - primeira chamada para popular o cache
    await syncService.syncAccounts(institutionId);

    // Limpar mocks para verificar se a segunda chamada acessa a API
    jest.clearAllMocks();

    // Act - segunda chamada com forceRefresh
    const result = await syncService.syncAccounts(institutionId, {
      forceRefresh: true,
    });

    // Assert
    expect(result.status).toBe(SyncStatus.SUCCESS);
    expect(result.data).toEqual(mockAccounts);
    expect(MockedOpenFinanceAuth.prototype.getToken).toHaveBeenCalledWith(
      institutionId
    );
    expect(MockedOpenFinanceClient.prototype.getAccounts).toHaveBeenCalledWith(
      institutionId,
      mockToken
    );
  });

  it('deve retornar erro quando a sincronização de contas falhar', async () => {
    // Arrange
    MockedOpenFinanceAuth.prototype.getToken.mockRejectedValue(
      new Error('Falha na autenticação')
    );

    const syncService = new SyncService({
      client: new MockedOpenFinanceClient(mockConfig),
      auth: new MockedOpenFinanceAuth(mockConfig),
    });

    // Act
    const result = await syncService.syncAccounts(institutionId);

    // Assert
    expect(result.status).toBe(SyncStatus.ERROR);
    expect(result.error).toContain('Falha na autenticação');
    expect(result.data).toBeUndefined();
  });

  it('deve sincronizar transações corretamente', async () => {
    // Arrange
    const syncService = new SyncService({
      client: new MockedOpenFinanceClient(mockConfig),
      auth: new MockedOpenFinanceAuth(mockConfig),
    });

    // Act
    const result = await syncService.syncTransactions(institutionId, accountId);

    // Assert
    expect(result.status).toBe(SyncStatus.SUCCESS);
    expect(result.data).toEqual(mockTransactions);
    expect(MockedOpenFinanceAuth.prototype.getToken).toHaveBeenCalledWith(
      institutionId
    );
    expect(
      MockedOpenFinanceClient.prototype.getTransactions
    ).toHaveBeenCalledWith(
      institutionId,
      accountId,
      mockToken,
      expect.objectContaining({})
    );
  });

  it('deve aplicar filtros de data nas transações', async () => {
    // Arrange
    const syncService = new SyncService({
      client: new MockedOpenFinanceClient(mockConfig),
      auth: new MockedOpenFinanceAuth(mockConfig),
    });

    const fromDate = new Date('2023-01-01');
    const toDate = new Date('2023-03-01');

    // Act
    await syncService.syncTransactions(institutionId, accountId, {
      fromDate,
      toDate,
    });

    // Assert
    expect(
      MockedOpenFinanceClient.prototype.getTransactions
    ).toHaveBeenCalledWith(
      institutionId,
      accountId,
      mockToken,
      expect.objectContaining({
        fromDate,
        toDate,
      })
    );
  });

  it('deve limpar o cache corretamente', async () => {
    // Arrange
    const syncService = new SyncService({
      client: new MockedOpenFinanceClient(mockConfig),
      auth: new MockedOpenFinanceAuth(mockConfig),
    });

    // Preencher o cache
    await syncService.syncAccounts(institutionId);
    await syncService.syncTransactions(institutionId, accountId);

    // Limpar mocks
    jest.clearAllMocks();

    // Act - limpar o cache
    const removedCount = syncService.clearCache();

    // Tentar buscar dados novamente
    await syncService.syncAccounts(institutionId);

    // Assert
    expect(removedCount).toBeGreaterThan(0);
    expect(MockedOpenFinanceClient.prototype.getAccounts).toHaveBeenCalled();
  });

  it('deve liberar recursos ao chamar dispose', async () => {
    // Arrange
    const syncService = new SyncService({
      client: new MockedOpenFinanceClient(mockConfig),
      auth: new MockedOpenFinanceAuth(mockConfig),
    });

    // Preencher o cache
    await syncService.syncAccounts(institutionId);

    // Act
    syncService.dispose();

    // Assert
    // Verificamos se o cache está vazio após dispose
    expect(syncService.clearCache()).toBe(0); // Não deve haver itens no cache
  });
});
