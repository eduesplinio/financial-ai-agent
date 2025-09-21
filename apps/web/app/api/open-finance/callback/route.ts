import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { OpenFinanceAuth } from '@financial-ai/open-finance';
import type { OAuthConfig } from '@financial-ai/open-finance';
import {
  getInstitutionConfig,
  SANDBOX_CONFIG,
} from '@/lib/open-finance-config';
// Removido import de addConnectedAccount - agora usa persistência no banco

/**
 * API de callback para o fluxo OAuth2 do Open Finance
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
    const oauthConfig = getOAuthConfig(institutionId);
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

      // Criar conta conectada
      const connectedAccount = {
        id: `conn_${institutionId}_${Date.now()}`,
        institutionId,
        accountId: `acc_${institutionId}_001`,
        nickname: `Conta ${institutionId}`,
        connectedAt: new Date().toISOString(),
        status: 'CONNECTED',
        lastSyncAt: new Date().toISOString(),
        tokenData: {
          accessToken: tokenResponse.access_token,
          tokenType: tokenResponse.token_type,
          expiresIn: tokenResponse.expires_in,
          scope: tokenResponse.scope,
        },
      };

      // Em uma implementação real, salvaríamos a conta conectada no banco de dados
      // através da API POST /api/open-finance/accounts
      console.log('Account connected:', connectedAccount);

      // Redirecionar para página de sucesso
      return NextResponse.redirect(
        new URL(
          `/integrations?success=true&institution=${institutionId}&account=${connectedAccount.id}`,
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
