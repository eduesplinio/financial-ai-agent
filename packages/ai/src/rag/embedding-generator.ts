import OpenAI from 'openai';

export interface EmbeddingProvider {
  getEmbedding(text: string): Promise<number[]>;
}

export class OpenAIEmbeddingProvider implements EmbeddingProvider {
  private openai: OpenAI;
  private model: string;

  constructor(apiKey: string, model: string = 'text-embedding-ada-002') {
    this.openai = new OpenAI({ apiKey });
    this.model = model;
  }

  async getEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: this.model,
      input: text,
    });
    // OpenAI returns embeddings in response.data[0].embedding
    if (!response.data || !response.data[0] || !response.data[0].embedding) {
      throw new Error('Embedding não retornado pela API OpenAI');
    }
    return response.data[0].embedding;
  }
}

// Exemplo de uso:
// const provider = new OpenAIEmbeddingProvider(process.env.OPENAI_API_KEY!);
// const embedding = await provider.getEmbedding('Texto do chunk financeiro');
