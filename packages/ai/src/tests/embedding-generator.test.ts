import { OpenAIEmbeddingProvider } from '../embedding-generator';

describe('OpenAIEmbeddingProvider', () => {
  it('should generate an embedding for a chunk of text (mocked)', async () => {
    // Mock OpenAI class
    const provider = new OpenAIEmbeddingProvider('test-key');
    provider['openai'].embeddings = {
      create: async ({ model, input }: { model: string; input: string }) => ({
        data: [{ embedding: Array(1536).fill(0.1) }],
      }),
    } as any;
    const embedding = await provider.getEmbedding('Texto financeiro de teste');
    expect(Array.isArray(embedding)).toBe(true);
    expect(embedding.length).toBe(1536);
    expect(embedding[0]).toBe(0.1);
  });
});
