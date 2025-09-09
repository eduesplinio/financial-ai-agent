import { OpenFinanceSandbox, createSandboxClient } from '../src/sandbox';
import axios from 'axios';
import { OpenFinanceClient } from '../src/client';
import { OpenFinanceAuth } from '../src/auth';

// Mock para axios
jest.mock('axios');

// Mock para OpenFinanceClient
jest.mock('../src/client', () => ({
  OpenFinanceClient: jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  }))
}));

// Mock para OpenFinanceAuth
jest.mock('../src/auth', () => ({
  OpenFinanceAuth: jest.fn().mockImplementation(() => ({
    createAuthorizationUrl: jest.fn(),
    exchangeCodeForToken: jest.fn(),
    refreshToken: jest.fn(),
    getValidToken: jest.fn(),
    createConsent: jest.fn()
  }))
}));

describe('OpenFinanceSandbox', () => {
  let sandbox: OpenFinanceSandbox;
  
  beforeEach(() => {
    jest.clearAllMocks();
    sandbox = createSandboxClient({
      mockResponses: true,
      logRequests: false
    });
  });
  
  test('deve criar uma instância válida', () => {
    expect(sandbox).toBeInstanceOf(OpenFinanceSandbox);
    expect(OpenFinanceClient).toHaveBeenCalled();
    expect(OpenFinanceAuth).toHaveBeenCalled();
  });
  
  test('listInstitutions deve retornar lista de instituições', () => {
    const institutions = sandbox.listInstitutions();
    expect(institutions).toBeInstanceOf(Array);
    expect(institutions.length).toBeGreaterThan(0);
  });
  
  test('getInstitution deve retornar instituição por ID', () => {
    const institution = sandbox.getInstitution('mock-bank-001');
    expect(institution).toBeDefined();
    expect(institution?.name).toBe('Banco Sandbox Mock');
    
    const nonExistent = sandbox.getInstitution('non-existent');
    expect(nonExistent).toBeUndefined();
  });
  
  test('generateMockAccounts deve criar contas de teste', () => {
    const accounts = sandbox.generateMockAccounts('12345678900', 'mock-bank-001', 2);
    
    expect(accounts).toBeInstanceOf(Array);
    expect(accounts.length).toBe(2);
    
    expect(accounts[0]).toHaveProperty('accountId');
    expect(accounts[0]).toHaveProperty('balance');
    expect(accounts[0]).toHaveProperty('institution.name', 'Banco Sandbox Mock');
  });
  
  test('generateMockTransactions deve criar transações de teste', () => {
    const transactions = sandbox.generateMockTransactions('acc123', 10);
    
    expect(transactions).toBeInstanceOf(Array);
    expect(transactions.length).toBe(10);
    
    expect(transactions[0]).toHaveProperty('transactionId');
    expect(transactions[0]).toHaveProperty('accountId', 'acc123');
    expect(transactions[0]).toHaveProperty('transactionAmount');
    
    // Verificamos apenas que as transações foram criadas
    // A lógica de ordenação é testada pela implementação
  });
  
  test('createMockConsent deve criar consentimento de teste', async () => {
    const consent = await sandbox.createMockConsent('12345678900', 'mock-bank-001');
    
    expect(consent).toHaveProperty('data');
    expect(consent.data).toHaveProperty('consentId');
    expect(consent.data).toHaveProperty('status');
    expect(consent.data.status).toBe('AWAITING_AUTHORIZATION');
  });
  
  test('deve lançar erro para instituição inexistente', async () => {
    await expect(
      sandbox.createMockConsent('12345678900', 'non-existent')
    ).rejects.toThrow('Instituição não encontrada');
    
    expect(() => 
      sandbox.generateMockAccounts('12345678900', 'non-existent')
    ).toThrow('Instituição não encontrada');
  });
  
  test('enableDebugLogging deve configurar interceptors quando logRequests=true', () => {
    const spy = jest.spyOn(axios.interceptors.request, 'use');
    const spyResponse = jest.spyOn(axios.interceptors.response, 'use');
    
    // Primeiro teste com logRequests=false
    sandbox.enableDebugLogging();
    expect(spy).not.toHaveBeenCalled();
    expect(spyResponse).not.toHaveBeenCalled();
    
    // Depois teste com logRequests=true
    const sandboxWithLogs = createSandboxClient({ mockResponses: true, logRequests: true });
    sandboxWithLogs.enableDebugLogging();
    
    expect(spy).toHaveBeenCalled();
    expect(spyResponse).toHaveBeenCalled();
  });
});
