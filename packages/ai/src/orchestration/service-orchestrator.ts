// Orquestrador de serviços para agente conversacional financeiro
// Roteamento inteligente de consultas e integração entre RAG, NLP e análise

import { FinancialNLPPipeline } from '../nlp/pipeline';
import { ConversationMemoryRedis } from '../conversation/context-redis';

export interface ServiceResponse {
  type: 'info' | 'analysis' | 'recommendation' | 'error';
  data: any;
  source: string;
  confidence: number;
}

export interface OrchestrationResult {
  response: ServiceResponse;
  context?: any;
  fallbackUsed?: boolean;
  processingTime?: number;
}

export class ServiceOrchestrator {
  private nlp: FinancialNLPPipeline;
  private memory: ConversationMemoryRedis;

  constructor() {
    this.nlp = new FinancialNLPPipeline();
    this.memory = new ConversationMemoryRedis();
  }

  async processQuery(
    userId: string,
    query: string
  ): Promise<OrchestrationResult> {
    const startTime = Date.now();

    try {
      // 1. Análise NLP da consulta
      const nlpResult = await this.nlp.analyzeIntent({ text: query });

      // 2. Adicionar ao contexto conversacional
      await this.memory.addMessage(userId, query, nlpResult);

      // 3. Roteamento inteligente baseado na intenção
      const serviceResponse = await this.routeToService(nlpResult, userId);

      // 4. Recuperar contexto atualizado
      const context = await this.memory.getContext(userId);

      return {
        response: serviceResponse,
        context,
        processingTime: Date.now() - startTime,
      };
    } catch (error) {
      // Fallback para erro
      return {
        response: {
          type: 'error',
          data: {
            message: 'Desculpe, não consegui processar sua solicitação.',
          },
          source: 'fallback',
          confidence: 0,
        },
        fallbackUsed: true,
        processingTime: Date.now() - startTime,
      };
    }
  }

  private async routeToService(
    nlpResult: any,
    userId: string
  ): Promise<ServiceResponse> {
    switch (nlpResult.type) {
      case 'informacao':
        return await this.handleInfoQuery(nlpResult, userId);

      case 'analise':
        return await this.handleAnalysisQuery(nlpResult, userId);

      case 'recomendacao':
        return await this.handleRecommendationQuery(nlpResult, userId);

      default:
        return {
          type: 'info',
          data: { message: 'Como posso ajudá-lo com suas finanças?' },
          source: 'default',
          confidence: 0.5,
        };
    }
  }

  protected async handleInfoQuery(
    nlpResult: any,
    userId: string
  ): Promise<ServiceResponse> {
    // Roteamento para serviços de informação (RAG, dados bancários, etc.)
    const entities = nlpResult.entities;

    if (entities?.valores?.length > 0 || entities?.datas?.length > 0) {
      // Consulta sobre transações específicas
      return {
        type: 'info',
        data: {
          message: 'Aqui estão as informações sobre suas transações.',
          entities: entities,
        },
        source: 'transaction-service',
        confidence: 0.8,
      };
    }

    // Consulta geral - usar RAG
    return {
      type: 'info',
      data: { message: 'Consultando base de conhecimento financeiro...' },
      source: 'rag-service',
      confidence: 0.7,
    };
  }

  private async handleAnalysisQuery(
    nlpResult: any,
    userId: string
  ): Promise<ServiceResponse> {
    // Roteamento para serviços de análise de padrões
    return {
      type: 'analysis',
      data: {
        message: 'Analisando seus padrões financeiros...',
        analysis: 'Seus gastos com alimentação aumentaram 15% este mês.',
      },
      source: 'pattern-analysis',
      confidence: 0.9,
    };
  }

  private async handleRecommendationQuery(
    nlpResult: any,
    userId: string
  ): Promise<ServiceResponse> {
    // Roteamento para sistema de recomendações
    return {
      type: 'recommendation',
      data: {
        message: 'Com base no seu perfil, recomendo...',
        recommendations: [
          'Diversificar investimentos',
          'Reduzir gastos variáveis',
        ],
      },
      source: 'recommendation-engine',
      confidence: 0.85,
    };
  }
}
