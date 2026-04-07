import { NextRequest, NextResponse } from 'next/server';
import { getAuthorizedUserId } from '@/lib/server/mobile-auth';
import { beginPluggyConnection } from '@/lib/server/pluggy';

type ConnectRequestBody = {
  redirectUri?: string;
  platform?: string;
  institutionId?: string;
};

/**
 * POST /v1/integrations/connect/token
 *
 * Contrato para o app iOS:
 * - devolve um `connectToken` e um `connectURL`
 *   que abre uma página hospedada por nós com Pluggy Connect.
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthorizedUserId(request);
    if (!userId) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as ConnectRequestBody;
    const url = new URL(request.url);
    const redirectUri = body.redirectUri || 'linio://integrations/callback';
    const platform = body.platform || 'ios';
    const institutionId = body.institutionId;

    const result = await beginPluggyConnection({
      userId,
      institutionId,
      appRedirectUri: redirectUri,
      origin: url.origin,
      platform,
    });

    return NextResponse.json({
      connectionStatus: 'connecting',
      connectToken: result.connectToken,
      connectURL: result.connectURL,
      lastSyncTimestamp: null,
      errorMessage: null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        connectionStatus: 'failed',
        lastSyncTimestamp: null,
        connectURL: null,
        connectToken: null,
        errorMessage:
          error instanceof Error
            ? error.message
            : 'Não foi possível iniciar a conexão com a Pluggy.',
      },
      { status: 503 }
    );
  }
}
