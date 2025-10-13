'use client';

import React, { useState, useEffect } from 'react';
import { Search, MessageCircle, Calendar, X } from 'lucide-react';
import { ChatMessage } from './ChatWidget';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Load conversations from API
  useEffect(() => {
    if (isOpen) {
      loadConversations();
    }
  }, [isOpen]);

  const loadConversations = async () => {
    setLoadingConversations(true);
    try {
      const response = await fetch('/api/chat/history');
      if (!response.ok) {
        throw new Error('Failed to load conversations');
      }

      const data = await response.json();
      const conversationsList: ConversationSummary[] = data.conversations.map(
        (conv: any) => ({
          id: conv.id,
          title: conv.title,
          lastMessage: conv.lastMessage,
          timestamp: new Date(conv.timestamp),
          messageCount: conv.messageCount,
        })
      );

      setConversations(conversationsList);
    } catch (error) {
      console.error('Error loading conversations:', error);
      setConversations([]);
    } finally {
      setLoadingConversations(false);
    }
  };

  const loadConversation = async (conversationId: string) => {
    setLoadingMessages(true);
    setSelectedConversation(conversationId);
    try {
      const response = await fetch('/api/chat/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conversationId }),
      });

      if (!response.ok) {
        throw new Error('Failed to load conversation');
      }

      const data = await response.json();
      const conversationMessages: ChatMessage[] = data.messages.map(
        (msg: any) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          sources:
            msg.sources && msg.sources.length > 0 ? msg.sources : undefined,
          feedback: null,
        })
      );

      setMessages(conversationMessages);
    } catch (error) {
      console.error('Error loading conversation:', error);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const filteredConversations = conversations.filter(
    conv =>
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-background border border-border rounded-xl shadow-2xl w-full max-w-6xl h-full max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#11684A] text-white px-6 py-4 rounded-t-xl flex items-center justify-between">
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
              {loadingConversations && conversations.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                  </div>
                  <p>Carregando conversas...</p>
                </div>
              ) : filteredConversations.length === 0 ? (
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
                    <div className="mb-1">
                      <h3 className="font-medium text-sm truncate">
                        {conv.title}
                      </h3>
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
                  {loadingMessages ? (
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
                                ? 'bg-[#11684A] text-white'
                                : 'bg-muted text-foreground border border-border'
                            }`}
                          >
                            <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0 prose-strong:font-semibold prose-strong:text-inherit">
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                  h1: ({ node, ...props }) => (
                                    <strong {...props} />
                                  ),
                                  h2: ({ node, ...props }) => (
                                    <strong {...props} />
                                  ),
                                  h3: ({ node, ...props }) => (
                                    <strong {...props} />
                                  ),
                                  h4: ({ node, ...props }) => (
                                    <strong {...props} />
                                  ),
                                  h5: ({ node, ...props }) => (
                                    <strong {...props} />
                                  ),
                                  h6: ({ node, ...props }) => (
                                    <strong {...props} />
                                  ),
                                }}
                              >
                                {msg.content}
                              </ReactMarkdown>
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
