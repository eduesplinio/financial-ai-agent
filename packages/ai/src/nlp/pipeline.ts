// Pipeline de NLP para compreensão de intenções financeiras
// Estrutura inicial para integração de módulos futuros
import { extractFinancialEntities } from './entity-extraction';
import { classifyQuery } from './classification';

export interface FinancialIntent {
  type: 'informacao' | 'analise' | 'recomendacao';
  confidence: number;
  entities?: Record<string, any>;
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
    // Extração de entidades financeiras
    const entities = extractFinancialEntities(input.text);
    // Classificação da consulta
    const { type, confidence } = classifyQuery(input.text);
    return {
      type,
      confidence,
      entities,
    };
  }
}
