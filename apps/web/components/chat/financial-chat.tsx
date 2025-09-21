'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'action' | 'data';
  data?: any;
}

interface FinancialChatProps {
  userId?: string;
  onActionTrigger?: (action: string, data: any) => void;
}

export function FinancialChat({
  userId = 'user-1',
  onActionTrigger,
}: FinancialChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Sou seu assistente financeiro. Posso te ajudar com análises de gastos, planejamento financeiro, categorização de transações e muito mais. Como posso ajudar hoje?',
      sender: 'assistant',
      timestamp: new Date(),
      type: 'text',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) {
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Simular resposta do agente financeiro
      const response = await simulateFinancialAgent(inputText);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'assistant',
        timestamp: new Date(),
        type: response.type || 'text',
        data: response.data,
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Disparar ação se necessário
      if (response.action && onActionTrigger) {
        onActionTrigger(response.action, response.data);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Desculpe, ocorreu um erro. Tente novamente.',
        sender: 'assistant',
        timestamp: new Date(),
        type: 'text',
      };
      setMessages(prev => [...prev, errorMessage]);
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

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const renderMessage = (message: Message) => {
    const isUser = message.sender === 'user';

    return (
      <div
        key={message.id}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`max-w-[70%] ${isUser ? 'order-2' : 'order-1'}`}>
          <div
            className={`rounded-lg px-4 py-2 ${
              isUser ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap">{message.text}</p>

            {/* Renderizar dados estruturados */}
            {message.type === 'data' && message.data && (
              <div className="mt-2 p-2 bg-background/50 rounded border">
                {message.data.transactions && (
                  <div>
                    <h4 className="font-semibold text-xs mb-2">
                      Transações Encontradas:
                    </h4>
                    {message.data.transactions
                      .slice(0, 3)
                      .map((tx: any, idx: number) => (
                        <div key={idx} className="text-xs mb-1">
                          • {tx.description}: {formatCurrency(tx.amount)} (
                          {tx.category})
                        </div>
                      ))}
                  </div>
                )}
                {message.data.summary && (
                  <div>
                    <h4 className="font-semibold text-xs mb-2">Resumo:</h4>
                    <div className="text-xs">
                      Total: {formatCurrency(message.data.summary.total)}
                      <br />
                      Categoria principal: {message.data.summary.topCategory}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div
            className={`text-xs text-muted-foreground mt-1 ${isUser ? 'text-right' : 'text-left'}`}
          >
            {message.timestamp.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
            isUser
              ? 'bg-primary text-primary-foreground order-1 mr-2'
              : 'bg-secondary order-2 ml-2'
          }`}
        >
          {isUser ? '👤' : '🤖'}
        </div>
      </div>
    );
  };

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          🤖 Assistente Financeiro
          <div className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
            Online
          </div>
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map(renderMessage)}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Analisando...
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <Separator />
        <div className="p-4">
          <div className="flex gap-2">
            <Input
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua pergunta financeira..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
              size="sm"
            >
              {isLoading ? '...' : '📤'}
            </Button>
          </div>
          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputText('Qual foi meu gasto total este mês?')}
              disabled={isLoading}
            >
              💰 Gastos do mês
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setInputText('Analise minhas categorias de gastos')
              }
              disabled={isLoading}
            >
              📊 Análise por categoria
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputText('Como posso economizar mais?')}
              disabled={isLoading}
            >
              💡 Dicas de economia
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Simulador do agente financeiro (em produção seria integrado com a API)
async function simulateFinancialAgent(query: string): Promise<{
  text: string;
  type?: 'text' | 'action' | 'data';
  data?: any;
  action?: string;
}> {
  // Simular delay de processamento
  await new Promise(resolve =>
    setTimeout(resolve, 1000 + Math.random() * 1000)
  );

  const lowerQuery = query.toLowerCase();

  // Simulação de processamento NLP e respostas
  if (
    lowerQuery.includes('gasto') &&
    (lowerQuery.includes('mês') || lowerQuery.includes('mensal'))
  ) {
    return {
      text: 'Analisando seus gastos mensais... Encontrei as seguintes informações:',
      type: 'data',
      data: {
        transactions: [
          {
            description: 'Supermercado Silva',
            amount: -320.5,
            category: 'Alimentação',
          },
          {
            description: 'Posto Shell',
            amount: -180.0,
            category: 'Transporte',
          },
          { description: 'Netflix', amount: -29.9, category: 'Entretenimento' },
        ],
        summary: {
          total: -3200.5,
          topCategory: 'Alimentação',
        },
      },
      action: 'show-expenses',
    };
  }

  if (lowerQuery.includes('categoria') || lowerQuery.includes('análise')) {
    return {
      text: 'Aqui está a análise das suas categorias de gastos:\n\n🍽️ Alimentação: R$ 1.250,00 (39%)\n🚗 Transporte: R$ 580,00 (18%)\n🏠 Moradia: R$ 900,00 (28%)\n🎮 Entretenimento: R$ 470,50 (15%)\n\nSua categoria com maior gasto é Alimentação. Posso sugerir algumas estratégias para otimizar esses gastos.',
      type: 'text',
      action: 'show-categories',
    };
  }

  if (
    lowerQuery.includes('economizar') ||
    lowerQuery.includes('poupar') ||
    lowerQuery.includes('dicas')
  ) {
    return {
      text: 'Baseado na análise dos seus gastos, aqui estão algumas dicas personalizadas:\n\n💡 **Alimentação**: Você gasta R$ 1.250/mês. Considere:\n- Fazer compras com lista\n- Cozinhar mais em casa\n- Comparar preços entre mercados\n\n🚗 **Transporte**: R$ 580/mês\n- Considere transporte público\n- Caronas compartilhadas\n- Trabalho remoto quando possível\n\n🎯 **Meta**: Com essas otimizações, você pode economizar até R$ 400/mês!',
      type: 'text',
    };
  }

  if (lowerQuery.includes('saldo') || lowerQuery.includes('conta')) {
    return {
      text: 'Seu saldo atual é de R$ 12.450,75.\n\n📈 Receitas este mês: R$ 8.500,00\n📉 Gastos este mês: R$ 3.200,50\n💰 Saldo líquido: +R$ 5.299,50\n\nVocê está com uma situação financeira positiva! Continue assim.',
      type: 'text',
    };
  }

  if (lowerQuery.includes('investimento') || lowerQuery.includes('investir')) {
    return {
      text: 'Com base no seu perfil financeiro, aqui estão algumas opções de investimento:\n\n🔒 **Conservador** (baixo risco):\n- Tesouro Selic: ~12,5% a.a.\n- CDB: ~13,2% a.a.\n\n⚖️ **Moderado** (risco médio):\n- Fundos multimercado\n- Tesouro IPCA+\n\n📊 **Arrojado** (alto risco):\n- Ações\n- Fundos de ações\n\nRecomendo começar com 70% conservador e 30% moderado.',
      type: 'text',
    };
  }

  // Resposta padrão
  return {
    text:
      'Entendi sua pergunta sobre ' +
      query +
      '. Posso ajudar com:\n\n• Análise de gastos e receitas\n• Categorização de transações\n• Dicas de economia personalizada\n• Planejamento financeiro\n• Sugestões de investimento\n• Metas financeiras\n\nPoderia ser mais específico sobre o que gostaria de saber?',
    type: 'text',
  };
}
