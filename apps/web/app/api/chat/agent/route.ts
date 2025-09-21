import { NextRequest, NextResponse } from 'next/server';
import { ConversationalAgent } from '@financial-ai/ai';

export async function POST(request: NextRequest) {
  try {
    const { message, session, userProfile } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Create ConversationalAgent instance
    const agent = new ConversationalAgent(openaiApiKey);

    // Process message with the agent
    const response = await agent.processMessage(message, session, userProfile);

    return NextResponse.json({
      content: response.message.content,
      sources: response.message.sources || [],
      confidence: response.message.metadata?.confidence || 0.8,
      hasSufficientContext:
        response.message.metadata?.hasSufficientContext || true,
      context: response.session.context,
    });
  } catch (error) {
    console.error('ConversationalAgent API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
