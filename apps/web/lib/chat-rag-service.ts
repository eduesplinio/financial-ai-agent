/**
 * Chat RAG Service - Integrates with MongoDB collections
 *
 * Uses RAGService for hybrid search across knowledge_documents and transactions
 * All data comes from MongoDB - no hardcoded knowledge
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export interface ChatChunk {
  type: 'chunk' | 'complete';
  content: string;
  sources?: Array<{ title: string; url: string }>;
}

export class ChatRAGService {
  /**
   * Process a chat message with RAG capabilities
   * Uses hybrid search to find relevant documents and transactions from MongoDB
   */
  async processMessage(
    userId: string,
    message: string,
    history?: Array<{ role: string; content: string }>,
    sessionId?: string
  ): Promise<AsyncGenerator<ChatChunk>> {
    return this.streamResponse(userId, message, history, sessionId);
  }

  /**
   * Stream response with RAG context from MongoDB
   * @param userId - User ID
   * @param message - Current user message
   * @param history - Conversation history (last N messages)
   */
  async *streamResponse(
    userId: string,
    message: string,
    history: Array<{ role: string; content: string }> = [],
    sessionId?: string
  ): AsyncGenerator<ChatChunk> {
    try {
      console.log(
        `🔍 Processing chat message for user ${userId}: "${message}"`
      );
      console.log(`📚 Conversation history: ${history.length} messages`);
      console.log(`🔑 Session ID: ${sessionId || 'none'}`);
      if (history.length > 0) {
        console.log(
          `   Last message: ${history[history.length - 1]?.content?.substring(0, 50)}...`
        );
      }

      // Import conversation service for persistence
      const { ConversationService, Conversation } = await import(
        '../../../packages/database/src/models'
      );

      // Get or create conversation for persistence
      let conversation = null;
      const effectiveSessionId = sessionId || `session_${Date.now()}_${userId}`;

      try {
        // Try to find existing conversation by sessionId using Mongoose
        if (sessionId) {
          console.log(
            `🔍 Searching for conversation with sessionId: ${sessionId}`
          );
          conversation = await ConversationService.findBySessionId(sessionId);

          if (conversation) {
            console.log(
              `📖 Using existing conversation: ${conversation._id} (${conversation.messages?.length || 0} messages)`
            );
          } else {
            console.log(`   No conversation found with this sessionId`);
          }
        }

        // If not found, create new conversation
        if (!conversation) {
          console.log(
            `📝 Creating new conversation with sessionId: ${effectiveSessionId}`
          );
          conversation = await ConversationService.create({
            userId,
            sessionId: effectiveSessionId,
            messages: [],
            context: {},
          });
          console.log(`✅ Created conversation: ${conversation._id}`);
          console.log(`   SessionId: ${conversation.sessionId}`);
          console.log(`   Messages: ${conversation.messages?.length || 0}`);
        }
      } catch (error) {
        console.error('❌ Error managing conversation:', error);
        // Continue without persistence if there's an error
      }

      // Import RAGService dynamically to avoid build issues
      const { RAGService } = await import(
        '../../../packages/ai/src/rag/rag-service'
      );

      // Create RAG service instance
      const ragService = new RAGService();

      // Detect if question is about concepts (what is, how does, explain) vs personal data (how much, my balance)
      const isConceptQuestion =
        /^(o que é|o que são|como funciona|explique|qual a diferença|quais são os tipos)/i.test(
          message
        );
      const isPersonalDataQuestion =
        /^(quanto|qual meu|meu saldo|meus gastos|minhas|meus|analise|mostre|liste|veja)/i.test(
          message
        ) ||
        /(gastos|despesas|receitas|transaç|saldo|investimentos|último mês|mês passado)/i.test(
          message
        );

      console.log(`📝 Tipo de pergunta detectado:`);
      console.log(`   Conceito: ${isConceptQuestion}`);
      console.log(`   Dados pessoais: ${isPersonalDataQuestion}`);
      console.log(`   Incluir transações: ${!isConceptQuestion}`);

      // Use hybrid search to get both documents and transactions from MongoDB
      // Vector search finds relevant items, then full data is retrieved from collections
      const results = await ragService.hybridFinancialSearch(message, userId, {
        includeDocuments: true,
        includeTransactions: !isConceptQuestion, // Don't fetch transactions for concept questions
        documentLimit: 5,
        transactionLimit: isPersonalDataQuestion ? 10000 : 100, // More transactions for personal data questions
      });

      console.log(
        `✅ Found ${results.documents.length} documents and ${results.transactions.length} transactions`
      );

      if (results.documents.length > 0) {
        console.log(
          '📚 Sample documents:',
          results.documents.slice(0, 2).map((d: any) => ({
            title: d.document?.title || d.title,
            category: d.document?.category || d.category,
            score: d.score?.toFixed(4),
          }))
        );
      }

      // Filter to keep only highly relevant documents (score >= 0.88)
      results.documents = results.documents.filter((d: any) => d.score >= 0.88);

      // Check if we have any data - if not, use general knowledge
      if (results.documents.length === 0 && results.transactions.length === 0) {
        console.log('⚠️ No data found, using general financial knowledge');

        // Build messages with conversation history
        const messages: any[] = [
          {
            role: 'system',
            content: `Você é um assistente financeiro pessoal especializado em educação financeira.

INSTRUÇÕES:
1. Responda perguntas sobre finanças pessoais, investimentos e planejamento financeiro
2. Seja direto e objetivo nas respostas
3. Use seu conhecimento geral sobre finanças
4. Para perguntas não relacionadas a finanças, responda: "Sou especializado em finanças. Posso ajudar com transações, investimentos e planejamento financeiro."
5. Se o usuário perguntar sobre suas transações, informe que não há transações cadastradas ainda

IMPORTANTE - CONTEXTO DA CONVERSA:
6. SEMPRE analise o histórico da conversa antes de responder
7. Se a pergunta for vaga ou incompleta (ex: "como comprar", "pra que serve"), use o contexto das mensagens anteriores para entender sobre o que o usuário está falando
8. Mantenha o tópico da conversa anterior a menos que o usuário mude explicitamente de assunto
9. Perguntas de acompanhamento referem-se ao tópico atual da conversa

Responda de forma clara e concisa em português brasileiro.`,
          },
        ];

        // Add conversation history
        console.log(`📝 Adding ${history.length} messages to context`);
        history.forEach((msg, index) => {
          console.log(
            `   ${index + 1}. ${msg.role}: ${msg.content.substring(0, 30)}...`
          );
          messages.push({
            role: msg.role,
            content: msg.content,
          });
        });

        // Add current message
        messages.push({
          role: 'user',
          content: message,
        });

        console.log(
          `📤 Sending ${messages.length} messages to OpenAI (including system prompt)`
        );

        // Stream response from OpenAI without RAG context
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages,
          stream: true,
          temperature: 0.7,
          max_tokens: 1200,
        });

        let fullResponse = '';

        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            fullResponse += content;
            yield {
              type: 'chunk',
              content: content,
            };
          }
        }

        // Save messages to database
        if (conversation) {
          try {
            await ConversationService.addMessage(conversation.sessionId, {
              id: `msg_${Date.now()}_user`,
              role: 'user',
              content: message,
              timestamp: new Date(),
            });

            await ConversationService.addMessage(conversation.sessionId, {
              id: `msg_${Date.now()}_assistant`,
              role: 'assistant',
              content: fullResponse,
              timestamp: new Date(),
              sources: [
                {
                  id: 'openai_general',
                  title: 'Conhecimento Geral (OpenAI)',
                  url: '#',
                },
              ],
            });
          } catch (error) {
            console.error('❌ Error saving messages:', error);
          }
        }

        yield {
          type: 'complete',
          content: fullResponse,
          sources: [
            {
              title: 'Conhecimento Geral (OpenAI)',
              url: '#',
            },
          ],
        };
        return;
      }

      // Build context with ALL fields from collections
      const context = this.buildContext(
        results.documents,
        results.transactions
      );
      const sources = this.buildSources(
        results.documents,
        results.transactions,
        message
      );

      // Create system prompt
      const systemPrompt = this.createSystemPrompt(context);

      // Build messages with conversation history
      const messages: any[] = [
        {
          role: 'system',
          content: systemPrompt,
        },
      ];

      // Add conversation history
      console.log(`📝 Adding ${history.length} messages to context`);
      history.forEach((msg, index) => {
        console.log(
          `   ${index + 1}. ${msg.role}: ${msg.content.substring(0, 30)}...`
        );
        messages.push({
          role: msg.role,
          content: msg.content,
        });
      });

      // Add current message
      messages.push({
        role: 'user',
        content: message,
      });

      console.log(
        `📤 Sending ${messages.length} messages to OpenAI (including system prompt)`
      );

      // Stream response from OpenAI
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 1200,
      });

      let fullResponse = '';

      for await (const chunk of completion) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullResponse += content;
          yield {
            type: 'chunk',
            content: content,
          };
        }
      }

      // Save messages to database
      if (conversation) {
        try {
          await ConversationService.addMessage(conversation.sessionId, {
            id: `msg_${Date.now()}_user`,
            role: 'user',
            content: message,
            timestamp: new Date(),
          });

          await ConversationService.addMessage(conversation.sessionId, {
            id: `msg_${Date.now()}_assistant`,
            role: 'assistant',
            content: fullResponse,
            timestamp: new Date(),
            sources: sources.map((src, index) => ({
              id: `source_${index}`,
              title: src.title,
              url: src.url,
            })),
          });
        } catch (error) {
          console.error('❌ Error saving messages:', error);
        }
      }

      // Send completion with sources
      yield {
        type: 'complete',
        content: fullResponse,
        sources: sources,
      };
    } catch (error) {
      console.error('❌ Error in RAG chat:', error);
      yield {
        type: 'complete',
        content:
          'Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente em alguns instantes.',
        sources: [],
      };
    }
  }

  /**
   * Build context string with ALL fields from MongoDB collections
   */
  private buildContext(documents: any[], transactions: any[]): string {
    let context = '';

    // Add knowledge documents with complete information from MongoDB
    if (documents.length > 0) {
      context += 'CONHECIMENTO FINANCEIRO DA BASE DE DADOS:\n';
      documents.forEach((doc, i) => {
        const docData = doc.document || doc;
        context += `${i + 1}. ${docData.title}\n`;
        context += `   Categoria: ${docData.category}\n`;
        context += `   Fonte: ${docData.source}\n`;
        context += `   Conteúdo: ${docData.content}\n`;
        if (docData.metadata?.tags && docData.metadata.tags.length > 0) {
          context += `   Tags: ${docData.metadata.tags.join(', ')}\n`;
        }
        context += '\n';
      });
    }

    // Add transactions with complete information from MongoDB
    if (transactions.length > 0) {
      // Group transactions by category for summary
      const categoryTotals: Record<string, { count: number; total: number }> =
        {};
      transactions.forEach(tx => {
        const txData = tx.transaction || tx;
        const category = txData.category?.primary || 'Sem categoria';
        if (!categoryTotals[category]) {
          categoryTotals[category] = { count: 0, total: 0 };
        }
        categoryTotals[category].count++;
        categoryTotals[category].total += txData.amount;
      });

      context += `SUAS TRANSAÇÕES FINANCEIRAS (${transactions.length} encontradas):\n\n`;

      // Add category summary first
      context += `RESUMO POR CATEGORIA:\n`;
      Object.entries(categoryTotals).forEach(([category, data]) => {
        context += `- ${category}: ${data.count} transações, Total: R$ ${data.total.toFixed(2)}\n`;
      });
      context += '\n';

      // Add detailed transactions
      context += `DETALHES DAS TRANSAÇÕES:\n`;
      transactions.forEach((tx, i) => {
        const txData = tx.transaction || tx;
        const date = new Date(txData.date).toLocaleDateString('pt-BR');
        const amount = Math.abs(txData.amount).toFixed(2);
        const type = txData.amount < 0 ? 'Despesa' : 'Receita';

        context += `${i + 1}. ${txData.description}\n`;
        context += `   Valor: R$ ${amount} (${type})\n`;
        context += `   Valor Real (com sinal): R$ ${txData.amount.toFixed(2)}\n`;
        context += `   Data: ${date}\n`;
        context += `   Categoria: ${txData.category?.primary || 'Sem categoria'}\n`;

        if (txData.merchant) {
          context += `   Estabelecimento: ${txData.merchant}\n`;
        }

        if (txData.accountName) {
          context += `   Conta: ${txData.accountName}\n`;
        }

        if (txData.metadata?.source) {
          context += `   Origem: ${txData.metadata.source}\n`;
        }

        context += '\n';
      });
    }

    return context;
  }

  /**
   * Build sources array - intelligently based on question type
   */
  private buildSources(
    documents: any[],
    transactions: any[],
    message: string
  ): Array<{ title: string; url: string }> {
    const sources: Array<{ title: string; url: string }> = [];

    // Detect question type
    const isConceptQuestion =
      /^(o que é|o que são|como funciona|explique|qual a diferença|quais são os tipos)/i.test(
        message
      );
    const isPersonalDataQuestion =
      /^(quanto|qual meu|meu saldo|meus gastos|minhas|meus|analise|mostre|liste|veja)/i.test(
        message
      ) ||
      /(gastos|despesas|receitas|transaç|saldo|investimentos|último mês|mês passado)/i.test(
        message
      );

    console.log(`📚 Construindo fontes:`);
    console.log(`   Documentos disponíveis: ${documents.length}`);
    console.log(`   Transações disponíveis: ${transactions.length}`);
    console.log(`   É pergunta de conceito: ${isConceptQuestion}`);
    console.log(`   É pergunta de dados pessoais: ${isPersonalDataQuestion}`);

    // For concept questions: ONLY add documents
    if (isConceptQuestion) {
      if (documents.length > 0) {
        documents.slice(0, 3).forEach(doc => {
          const docData = doc.document || doc;
          sources.push({
            title: docData.title,
            url: docData.source || '#',
          });
        });
        console.log(
          `   ✅ Adicionou ${sources.length} documentos (pergunta de conceito)`
        );
      }
      // Do NOT add transactions for concept questions
      console.log(`   ⏭️  Pulou transações (pergunta de conceito)`);
    }
    // For personal data questions: ONLY add transactions
    else if (isPersonalDataQuestion) {
      if (transactions.length > 0) {
        sources.push({
          title: 'Transações',
          url: '/transactions',
        });
        console.log(`   ✅ Adicionou transações (pergunta de dados pessoais)`);
      }
      // Do NOT add documents for personal data questions
      console.log(`   ⏭️  Pulou documentos (pergunta de dados pessoais)`);
    }
    // For mixed/other questions: add both if relevant
    else {
      if (documents.length > 0) {
        documents.slice(0, 2).forEach(doc => {
          const docData = doc.document || doc;
          sources.push({
            title: docData.title,
            url: docData.source || '#',
          });
        });
        console.log(
          `   ✅ Adicionou ${documents.length} documentos (pergunta mista)`
        );
      }
      if (transactions.length > 0) {
        sources.push({
          title: 'Transações',
          url: '/transactions',
        });
        console.log(`   ✅ Adicionou transações (pergunta mista)`);
      }
    }

    console.log(`   📋 Total de fontes: ${sources.length}`);
    return sources;
  }

  /**
   * Create system prompt
   */
  private createSystemPrompt(context: string): string {
    return `Você é um assistente financeiro pessoal especializado em educação financeira e análise de transações.

CONTEXTO DISPONÍVEL:
${context}

INSTRUÇÕES IMPORTANTES:

**Sobre uso de fontes:**
1. Use APENAS as informações fornecidas no contexto acima
2. Para perguntas sobre CONCEITOS financeiros (O que é MEI? Como funciona Tesouro Direto?), use APENAS os documentos de conhecimento
3. Para perguntas sobre SEUS DADOS (quanto gastei, quanto tenho), use APENAS as transações
4. NÃO misture fontes: se a pergunta é sobre conceito, não use transações; se é sobre dados pessoais, não use documentos gerais

**IMPORTANTE - CONTEXTO DA CONVERSA:**
5. SEMPRE analise o histórico da conversa antes de responder
6. Se a pergunta for vaga ou incompleta (ex: "como comprar", "pra que serve", "quanto custa"), use o contexto das mensagens anteriores para entender sobre o que o usuário está falando
7. Mantenha o tópico da conversa anterior a menos que o usuário mude explicitamente de assunto
8. Perguntas de acompanhamento referem-se ao tópico atual da conversa
9. Exemplo: se o usuário perguntou "o que é bitcoin" e depois pergunta "como comprar", ele está perguntando como comprar BITCOIN

**Sobre cálculos:**
5. Para perguntas sobre gastos, investimentos ou receitas, SEMPRE calcule o total somando TODAS as transações da categoria correspondente
6. Considere o sinal do valor (positivo = receita/investimento, negativo = despesa)
7. Use o resumo por categoria fornecido no contexto para cálculos rápidos

**Sobre respostas:**
8. Se não houver informações no contexto, diga: "Não encontrei informações sobre isso na base de dados."
9. Seja direto e objetivo
10. Para perguntas não relacionadas a finanças, responda: "Sou especializado em finanças. Posso ajudar com transações, investimentos e planejamento financeiro."

**EXEMPLOS DE USO CORRETO:**

Pergunta sobre CONCEITO (use documentos):
- "O que é MEI?" → Use APENAS documento sobre MEI
- "Como funciona Tesouro Direto?" → Use APENAS documento sobre Tesouro Direto
- "O que é Bitcoin?" → Use APENAS documento sobre Bitcoin

Pergunta sobre DADOS PESSOAIS (use transações):
- "Quanto gastei com casa?" → Use APENAS transações da categoria Casa
- "Quanto tenho em investimentos?" → Use APENAS transações da categoria Investimento
- "Qual meu saldo?" → Use APENAS transações

Pergunta MISTA (use ambos):
- "Como posso investir melhor meu dinheiro?" → Use documentos sobre investimentos E mencione transações se relevante

**FORMATO DE RESPOSTA:**
- Valores: sempre em reais (R$) com duas casas decimais
- NÃO mencione as fontes na resposta (elas serão exibidas automaticamente na seção "Fontes")
- NÃO diga "Para mais detalhes, consulte..." ou "Você pode ver mais em..."
- NÃO inclua links ou referências a documentos na resposta
- Responda diretamente o conteúdo, sem mencionar de onde veio a informação
- Não invente informações

Responda de forma clara e concisa.`;
  }
}

export default ChatRAGService;
