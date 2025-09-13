import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Placeholder for chat processing
    // TODO: Integrate with RAG system and LLM
    const response = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Olá! Recebi sua mensagem: "${message}". Este é um placeholder que será conectado ao sistema RAG e LLM em breve.`,
      sources: [
        { title: 'Documento Financeiro 1', url: '#' },
        { title: 'Regulamentação Bancária', url: '#' },
      ],
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
