import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getChatService } from '@/lib/chat-service';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
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

    const response = {
      id: result.message.id,
      role: result.message.role,
      content: result.message.content,
      sources: result.message.sources || [],
      sessionId: chatSession.sessionId,
      metadata: result.message.metadata,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
