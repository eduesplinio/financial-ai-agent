import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getAuthorizedUserId } from '@/lib/server/mobile-auth';

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

  const db = await getDatabase();
  const connectedAccounts = db.collection('connected_accounts');

  const accounts = await connectedAccounts
    .find({ userId, deletedAt: { $exists: false } })
    .project({ lastSync: 1 })
    .toArray();

  if (accounts.length === 0) {
    return NextResponse.json({
      connectionStatus: 'notConnected',
      lastSyncTimestamp: null,
      connectURL: null,
      connectToken: null,
      errorMessage: null,
    });
  }

  const lastSyncAt = accounts
    .map(a => (a.lastSync ? new Date(a.lastSync) : null))
    .filter(Boolean)
    .reduce<Date | null>((acc, date) => {
      if (!date) return acc;
      if (!acc) return date;
      return date > acc ? date : acc;
    }, null);

  return NextResponse.json({
    connectionStatus: 'connected',
    lastSyncTimestamp: lastSyncAt ? Math.floor(lastSyncAt.getTime() / 1000) : null,
    connectURL: null,
    connectToken: null,
    errorMessage: null,
  });
}
