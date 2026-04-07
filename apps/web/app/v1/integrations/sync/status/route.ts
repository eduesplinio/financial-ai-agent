import { NextRequest, NextResponse } from 'next/server';
import { getAuthorizedUserId } from '@/lib/server/mobile-auth';
import { getPluggyStatus } from '@/lib/server/pluggy';

/**
 * GET /v1/integrations/sync/status
 *
 * Contrato para o app iOS:
 * - `connectionStatus`: notConnected | connecting | connected | syncing | failed
 * - `lastSyncTimestamp`: unix seconds (number) ou null
 */
export async function GET(_request: NextRequest) {
  const userId = await getAuthorizedUserId(_request);
  if (!userId) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  const status = await getPluggyStatus(userId);

  return NextResponse.json({
    connectionStatus: status.connectionStatus,
    lastSyncTimestamp: status.lastSyncTimestamp,
    connectURL: null,
    connectToken: null,
    errorMessage: status.errorMessage,
  });
}
