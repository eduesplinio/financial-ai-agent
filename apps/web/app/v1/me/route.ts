import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAuthorizedUserId } from '@/lib/server/mobile-auth';

/**
 * GET /v1/me
 *
 * Endpoint utilitário para validar autenticação e descobrir `userId` no ambiente.
 * - web: usa sessão NextAuth
 * - dev/mobile: aceita `x-linio-dev-key` + (`x-linio-dev-userid` ou `x-linio-dev-email`)
 */
export async function GET(request: NextRequest) {
  const userId = await getAuthorizedUserId(request);
  if (!userId) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  const session = await getServerSession(authOptions);

  return NextResponse.json({
    userId,
    email: session?.user?.email ?? null,
    role: (session?.user as any)?.role ?? null,
  });
}

