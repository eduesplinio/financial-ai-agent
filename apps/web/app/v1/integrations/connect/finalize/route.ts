import { NextRequest, NextResponse } from 'next/server';
import { finalizePluggyConnection } from '@/lib/server/pluggy';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const sessionId = typeof body.sessionId === 'string' ? body.sessionId : '';
    const itemId = typeof body.itemId === 'string' ? body.itemId : '';

    if (!sessionId || !itemId) {
      return NextResponse.json(
        { message: 'sessionId e itemId são obrigatórios.' },
        { status: 400 }
      );
    }

    const result = await finalizePluggyConnection({ sessionId, itemId });
    return NextResponse.json({ redirectURL: result.redirectURL });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : 'Não foi possível finalizar a conexão.',
      },
      { status: 409 }
    );
  }
}
