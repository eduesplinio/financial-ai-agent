import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getChatService } from '@/lib/chat-service';

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
      async start(controller) {
        let isClosed = false;
        const timeouts: NodeJS.Timeout[] = [];

        // Handle controller close
        const cleanup = () => {
          isClosed = true;
          timeouts.forEach(timeout => clearTimeout(timeout));
        };

        // Send initial typing indicator
        try {
          controller.enqueue(
            `data: ${JSON.stringify({
              type: 'typing',
              content:
                '🤖 Analisando sua pergunta e preparando uma resposta personalizada...',
            })}\n\n`
          );
        } catch (error) {
          cleanup();
          return;
        }

        // Small delay to show thinking animation
        await new Promise(resolve => setTimeout(resolve, 800));

        // Get real AI response using ChatService
        try {
          const chatService = getChatService();

          // Create or get session for the user
          let sessionId = `widget_${session.user.id}`;
          let conversationSession = chatService.getSession(sessionId);

          if (!conversationSession) {
            conversationSession = chatService.createSession(session.user.id);
            sessionId = conversationSession.sessionId;
          }

          // Process the message with AI - ChatService will automatically fetch user data
          const aiResponse = await chatService.processMessage(
            sessionId,
            message
            // userProfile will be fetched automatically by ChatService
          );

          const response = aiResponse.message.content;
          const sources = aiResponse.message.sources || [];

          // Stream response word by word
          const words = response.split(' ');
          let currentResponse = '';

          words.forEach((word, index) => {
            const timeout = setTimeout(() => {
              if (isClosed) {
                return;
              }

              try {
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
                  const finalTimeout = setTimeout(() => {
                    if (isClosed) {
                      return;
                    }

                    try {
                      controller.enqueue(
                        `data: ${JSON.stringify({
                          type: 'complete',
                          content: currentResponse,
                          sources: sources.map(source => ({
                            title: source.title,
                            url: source.url || '#',
                          })),
                        })}\n\n`
                      );

                      controller.close();
                      isClosed = true;
                    } catch (error) {
                      cleanup();
                    }
                  }, 100);
                  timeouts.push(finalTimeout);
                }
              } catch (error) {
                cleanup();
              }
            }, index * 50); // Faster streaming for better UX
            timeouts.push(timeout);
          });
        } catch (aiError) {
          console.error('AI processing error:', aiError);

          // Fallback to error message
          const errorResponse =
            'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.';
          const words = errorResponse.split(' ');
          let currentResponse = '';

          words.forEach((word, index) => {
            const timeout = setTimeout(() => {
              if (isClosed) {
                return;
              }

              try {
                currentResponse += (index > 0 ? ' ' : '') + word;

                controller.enqueue(
                  `data: ${JSON.stringify({
                    type: 'chunk',
                    content: word + (index < words.length - 1 ? ' ' : ''),
                    isComplete: index === words.length - 1,
                  })}\n\n`
                );

                if (index === words.length - 1) {
                  const finalTimeout = setTimeout(() => {
                    if (isClosed) {
                      return;
                    }

                    try {
                      controller.enqueue(
                        `data: ${JSON.stringify({
                          type: 'complete',
                          content: currentResponse,
                          sources: [],
                        })}\n\n`
                      );

                      controller.close();
                      isClosed = true;
                    } catch (error) {
                      cleanup();
                    }
                  }, 100);
                  timeouts.push(finalTimeout);
                }
              } catch (error) {
                cleanup();
              }
            }, index * 50);
            timeouts.push(timeout);
          });
        }
      },
      cancel() {
        // This will be called when the stream is cancelled (e.g., user navigates away)
      },
    });

    return new Response(stream, { headers: responseHeaders });
  } catch (error) {
    console.error('Chat stream API error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
