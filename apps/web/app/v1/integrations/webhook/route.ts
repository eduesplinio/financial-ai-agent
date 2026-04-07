import { NextRequest, NextResponse } from 'next/server';
import { persistPluggyTransactions } from '@/lib/server/pluggy';

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);

  if (!payload?.event || !payload?.itemId || !payload?.clientUserId) {
    return NextResponse.json({ ok: true });
  }

  if (
    payload.event === 'item/created' ||
    payload.event === 'item/updated' ||
    payload.event === 'transactions/created' ||
    payload.event === 'transactions/updated'
  ) {
    await persistPluggyTransactions(payload.clientUserId, payload.itemId).catch(
      () => undefined
    );
  }

  return NextResponse.json({ ok: true });
}
