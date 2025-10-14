'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { CHAT_CONFIG } from '@/lib/branding';

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
      content: CHAT_CONFIG.welcomeMessage,
      timestamp: new Date(),
      metadata: {
        confidence: 1.0,
        source: 'greeting',
      },
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock da integração com o agente conversacional
  const processMessage = async (userMessage: string): Promise<ChatMessage> => {
    // Simular delay de processamento
    await new Promise(resolve =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    );

    // Mock de respostas baseadas em padrões
    let botResponse = '';
    let confidence = 0.8;
    let source = 'nlp-pipeline';

    const normalizedMessage = userMessage.toLowerCase();

    if (
      normalizedMessage.includes('saldo') ||
      normalizedMessage.includes('conta')
    ) {
      botResponse = `💰 Seu saldo atual é de **R$ 12.450,75**. Você teve um aumento de 5,2% em relação ao mês passado. Suas principais movimentações recentes foram: transferência de R$ 2.300 recebida e compra no cartão de R$ 189,90.`;
      confidence = 0.95;
      source = 'account-service';
    } else if (
      normalizedMessage.includes('gasto') ||
      normalizedMessage.includes('despesa')
    ) {
      botResponse = `📊 Seus gastos este mês totalizam **R$ 3.200,50**. As principais categorias são:\n\n• **Moradia**: R$ 1.200 (37%)\n• **Alimentação**: R$ 850 (27%)\n• **Transporte**: R$ 420 (13%)\n• **Outros**: R$ 730,50 (23%)\n\nVocê está 3,4% abaixo da média dos últimos meses!`;
      confidence = 0.92;
    } else if (
      normalizedMessage.includes('investimento') ||
      normalizedMessage.includes('aplicar')
    ) {
      botResponse = `📈 Para investimentos, considere seu perfil e objetivos:\n\n• **Reserva de emergência**: Mantenha 6 meses de gastos em renda fixa\n• **Investimentos conservadores**: CDB, Tesouro Direto (8-12% a.a.)\n• **Investimentos moderados**: Fundos de índice, ações blue chips\n\nGostaria de simular alguns cenários de investimento?`;
      confidence = 0.88;
      source = 'investment-advisor';
    } else if (
      normalizedMessage.includes('meta') ||
      normalizedMessage.includes('objetivo')
    ) {
      botResponse = `🎯 Suas metas financeiras atuais:\n\n• **Reserva de emergência**: R$ 15.000 (83% concluída)\n• **Viagem Europa**: R$ 8.000 (45% concluída)\n• **Carro novo**: R$ 25.000 (início em 2025)\n\nVocê está no caminho certo! Continue poupando R$ 1.500/mês.`;
      confidence = 0.9;
      source = 'goals-tracker';
    } else if (
      normalizedMessage.includes('ajuda') ||
      normalizedMessage.includes('help')
    ) {
      botResponse = `🚀 Posso ajudá-lo com:\n\n• **Consultas financeiras**: saldo, extratos, gastos\n• **Análise de gastos**: categorização e tendências\n• **Planejamento**: metas e orçamento\n• **Investimentos**: sugestões personalizadas\n• **Relatórios**: análises detalhadas\n\nExemplos: "Qual meu saldo?", "Gastos em alimentação", "Como investir R$ 1000?"`;
      confidence = 1.0;
      source = 'help-system';
    } else {
      // Resposta genérica usando "entidades" simuladas
      const possibleEntities = ['transação', 'categoria', 'valor', 'período'];
      const detectedEntity =
        possibleEntities[Math.floor(Math.random() * possibleEntities.length)];

      botResponse = `🤔 Entendi que você está perguntando sobre **${detectedEntity}**. Posso ajudá-lo com informações mais específicas se você me fornecer mais detalhes.\n\nTente perguntas como:\n• "Qual meu saldo atual?"\n• "Gastos em alimentação este mês"\n• "Como está minha poupança?"`;
      confidence = 0.65;
      source = 'fallback-nlp';
    }

    return {
      id: Date.now().toString(),
      type: 'bot',
      content: botResponse,
      timestamp: new Date(),
      metadata: {
        confidence,
        source,
        processingTime: Math.floor(800 + Math.random() * 1500),
      },
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

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
    if (!confidence) return 'text-muted-foreground';
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          🤖 Linio - Seu Assistente Financeiro
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
                    <div className="animate-pulse text-lg">🤖</div>
                    <span className="text-sm">Pensando...</span>
                    <div className="flex gap-1">
                      <div
                        className="w-2 h-2 bg-current rounded-full animate-bounce"
                        style={{ animationDelay: '0ms' }}
                      />
                      <div
                        className="w-2 h-2 bg-current rounded-full animate-bounce"
                        style={{ animationDelay: '150ms' }}
                      />
                      <div
                        className="w-2 h-2 bg-current rounded-full animate-bounce"
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
              placeholder={CHAT_CONFIG.placeholderText}
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
            Exemplos:{' '}
            {CHAT_CONFIG.examples.slice(0, 3).map((example, i) => (
              <span key={i}>
                "{example}"{i < 2 ? ', ' : ''}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
