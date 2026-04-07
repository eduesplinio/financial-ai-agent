import { NextRequest, NextResponse } from 'next/server';
import { getAuthorizedUserId } from '@/lib/server/mobile-auth';

type ConnectRequestBody = {
  redirectUri?: string;
  platform?: string;
};

/**
 * POST /v1/integrations/connect/token
 *
 * Contrato para o app iOS:
 * - devolve um `connectToken` (opaco, útil para rastrear a tentativa) e um `connectURL`
 *   que pode ser aberto no navegador para completar o fluxo.
 *
 * Observação: neste projeto web o fluxo de conexão é simulado via `/api/open-finance/accounts`.
 * Este endpoint entrega um deep link para a tela web de integrações.
 */
export async function POST(request: NextRequest) {
  const userId = await getAuthorizedUserId(request);
  if (!userId) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as ConnectRequestBody;
  const url = new URL(request.url);
  const origin = url.origin;
  const redirectUri = body.redirectUri || 'linio://integrations/callback';
  const platform = body.platform || 'ios';

  const connectToken = `ct_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const connectURL = new URL('/v1/integrations/connect/complete', origin);
  connectURL.searchParams.set('token', connectToken);
  connectURL.searchParams.set('userId', userId);
  connectURL.searchParams.set('redirectUri', redirectUri);
  connectURL.searchParams.set('platform', platform);

  return NextResponse.json({
    connectionStatus: 'connecting',
    connectToken,
    connectURL: connectURL.toString(),
    lastSyncTimestamp: null,
    errorMessage: null,
  });
}
