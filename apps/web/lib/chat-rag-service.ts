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
    message: string
  ): Promise<AsyncGenerator<ChatChunk>> {
    return this.streamResponse(userId, message);
  }

  /**
   * Stream response with RAG context from MongoDB
   */
  async *streamResponse(
    userId: string,
    message: string
  ): AsyncGenerator<ChatChunk> {
    try {
      console.log(
        `🔍 Processing chat message for user ${userId}: "${message}"`
      );

      // Import RAGService dynamically to avoid build issues
      const { RAGService } = await import(
        '../../../packages/ai/src/rag/rag-service'
      );

      // Create RAG service instance
      const ragService = new RAGService();

      // Use hybrid search to get both documents and transactions from MongoDB
      // Vector search finds relevant items, then full data is retrieved from collections
      const results = await ragService.hybridFinancialSearch(message, userId, {
        includeDocuments: true,
        includeTransactions: true,
        documentLimit: 5,
        transactionLimit: 20,
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
          }))
        );
      }

      // Check if we have any data - if not, use general knowledge
      if (results.documents.length === 0 && results.transactions.length === 0) {
        console.log('⚠️ No data found, using general financial knowledge');

        // Stream response from OpenAI without RAG context
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Você é um assistente financeiro pessoal especializado em educação financeira.

INSTRUÇÕES:
1. Responda perguntas sobre finanças pessoais, investimentos e planejamento financeiro
2. Seja direto e objetivo nas respostas
3. Use seu conhecimento geral sobre finanças
4. Para perguntas não relacionadas a finanças, responda: "Sou especializado em finanças. Posso ajudar com transações, investimentos e planejamento financeiro."
5. Se o usuário perguntar sobre suas transações, informe que não há transações cadastradas ainda

Responda de forma clara e concisa em português brasileiro.`,
            },
            {
              role: 'user',
              content: message,
            },
          ],
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
        results.transactions
      );

      // Create system prompt
      const systemPrompt = this.createSystemPrompt(context);

      // Stream response from OpenAI
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: message,
          },
        ],
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
      context += `SUAS TRANSAÇÕES FINANCEIRAS (${transactions.length} encontradas):\n`;
      transactions.forEach((tx, i) => {
        const txData = tx.transaction || tx;
        const date = new Date(txData.date).toLocaleDateString('pt-BR');
        const amount = Math.abs(txData.amount).toFixed(2);
        const type = txData.amount < 0 ? 'Despesa' : 'Receita';

        context += `${i + 1}. ${txData.description}\n`;
        context += `   Valor: R$ ${amount} (${type})\n`;
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
   * Build sources array - simplified
   */
  private buildSources(
    documents: any[],
    transactions: any[]
  ): Array<{ title: string; url: string }> {
    const sources: Array<{ title: string; url: string }> = [];

    // Add only top 3 document sources
    documents.slice(0, 3).forEach(doc => {
      const docData = doc.document || doc;
      sources.push({
        title: docData.title,
        url: docData.source || '#',
      });
    });

    // Add transaction summary only if used
    if (transactions.length > 0) {
      sources.push({
        title: `${transactions.length} transações analisadas`,
        url: '/transactions',
      });
    }

    return sources;
  }

  /**
   * Create system prompt
   */
  private createSystemPrompt(context: string): string {
    return `Você é um assistente financeiro pessoal especializado em educação financeira e análise de transações.

CONTEXTO DISPONÍVEL:
${context}

INSTRUÇÕES:
1. Responda perguntas sobre finanças pessoais, investimentos, planejamento financeiro e análise de transações
2. Use APENAS as informações fornecidas no contexto acima
3. Para perguntas sobre conceitos financeiros (Bitcoin, Tesouro Direto, etc), use o conhecimento da base de dados
4. Para perguntas sobre gastos, use as transações fornecidas
5. Se não houver informações no contexto, diga: "Não encontrei informações sobre isso na base de dados."
6. Seja direto e objetivo nas respostas
7. Para perguntas não relacionadas a finanças (nome, política, etc), responda: "Sou especializado em finanças. Posso ajudar com transações, investimentos e planejamento financeiro."

EXEMPLOS:
- "O que é Bitcoin?" → Use o documento sobre Bitcoin da base
- "Quanto gastei com casa?" → Analise as transações da categoria Casa
- "Como criar reserva de emergência?" → Use o documento sobre Reserva de Emergência

Responda de forma clara e concisa.`;
  }
}

export default ChatRAGService;
