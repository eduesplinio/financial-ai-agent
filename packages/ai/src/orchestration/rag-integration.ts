// Integração do orquestrador com sistema RAG
// Conecta consultas de informação ao sistema de busca semântica

import { ServiceOrchestrator, ServiceResponse } from './service-orchestrator';

// Mock da interface RAG (será substituído pela importação real)
interface RAGService {
  semanticSearch(query: string, filters?: any): Promise<any[]>;
}

interface VectorSearchService {
  semanticSearch(query: any): Promise<any[]>;
}

export class RAGIntegratedOrchestrator extends ServiceOrchestrator {
  private ragService: RAGService | undefined;
  private vectorSearch: VectorSearchService | undefined;

  constructor(ragService?: RAGService, vectorSearch?: VectorSearchService) {
    super();
    this.ragService = ragService;
    this.vectorSearch = vectorSearch;
  }

  // Override do método de tratamento de consultas de informação
  protected override async handleInfoQuery(
    nlpResult: any,
    userId: string
  ): Promise<ServiceResponse> {
    const entities = nlpResult.entities;

    // Se há valores ou datas, trata como consulta sobre transações
    if (entities?.valores?.length > 0 || entities?.datas?.length > 0) {
      return {
        type: 'info',
        data: {
          message: 'Consultando suas transações específicas...',
          entities: entities,
          transactionData: this.mockTransactionData(entities),
        },
        source: 'transaction-service',
        confidence: 0.85,
      };
    }

    // Para consultas gerais, usar sistema RAG
    return await this.queryRAGSystem(nlpResult.text || '', userId);
  }

  private async queryRAGSystem(
    query: string,
    userId: string
  ): Promise<ServiceResponse> {
    try {
      let results = [];

      if (this.ragService) {
        // Usar RAGService se disponível
        results = await this.ragService.semanticSearch(query, {
          categories: ['investimentos', 'economia', 'financas'],
          limit: 5,
        });
      } else if (this.vectorSearch) {
        // Fallback para VectorSearchService direto
        const mockEmbedding = new Array(1536).fill(0).map(() => Math.random());
        results = await this.vectorSearch.semanticSearch({
          queryVector: mockEmbedding,
          limit: 5,
          numCandidates: 20,
        });
      } else {
        // Fallback com dados mockados
        results = this.mockRAGResults(query);
      }

      return {
        type: 'info',
        data: {
          message: 'Aqui estão as informações relevantes encontradas:',
          results: results.slice(0, 3), // Limita a 3 resultados principais
          query: query,
        },
        source: 'rag-system',
        confidence: results.length > 0 ? 0.9 : 0.3,
      };
    } catch (error) {
      console.error('Erro ao consultar sistema RAG:', error);

      // Fallback para erro do RAG
      return {
        type: 'info',
        data: {
          message:
            'Desculpe, não consegui encontrar informações específicas sobre sua consulta. Posso ajudá-lo com informações gerais sobre finanças.',
          error: 'rag-unavailable',
        },
        source: 'fallback',
        confidence: 0.2,
      };
    }
  }

  private mockTransactionData(entities: any) {
    return {
      transactions: [
        {
          date: entities.datas?.[0] || '2025-09-12',
          amount: entities.valores?.[0] || 'R$ 500',
          category: entities.categorias?.[0] || 'geral',
          description: 'Transação processada',
        },
      ],
    };
  }

  private mockRAGResults(query: string) {
    const results = [
      {
        document: {
          title: 'Investimentos em Renda Fixa',
          content:
            'Renda fixa são investimentos com rentabilidade previsível...',
          source: 'Banco Central',
          category: 'investimentos',
        },
        score: 0.89,
      },
      {
        document: {
          title: 'Planejamento Financeiro',
          content:
            'O planejamento financeiro é essencial para alcançar objetivos...',
          source: 'CVM',
          category: 'planejamento',
        },
        score: 0.76,
      },
      {
        document: {
          title: 'Educação Financeira',
          content:
            'A educação financeira ajuda nas decisões de investimento...',
          source: 'FEBRABAN',
          category: 'educacao',
        },
        score: 0.65,
      },
    ];

    // Filtrar resultados baseado na query - fallback simples
    return results.slice(0, 5);
  }
}
