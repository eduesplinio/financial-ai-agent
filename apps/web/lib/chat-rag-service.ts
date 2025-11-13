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

      // Detect question type
      const isGreeting =
        /^(oi|olá|ola|hey|opa|e aí|eai|bom dia|boa tarde|boa noite|tudo bem|como vai)/i.test(
          message.trim()
        );
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
      console.log(`   Saudação: ${isGreeting}`);
      console.log(`   Conceito: ${isConceptQuestion}`);
      console.log(`   Dados pessoais: ${isPersonalDataQuestion}`);
      console.log(
        `   Incluir transações: ${!isConceptQuestion && !isGreeting}`
      );

      // Use hybrid search to get both documents and transactions from MongoDB
      // Vector search finds relevant items, then full data is retrieved from collections
      const results = await ragService.hybridFinancialSearch(message, userId, {
        includeDocuments: !isGreeting,
        includeTransactions: !isConceptQuestion && !isGreeting, // Don't fetch for concept questions or greetings
        documentLimit: 5,
        transactionLimit: isPersonalDataQuestion ? 10000 : 100,
      });

      // Filter transactions based on question type
      const isDespesaQuestion = /(despesa|gasto|gastei|gastou|total)/i.test(
        message
      );
      const isReceitaQuestion = /(receita|ganho|ganhei|salário)/i.test(message);

      if (isDespesaQuestion && !isReceitaQuestion) {
        // Keep only expenses (negative values)
        const beforeFilter = results.transactions.length;
        console.log(`🔍 Before filter - transactions:`);
        results.transactions.forEach((tx: any, idx: number) => {
          const txData = tx.transaction || tx;
          console.log(
            `  ${idx + 1}. ${txData.description}: R$ ${txData.amount.toFixed(2)} (${txData.amount < 0 ? 'DESPESA' : 'RECEITA'})`
          );
        });

        results.transactions = results.transactions.filter((tx: any) => {
          const txData = tx.transaction || tx;
          return txData.amount < 0;
        });
        console.log(
          `🔍 Filtered to expenses only: ${results.transactions.length} of ${beforeFilter} transactions`
        );

        // Calculate total for verification
        const total = results.transactions.reduce((sum: number, tx: any) => {
          const txData = tx.transaction || tx;
          return sum + Math.abs(txData.amount);
        }, 0);
        console.log(
          `💰 Total despesas calculado após filtro: R$ ${total.toFixed(2)}`
        );
      } else if (isReceitaQuestion && !isDespesaQuestion) {
        // Keep only income (positive values)
        results.transactions = results.transactions.filter((tx: any) => {
          const txData = tx.transaction || tx;
          return txData.amount > 0;
        });
        console.log(
          `🔍 Filtered to income only: ${results.transactions.length} transactions`
        );
      }

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

      // Filter to keep only relevant documents (score >= 0.45 for concept questions, 0.70 for others)
      const scoreThreshold = isConceptQuestion ? 0.45 : 0.7;
      results.documents = results.documents.filter(
        (d: any) => d.score >= scoreThreshold
      );
      console.log(
        `🎯 Applied score threshold: ${scoreThreshold}, kept ${results.documents.length} documents`
      );

      // Check if we have any data - if not, use general knowledge
      if (results.documents.length === 0 && results.transactions.length === 0) {
        console.log('⚠️ No data found, using general financial knowledge');

        // Build messages with conversation history
        const messages: any[] = [
          {
            role: 'system',
            content: `Você é Linio, um assistente financeiro amigável e prestativo, dedicado a ajudar pessoas com suas finanças pessoais.

INSTRUÇÕES:
1. Seja sempre cordial, empático e encorajador
2. Use emojis apenas quando realmente necessário (conquistas, celebrações, alertas importantes)
3. Responda perguntas sobre finanças pessoais, investimentos e planejamento financeiro de forma clara e didática
4. Use seu conhecimento geral sobre finanças
5. Para perguntas não relacionadas a finanças, responda gentilmente: "Adoraria ajudar, mas sou especializado em finanças! Posso te auxiliar com transações, investimentos e planejamento financeiro."
6. Se o usuário perguntar sobre suas transações, informe de forma amigável que não há transações cadastradas ainda

CONTEXTO DA CONVERSA:
7. SEMPRE analise o histórico da conversa antes de responder
8. Se a pergunta for vaga ou incompleta, use o contexto das mensagens anteriores
9. Mantenha o tópico da conversa anterior a menos que o usuário mude explicitamente de assunto

Responda de forma clara, amigável e útil em português brasileiro!`,
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
              sources: [],
            });
          } catch (error) {
            console.error('❌ Error saving messages:', error);
          }
        }

        yield {
          type: 'complete',
          content: fullResponse,
          sources: [],
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
      console.log(
        `📊 buildContext - Processing ${transactions.length} transactions`
      );

      // Group transactions by category for summary
      const categoryTotals: Record<string, { count: number; total: number }> =
        {};
      transactions.forEach((tx, idx) => {
        const txData = tx.transaction || tx;
        const category = txData.category?.primary || 'Sem categoria';
        console.log(
          `  ${idx + 1}. ${txData.description}: R$ ${txData.amount.toFixed(2)} -> abs: R$ ${Math.abs(txData.amount).toFixed(2)} (cat: ${category})`
        );

        if (!categoryTotals[category]) {
          categoryTotals[category] = { count: 0, total: 0 };
        }
        categoryTotals[category].count++;
        // Use absolute value to always show positive amounts
        categoryTotals[category].total += Math.abs(txData.amount);
      });

      const grandTotal = Object.values(categoryTotals).reduce(
        (sum, cat) => sum + cat.total,
        0
      );

      console.log(`📊 Category totals:`);
      Object.entries(categoryTotals).forEach(([cat, data]) => {
        console.log(`  ${cat}: ${data.count} txs, R$ ${data.total.toFixed(2)}`);
      });
      console.log(
        `💰 Grand total from buildContext: R$ ${grandTotal.toFixed(2)}`
      );

      context += `SUAS TRANSAÇÕES FINANCEIRAS (${transactions.length} encontradas):\n\n`;
      context += `TOTAL GERAL: R$ ${grandTotal.toFixed(2)}\n\n`;

      // Add category summary
      context += `RESUMO POR CATEGORIA:\n`;
      Object.entries(categoryTotals).forEach(([category, data]) => {
        context += `- ${category}: ${data.count} transações, R$ ${data.total.toFixed(2)}\n`;
      });
      context += '\n';

      // Add detailed transactions (simplified)
      context += `DETALHES DAS TRANSAÇÕES:\n`;
      transactions.forEach((tx, i) => {
        const txData = tx.transaction || tx;
        const date = new Date(txData.date).toLocaleDateString('pt-BR');
        const amount = Math.abs(txData.amount).toFixed(2);

        context += `${i + 1}. ${txData.description} - R$ ${amount} - ${txData.category?.primary || 'Sem categoria'} - ${date}\n`;
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
        // Ordenar por score (maior primeiro) e pegar top 3
        const sortedDocs = [...documents].sort((a, b) => b.score - a.score);
        sortedDocs.slice(0, 3).forEach(doc => {
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
        const sortedDocs = [...documents].sort((a, b) => b.score - a.score);
        sortedDocs.slice(0, 2).forEach(doc => {
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
    return `Você é Linio, um assistente financeiro pessoal amigável e prestativo, especializado em educação financeira e análise de transações.

CONTEXTO DISPONÍVEL:
${context}

INSTRUÇÕES IMPORTANTES:

**Sobre sua personalidade:**
1. Seja sempre cordial, empático e encorajador
2. Use emojis apenas quando realmente necessário (conquistas, celebrações, alertas importantes)
3. Comemore conquistas financeiras do usuário
4. Ofereça dicas práticas e motivacionais quando apropriado
5. Trate o usuário com respeito e atenção

**Sobre uso de fontes:**
6. Use APENAS as informações fornecidas no contexto acima
7. Para perguntas sobre CONCEITOS financeiros, use APENAS os documentos de conhecimento
8. Para perguntas sobre SEUS DADOS (quanto gastei, quanto tenho), use APENAS as transações
9. NÃO misture fontes inadequadamente

**CONTEXTO DA CONVERSA:**
10. SEMPRE analise o histórico da conversa antes de responder
11. Se a pergunta for vaga, use o contexto das mensagens anteriores
12. Mantenha o tópico da conversa anterior a menos que o usuário mude explicitamente de assunto

**Sobre cálculos:**
13. O TOTAL GERAL já está calculado no contexto - USE ESSE VALOR
14. NÃO some manualmente os valores das transações
15. Para categorias específicas, use os valores do "RESUMO POR CATEGORIA"

**Sobre respostas:**
16. Se não houver informações, diga gentilmente: "Não encontrei informações sobre isso ainda."
17. Seja claro mas amigável
18. Para perguntas não relacionadas a finanças, responda: "Adoraria ajudar, mas sou especializado em finanças! Posso te auxiliar com transações, investimentos e planejamento financeiro."

**FORMATO DE RESPOSTA:**
- Valores: sempre em reais (R$) com duas casas decimais
- NÃO mencione as fontes na resposta (elas aparecem automaticamente)
- Seja conversacional e acolhedor
- Use linguagem simples e acessível

Responda de forma clara, amigável e útil!`;
  }
}

export default ChatRAGService;
