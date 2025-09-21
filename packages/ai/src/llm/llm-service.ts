// LLM (Large Language Model) integration
import OpenAI from 'openai';
import { MessageRole } from '@financial-ai/shared/src/types';

export interface LLMResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

/**
 * LLMService provides an abstraction for different LLM providers
 * Currently implements OpenAI's GPT-4/GPT-3.5 and can be extended for Claude or other models
 */
export class LLMService {
  private openai?: OpenAI;
  private anthropic?: any; // Will be implemented when adding Claude support
  private defaultModel: string;
  private defaultOptions: LLMOptions;

  constructor(
    apiKey: string,
    provider: 'openai' | 'anthropic' = 'openai',
    options: LLMOptions = {}
  ) {
    if (provider === 'openai') {
      this.openai = new OpenAI({ apiKey });
    } else if (provider === 'anthropic') {
      // this.anthropic = new Anthropic({ apiKey });
      // TODO: Implement Anthropic Claude integration when needed
      throw new Error('Anthropic Claude integration not yet implemented');
    }

    this.defaultModel = options.model || 'gpt-4o';
    this.defaultOptions = {
      temperature: options.temperature || 0.2,
      maxTokens: options.maxTokens || 2048,
    };
  }

  /**
   * Generate a response using the configured LLM
   */
  async generateResponse(
    messages: LLMMessage[],
    options: LLMOptions = {}
  ): Promise<LLMResponse> {
    if (this.openai) {
      return this.generateOpenAIResponse(messages, options);
    } else if (this.anthropic) {
      return this.generateClaudeResponse(messages, options);
    } else {
      throw new Error('No LLM provider configured');
    }
  }

  /**
   * Generate a response using OpenAI's API
   */
  private async generateOpenAIResponse(
    messages: LLMMessage[],
    options: LLMOptions = {}
  ): Promise<LLMResponse> {
    const model = options.model || this.defaultModel;
    const temperature = options.temperature ?? this.defaultOptions.temperature;
    const max_tokens = options.maxTokens ?? this.defaultOptions.maxTokens;

    if (!this.openai) {
      throw new Error('OpenAI client not initialized');
    }

    try {
      // Construct params object with proper type handling for OpenAI API
      const params: any = {
        model,
        messages: messages as any,
      };

      // Only add defined values
      if (temperature !== undefined) params.temperature = temperature;
      if (max_tokens !== undefined) params.max_tokens = max_tokens;

      const response = await this.openai.chat.completions.create(params);

      return {
        content: response.choices[0]?.message?.content || '',
        usage: {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0,
        },
      };
    } catch (error) {
      console.error('Error generating response from OpenAI:', error);
      throw new Error(
        `Failed to generate response: ${(error as Error).message}`
      );
    }
  }

  /**
   * Generate a response using Anthropic's Claude API
   * To be implemented when needed
   */
  private async generateClaudeResponse(
    messages: LLMMessage[],
    options: LLMOptions = {}
  ): Promise<LLMResponse> {
    // TODO: Implement Claude integration
    throw new Error('Anthropic Claude integration not yet implemented');
  }

  /**
   * Create financial specialized prompts for the model
   */
  createFinancialPrompt(
    query: string,
    context: string,
    userProfile?: any
  ): LLMMessage[] {
    const systemPrompt = `Você é um assistente financeiro especializado, treinado para fornecer informações precisas 
    e personalizadas sobre finanças pessoais, investimentos e economia. 
    
    Responda com base APENAS nas informações fornecidas no contexto. 
    Se o contexto não contiver informações suficientes para responder à pergunta, 
    indique claramente quais informações estão faltando.
    
    Sempre forneça explicações detalhadas, mas evite usar jargões financeiros complexos
    a menos que o usuário demonstre familiaridade com eles.
    
    Ao mencionar fatos ou dados específicos, cite a fonte original das informações.
    
    ${
      userProfile
        ? `O usuário tem o seguinte perfil:
    - Tolerância a risco: ${userProfile.riskTolerance}
    - Nível de conhecimento financeiro: ${userProfile.financialKnowledgeLevel}
    - Faixa etária: ${userProfile.ageGroup}`
        : ''
    }`;

    return [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: `Pergunta: ${query}\n\nContexto para resposta: ${context}`,
      },
    ];
  }
}

export default LLMService;
