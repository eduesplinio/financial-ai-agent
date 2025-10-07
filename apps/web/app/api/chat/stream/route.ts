import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Marcar como rota dinâmica
export const dynamic = 'force-dynamic';

/**
 * GET /api/chat/stream
 * Endpoint para streaming de chat com RAG completo
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

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Use the simplified RAG service
          const { ChatRAGService } = await import('@/lib/chat-rag-service');
          const chatRAGService = new ChatRAGService();

          // Stream response using RAG
          for await (const chunk of chatRAGService.streamResponse(
            session.user.id,
            message
          )) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`)
            );
          }

          controller.close();
        } catch (error) {
          console.error('Error in chat stream:', error);

          // Send error message
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'complete',
                content:
                  'Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente em alguns instantes.',
                sources: [],
              })}\n\n`
            )
          );

          controller.close();
        }
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
