import { RAGService } from '../rag/rag-service';
import { IntentClassifier, FinancialIntent } from './intent-classifier';
import OpenAI from 'openai';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  sources?: Array<{ title: string; url: string }>;
  metadata?: {
    transactionCount?: number;
    documentCount?: number;
    searchQuery?: string;
  };
}

export interface ChatResponse {
  message: ChatMessage;
  sources: Array<{ title: string; url: string }>;
  metadata: {
    transactionCount: number;
    documentCount: number;
    processingTime: number;
  };
}

export class ChatService {
  private ragService: RAGService;
  private intentClassifier: IntentClassifier;
  private openai: OpenAI;

  constructor() {
    this.ragService = new RAGService();
    this.intentClassifier = new IntentClassifier();
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });
  }

  /**
   * Process a user message and generate a response using RAG
   */
  async processMessage(
    userId: string,
    message: string,
    conversationHistory: ChatMessage[] = []
  ): Promise<ChatResponse> {
    const startTime = Date.now();

    try {
      // Perform hybrid search for relevant context
      const searchResults = await this.ragService.hybridFinancialSearch(
        message,
        userId,
        {
          documentLimit: 3,
          transactionLimit: 8,
        }
      );

      // Build context from search results
      const context = this.buildContext(searchResults);
      const sources = this.extractSources(searchResults);

      // Create conversation context
      const conversationContext =
        this.buildConversationContext(conversationHistory);

      // Classify intent for better response
      const intentClassification = this.intentClassifier.classify(message);

      // Generate response using OpenAI
      const response = await this.generateResponse(
        message,
        context,
        conversationContext,
        intentClassification.intent
      );

      const processingTime = Date.now() - startTime;

      const chatMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        sources,
        metadata: {
          transactionCount: searchResults.transactions.length,
          documentCount: searchResults.documents.length,
          searchQuery: message,
        },
      };

      return {
        message: chatMessage,
        sources,
        metadata: {
          transactionCount: searchResults.transactions.length,
          documentCount: searchResults.documents.length,
          processingTime,
        },
      };
    } catch (error) {
      console.error('Error processing chat message:', error);
      throw new Error('Falha ao processar mensagem');
    }
  }

  /**
   * Stream a response using OpenAI streaming
   */
  async *streamResponse(
    userId: string,
    message: string,
    conversationHistory: ChatMessage[] = []
  ): AsyncGenerator<{
    type: 'chunk' | 'complete';
    content: string;
    sources?: Array<{ title: string; url: string }>;
  }> {
    try {
      // Classify user intent
      const intentClassification = this.intentClassifier.classify(message);

      // Get search filters based on intent
      const searchFilters =
        this.intentClassifier.getSearchFilters(intentClassification);

      // Adjust search parameters based on intent
      let documentLimit = 3;
      let transactionLimit = 8;

      if (intentClassification.intent === FinancialIntent.TRANSACTION_SEARCH) {
        transactionLimit = 15; // More transactions for transaction searches
        documentLimit = 1; // Fewer documents
      } else if (
        intentClassification.intent === FinancialIntent.FINANCIAL_EDUCATION
      ) {
        documentLimit = 5; // More documents for education
        transactionLimit = 3; // Fewer transactions
      }

      // Perform hybrid search for relevant context
      const searchResults = await this.ragService.hybridFinancialSearch(
        message,
        userId,
        {
          documentLimit,
          transactionLimit,
          filters: searchFilters,
        }
      );

      // Build context from search results
      const context = this.buildContext(searchResults);
      const sources = this.extractSources(searchResults);

      // Create conversation context
      const conversationContext =
        this.buildConversationContext(conversationHistory);

      // Create system prompt with intent
      const systemPrompt = this.createSystemPrompt(
        context,
        conversationContext,
        intentClassification.intent
      );

      // Stream response from OpenAI
      const completion = await this.openai.chat.completions.create({
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
      console.error('Error streaming chat response:', error);
      yield {
        type: 'complete',
        content:
          'Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente em alguns instantes.',
        sources: [],
      };
    }
  }

  /**
   * Build context string from search results
   */
  private buildContext(searchResults: any): string {
    let context = '';

    // Add document context
    if (searchResults.documents.length > 0) {
      context += 'CONHECIMENTO FINANCEIRO RELEVANTE:\n';
      searchResults.documents.forEach((doc: any, i: number) => {
        context += `${i + 1}. ${doc.document.title}:\n${doc.document.content.substring(0, 300)}...\n\n`;
      });
    }

    // Add transaction context
    if (searchResults.transactions.length > 0) {
      context += 'TRANSAÇÕES DO USUÁRIO:\n';
      searchResults.transactions.forEach((tx: any, i: number) => {
        const date = new Date(tx.transaction.date).toLocaleDateString('pt-BR');
        const amount = tx.transaction.amount.toFixed(2);
        const category = tx.transaction.category?.primary || 'Sem categoria';
        context += `${i + 1}. ${tx.transaction.description} - R$${amount} (${date}) - ${category}\n`;
      });
      context += '\n';
    }

    return context;
  }

  /**
   * Extract sources from search results
   */
  private extractSources(
    searchResults: any
  ): Array<{ title: string; url: string }> {
    const sources: Array<{ title: string; url: string }> = [];

    // Add document sources
    searchResults.documents.forEach((doc: any) => {
      sources.push({
        title: doc.document.title,
        url: doc.document.url || '#',
      });
    });

    // Add transaction summary as source if there are transactions
    if (searchResults.transactions.length > 0) {
      sources.push({
        title: `${searchResults.transactions.length} transações analisadas`,
        url: '/transactions',
      });
    }

    return sources;
  }

  /**
   * Build conversation context from history
   */
  private buildConversationContext(history: ChatMessage[]): string {
    if (history.length === 0) return '';

    let context = 'HISTÓRICO DA CONVERSA:\n';

    // Include last 3 messages for context
    const recentHistory = history.slice(-3);

    recentHistory.forEach((msg, i) => {
      const role = msg.role === 'user' ? 'Usuário' : 'Assistente';
      context += `${role}: ${msg.content}\n`;
    });

    context += '\n';
    return context;
  }

  /**
   * Create system prompt for the financial assistant
   */
  private createSystemPrompt(
    context: string,
    conversationContext: string,
    intent?: FinancialIntent
  ): string {
    const basePrompt = `Você é um assistente financeiro pessoal especializado em ajudar usuários brasileiros com suas finanças pessoais.

${conversationContext}

CONTEXTO DISPONÍVEL:
${context}

INSTRUÇÕES GERAIS:
- Responda sempre em português brasileiro de forma clara, amigável e profissional
- Use os dados das transações e documentos fornecidos para dar respostas personalizadas e específicas
- Quando mencionar transações, cite valores, datas e categorias exatos dos dados fornecidos
- Forneça insights práticos e acionáveis baseados nos dados reais do usuário
- Se não houver contexto suficiente, seja honesto sobre isso e sugira como o usuário pode obter mais informações
- Use formatação clara com listas e parágrafos quando apropriado
- Seja específico: em vez de "você gastou muito", diga "você gastou R$X em categoria Y"
- Ofereça sugestões concretas baseadas nos padrões identificados nos dados`;

    // Add intent-specific instructions
    const intentInstructions = this.getIntentSpecificInstructions(intent);

    return `${basePrompt}

${intentInstructions}

Mantenha suas respostas focadas, úteis e baseadas nos dados fornecidos.`;
  }

  /**
   * Get intent-specific instructions
   */
  private getIntentSpecificInstructions(intent?: FinancialIntent): string {
    if (!intent) return '';

    switch (intent) {
      case FinancialIntent.EXPENSE_ANALYSIS:
        return `FOCO ESPECIAL - ANÁLISE DE GASTOS:
- Analise os padrões de gastos com base nas transações fornecidas
- Identifique as categorias com maiores gastos
- Compare gastos entre períodos se houver dados suficientes
- Sugira áreas específicas onde o usuário pode economizar
- Calcule percentuais e médias quando relevante`;

      case FinancialIntent.INVESTMENT_ADVICE:
        return `FOCO ESPECIAL - CONSELHOS DE INVESTIMENTO:
- Use o conhecimento financeiro dos documentos para dar conselhos sólidos
- Considere o perfil de risco baseado nas transações do usuário
- Sugira produtos de investimento adequados ao perfil brasileiro
- Explique conceitos de forma didática
- Sempre mencione que não é aconselhamento financeiro personalizado`;

      case FinancialIntent.TRANSACTION_SEARCH:
        return `FOCO ESPECIAL - BUSCA DE TRANSAÇÕES:
- Liste as transações encontradas de forma clara e organizada
- Agrupe por categoria, data ou valor quando apropriado
- Forneça totais e estatísticas relevantes
- Destaque padrões interessantes nas transações
- Use tabelas ou listas para melhor visualização`;

      case FinancialIntent.SAVINGS_ADVICE:
        return `FOCO ESPECIAL - DICAS DE ECONOMIA:
- Analise os gastos para identificar oportunidades de economia
- Sugira estratégias práticas e específicas
- Priorize sugestões baseadas nos maiores gastos identificados
- Ofereça alternativas concretas para reduzir custos
- Calcule potencial de economia quando possível`;

      case FinancialIntent.FINANCIAL_EDUCATION:
        return `FOCO ESPECIAL - EDUCAÇÃO FINANCEIRA:
- Use os documentos de conhecimento para explicar conceitos
- Explique de forma didática e acessível
- Use exemplos práticos relacionados à situação do usuário
- Conecte a teoria com a prática baseada nas transações
- Sugira próximos passos de aprendizado`;

      default:
        return `INSTRUÇÕES ESPECÍFICAS:
- Foque em ajudar o usuário a tomar melhores decisões financeiras
- Seja prático e acionável em suas sugestões
- Use os dados disponíveis para personalizar a resposta`;
    }
  }

  /**
   * Generate a single response (non-streaming)
   */
  private async generateResponse(
    message: string,
    context: string,
    conversationContext: string,
    intent?: FinancialIntent
  ): Promise<string> {
    const systemPrompt = this.createSystemPrompt(
      context,
      conversationContext,
      intent
    );

    const completion = await this.openai.chat.completions.create({
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
      temperature: 0.7,
      max_tokens: 1200,
    });

    return (
      completion.choices[0]?.message?.content ||
      'Desculpe, não consegui gerar uma resposta.'
    );
  }
}

export default ChatService;
