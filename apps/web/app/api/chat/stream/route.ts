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
    const sessionId = searchParams.get('sessionId');

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

        // Handle controller close
        const cleanup = () => {
          isClosed = true;
        };

        try {
          // Send initial typing indicator
          controller.enqueue(
            `data: ${JSON.stringify({
              type: 'typing',
              content: 'Assistente está processando sua pergunta...',
            })}\n\n`
          );

          const chatService = getChatService();
          const userId = session.user?.id || session.user?.email || 'anonymous';
          
          let chatSession;
          
          if (sessionId) {
            chatSession = chatService.getSession(sessionId);
            if (!chatSession) {
              chatSession = chatService.createSession(userId);
            }
          } else {
            chatSession = chatService.createSession(userId);
          }

          // Process the message with the chat service
          const result = await chatService.processMessage(
            chatSession.sessionId,
            message
          );

          if (isClosed) return;

          const responseContent = result.message.content;
          
          // Stream response word by word
          const words = responseContent.split(' ');
          let currentResponse = '';

          for (let index = 0; index < words.length; index++) {
            if (isClosed) break;

            const word = words[index];
            currentResponse += (index > 0 ? ' ' : '') + word;

            controller.enqueue(
              `data: ${JSON.stringify({
                type: 'chunk',
                content: word + (index < words.length - 1 ? ' ' : ''),
                isComplete: index === words.length - 1,
              })}\n\n`
            );

            // Add delay between words for streaming effect
            await new Promise(resolve => setTimeout(resolve, 50));
          }

          if (!isClosed) {
            // Send final message with sources when complete
            controller.enqueue(
              `data: ${JSON.stringify({
                type: 'complete',
                content: responseContent,
                sources: result.message.sources || [],
                sessionId: chatSession.sessionId,
                metadata: result.message.metadata,
              })}\n\n`
            );

            controller.close();
          }
        } catch (error) {
          console.error('Error in chat stream:', error);
          if (!isClosed) {
            controller.enqueue(
              `data: ${JSON.stringify({
                type: 'error',
                content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
              })}\n\n`
            );
            controller.close();
          }
          cleanup();
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
