'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  metadata?: {
    confidence?: number;
    source?: string;
    processingTime?: number;
  };
}

interface ChatInterfaceProps {
  userId?: string;
  onMessageSent?: (message: string) => void;
}

export function ChatInterface({
  userId = 'user-demo',
  onMessageSent,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content:
        '🤖 Olá! Sou seu assistente financeiro pessoal. Posso ajudá-lo com consultas sobre transações, investimentos, planejamento financeiro e muito mais. Como posso ajudá-lo hoje?',
      timestamp: new Date(),
      metadata: {
        confidence: 1.0,
        source: 'greeting',
      },
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Real integration with AI agent
  const processMessage = async (userMessage: string): Promise<ChatMessage> => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          sessionId: sessionId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process message');
      }

      const data = await response.json();

      // Update session ID
      setSessionId(data.sessionId);

      return {
        id: data.message.id,
        type: 'bot',
        content: data.message.content,
        timestamp: new Date(data.message.timestamp),
        metadata: {
          confidence: data.message.metadata?.confidence || 0.8,
          source: 'ai-agent',
          processingTime: data.message.metadata?.processingTime || 0,
        },
      };
    } catch (error) {
      console.error('Error processing message:', error);

      return {
        id: Date.now().toString(),
        type: 'bot',
        content: `❌ Desculpe, ocorreu um erro ao processar sua mensagem: ${error instanceof Error ? error.message : 'Erro desconhecido'}. Tente novamente.`,
        timestamp: new Date(),
        metadata: {
          confidence: 0,
          source: 'error-handler',
          processingTime: 0,
        },
      };
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToProcess = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    try {
      const botResponse = await processMessage(messageToProcess);
      setMessages(prev => [...prev, botResponse]);
      onMessageSent?.(messageToProcess);
    } catch (error) {
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content:
          '❌ Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
        timestamp: new Date(),
        metadata: {
          confidence: 0,
          source: 'error-handler',
        },
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) {
      return 'text-muted-foreground';
    }
    if (confidence >= 0.8) {
      return 'text-green-600';
    }
    if (confidence >= 0.6) {
      return 'text-yellow-600';
    }
    return 'text-red-600';
  };

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          🤖 Assistente Financeiro IA
          <span className="text-sm font-normal text-muted-foreground">
            • {messages.length - 1} mensagens
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 p-0">
        {/* Área de mensagens */}
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </div>

                  <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                    <span>{formatTimestamp(message.timestamp)}</span>

                    {message.metadata && message.type === 'bot' && (
                      <div className="flex items-center gap-2">
                        <span
                          className={getConfidenceColor(
                            message.metadata.confidence
                          )}
                        >
                          {((message.metadata.confidence || 0) * 100).toFixed(
                            0
                          )}
                          %
                        </span>
                        {message.metadata.processingTime && (
                          <span className="text-muted-foreground">
                            {message.metadata.processingTime}ms
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-2 max-w-[80%]">
                  <div className="flex items-center gap-2">
                    <div className="animate-pulse">🤖</div>
                    <span className="text-sm">Processando...</span>
                    <div className="flex gap-1">
                      <div
                        className="w-1 h-1 bg-current rounded-full animate-bounce"
                        style={{ animationDelay: '0ms' }}
                      />
                      <div
                        className="w-1 h-1 bg-current rounded-full animate-bounce"
                        style={{ animationDelay: '150ms' }}
                      />
                      <div
                        className="w-1 h-1 bg-current rounded-full animate-bounce"
                        style={{ animationDelay: '300ms' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <Separator />

        {/* Input de mensagem */}
        <div className="p-4">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem sobre finanças..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
            >
              {isLoading ? '⏳' : '📤'}
            </Button>
          </div>

          <div className="mt-2 text-xs text-muted-foreground">
            Exemplos: "Qual meu saldo?", "Gastos em alimentação", "Como investir
            R$ 1000?"
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
