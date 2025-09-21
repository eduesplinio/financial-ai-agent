import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getChatService } from '@/lib/chat-service';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, sessionId } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const chatService = getChatService();

    // Get or create session
    let conversationSession = sessionId
      ? chatService.getSession(sessionId)
      : null;

    if (!conversationSession) {
      conversationSession = chatService.createSession(session.user.id);
    }

    // Process the message - ChatService will automatically fetch user data
    const response = await chatService.processMessage(
      conversationSession.sessionId,
      message
      // userProfile will be fetched automatically by ChatService
    );

    return NextResponse.json({
      message: response.message,
      sessionId: response.session.sessionId,
    });
  } catch (error) {
    console.error('Chat API error:', error);

    // Check if it's an OpenAI API error
    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json(
        {
          error:
            'OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
