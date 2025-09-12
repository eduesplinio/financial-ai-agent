/**
 * Tests for Augmented Response Generator
 *
 * This file contains tests for the RAG response generation system.
 */
import { LLMService } from '../src/llm/llm-service';
import { RAGService } from '../src/rag/rag-service';
import { AugmentedResponseGenerator } from '../src/rag/augmented-response-generator';
import { ResponseValidator } from '../src/rag/response-validator';
import { KnowledgeDocument } from '@/shared/src/types';

describe('Augmented Response Generator', () => {
  let mockLlmService: jest.Mocked<LLMService>;
  let mockRagService: jest.Mocked<RAGService>;
  let generator: AugmentedResponseGenerator;

  beforeEach(() => {
    // Create mock LLM service
    mockLlmService = {
      generateResponse: jest.fn().mockResolvedValue({
        content:
          'Investimentos em renda fixa são considerados mais seguros que renda variável [1]. O Tesouro Direto é uma opção de baixo risco [2].',
        usage: { promptTokens: 100, completionTokens: 50, totalTokens: 150 },
      }),
      createFinancialPrompt: jest.fn(),
    } as unknown as jest.Mocked<LLMService>;

    // Create mock RAG service
    mockRagService = {
      semanticSearch: jest.fn().mockResolvedValue([
        {
          document: {
            id: 'doc1',
            title: 'Renda Fixa',
            content: 'Investimentos em renda fixa são mais seguros.',
            source: 'Banco Central',
            category: 'investimentos',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          score: 0.9,
        },
        {
          document: {
            id: 'doc2',
            title: 'Tesouro Direto',
            content: 'O Tesouro Direto é garantido pelo governo.',
            source: 'Tesouro Nacional',
            category: 'investimentos',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          score: 0.8,
        },
      ]),
      indexDocument: jest.fn(),
      updateKnowledgeBase: jest.fn(),
    } as unknown as jest.Mocked<RAGService>;

    // Create the generator
    generator = new AugmentedResponseGenerator(mockLlmService, mockRagService);
  });

  test('should generate augmented response with citations', async () => {
    const query = 'Quais são investimentos de baixo risco?';

    const response = await generator.generateResponse(query);

    // Check that LLM and RAG services were called
    expect(mockRagService.semanticSearch).toHaveBeenCalledWith(query, {});
    expect(mockLlmService.generateResponse).toHaveBeenCalled();

    // Check response structure
    expect(response).toHaveProperty('content');
    expect(response).toHaveProperty('sources');
    expect(response).toHaveProperty('confidence');
    expect(response).toHaveProperty('hasSufficientContext');

    // Citations should be extracted
    expect(response.sources.length).toBeGreaterThan(0);
  });

  test('should handle insufficient context', async () => {
    // Override mock to return no relevant documents
    mockRagService.semanticSearch.mockResolvedValueOnce([]);

    const query = 'Quais são investimentos de baixo risco?';
    const response = await generator.generateResponse(query);

    expect(response.hasSufficientContext).toBe(false);
  });
});

describe('Response Validator', () => {
  let mockLlmService: jest.Mocked<LLMService>;
  let validator: ResponseValidator;

  beforeEach(() => {
    // Create mock LLM service
    mockLlmService = {
      generateResponse: jest.fn().mockResolvedValue({
        content:
          'Precisão factual: 8\nAfirmações corretas: Tesouro Direto é de baixo risco\nAfirmações incorretas: Nenhuma\nCitações adequadas: sim\nCompletude da resposta: 7',
        usage: { promptTokens: 100, completionTokens: 50, totalTokens: 150 },
      }),
    } as unknown as jest.Mocked<LLMService>;

    // Create the validator
    validator = new ResponseValidator(mockLlmService);
  });

  test('should validate response quality', async () => {
    const response =
      'Investimentos em renda fixa são considerados mais seguros que renda variável [1]. O Tesouro Direto é uma opção de baixo risco [2].';
    const query = 'Quais são investimentos de baixo risco?';
    const documents: KnowledgeDocument[] = [
      {
        id: 'doc1',
        title: 'Renda Fixa',
        content: 'Investimentos em renda fixa são mais seguros.',
        source: 'Banco Central',
        category: 'investimentos',
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'doc2',
        title: 'Tesouro Direto',
        content: 'O Tesouro Direto é garantido pelo governo.',
        source: 'Tesouro Nacional',
        category: 'investimentos',
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const validationResult = await validator.validateResponse(
      response,
      query,
      documents
    );

    expect(validationResult).toHaveProperty('validationPassed');
    expect(validationResult).toHaveProperty('quality');
    expect(validationResult.quality).toHaveProperty('factualConsistency');
    expect(validationResult.quality).toHaveProperty('completeness');
    expect(validationResult.quality).toHaveProperty('citationQuality');
  });

  test('should evaluate response quality using heuristics', () => {
    const response =
      'Investimentos em renda fixa são considerados mais seguros que renda variável [1].\n\nO Tesouro Direto é uma opção de baixo risco [2].\n\nOutras opções incluem:\n- CDBs\n- LCIs\n- LCAs\n\nEm 2023, as taxas médias foram de 12,5%.';

    const quality = validator.evaluateResponseQuality(response);

    expect(quality).toBeGreaterThan(0);
    expect(quality).toBeLessThanOrEqual(1);
  });
});
