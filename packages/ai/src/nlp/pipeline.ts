// Pipeline de NLP para compreensão de intenções financeiras
// Estrutura inicial para integração de módulos futuros
import { extractFinancialEntities } from './entity-extraction';
import { classifyQuery } from './classification';
import { normalizePTBR } from './normalize-ptbr';
import { detectSentiment } from './sentiment';

export interface FinancialIntent {
  type: 'informacao' | 'analise' | 'recomendacao';
  confidence: number;
  entities?: Record<string, any>;
  sentiment?: 'positivo' | 'negativo' | 'neutro';
  sentimentScore?: number;
}

export interface NLPPipelineInput {
  text: string;
  lang?: 'pt-br';
}

export class FinancialNLPPipeline {
  constructor() {
    // Inicialização de recursos, modelos, etc.
  }

  async analyzeIntent(input: NLPPipelineInput): Promise<FinancialIntent> {
    // Normalização de texto PT-BR para classificação e sentimento
    const tokens = normalizePTBR(input.text);
    const normalizedText = tokens.join(' ');
    // Extração de entidades financeiras: usar texto original
    const entities = extractFinancialEntities(input.text);
    // Classificação da consulta
    const { type, confidence } = classifyQuery(normalizedText);
    // Detecção de sentimento
    const { sentiment, score: sentimentScore } =
      detectSentiment(normalizedText);
    return {
      type,
      confidence,
      entities,
      sentiment,
      sentimentScore,
    };
  }
}
