import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Marcar como rota dinâmica
export const dynamic = 'force-dynamic';

/**
 * GET /api/chat/stream
 * Endpoint para streaming de chat (implementação futura)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const message = searchParams.get('message');

    if (!message) {
      return NextResponse.json(
        { message: 'Mensagem é obrigatória' },
        { status: 400 }
      );
    }

    // Criar stream de resposta simulada
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      start(controller) {
        const responses = [
          'Olá! ',
          'Recebi sua mensagem: "' + message + '". ',
          'O sistema de chat com IA está sendo implementado. ',
          'Em breve você poderá fazer perguntas sobre suas finanças ',
          'e receber análises personalizadas baseadas em suas transações!',
        ];

        let index = 0;
        const interval = setInterval(() => {
          if (index < responses.length) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  content: responses[index],
                  done: false,
                })}\n\n`
              )
            );
            index++;
          } else {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  content: '',
                  done: true,
                })}\n\n`
              )
            );
            clearInterval(interval);
            controller.close();
          }
        }, 500);
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in chat stream:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
