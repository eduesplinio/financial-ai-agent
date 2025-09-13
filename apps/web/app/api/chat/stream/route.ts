import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const message = searchParams.get('message');

    if (!message) {
      return new Response('Message is required', { status: 400 });
    }

    // Set headers for Server-Sent Events
    const responseHeaders = {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    };

    // Create a readable stream for SSE
    const stream = new ReadableStream({
      start(controller) {
        // Send initial typing indicator
        controller.enqueue(
          `data: ${JSON.stringify({
            type: 'typing',
            content: 'Assistente está processando sua pergunta...',
          })}\n\n`
        );

        // Simulate streaming response
        const response = `Recebi sua pergunta: "${message}". Esta é uma resposta simulada que será substituída pela integração real com o sistema RAG e LLM. A resposta está sendo transmitida em tempo real via Server-Sent Events.`;

        // Stream response word by word
        const words = response.split(' ');
        let currentResponse = '';

        words.forEach((word, index) => {
          setTimeout(() => {
            currentResponse += (index > 0 ? ' ' : '') + word;

            controller.enqueue(
              `data: ${JSON.stringify({
                type: 'chunk',
                content: word + (index < words.length - 1 ? ' ' : ''),
                isComplete: index === words.length - 1,
              })}\n\n`
            );

            // Send final message with sources when complete
            if (index === words.length - 1) {
              setTimeout(() => {
                controller.enqueue(
                  `data: ${JSON.stringify({
                    type: 'complete',
                    content: currentResponse,
                    sources: [
                      { title: 'Documento Financeiro 1', url: '#' },
                      { title: 'Regulamentação Bancária', url: '#' },
                    ],
                  })}\n\n`
                );

                controller.close();
              }, 100);
            }
          }, index * 100);
        });
      },
    });

    return new Response(stream, { headers: responseHeaders });
  } catch (error) {
    console.error('Chat stream API error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
