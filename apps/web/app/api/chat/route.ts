import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Marcar como rota dinâmica
export const dynamic = 'force-dynamic';

/**
 * POST /api/chat
 * Endpoint básico para chat (implementação futura)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { message: 'Mensagem é obrigatória' },
        { status: 400 }
      );
    }

    // TODO: Implementar lógica do chat com RAG
    return NextResponse.json({
      message:
        'Chat em desenvolvimento. Em breve você poderá conversar com o assistente financeiro!',
      response: `Recebi sua mensagem: "${message}". O sistema de chat está sendo implementado.`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in chat:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
