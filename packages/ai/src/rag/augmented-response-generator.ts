/**
 * Augmented Response Generator
 *
 * This component implements the core RAG functionality to generate responses
 * with factual grounding, citations, and fallback mechanisms.
 */
import { LLMService, LLMMessage } from '../llm/llm-service';
import { RAGService, RAGResponse, RelevantDocument } from './rag-service';
import { KnowledgeDocument, UserProfile } from '@financial-ai/shared/src/types';

export interface SourceReference {
  id: string;
  title: string;
  source: string;
  url?: string | undefined;
  relevance: number;
}

export interface AugmentedResponse {
  content: string;
  sources: SourceReference[];
  confidence: number;
  hasSufficientContext: boolean;
}

export interface ResponseQualityMetrics {
  factualConsistency: number; // 0-1 measure of how consistent response is with retrieved facts
  completeness: number; // 0-1 measure of how completely the query was answered
  citation_count: number; // Number of properly cited facts
  confidence: number; // 0-1 overall confidence score
}

export class AugmentedResponseGenerator {
  private llmService: LLMService;
  private ragService: RAGService;

  constructor(llmService: LLMService, ragService: RAGService) {
    this.llmService = llmService;
    this.ragService = ragService;
  }

  /**
   * Generate an augmented response based on a user query
   *
   * @param query The user query to respond to
   * @param userProfile Optional user profile for personalization
   * @returns An augmented response with citations
   */
  async generateResponse(
    query: string,
    userProfile?: UserProfile
  ): Promise<AugmentedResponse> {
    // Step 1: Retrieve relevant documents using the RAG service
    const relevantDocuments = await this.ragService.semanticSearch(query, {});

    // Step 2: Check if we have sufficient context to answer
    const hasSufficientContext = this.evaluateContextSufficiency(
      relevantDocuments,
      query
    );

    // Step 3: Format context from retrieved documents
    const formattedContext = this.formatRetrievedContext(relevantDocuments);

    // Step 4: Generate the augmented response
    const response = await this.generateAugmentedContent(
      query,
      formattedContext,
      userProfile,
      relevantDocuments,
      hasSufficientContext
    );

    // Step 5: Validate response quality and extract citations
    const { content, sources, confidence } = this.processResponse(
      response,
      relevantDocuments
    );

    return {
      content,
      sources,
      confidence,
      hasSufficientContext,
    };
  }

  /**
   * Evaluate whether the retrieved context is sufficient to answer the query
   */
  private evaluateContextSufficiency(
    documents: RelevantDocument[],
    query: string
  ): boolean {
    // Simple heuristic: If we have at least one document with a score >= 0.7
    const hasHighRelevance = documents.some(doc => doc.score >= 0.7);

    // Or at least 3 documents with score >= 0.5
    const mediumRelevanceCount = documents.filter(
      doc => doc.score >= 0.5
    ).length;

    return hasHighRelevance || mediumRelevanceCount >= 3;
  }

  /**
   * Format retrieved documents into a context string for the LLM
   */
  private formatRetrievedContext(documents: RelevantDocument[]): string {
    // Sort by relevance score, highest first
    const sortedDocuments = [...documents].sort((a, b) => b.score - a.score);

    // Format each document with clear delineation
    const formattedDocs = sortedDocuments.map((doc, index) => {
      return `
DOCUMENTO #${index + 1}
Título: ${doc.document.title}
Fonte: ${doc.document.source}
Relevância: ${(doc.score * 100).toFixed(1)}%
Conteúdo:
${doc.document.content}
---
`;
    });

    return `
Contexto para responder à pergunta (baseado em ${documents.length} documentos):
${formattedDocs.join('\n')}
`;
  }

  /**
   * Generate the augmented content using the LLM with specialized prompt
   */
  private async generateAugmentedContent(
    query: string,
    context: string,
    userProfile: UserProfile | undefined,
    documents: RelevantDocument[],
    hasSufficientContext: boolean
  ): Promise<string> {
    // Create specialized financial prompts based on whether we have enough context
    let messages: LLMMessage[];

    if (hasSufficientContext) {
      messages = this.createFinancialContextPrompt(
        query,
        context,
        userProfile,
        documents
      );
    } else {
      messages = this.createFallbackPrompt(query, context, userProfile);
    }

    // Generate the response
    const response = await this.llmService.generateResponse(messages, {
      temperature: 0.2, // Lower temperature for factual responses
    });

    return response.content;
  }

  /**
   * Create a specialized prompt for financial context
   */
  private createFinancialContextPrompt(
    query: string,
    context: string,
    userProfile: UserProfile | undefined,
    documents: RelevantDocument[]
  ): LLMMessage[] {
    const sources = documents
      .map(
        (doc, i) => `[${i + 1}] ${doc.document.title} (${doc.document.source})`
      )
      .join('\n');

    const systemPrompt = `
Você é um assistente financeiro especializado, treinado para fornecer informações precisas
e personalizadas sobre finanças pessoais, investimentos e economia brasileira.

Responda com base APENAS nas informações fornecidas no contexto.
Se a pergunta não puder ser respondida completamente com as informações do contexto,
indique claramente quais informações estão faltando.

REGRAS IMPORTANTES:
1. Seja claro, conciso e didático - explique conceitos financeiros em linguagem acessível
2. SEMPRE cite as fontes usando números entre colchetes [1], [2], etc. ao final da sentença ou parágrafo relevante
3. Evite usar jargões financeiros complexos a menos que o usuário demonstre familiaridade com eles
4. Quando falar sobre produtos financeiros ou investimentos, sempre cite riscos e considerações importantes
5. NÃO INVENTE INFORMAÇÕES. Se não tiver certeza, indique que não há dados suficientes no contexto
6. Para perguntas sobre regulamentações financeiras, mencione sempre a data da informação

${
  userProfile
    ? `
PERFIL DO USUÁRIO:
- Tolerância a risco: ${userProfile.riskTolerance}
- Nível de conhecimento financeiro: ${userProfile.financialKnowledgeLevel}
- Faixa etária: ${userProfile.ageGroup}
Adapte sua resposta para esse perfil.
`
    : ''
}

FONTES DISPONÍVEIS:
${sources}
`;

    const userPrompt = `
PERGUNTA: ${query}

${context}
`;

    return [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];
  }

  /**
   * Create a fallback prompt when context is insufficient
   */
  private createFallbackPrompt(
    query: string,
    context: string,
    userProfile: UserProfile | undefined
  ): LLMMessage[] {
    const systemPrompt = `
Você é um assistente financeiro especializado. A pergunta do usuário não pode ser respondida completamente
com as informações disponíveis no contexto.

INSTRUÇÕES:
1. Indique claramente que não há dados suficientes para responder completamente à pergunta
2. Forneça APENAS informações gerais que estejam presentes no contexto limitado disponível
3. Sugira como o usuário poderia reformular a pergunta ou quais informações adicionais seriam necessárias
4. NÃO INVENTE INFORMAÇÕES nem forneça dados que não estejam no contexto
5. Ofereça fontes alternativas confiáveis onde o usuário poderia buscar essas informações (ex: Banco Central, CVM)

${
  userProfile
    ? `
PERFIL DO USUÁRIO:
- Tolerância a risco: ${userProfile.riskTolerance}
- Nível de conhecimento financeiro: ${userProfile.financialKnowledgeLevel}
- Faixa etária: ${userProfile.ageGroup}
Adapte sua resposta para esse perfil.
`
    : ''
}
`;

    return [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: `PERGUNTA: ${query}\n\nCONTEXTO LIMITADO:\n${context}`,
      },
    ];
  }

  /**
   * Process the LLM response to extract citations and validate quality
   */
  private processResponse(
    rawResponse: string,
    documents: RelevantDocument[]
  ): {
    content: string;
    sources: SourceReference[];
    confidence: number;
  } {
    // Extract source references from the response
    const sourceRefs = this.extractSourceReferences(rawResponse, documents);

    // Calculate confidence based on citation quality
    const confidence = this.calculateConfidence(
      rawResponse,
      sourceRefs,
      documents
    );

    return {
      content: rawResponse,
      sources: sourceRefs,
      confidence,
    };
  }

  /**
   * Extract source references from the response
   */
  private extractSourceReferences(
    response: string,
    documents: RelevantDocument[]
  ): SourceReference[] {
    const sourceMap = new Map<number, SourceReference>();

    // Match citation patterns like [1], [2], etc.
    const citationPattern = /\[(\d+)\]/g;
    let match;

    while ((match = citationPattern.exec(response)) !== null) {
      // Make sure we have a matched group and parse it
      if (match[1]) {
        const sourceIndex = parseInt(match[1], 10) - 1;

        // Only add valid references that correspond to our documents
        if (sourceIndex >= 0 && sourceIndex < documents.length) {
          const docRef = documents[sourceIndex];

          if (docRef && !sourceMap.has(sourceIndex)) {
            const doc = docRef.document;

            sourceMap.set(sourceIndex, {
              id: doc.id,
              title: doc.title,
              source: doc.source,
              url:
                doc.metadata && typeof doc.metadata.url === 'string'
                  ? doc.metadata.url
                  : undefined,
              relevance: docRef.score,
            });
          }
        }
      }
    }

    return Array.from(sourceMap.values());
  }

  /**
   * Calculate response confidence based on citations and relevance
   */
  private calculateConfidence(
    response: string,
    sources: SourceReference[],
    documents: RelevantDocument[]
  ): number {
    // No sources cited means low confidence
    if (sources.length === 0) return 0.3;

    // Calculate average relevance of cited sources
    const avgRelevance =
      sources.reduce((sum, src) => sum + src.relevance, 0) / sources.length;

    // Citation ratio: What percentage of available sources were cited?
    const citationRatio =
      documents.length > 0
        ? Math.min(1, sources.length / Math.min(5, documents.length))
        : 0;

    // Response length factor - longer responses typically have more substance
    const responseLength = response.length;
    const lengthFactor = Math.min(1, responseLength / 1000) * 0.1;

    // Calculate final confidence score
    const confidenceScore =
      avgRelevance * 0.6 + citationRatio * 0.3 + lengthFactor;

    // Bound between 0.1 and 1.0
    return Math.max(0.1, Math.min(1.0, confidenceScore));
  }

  /**
   * Validate response quality using a separate LLM call (for high-stakes scenarios)
   * Note: This is not used in the main flow but can be called separately
   */
  async validateResponseQuality(
    query: string,
    response: string,
    documents: RelevantDocument[]
  ): Promise<ResponseQualityMetrics> {
    const validationPrompt = `
Avaliar a qualidade da seguinte resposta gerada para uma pergunta financeira.

PERGUNTA: ${query}

RESPOSTA: ${response}

FONTES ORIGINAIS:
${documents
  .map(
    (doc, i) =>
      `FONTE ${i + 1}: ${doc.document.title}\n${doc.document.content.substring(0, 200)}...`
  )
  .join('\n\n')}

Avalie os seguintes aspectos em uma escala de 0 a 1:
1. Consistência Factual: A resposta está alinhada aos fatos presentes nas fontes?
2. Completude: A resposta aborda todos os aspectos relevantes da pergunta?
3. Citações: As informações são adequadamente atribuídas às fontes?
4. Confiança Geral: Qual o nível geral de confiança na resposta?

Formate a resposta exatamente assim:
factualConsistency: 0.X
completeness: 0.X
citation_count: Y
confidence: 0.X
`;

    const validationMessages: LLMMessage[] = [
      {
        role: 'system',
        content:
          'Você é um avaliador especializado em qualidade de respostas financeiras.',
      },
      { role: 'user', content: validationPrompt },
    ];

    const validationResponse =
      await this.llmService.generateResponse(validationMessages);

    try {
      // Parse the metrics from the validation response
      const factualMatch = validationResponse.content.match(
        /factualConsistency: (0\.\d+)/
      );
      const completenessMatch = validationResponse.content.match(
        /completeness: (0\.\d+)/
      );
      const citationMatch = validationResponse.content.match(
        /citation_count: (\d+)/
      );
      const confidenceMatch =
        validationResponse.content.match(/confidence: (0\.\d+)/);

      return {
        factualConsistency:
          factualMatch && factualMatch[1] ? parseFloat(factualMatch[1]) : 0.5,
        completeness:
          completenessMatch && completenessMatch[1]
            ? parseFloat(completenessMatch[1])
            : 0.5,
        citation_count:
          citationMatch && citationMatch[1]
            ? parseInt(citationMatch[1], 10)
            : 0,
        confidence:
          confidenceMatch && confidenceMatch[1]
            ? parseFloat(confidenceMatch[1])
            : 0.5,
      };
    } catch (error) {
      console.error('Error parsing validation response:', error);
      return {
        factualConsistency: 0.5,
        completeness: 0.5,
        citation_count: 0,
        confidence: 0.5,
      };
    }
  }
}

export default AugmentedResponseGenerator;
