'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  X,
  ThumbsUp,
  ThumbsDown,
  History,
  Maximize2,
  Minimize2,
  Bot,
  DollarSign,
  TrendingUp,
  Target,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { ChatHistory } from './ChatHistory';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{ title: string; url: string }>;
  streaming?: boolean;
  feedback?: 'positive' | 'negative' | null;
}

export const ChatWidget: React.FC = () => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [showWidget, setShowWidget] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize sessionId when widget opens
  useEffect(() => {
    if (showWidget && !sessionId && session?.user?.id) {
      const newSessionId = `session_${Date.now()}_${session.user.id}`;
      setSessionId(newSessionId);
      console.log('📝 Created new session:', newSessionId);
    }
  }, [showWidget, sessionId, session?.user?.id]);

  // Auto-scroll durante streaming
  useEffect(() => {
    if (streaming && messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, streaming]);

  // Scroll to bottom when messages change
  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
    return () => clearTimeout(timer);
  }, [messages.length, loading]);

  // Scroll to bottom after streaming completes (para mostrar fontes e feedback)
  useEffect(() => {
    if (!streaming && !loading && messages.length > 0) {
      const timer = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [streaming, loading, messages.length]);

  // Reset to windowed mode when widget opens
  useEffect(() => {
    if (showWidget) {
      setIsFullscreen(false);
      // Scroll to bottom instantly when widget opens (no animation)
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight;
      }
      // Focus input when widget opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [showWidget]);

  // Scroll to bottom when toggling fullscreen
  useEffect(() => {
    if (messages.length > 0 && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [isFullscreen]);

  // Brazilian nicknames mapping
  const getNickname = (fullName: string): string => {
    const firstNames = fullName.trim().split(' ')[0].toLowerCase();

    // Common Brazilian nicknames
    const nicknameMap: Record<string, string> = {
      // Masculinos
      eduardo: 'Edu',
      alexandre: 'Alex',
      fernando: 'Nando',
      francisco: 'Chico',
      antonio: 'Toni',
      jose: 'Zé',
      joao: 'João',
      carlos: 'Carlinhos',
      roberto: 'Beto',
      luiz: 'Lu',
      luis: 'Lu',
      gabriel: 'Gabi',
      rafael: 'Rafa',
      leonardo: 'Leo',
      ricardo: 'Rica',
      marcelo: 'Marcelinho',
      anderson: 'Ander',
      wellington: 'Well',
      alessandro: 'Ale',
      fabricio: 'Fabi',
      daniel: 'Dani',
      marcos: 'Marquinhos',
      paulo: 'Paulinho',
      pedro: 'Pedrinho',
      guilherme: 'Gui',
      rodrigo: 'Rô',
      thiago: 'Thi',
      diego: 'Di',
      vinicius: 'Vini',
      matheus: 'Matheusinho',
      felipe: 'Fê',
      bruno: 'Bruninho',
      andre: 'Dé',
      gustavo: 'Gus',
      renato: 'Renatinho',
      sergio: 'Sérgio',
      mauricio: 'Mauro',
      henrique: 'Rique',
      lucas: 'Lu',
      victor: 'Vitinho',
      caio: 'Cainho',
      leandro: 'Léo',
      adriano: 'Dri',
      jefferson: 'Jeff',

      // Femininos
      maria: 'Mari',
      ana: 'Aninha',
      fernanda: 'Fê',
      patricia: 'Pati',
      juliana: 'Ju',
      cristina: 'Cris',
      monica: 'Mô',
      sandra: 'San',
      claudia: 'Clau',
      adriana: 'Dri',
      marcia: 'Má',
      andrea: 'Dé',
      luciana: 'Lu',
      simone: 'Si',
      daniela: 'Dani',
      carolina: 'Carol',
      gabriela: 'Gabi',
      paula: 'Paulinha',
      camila: 'Cami',
      renata: 'Re',
      priscila: 'Pri',
      beatriz: 'Bia',
      larissa: 'Lari',
      amanda: 'Manda',
      jessica: 'Jess',
      bruna: 'Bruninha',
      carla: 'Carlinha',
      vanessa: 'Van',
      isabela: 'Isa',
      leticia: 'Lê',
      natalia: 'Nat',
      raquel: 'Raque',
      sabrina: 'Sá',
      thaís: 'Tha',
      viviane: 'Vivi',
      aline: 'Ali',
      tatiana: 'Tati',
      denise: 'Dê',
      eliane: 'Eli',
      karina: 'Ka',
      michelle: 'Mi',
      roberta: 'Rô',
      silvia: 'Sil',
      tereza: 'Tetê',
      valeria: 'Val',
    };

    // Remove accents for matching
    const removeAccents = (str: string) => {
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    const cleanName = removeAccents(firstNames);
    const nickname = nicknameMap[cleanName];

    if (nickname) {
      return nickname;
    }

    // Fallback strategies for names not in the map
    const originalName = fullName.trim().split(' ')[0];

    // If name is longer than 6 characters, try to shorten it
    if (originalName.length > 6) {
      // Try common patterns
      if (originalName.endsWith('inho') || originalName.endsWith('inha')) {
        return originalName; // Already a nickname
      }

      // Create a shortened version (first 3-4 chars + common endings)
      const base = originalName.substring(0, Math.min(4, originalName.length));
      return base.charAt(0).toUpperCase() + base.slice(1);
    }

    // For shorter names, return as is with proper capitalization
    return (
      originalName.charAt(0).toUpperCase() + originalName.slice(1).toLowerCase()
    );
  };

  // Get user's nickname or first name
  const getFirstName = () => {
    if (!session?.user?.name) return '';
    return getNickname(session.user.name);
  };
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || streaming) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Build conversation history (last 10 messages for context)
      const history = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      // Use Server-Sent Events for streaming with conversation history
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: history,
          sessionId: sessionId, // Send sessionId for persistence
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      let assistantMsgId = (Date.now() + 1).toString();
      let currentContent = '';
      let hasStartedStreaming = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === 'chunk' || data.type === 'stream') {
                if (!hasStartedStreaming) {
                  setStreaming(true);
                  hasStartedStreaming = true;
                }

                if (data.type === 'chunk') {
                  currentContent += data.content;
                } else {
                  currentContent = data.content; // For 'stream' type, replace content
                }

                setMessages(prev => {
                  const lastMsg = prev[prev.length - 1];
                  if (
                    lastMsg &&
                    lastMsg.role === 'assistant' &&
                    lastMsg.id === assistantMsgId
                  ) {
                    return [
                      ...prev.slice(0, -1),
                      { ...lastMsg, content: currentContent, streaming: true },
                    ];
                  } else {
                    return [
                      ...prev,
                      {
                        id: assistantMsgId,
                        role: 'assistant',
                        content: currentContent,
                        streaming: true,
                      },
                    ];
                  }
                });
              } else if (data.type === 'complete') {
                setMessages(prev =>
                  prev.map(msg =>
                    msg.id === assistantMsgId
                      ? {
                          ...msg,
                          content: data.content,
                          sources: data.sources,
                          streaming: false,
                          feedback: null,
                        }
                      : msg
                  )
                );
              }
            } catch (err) {
              console.error('Error parsing SSE data:', err);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content:
          'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      setStreaming(false);

      // Focus input after response is complete
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleFeedback = (
    messageId: string,
    feedback: 'positive' | 'negative'
  ) => {
    setMessages(prev =>
      prev.map(msg => (msg.id === messageId ? { ...msg, feedback } : msg))
    );

    // TODO: Send feedback to API
    console.log('Feedback submitted:', { messageId, feedback });
  };

  const handleSendMessage = async (message: string) => {
    if (loading || streaming || !message.trim()) return;

    setInput(message);

    // Wait for state to update, then send the message
    setTimeout(async () => {
      const syntheticEvent = {
        preventDefault: () => {},
      } as React.FormEvent;

      await sendMessage(syntheticEvent);
    }, 0);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-[#11684A] hover:bg-[#0d5039] text-white rounded-full shadow-lg p-3.5 flex items-center transition-all duration-200 hover:scale-105"
        onClick={() => setShowWidget(v => !v)}
        aria-label="Abrir Agente IA"
      >
        <Bot className="h-6 w-6" />
      </button>

      {/* Chat Widget */}
      {showWidget && (
        <div
          className={`fixed z-50 bg-background/95 backdrop-blur-sm border-2 border-border shadow-xl flex flex-col transition-all duration-200 ${
            isFullscreen
              ? 'inset-4 md:inset-8 rounded-lg'
              : 'bottom-20 right-6 w-[420px] max-w-[calc(100vw-2rem)] rounded-xl'
          }`}
          style={
            !isFullscreen
              ? { height: 'auto', maxHeight: 'calc(100vh - 8rem)' }
              : {}
          }
        >
          {/* Header */}
          <div className="bg-[#11684A] text-white px-4 py-3 flex items-center justify-between rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Agente Financeiro</h3>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                className="text-white/80 hover:text-white transition-colors p-1.5 rounded hover:bg-white/10"
                onClick={() => setShowHistory(true)}
                aria-label="Ver Histórico"
                title="Histórico de conversas"
              >
                <History className="h-4 w-4" />
              </button>
              <button
                className="text-white/80 hover:text-white transition-colors p-1.5 rounded hover:bg-white/10"
                onClick={() => setIsFullscreen(!isFullscreen)}
                aria-label={isFullscreen ? 'Modo janela' : 'Tela cheia'}
                title={
                  isFullscreen ? 'Modo janela' : 'Expandir para tela cheia'
                }
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </button>
              <button
                className="text-white/80 hover:text-white transition-colors p-1.5 rounded hover:bg-white/10"
                onClick={() => setShowWidget(false)}
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={messagesContainerRef}
            className={`overflow-y-auto px-4 py-3 space-y-3 ${
              isFullscreen ? 'flex-1' : 'h-96'
            }`}
          >
            {messages.length === 0 ? (
              <div
                className={`text-center text-muted-foreground ${
                  isFullscreen ? 'py-16' : 'py-12'
                }`}
              >
                <h3
                  className={`font-semibold mb-4 ${
                    isFullscreen ? 'text-2xl' : 'text-xl'
                  }`}
                >
                  {getFirstName() ? `Olá, ${getFirstName()}!` : 'Olá!'}
                </h3>
                <p
                  className={`text-muted-foreground/80 mb-6 mx-auto ${
                    isFullscreen ? 'text-base max-w-md' : 'text-sm max-w-xs'
                  }`}
                >
                  Sou seu agente financeiro pessoal. Te ajudo a economizar mais,
                  investir melhor e alcançar suas metas financeiras.
                </p>
                <div
                  className={`flex justify-center gap-3 mx-auto ${
                    isFullscreen
                      ? 'max-w-md flex-wrap mt-6'
                      : 'max-w-xs gap-2 mt-5'
                  }`}
                >
                  <button
                    onClick={() =>
                      handleSendMessage('Analise meus gastos do último mês')
                    }
                    className={`group bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-700 dark:text-red-300 px-3 py-2 rounded-lg transition-colors duration-200 border border-red-200 dark:border-red-700/30 shadow-sm hover:shadow-md flex items-center gap-1.5 ${
                      isFullscreen ? 'text-sm' : 'text-xs'
                    }`}
                  >
                    <DollarSign
                      className={`${isFullscreen ? 'w-3.5 h-3.5' : 'w-3 h-3'} group-hover:scale-110 transition-transform`}
                    />
                    Ver gastos
                  </button>
                  <button
                    onClick={() =>
                      handleSendMessage(
                        'Como posso investir melhor meu dinheiro?'
                      )
                    }
                    className={`group bg-purple-50 dark:bg-purple-900/10 hover:bg-purple-100 dark:hover:bg-purple-900/20 text-purple-700 dark:text-purple-300 px-3 py-2 rounded-lg transition-colors duration-200 border border-purple-200 dark:border-purple-700/30 shadow-sm hover:shadow-md flex items-center gap-1.5 ${
                      isFullscreen ? 'text-sm' : 'text-xs'
                    }`}
                  >
                    <TrendingUp
                      className={`${isFullscreen ? 'w-3.5 h-3.5' : 'w-3 h-3'} group-hover:scale-110 transition-transform`}
                    />
                    Investir
                  </button>
                  <button
                    onClick={() =>
                      handleSendMessage('Quais são minhas metas financeiras?')
                    }
                    className={`group bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-lg transition-colors duration-200 border border-blue-200 dark:border-blue-700/30 shadow-sm hover:shadow-md flex items-center gap-1.5 ${
                      isFullscreen ? 'text-sm' : 'text-xs'
                    }`}
                  >
                    <Target
                      className={`${isFullscreen ? 'w-3.5 h-3.5' : 'w-3 h-3'} group-hover:scale-110 transition-transform`}
                    />
                    Metas
                  </button>
                </div>
              </div>
            ) : (
              <>
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    } mb-4`}
                  >
                    {/* Message Bubble */}
                    <div
                      className={`max-w-[80%] ${
                        message.role === 'user' ? 'text-right' : ''
                      }`}
                    >
                      <div
                        className={`inline-block px-3 py-2 rounded-lg text-sm ${
                          message.role === 'user'
                            ? 'bg-[#11684A] text-white'
                            : 'bg-muted text-foreground border border-border'
                        }`}
                      >
                        <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0 prose-strong:font-semibold prose-strong:text-inherit">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              h1: ({ node, ...props }) => <strong {...props} />,
                              h2: ({ node, ...props }) => <strong {...props} />,
                              h3: ({ node, ...props }) => <strong {...props} />,
                              h4: ({ node, ...props }) => <strong {...props} />,
                              h5: ({ node, ...props }) => <strong {...props} />,
                              h6: ({ node, ...props }) => <strong {...props} />,
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>

                        {/* Citations */}
                        {message.sources && message.sources.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-border/20">
                            <div className="text-xs text-muted-foreground mb-1">
                              Fontes:
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {message.sources.map((source, index) => (
                                <a
                                  key={index}
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs bg-background/50 px-2 py-1 rounded hover:bg-background/80 transition-colors"
                                >
                                  {source.title}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Feedback - only after message is fully processed */}
                      {message.role === 'assistant' && !message.streaming && (
                        <div className="mt-2 pt-2 border-t border-border/20 flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            Esta resposta foi útil?
                          </span>
                          <button
                            onClick={() =>
                              handleFeedback(message.id, 'positive')
                            }
                            className={`p-1 rounded transition-colors ${
                              message.feedback === 'positive'
                                ? 'text-green-600 bg-green-100'
                                : 'text-muted-foreground hover:text-green-600'
                            }`}
                            aria-label="Resposta útil"
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() =>
                              handleFeedback(message.id, 'negative')
                            }
                            className={`p-1 rounded transition-colors ${
                              message.feedback === 'negative'
                                ? 'text-red-600 bg-red-100'
                                : 'text-muted-foreground hover:text-red-600'
                            }`}
                            aria-label="Resposta não útil"
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Loading Indicator - só aparece antes do streaming começar */}
                {loading &&
                  !streaming &&
                  messages.length > 0 &&
                  messages[messages.length - 1].role === 'user' && (
                    <div className="flex justify-start mb-4">
                      <div className="inline-block px-3 py-2 rounded-lg text-sm bg-muted text-foreground border border-border">
                        <div className="flex items-center gap-2">
                          <Bot className="h-4 w-4 animate-pulse text-[#11684A]" />
                          <span className="text-sm text-muted-foreground">
                            Pensando
                          </span>
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-[#11684A] rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-[#11684A] rounded-full animate-bounce"
                              style={{ animationDelay: '0.15s' }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-[#11684A] rounded-full animate-bounce"
                              style={{ animationDelay: '0.3s' }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            className="border-t-2 border-border px-4 py-3 bg-background rounded-b-xl"
            onSubmit={sendMessage}
          >
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                className="flex-1 px-3 py-2 rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-sm placeholder:text-muted-foreground/60"
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Como posso ajudar você hoje?"
                disabled={loading || streaming}
                autoComplete="off"
              />
              <button
                type="submit"
                className="bg-[#11684A] hover:bg-[#0d5039] text-white rounded-md px-3 py-2 flex items-center gap-1 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                disabled={loading || streaming || !input.trim()}
              >
                <Send className="h-3.5 w-3.5" />
                <span className="hidden sm:inline text-sm">Enviar</span>
              </button>
            </div>
          </form>
        </div>
      )}

      <ChatHistory isOpen={showHistory} onClose={() => setShowHistory(false)} />
    </>
  );
};

export default ChatWidget;
