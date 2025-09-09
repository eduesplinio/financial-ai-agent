/**
 * Implementação da autenticação OAuth2 para instituições financeiras do Open Finance Brasil
 */
import axios from 'axios';
import { randomBytes, createHash } from 'crypto';
import * as jose from 'jose';
import {
  OpenFinanceConfig,
  OAuthConfig,
  OAuthTokenResponse,
  ConsentRequest,
  ConsentResponse,
} from './types';
import { withRetry } from './retry';

export class OpenFinanceAuth {
  private config: OpenFinanceConfig;
  private tokens: Record<string, OAuthTokenResponse & { expiresAt: Date }> = {};

  constructor(config: OpenFinanceConfig) {
    this.config = config;
  }

  /**
   * Gera um PKCE code challenge e code verifier para OAuth2
   */
  private generatePKCE(): { codeVerifier: string; codeChallenge: string } {
    // Gerar code verifier (string aleatória entre 43-128 caracteres)
    const codeVerifier = randomBytes(64)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
      .substring(0, 128);

    // Gerar code challenge usando SHA-256
    const codeChallenge = createHash('sha256')
      .update(codeVerifier)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    return { codeVerifier, codeChallenge };
  }

  /**
   * Gera um state aleatório para o fluxo OAuth
   */
  private generateState(): string {
    return randomBytes(32).toString('hex');
  }

  /**
   * Cria uma URL de autorização para o fluxo OAuth2 Authorization Code
   *
   * @param institutionId ID da instituição financeira
   * @param redirectUri URL de redirecionamento após autorização
   * @param scopes Escopos de acesso solicitados
   * @returns URL de autorização e dados necessários para a segunda etapa
   */
  public async createAuthorizationUrl(
    oauthConfig: OAuthConfig
  ): Promise<{ url: string; state: string; codeVerifier: string }> {
    const {
      institutionId,
      redirectUri,
      scopes,
      authorizationEndpoint,
      clientId,
      additionalParams = {},
    } = oauthConfig;

    const { codeVerifier, codeChallenge } = this.generatePKCE();
    const state = this.generateState();

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: Array.isArray(scopes) ? scopes.join(' ') : scopes,
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      ...additionalParams,
    });

    const url = `${authorizationEndpoint}?${params.toString()}`;

    return {
      url,
      state,
      codeVerifier,
    };
  }

  /**
   * Troca o código de autorização por um token de acesso
   *
   * @param institutionId ID da instituição financeira
   * @param code Código de autorização recebido do redirect
   * @param codeVerifier Code verifier PKCE usado na criação da URL de autorização
   * @param redirectUri URL de redirecionamento usada na primeira etapa
   * @returns Resposta do token OAuth
   */
  public async exchangeCodeForToken(
    oauthConfig: OAuthConfig,
    code: string,
    codeVerifier: string
  ): Promise<OAuthTokenResponse> {
    const { tokenEndpoint, clientId, clientSecret, redirectUri } = oauthConfig;

    try {
      const response = await withRetry(() =>
        axios.post(
          tokenEndpoint,
          {
            grant_type: 'authorization_code',
            client_id: clientId,
            client_secret: clientSecret,
            code,
            code_verifier: codeVerifier,
            redirect_uri: redirectUri,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      );

      const tokenResponse = response.data as OAuthTokenResponse;

      // Armazenar o token com horário de expiração
      this.storeToken(oauthConfig.institutionId, tokenResponse);

      return tokenResponse;
    } catch (error) {
      console.error('Erro ao trocar código por token:', error);
      throw error;
    }
  }

  /**
   * Atualiza um token expirado usando refresh_token
   *
   * @param institutionId ID da instituição financeira
   * @returns Token atualizado ou null se não for possível atualizar
   */
  public async refreshToken(
    oauthConfig: OAuthConfig
  ): Promise<OAuthTokenResponse | null> {
    const tokenData = this.tokens[oauthConfig.institutionId];

    if (!tokenData || !tokenData.refresh_token) {
      return null;
    }

    try {
      const response = await withRetry(() =>
        axios.post(
          oauthConfig.tokenEndpoint,
          {
            grant_type: 'refresh_token',
            client_id: oauthConfig.clientId,
            client_secret: oauthConfig.clientSecret,
            refresh_token: tokenData.refresh_token,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      );

      const tokenResponse = response.data as OAuthTokenResponse;

      // Armazenar o token atualizado
      this.storeToken(oauthConfig.institutionId, tokenResponse);

      return tokenResponse;
    } catch (error) {
      console.error('Erro ao atualizar token:', error);

      // Limpar token inválido
      delete this.tokens[oauthConfig.institutionId];

      return null;
    }
  }

  /**
   * Armazena um token com sua data de expiração
   *
   * @param institutionId ID da instituição financeira
   * @param tokenResponse Resposta do token da API
   */
  private storeToken(
    institutionId: string,
    tokenResponse: OAuthTokenResponse
  ): void {
    const expiresInMs = (tokenResponse.expires_in || 3600) * 1000;
    const expiresAt = new Date(Date.now() + expiresInMs);

    this.tokens[institutionId] = {
      ...tokenResponse,
      expiresAt,
    };
  }

  /**
   * Obtém um token válido para uma instituição
   *
   * @param oauthConfig Configuração OAuth para a instituição
   * @returns Token válido ou null se não disponível/não puder ser atualizado
   */
  public async getValidToken(oauthConfig: OAuthConfig): Promise<string | null> {
    const tokenData = this.tokens[oauthConfig.institutionId];

    // Se não temos token, retorna null
    if (!tokenData) {
      return null;
    }

    // Se o token ainda é válido, retorna ele
    const now = new Date();
    if (now < tokenData.expiresAt) {
      return tokenData.access_token;
    }

    // Tenta atualizar o token
    const refreshedToken = await this.refreshToken(oauthConfig);
    return refreshedToken ? refreshedToken.access_token : null;
  }

  /**
   * Cria uma requisição de consentimento para acesso aos dados do usuário
   *
   * @param oauthConfig Configuração OAuth para a instituição
   * @param consentRequest Dados da requisição de consentimento
   * @returns Resposta do consentimento da API
   */
  public async createConsent(
    oauthConfig: OAuthConfig,
    consentRequest: ConsentRequest
  ): Promise<ConsentResponse> {
    const token = await this.getValidToken(oauthConfig);

    if (!token) {
      throw new Error('Token não disponível para criar consentimento');
    }

    try {
      const response = await withRetry(() =>
        axios.post(
          `${oauthConfig.apiBaseUrl}/consents/v1/consents`,
          consentRequest,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        )
      );

      return response.data;
    } catch (error) {
      console.error('Erro ao criar consentimento:', error);
      throw error;
    }
  }

  /**
   * Cria um JWT Client Assertion para autenticação junto às instituições financeiras
   *
   * @param clientId ID do cliente registrado na instituição
   * @param privateKey Chave privada para assinar o JWT
   * @param audience URL do endpoint de token da instituição
   * @returns JWT Client Assertion
   */
  public async createClientAssertion(
    clientId: string,
    privateKey: string,
    audience: string
  ): Promise<string> {
    // Converter a chave privada para o formato adequado
    const key = await jose.importPKCS8(privateKey, 'RS256');

    // Definir payload do JWT
    const payload = {
      iss: clientId,
      sub: clientId,
      jti: randomBytes(16).toString('hex'),
      aud: audience,
      exp: Math.floor(Date.now() / 1000) + 300, // 5 minutos de expiração
      iat: Math.floor(Date.now() / 1000),
    };

    // Assinar o JWT
    const assertion = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: 'RS256' })
      .sign(key);

    return assertion;
  }
}
