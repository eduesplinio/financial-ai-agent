import { OpenFinanceAuth } from '../src/auth';
import axios from 'axios';

// Mock para axios
jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

// Mock para randomBytes e createHash
jest.mock('crypto', () => ({
  randomBytes: jest.fn().mockImplementation(size => ({
    toString: jest.fn().mockReturnValue('mock_random_bytes'),
  })),
  createHash: jest.fn().mockImplementation(() => ({
    update: jest.fn().mockReturnThis(),
    digest: jest.fn().mockReturnValue({
      toString: jest.fn().mockReturnValue('mock_hash'),
      replace: jest.fn().mockReturnThis(),
    }),
  })),
}));

// Mock para jose
jest.mock('jose', () => ({
  importPKCS8: jest.fn().mockResolvedValue('mock_key'),
  SignJWT: jest.fn().mockImplementation(() => ({
    setProtectedHeader: jest.fn().mockReturnThis(),
    sign: jest.fn().mockResolvedValue('mock_jwt_token'),
  })),
}));

describe('OpenFinanceAuth', () => {
  let auth: OpenFinanceAuth;
  const mockConfig = {
    baseUrl: 'https://api.example.com',
    clientId: 'client_id',
    clientSecret: 'client_secret',
    useAuth: true,
  };

  const mockOAuthConfig = {
    institutionId: 'bank123',
    clientId: 'client_id',
    clientSecret: 'client_secret',
    redirectUri: 'https://app.example.com/callback',
    authorizationEndpoint: 'https://auth.bank.com/authorize',
    tokenEndpoint: 'https://auth.bank.com/token',
    apiBaseUrl: 'https://api.bank.com',
    scopes: ['accounts', 'transactions'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    auth = new OpenFinanceAuth(mockConfig);

    // Configurar mocks para axios
    mockAxios.post.mockResolvedValue({
      data: {
        access_token: 'mock_access_token',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'mock_refresh_token',
        scope: 'accounts transactions',
      },
    });
  });

  test('createAuthorizationUrl deve gerar uma URL correta', async () => {
    const result = await auth.createAuthorizationUrl(mockOAuthConfig);

    expect(result).toHaveProperty('url');
    expect(result).toHaveProperty('state');
    expect(result).toHaveProperty('codeVerifier');

    expect(result.url).toContain(mockOAuthConfig.authorizationEndpoint);
    expect(result.url).toContain('client_id=client_id');
    expect(result.url).toContain(
      'redirect_uri=https%3A%2F%2Fapp.example.com%2Fcallback'
    );
  });

  test('exchangeCodeForToken deve fazer requisição correta', async () => {
    const code = 'authorization_code';
    const codeVerifier = 'code_verifier';

    const result = await auth.exchangeCodeForToken(
      mockOAuthConfig,
      code,
      codeVerifier
    );

    expect(mockAxios.post).toHaveBeenCalledWith(
      mockOAuthConfig.tokenEndpoint,
      {
        grant_type: 'authorization_code',
        client_id: mockOAuthConfig.clientId,
        client_secret: mockOAuthConfig.clientSecret,
        code,
        code_verifier: codeVerifier,
        redirect_uri: mockOAuthConfig.redirectUri,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    expect(result).toHaveProperty('access_token', 'mock_access_token');
  });

  test('refreshToken deve atualizar token corretamente', async () => {
    // Primeiro precisamos ter um token armazenado
    await auth.exchangeCodeForToken(mockOAuthConfig, 'code', 'verifier');

    // Limpar mock para testar refreshToken
    mockAxios.post.mockClear();

    const result = await auth.refreshToken(mockOAuthConfig);

    expect(mockAxios.post).toHaveBeenCalledWith(
      mockOAuthConfig.tokenEndpoint,
      {
        grant_type: 'refresh_token',
        client_id: mockOAuthConfig.clientId,
        client_secret: mockOAuthConfig.clientSecret,
        refresh_token: 'mock_refresh_token',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    expect(result).toHaveProperty('access_token', 'mock_access_token');
  });

  test('createClientAssertion deve gerar JWT corretamente', async () => {
    const clientId = 'client_id';
    const privateKey =
      '-----BEGIN PRIVATE KEY-----\nMOCK_KEY\n-----END PRIVATE KEY-----';
    const audience = 'https://auth.bank.com/token';

    const result = await auth.createClientAssertion(
      clientId,
      privateKey,
      audience
    );

    expect(result).toBe('mock_jwt_token');
  });
});
