import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { OpenFinanceAuth } from '@financial-ai/open-finance';
import type { OAuthConfig } from '@financial-ai/open-finance';

/**
 * API de callback para o fluxo OAuth2 do Open Finance
 */

// Configurações OAuth (mesmo do arquivo anterior)
const OAUTH_CONFIGS: Record<string, OAuthConfig> = {
  'banco-do-brasil': {
    institutionId: 'banco-do-brasil',
    clientId: process.env.BB_CLIENT_ID || 'bb-client-id',
    clientSecret: process.env.BB_CLIENT_SECRET || 'bb-client-secret',
    redirectUri: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/open-finance/callback`,
    authorizationEndpoint: 'https://auth.bb.com.br/oauth/authorize',
    tokenEndpoint: 'https://auth.bb.com.br/oauth/token',
    apiBaseUrl: 'https://api.bb.com.br/open-banking',
    scopes: ['accounts', 'transactions'],
  },
  'caixa-economica': {
    institutionId: 'caixa-economica',
    clientId: process.env.CEF_CLIENT_ID || 'cef-client-id',
    clientSecret: process.env.CEF_CLIENT_SECRET || 'cef-client-secret',
    redirectUri: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/open-finance/callback`,
    authorizationEndpoint: 'https://auth.caixa.gov.br/oauth/authorize',
    tokenEndpoint: 'https://auth.caixa.gov.br/oauth/token',
    apiBaseUrl: 'https://api.caixa.gov.br/open-banking',
    scopes: ['accounts', 'transactions'],
  },
  bradesco: {
    institutionId: 'bradesco',
    clientId: process.env.BRADESCO_CLIENT_ID || 'bradesco-client-id',
    clientSecret:
      process.env.BRADESCO_CLIENT_SECRET || 'bradesco-client-secret',
    redirectUri: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/open-finance/callback`,
    authorizationEndpoint: 'https://auth.bradesco.com.br/oauth/authorize',
    tokenEndpoint: 'https://auth.bradesco.com.br/oauth/token',
    apiBaseUrl: 'https://api.bradesco.com.br/open-banking',
    scopes: ['accounts', 'transactions', 'credit-cards'],
  },
  itau: {
    institutionId: 'itau',
    clientId: process.env.ITAU_CLIENT_ID || 'itau-client-id',
    clientSecret: process.env.ITAU_CLIENT_SECRET || 'itau-client-secret',
    redirectUri: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/open-finance/callback`,
    authorizationEndpoint: 'https://auth.itau.com.br/oauth/authorize',
    tokenEndpoint: 'https://auth.itau.com.br/oauth/token',
    apiBaseUrl: 'https://api.itau.com.br/open-banking',
    scopes: ['accounts', 'transactions', 'credit-cards', 'investments'],
  },
  santander: {
    institutionId: 'santander',
    clientId: process.env.SANTANDER_CLIENT_ID || 'santander-client-id',
    clientSecret:
      process.env.SANTANDER_CLIENT_SECRET || 'santander-client-secret',
    redirectUri: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/open-finance/callback`,
    authorizationEndpoint: 'https://auth.santander.com.br/oauth/authorize',
    tokenEndpoint: 'https://auth.santander.com.br/oauth/token',
    apiBaseUrl: 'https://api.santander.com.br/open-banking',
    scopes: ['accounts', 'transactions', 'credit-cards'],
  },
  nubank: {
    institutionId: 'nubank',
    clientId: process.env.NUBANK_CLIENT_ID || 'nubank-client-id',
    clientSecret: process.env.NUBANK_CLIENT_SECRET || 'nubank-client-secret',
    redirectUri: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/open-finance/callback`,
    authorizationEndpoint: 'https://auth.nubank.com.br/oauth/authorize',
    tokenEndpoint: 'https://auth.nubank.com.br/oauth/token',
    apiBaseUrl: 'https://api.nubank.com.br/open-banking',
    scopes: ['accounts', 'transactions', 'credit-cards'],
  },
};

/**
 * GET /api/open-finance/callback
 * Processa o callback do fluxo OAuth2
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    const institutionId = searchParams.get('institution_id');

    // Verificar se houve erro na autorização
    if (error) {
      console.error('OAuth2 authorization error:', error, errorDescription);
      return NextResponse.redirect(
        new URL(
          `/integrations?error=${encodeURIComponent(errorDescription || error)}`,
          request.url
        )
      );
    }

    // Verificar parâmetros obrigatórios
    if (!code || !state || !institutionId) {
      return NextResponse.redirect(
        new URL('/integrations?error=missing_parameters', request.url)
      );
    }

    // Verificar se a instituição está configurada
    const oauthConfig = OAUTH_CONFIGS[institutionId];
    if (!oauthConfig) {
      return NextResponse.redirect(
        new URL('/integrations?error=unsupported_institution', request.url)
      );
    }

    // Em uma implementação real, buscaríamos o codeVerifier do banco de dados
    // usando o state como chave. Por enquanto, vamos simular
    const codeVerifier = `code_verifier_${state}`;

    // Criar instância do OpenFinanceAuth
    const auth = new OpenFinanceAuth({
      baseUrl: oauthConfig.apiBaseUrl,
      clientId: oauthConfig.clientId,
      clientSecret: oauthConfig.clientSecret,
      authUrl: oauthConfig.authorizationEndpoint,
    });

    try {
      // Trocar código por token
      const tokenResponse = await auth.exchangeCodeForToken(
        oauthConfig,
        code,
        codeVerifier
      );

      // Em uma implementação real, salvaríamos o token no banco de dados
      // associado ao usuário e à instituição
      console.log('Token received for institution:', institutionId);
      console.log('Token type:', tokenResponse.token_type);
      console.log('Expires in:', tokenResponse.expires_in, 'seconds');

      // Redirecionar para página de sucesso
      return NextResponse.redirect(
        new URL(
          `/integrations?success=true&institution=${institutionId}`,
          request.url
        )
      );
    } catch (tokenError) {
      console.error('Error exchanging code for token:', tokenError);
      return NextResponse.redirect(
        new URL('/integrations?error=token_exchange_failed', request.url)
      );
    }
  } catch (error) {
    console.error('Error processing OAuth2 callback:', error);
    return NextResponse.redirect(
      new URL('/integrations?error=callback_processing_failed', request.url)
    );
  }
}

/**
 * POST /api/open-finance/callback
 * Processa webhooks de notificação das instituições financeiras
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventType, institutionId, data } = body;

    console.log('Webhook received:', { eventType, institutionId, data });

    // Verificar assinatura do webhook (em produção)
    const signature = request.headers.get('x-webhook-signature');
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing webhook signature' },
        { status: 401 }
      );
    }

    // Processar diferentes tipos de eventos
    switch (eventType) {
      case 'consent.authorized':
        console.log('Consent authorized for institution:', institutionId);
        // Atualizar status do consentimento no banco de dados
        break;

      case 'consent.revoked':
        console.log('Consent revoked for institution:', institutionId);
        // Revogar acesso e limpar tokens
        break;

      case 'account.updated':
        console.log('Account updated for institution:', institutionId);
        // Sincronizar dados da conta
        break;

      case 'transaction.created':
        console.log('New transaction for institution:', institutionId);
        // Processar nova transação
        break;

      default:
        console.log('Unknown webhook event type:', eventType);
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
