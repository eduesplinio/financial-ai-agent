import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/chat/history
 * Get user's conversation history
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Import ConversationService dynamically
    const { ConversationService } = await import(
      '../../../../../../packages/database/src/models'
    );

    // Get conversations for user
    const result = await ConversationService.findByUserId(
      session.user.id,
      page,
      limit
    );

    // Transform conversations to summary format
    const conversations = result.conversations.map(conv => {
      const lastMessage =
        conv.messages.length > 0
          ? conv.messages[conv.messages.length - 1]
          : null;

      // Generate title from first user message or use default
      const firstUserMessage = conv.messages.find(m => m.role === 'user');
      const title = firstUserMessage
        ? firstUserMessage.content.substring(0, 50) +
          (firstUserMessage.content.length > 50 ? '...' : '')
        : 'Nova conversa';

      return {
        id: conv._id.toString(),
        sessionId: conv.sessionId,
        title,
        lastMessage: lastMessage?.content || '',
        timestamp: conv.updatedAt,
        messageCount: conv.messages.length,
      };
    });

    return NextResponse.json({
      conversations,
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit),
    });
  } catch (error) {
    console.error('Error fetching conversation history:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar histórico' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/chat/history
 * Get specific conversation by ID
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { conversationId } = body;

    if (!conversationId) {
      return NextResponse.json(
        { message: 'ID da conversa é obrigatório' },
        { status: 400 }
      );
    }

    // Import ConversationService dynamically
    const { ConversationService } = await import(
      '../../../../../../packages/database/src/models'
    );

    // Get conversation
    const conversation = await ConversationService.findById(conversationId);

    if (!conversation) {
      return NextResponse.json(
        { message: 'Conversa não encontrada' },
        { status: 404 }
      );
    }

    // Check if conversation belongs to user
    const conversationUserId = conversation.userId?._id
      ? conversation.userId._id.toString()
      : conversation.userId.toString();

    if (conversationUserId !== session.user.id) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 403 });
    }

    // Transform messages
    const messages = conversation.messages.map(msg => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp,
      sources: msg.sources || [],
    }));

    return NextResponse.json({
      id: conversation._id.toString(),
      sessionId: conversation.sessionId,
      messages,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar conversa' },
      { status: 500 }
    );
  }
}
