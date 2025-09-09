import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import {
  OpenFinanceConfig,
  ApiResponse,
  RequestOptions,
  OAuthTokenResponse,
} from './types';

// Helper function para verificar se um erro é do tipo AxiosError
function isAxiosError(error: any): error is AxiosError {
  return error && error.isAxiosError === true && error.response !== undefined;
}

/**
 * Cliente HTTP base para APIs do Open Finance Brasil
 */
export class OpenFinanceClient {
  private client: AxiosInstance;
  private config: OpenFinanceConfig;
  private authToken?: string;
  private tokenExpiresAt?: Date;

  /**
   * Cria uma nova instância do cliente OpenFinance
   * @param config Configuração do cliente Open Finance
   */
  constructor(config: OpenFinanceConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    // Configuração de interceptors
    this.setupInterceptors();
  }

  /**
   * Configura interceptors para tratamento de requisições e respostas
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      async config => {
        // Adiciona token de autorização se necessário
        if (
          this.config.useAuth &&
          !config.headers.Authorization &&
          this.authToken
        ) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      response => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };

        // Implement retry logic for specific error scenarios
        if (
          error.response?.status === 429 || // Too Many Requests
          (error.response?.status === 401 && !originalRequest._retry) // Unauthorized (possibly expired token)
        ) {
          if (!originalRequest._retry) {
            originalRequest._retry = true;

            // Refresh token if unauthorized
            if (error.response?.status === 401 && this.config.useAuth) {
              await this.refreshAuthToken();
              if (this.authToken) {
                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers.Authorization = `Bearer ${this.authToken}`;
              }
            }

            // Retry with exponential backoff for rate limiting
            if (error.response?.status === 429) {
              const retryAfter = parseInt(
                error.response.headers['retry-after'] || '1',
                10
              );
              await this.delay(retryAfter * 1000);
            }

            return this.client(originalRequest);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Helper para criar delay usando Promise
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Atualiza o token de autenticação
   */
  public async refreshAuthToken(): Promise<void> {
    // Verificar se o token atual ainda é válido
    if (this.tokenExpiresAt && new Date() < this.tokenExpiresAt) {
      return;
    }

    try {
      const response = await axios.post(
        `${this.config.authUrl}/oauth/token`,
        {
          grant_type: 'client_credentials',
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          scope: this.config.scope || 'openid accounts credit-cards-accounts',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      this.authToken = response.data.access_token;

      // Calcular tempo de expiração (normalmente em segundos)
      const expiresIn = response.data.expires_in || 3600; // Default 1 hour
      this.tokenExpiresAt = new Date(Date.now() + expiresIn * 1000);
    } catch (error) {
      console.error('Failed to refresh auth token:', error);
      throw error;
    }
  }

  /**
   * Executa uma requisição GET
   * @param url Endpoint da API
   * @param options Opções da requisição
   */
  public async get<T>(
    url: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...options, method: 'GET', url });
  }

  /**
   * Executa uma requisição POST
   * @param url Endpoint da API
   * @param data Dados a serem enviados
   * @param options Opções da requisição
   */
  public async post<T>(
    url: string,
    data: any,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...options, method: 'POST', url, data });
  }

  /**
   * Executa uma requisição PUT
   * @param url Endpoint da API
   * @param data Dados a serem enviados
   * @param options Opções da requisição
   */
  public async put<T>(
    url: string,
    data: any,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...options, method: 'PUT', url, data });
  }

  /**
   * Executa uma requisição DELETE
   * @param url Endpoint da API
   * @param options Opções da requisição
   */
  public async delete<T>(
    url: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...options, method: 'DELETE', url });
  }

  /**
   * Método genérico para realizar requisições HTTP
   * @param options Opções da requisição
   */
  private async request<T>(
    options: RequestOptions & { method: string; url: string; data?: any }
  ): Promise<ApiResponse<T>> {
    const {
      retries = this.config.maxRetries || 3,
      retryDelay = 1000,
      ...requestOptions
    } = options;

    let lastError: Error | null = null;
    let attempt = 0;

    while (attempt <= retries) {
      try {
        // Verificar se é necessário autenticar (pular em ambiente de teste)
        if (
          process.env.NODE_ENV !== 'test' &&
          this.config.useAuth &&
          (!this.authToken ||
            (this.tokenExpiresAt && new Date() >= this.tokenExpiresAt))
        ) {
          await this.refreshAuthToken();
        }

        const response = await this.client.request<T>(requestOptions);

        return {
          data: response.data,
          status: response.status,
          headers: response.headers,
          success: true,
        };
      } catch (error) {
        lastError = error as Error;

        // Não fazer retry para alguns tipos de erro
        if (
          isAxiosError(error) &&
          error.response &&
          ![408, 429, 500, 502, 503, 504].includes(error.response.status)
        ) {
          break;
        }

        attempt += 1;

        if (attempt <= retries) {
          // Exponential backoff with jitter
          const delay = Math.min(
            retryDelay * Math.pow(2, attempt - 1) + Math.random() * 1000,
            30000 // Max delay 30 seconds
          );
          await this.delay(delay);
        }
      }
    }

    if (isAxiosError(lastError) && lastError.response) {
      return {
        success: false,
        status: lastError.response.status,
        headers: lastError.response.headers,
        error: {
          message: lastError.message,
          code: lastError.code || 'UNKNOWN_ERROR',
          response: lastError.response.data,
        },
      };
    }

    return {
      success: false,
      error: {
        message: lastError?.message || 'Unknown error occurred',
        code: 'UNKNOWN_ERROR',
      },
    };
  }
}

export default OpenFinanceClient;
