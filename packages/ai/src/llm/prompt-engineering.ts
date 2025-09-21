/**
 * Financial Prompt Engineering
 *
 * This module contains specialized prompt templates and utilities for financial RAG
 * to improve the quality of responses related to financial topics.
 */

import { LLMMessage } from './llm-service';
import { UserProfile } from '@financial-ai/shared/src/types';

/**
 * Default system prompt for financial queries
 */
export const DEFAULT_FINANCIAL_SYSTEM_PROMPT = `
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
`;

/**
 * Create a specialized financial prompt based on user's profile
 */
export function createFinancialPrompt(
  userProfile?: UserProfile,
  additionalInstructions?: string
): string {
  let prompt = DEFAULT_FINANCIAL_SYSTEM_PROMPT;

  if (userProfile) {
    // Add personalized instructions based on user profile
    prompt += `\nPERFIL DO USUÁRIO:`;

    if (userProfile.riskTolerance) {
      prompt += `\n- Tolerância a risco: ${userProfile.riskTolerance}`;

      // Add specific guidance based on risk tolerance
      if (userProfile.riskTolerance === 'conservative') {
        prompt += `\n  * Enfatize segurança e preservação de capital`;
        prompt += `\n  * Destaque riscos com mais ênfase que potenciais retornos`;
      } else if (userProfile.riskTolerance === 'moderate') {
        prompt += `\n  * Busque equilíbrio entre riscos e retornos`;
        prompt += `\n  * Apresente opções diversificadas`;
      } else if (userProfile.riskTolerance === 'aggressive') {
        prompt += `\n  * Pode discutir investimentos de maior risco quando relevantes`;
        prompt += `\n  * Enfatize horizonte de longo prazo para investimentos voláteis`;
      }
    }

    if (userProfile.financialKnowledgeLevel) {
      prompt += `\n- Nível de conhecimento financeiro: ${userProfile.financialKnowledgeLevel}`;

      // Adjust complexity based on knowledge level
      if (userProfile.financialKnowledgeLevel === 'beginner') {
        prompt += `\n  * Use explicações simples e didáticas`;
        prompt += `\n  * Defina termos financeiros antes de usá-los`;
        prompt += `\n  * Evite jargões e terminologia técnica`;
      } else if (userProfile.financialKnowledgeLevel === 'intermediate') {
        prompt += `\n  * Pode usar terminologia financeira básica sem explicação`;
        prompt += `\n  * Explique conceitos avançados quando necessário`;
      } else if (userProfile.financialKnowledgeLevel === 'advanced') {
        prompt += `\n  * Pode usar terminologia técnica e conceitos avançados`;
        prompt += `\n  * Forneça análises mais profundas quando relevante`;
      }
    }

    if (userProfile.ageGroup) {
      prompt += `\n- Faixa etária: ${userProfile.ageGroup}`;
    }

    prompt += `\nAdapte sua resposta para esse perfil.`;
  }

  if (additionalInstructions) {
    prompt += `\n\nINSTRUÇÕES ADICIONAIS:\n${additionalInstructions}`;
  }

  return prompt;
}

/**
 * Create a complete prompt for financial RAG queries
 */
export function createFinancialRAGPrompt(
  query: string,
  context: string,
  userProfile?: UserProfile,
  options?: {
    temperature?: number;
    maxResponseLength?: number;
    formatInstructions?: string;
  }
): LLMMessage[] {
  let systemPrompt = createFinancialPrompt(userProfile);

  // Add format instructions if provided
  if (options?.formatInstructions) {
    systemPrompt += `\n\nFORMATO DA RESPOSTA:\n${options.formatInstructions}`;
  }

  // Add length guidance if provided
  if (options?.maxResponseLength) {
    systemPrompt += `\n\nSua resposta deve ter no máximo ${options.maxResponseLength} caracteres.`;
  }

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `PERGUNTA: ${query}\n\nCONTEXTO:\n${context}` },
  ];
}

/**
 * Create a prompt for when we don't have enough context
 */
export function createInsufficientContextPrompt(
  query: string,
  limitedContext: string,
  userProfile?: UserProfile
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
      content: `PERGUNTA: ${query}\n\nCONTEXTO LIMITADO:\n${limitedContext}`,
    },
  ];
}

/**
 * Create a prompt for financial fact-checking
 */
export function createFactCheckPrompt(
  query: string,
  response: string,
  context: string
): LLMMessage[] {
  const systemPrompt = `
Você é um especialista financeiro com a tarefa de verificar fatos em respostas sobre finanças.
Avalie cuidadosamente se a resposta fornecida contém informações precisas e consistentes com o contexto.

INSTRUÇÕES:
1. Compare cada afirmação na resposta com as informações no contexto
2. Identifique quaisquer afirmações incorretas, imprecisas ou não suportadas pelo contexto
3. Verifique se a resposta cita corretamente as fontes
4. Avalie se a resposta é completa em relação à pergunta e ao contexto disponível
5. NÃO considere seu conhecimento prévio sobre finanças - baseie-se APENAS no contexto fornecido

Formate sua resposta da seguinte forma:
- Precisão factual: [0-10]
- Afirmações corretas: [liste afirmações corretas]
- Afirmações incorretas: [liste afirmações incorretas, se houver]
- Afirmações não verificáveis: [liste afirmações que não podem ser verificadas com o contexto]
- Citações adequadas: [sim/não/parcial]
- Completude da resposta: [0-10]
`;

  return [
    { role: 'system', content: systemPrompt },
    {
      role: 'user',
      content: `
PERGUNTA: ${query}

RESPOSTA A VERIFICAR:
${response}

CONTEXTO PARA VERIFICAÇÃO:
${context}
`,
    },
  ];
}
