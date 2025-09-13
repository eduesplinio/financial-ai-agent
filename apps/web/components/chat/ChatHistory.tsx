'use client';

import React, { useState, useEffect } from 'react';
import { Search, MessageCircle, Calendar, Filter, X } from 'lucide-react';
import { ChatMessage } from './ChatWidget';

interface ChatHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ConversationSummary {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  isOpen,
  onClose,
}) => {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    if (isOpen) {
      const mockConversations: ConversationSummary[] = [
        {
          id: '1',
          title: 'Planejamento Financeiro 2024',
          lastMessage: 'Como posso organizar melhor meu orçamento?',
          timestamp: new Date('2024-01-15T10:30:00'),
          messageCount: 8,
        },
        {
          id: '2',
          title: 'Investimentos em Renda Fixa',
          lastMessage: 'Quais são as melhores opções de CDB?',
          timestamp: new Date('2024-01-14T15:45:00'),
          messageCount: 12,
        },
        {
          id: '3',
          title: 'Análise de Gastos Dezembro',
          lastMessage: 'Meus gastos aumentaram muito em dezembro',
          timestamp: new Date('2024-01-10T09:20:00'),
          messageCount: 5,
        },
      ];
      setConversations(mockConversations);
    }
  }, [isOpen]);

  const loadConversation = async (conversationId: string) => {
    setLoading(true);
    try {
      // Mock loading conversation messages
      const mockMessages: ChatMessage[] = [
        {
          id: '1',
          role: 'user',
          content: 'Como posso organizar melhor meu orçamento?',
        },
        {
          id: '2',
          role: 'assistant',
          content:
            'Para organizar seu orçamento de forma eficiente, recomendo seguir a regra 50-30-20: 50% para gastos essenciais, 30% para gastos pessoais e 20% para poupança e investimentos.',
          sources: [{ title: 'Guia de Planejamento Financeiro', url: '#' }],
          feedback: null,
        },
      ];

      setMessages(mockMessages);
      setSelectedConversation(conversationId);
    } catch (error) {
      console.error('Error loading conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter(
    conv =>
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-xl shadow-2xl w-full max-w-4xl h-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Histórico de Conversas</h2>
          </div>
          <button
            onClick={onClose}
            className="text-primary-foreground hover:text-primary-foreground/80 transition-colors"
            aria-label="Fechar histórico"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Conversations List */}
          <div className="w-1/3 border-r border-border flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar conversas..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhuma conversa encontrada</p>
                </div>
              ) : (
                filteredConversations.map(conv => (
                  <button
                    key={conv.id}
                    onClick={() => loadConversation(conv.id)}
                    className={`w-full p-4 text-left border-b border-border hover:bg-muted/50 transition-colors ${
                      selectedConversation === conv.id ? 'bg-muted' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-medium text-sm truncate">
                        {conv.title}
                      </h3>
                      <span className="text-xs text-muted-foreground ml-2">
                        {conv.messageCount} msgs
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mb-2">
                      {conv.lastMessage}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{conv.timestamp.toLocaleDateString('pt-BR')}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Messages Display */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold">
                    {
                      conversations.find(c => c.id === selectedConversation)
                        ?.title
                    }
                  </h3>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: '0.1s' }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: '0.2s' }}
                        ></div>
                        <span className="ml-2 text-muted-foreground">
                          Carregando conversa...
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map(msg => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`rounded-lg px-3 py-2 max-w-[85%] ${
                              msg.role === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-foreground'
                            }`}
                          >
                            <div className="whitespace-pre-wrap">
                              {msg.content}
                            </div>

                            {msg.sources && msg.sources.length > 0 && (
                              <div className="mt-2 pt-2 border-t border-border/20">
                                <div className="text-xs text-muted-foreground mb-1">
                                  Fontes:
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {msg.sources.map((src, i) => (
                                    <a
                                      key={i}
                                      href={src.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs bg-background/50 px-2 py-1 rounded hover:bg-background/80 transition-colors"
                                    >
                                      {src.title}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center text-muted-foreground">
                <div>
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Selecione uma conversa</p>
                  <p className="text-sm">
                    Escolha uma conversa da lista para ver o histórico completo
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;
