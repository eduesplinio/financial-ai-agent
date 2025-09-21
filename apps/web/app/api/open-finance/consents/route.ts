import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { OpenFinanceAuth } from '@financial-ai/open-finance';
import type { OAuthConfig, ConsentRequest } from '@financial-ai/open-finance';

/**
 * API para gerenciar consentimentos OAuth2 do Open Finance
 */

// Configurações OAuth para cada instituição (em produção, viria do banco de dados)
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
 * GET /api/open-finance/consents
 * Lista consentimentos do usuário
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Em uma implementação real, buscaríamos do banco de dados
    // Por enquanto, retornamos uma lista vazia
    const consents = [];

    return NextResponse.json({
      success: true,
      data: consents,
      total: consents.length,
    });
  } catch (error) {
    console.error('Error fetching consents:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/open-finance/consents
 * Cria um novo consentimento OAuth2
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { institutionId, scopes, expirationDays = 90 } = body;

    if (!institutionId) {
      return NextResponse.json(
        { error: 'Institution ID is required' },
        { status: 400 }
      );
    }

    // Verificar se a instituição está configurada
    const oauthConfig = OAUTH_CONFIGS[institutionId];
    if (!oauthConfig) {
      return NextResponse.json(
        { error: 'Institution not supported' },
        { status: 400 }
      );
    }

    // Criar instância do OpenFinanceAuth
    const auth = new OpenFinanceAuth({
      baseUrl: oauthConfig.apiBaseUrl,
      clientId: oauthConfig.clientId,
      clientSecret: oauthConfig.clientSecret,
      authUrl: oauthConfig.authorizationEndpoint,
    });

    // Criar URL de autorização
    const authData = await auth.createAuthorizationUrl({
      ...oauthConfig,
      scopes: scopes || oauthConfig.scopes,
    });

    // Calcular data de expiração
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + expirationDays);

    // Criar requisição de consentimento
    const consentRequest: ConsentRequest = {
      data: {
        loggedUser: {
          document: {
            identification: session.user.email || '',
            rel: 'CPF', // Assumindo CPF por enquanto
          },
        },
        permissions: scopes || oauthConfig.scopes,
        expirationDateTime: expirationDate.toISOString(),
        transactionFromDateTime: new Date(
          Date.now() - 90 * 24 * 60 * 60 * 1000
        ).toISOString(), // 90 dias atrás
        transactionToDateTime: expirationDate.toISOString(),
      },
    };

    // Em uma implementação real, salvaríamos o consentimento no banco de dados
    // Por enquanto, apenas retornamos a URL de autorização

    return NextResponse.json({
      success: true,
      data: {
        consentId: `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        authorizationUrl: authData.url,
        state: authData.state,
        codeVerifier: authData.codeVerifier,
        institutionId,
        scopes: scopes || oauthConfig.scopes,
        expirationDate: expirationDate.toISOString(),
        status: 'AWAITING_AUTHORIZATION',
      },
      message:
        'Consent created successfully. Redirect user to authorization URL.',
    });
  } catch (error) {
    console.error('Error creating consent:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/open-finance/consents/:consentId
 * Revoga um consentimento
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const consentId = searchParams.get('consentId');

    if (!consentId) {
      return NextResponse.json(
        { error: 'Consent ID is required' },
        { status: 400 }
      );
    }

    // Em uma implementação real, revogaríamos o consentimento na API da instituição
    // e atualizaríamos o status no banco de dados

    return NextResponse.json({
      success: true,
      message: 'Consent revoked successfully',
    });
  } catch (error) {
    console.error('Error revoking consent:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
