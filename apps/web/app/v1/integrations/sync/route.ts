import { NextRequest, NextResponse } from 'next/server';
import { getAuthorizedUserId } from '@/lib/server/mobile-auth';
import { syncPluggyItem } from '@/lib/server/pluggy';

/**
 * POST /v1/integrations/sync
 *
 * Dispara atualização do item Pluggy conectado do usuário.
 * Resposta mantém o contrato esperado pelo app iOS.
 */
export async function POST(_request: NextRequest) {
  try {
    const userId = await getAuthorizedUserId(_request);
    if (!userId) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const result = await syncPluggyItem({ userId });

    return NextResponse.json({
      connectionStatus: result.connectionStatus,
      lastSyncTimestamp: result.lastSyncTimestamp,
      connectURL: null,
      connectToken: null,
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
            : 'Não foi possível sincronizar com a Pluggy.',
      },
      { status: 409 }
    );
  }
}
