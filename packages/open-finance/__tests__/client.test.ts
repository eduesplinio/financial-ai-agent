import { OpenFinanceClient } from '../src/client';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Mock para axios
jest.mock('axios', () => {
  const mockAxios: any = {
    create: jest.fn(() => mockAxios),
    request: jest.fn(),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() }
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    defaults: {}
  };
  return mockAxios;
});

describe('OpenFinanceClient', () => {
  let client: OpenFinanceClient;
  const mockConfig = {
    baseUrl: 'https://api.openfinance.example.com',
    clientId: 'test-client-id',
    clientSecret: 'test-client-secret',
    authUrl: 'https://auth.openfinance.example.com',
    useAuth: true,
    timeout: 5000,
    maxRetries: 3
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    client = new OpenFinanceClient(mockConfig);
  });
  
  test('cria instância com configuração válida', () => {
    expect(client).toBeInstanceOf(OpenFinanceClient);
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: mockConfig.baseUrl,
      timeout: mockConfig.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
  });
  
  test('configura interceptors corretamente', () => {
    const mockAxios = axios.create();
    expect(mockAxios.interceptors.request.use).toHaveBeenCalled();
    expect(mockAxios.interceptors.response.use).toHaveBeenCalled();
  });
  
  test('método GET faz request corretamente', async () => {
    const mockAxios = axios.create();
    (mockAxios.request as jest.Mock).mockResolvedValueOnce({
      data: { success: true },
      status: 200,
      headers: {},
      config: {},
      statusText: 'OK'
    });
    
    const result = await client.get('/accounts');
    
    expect(mockAxios.request).toHaveBeenCalledWith({
      method: 'GET',
      url: '/accounts'
    });
    
    expect(result).toEqual({
      data: { success: true },
      status: 200,
      headers: {},
      success: true
    });
  });
  
  test('método POST envia dados corretamente', async () => {
    const mockAxios = axios.create();
    (mockAxios.request as jest.Mock).mockResolvedValueOnce({
      data: { id: '123', success: true },
      status: 201,
      headers: {},
      config: {},
      statusText: 'Created'
    });
    
    const postData = { name: 'Test Account' };
    const result = await client.post('/accounts', postData);
    
    expect(mockAxios.request).toHaveBeenCalledWith({
      method: 'POST',
      url: '/accounts',
      data: postData
    });
    
    expect(result).toEqual({
      data: { id: '123', success: true },
      status: 201,
      headers: {},
      success: true
    });
  });
  
  test('lida com erro de resposta corretamente', async () => {
    const mockAxios = axios.create();
    const error = {
      response: {
        data: { message: 'Resource not found' },
        status: 404,
        headers: {},
        config: {},
        statusText: 'Not Found'
      },
      message: 'Request failed with status code 404',
      code: 'ERR_BAD_REQUEST',
      isAxiosError: true
    };
    
    (mockAxios.request as jest.Mock).mockRejectedValueOnce(error);
    
    const result = await client.get('/nonexistent');
    
    expect(result).toEqual({
      success: false,
      status: 404,
      headers: {},
      error: {
        message: 'Request failed with status code 404',
        code: 'ERR_BAD_REQUEST',
        response: { message: 'Resource not found' }
      }
    });
  });
});
