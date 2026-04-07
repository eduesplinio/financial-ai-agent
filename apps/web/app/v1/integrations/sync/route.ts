import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getAuthorizedUserId } from '@/lib/server/mobile-auth';

/**
 * POST /v1/integrations/sync
 *
 * Inicia sincronização (simulada) para todas as contas conectadas do usuário.
 * Resposta mantém o contrato esperado pelo app iOS.
 */
export async function POST(_request: NextRequest) {
  const userId = await getAuthorizedUserId(_request);
  if (!userId) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  const db = await getDatabase();
  const connectedAccounts = db.collection('connected_accounts');

  const accounts = await connectedAccounts
    .find({ userId, deletedAt: { $exists: false } })
    .project({ _id: 1 })
    .toArray();

  if (accounts.length === 0) {
    return NextResponse.json(
      {
        connectionStatus: 'failed',
        lastSyncTimestamp: null,
        connectURL: null,
        connectToken: null,
        errorMessage: 'Nenhuma conta conectada.',
      },
      { status: 409 }
    );
  }

  // Atualiza `lastSync` de todas as contas como "agora".
  // O pipeline real já existe em `/api/open-finance/sync`, mas o iOS não trabalha com accountId.
  const now = new Date();
  await connectedAccounts.updateMany(
    { userId, deletedAt: { $exists: false } },
    { $set: { lastSync: now, updatedAt: now } }
  );

  return NextResponse.json({
    connectionStatus: 'connected',
    lastSyncTimestamp: Math.floor(now.getTime() / 1000),
    connectURL: null,
    connectToken: null,
    errorMessage: null,
  });
}
