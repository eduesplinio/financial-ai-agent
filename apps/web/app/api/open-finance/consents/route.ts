import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
// import { OpenFinanceAuth } from '@financial-ai/open-finance';
// import type { OAuthConfig, ConsentRequest } from '@financial-ai/open-finance';

type OAuthConfig = any;
type ConsentRequest = any;
// import { addConnectedAccount } from '../accounts/route';
import {
  getInstitutionConfig,
  SANDBOX_CONFIG,
} from '@/lib/open-finance-config';

/**
 * API para gerenciar consentimentos OAuth2 do Open Finance
 */

// Função para obter configuração OAuth2 de uma instituição
function getOAuthConfig(institutionId: string): OAuthConfig | null {
  const institution = getInstitutionConfig(institutionId);
  if (!institution) return null;

  return {
    institutionId,
    clientId: SANDBOX_CONFIG.clientId,
    clientSecret: SANDBOX_CONFIG.clientSecret,
    redirectUri: SANDBOX_CONFIG.redirectUri,
    authorizationEndpoint: `${institution.authUrl}/oauth/authorize`,
    tokenEndpoint: `${institution.apiUrl}/oauth/token`,
    apiBaseUrl: institution.apiUrl,
    scopes: institution.scopes,
  };
}

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
    const oauthConfig = getOAuthConfig(institutionId);
    if (!oauthConfig) {
      return NextResponse.json(
        { error: 'Institution not supported' },
        { status: 400 }
      );
    }

    // TODO: Implementar fluxo OAuth2 real do Open Finance Brasil
    const authData = {
      url: `${oauthConfig.authorizationEndpoint}?client_id=${oauthConfig.clientId}`,
      state: Math.random().toString(36),
      codeVerifier: Math.random().toString(36),
    };

    // Calcular data de expiração
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + expirationDays);

    // Criar requisição de consentimento conforme especificação Open Finance Brasil
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

    const consentId = `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return NextResponse.json({
      success: true,
      data: {
        consentId,
        authorizationUrl: authData.url,
        state: authData.state,
        codeVerifier: authData.codeVerifier,
        institutionId,
        scopes: scopes || oauthConfig.scopes,
        expirationDate: expirationDate.toISOString(),
        status: 'AWAITING_AUTHORIZATION',
        consentRequest,
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
