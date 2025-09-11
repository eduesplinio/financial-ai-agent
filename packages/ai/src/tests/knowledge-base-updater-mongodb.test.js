// @ts-nocheck
const { KnowledgeBaseUpdater } = require('../knowledge-base-updater');

// Mock do DocumentIndexService para teste
jest.mock('@financial-ai/database/src/document-index', () => ({
  DocumentIndexService: {
    saveProcessedDocument: jest.fn().mockResolvedValue({
      _id: 'test-document-id',
      filename: 'test.txt',
      filepath: '/path/to/test.txt',
      format: 'txt',
      processingStatus: 'success',
      metrics: {
        coverage: 0.95,
        chunkCount: 3,
        avgChunkSize: 100,
        embeddingCompleteness: 1.0,
        format: 'txt',
        fileSize: 300,
        extractionSuccess: true,
      },
      totalChunks: 3,
    }),
  },
}));

// Mock para extractText
jest.mock('../document-format-processor', () => ({
  extractText: jest.fn().mockResolvedValue('Conteúdo de teste do documento'),
}));

// Mock para chunkFinancialDocument
jest.mock('../chunking', () => ({
  chunkFinancialDocument: jest
    .fn()
    .mockReturnValue([
      { content: 'Chunk 1' },
      { content: 'Chunk 2' },
      { content: 'Chunk 3' },
    ]),
}));

// Mock para OpenAIEmbeddingProvider
jest.mock('../embedding-generator', () => ({
  OpenAIEmbeddingProvider: jest.fn().mockImplementation(() => ({
    getEmbedding: jest.fn().mockResolvedValue([0.1, 0.2, 0.3]),
  })),
}));

describe('KnowledgeBaseUpdater - MongoDB Integration', () => {
  const options = {
    watchDir: '/path/to/docs',
    formats: ['txt', 'pdf', 'html', 'md'],
    embeddingApiKey: 'sk-test',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should process a file and save to MongoDB', async () => {
    const DocumentIndexService =
      require('@financial-ai/database/src/document-index').DocumentIndexService;
    const updater = new KnowledgeBaseUpdater(options);

    const result = await updater.processFile('/path/to/docs/test.txt', 'txt');

    // Verifica se o DocumentIndexService foi chamado com os parâmetros corretos
    expect(DocumentIndexService.saveProcessedDocument).toHaveBeenCalledTimes(1);
    expect(DocumentIndexService.saveProcessedDocument).toHaveBeenCalledWith(
      expect.objectContaining({
        filename: 'test.txt',
        filepath: '/path/to/docs/test.txt',
        format: 'txt',
        metrics: expect.any(Object),
        chunks: expect.arrayContaining([
          expect.objectContaining({ content: 'Chunk 1' }),
          expect.objectContaining({ content: 'Chunk 2' }),
          expect.objectContaining({ content: 'Chunk 3' }),
        ]),
        embeddings: expect.arrayContaining([
          expect.arrayContaining([0.1, 0.2, 0.3]),
          expect.arrayContaining([0.1, 0.2, 0.3]),
          expect.arrayContaining([0.1, 0.2, 0.3]),
        ]),
      })
    );

    // Verifica se o resultado contém os dados corretos
    expect(result).toEqual(
      expect.objectContaining({
        documentId: 'test-document-id',
        processingStatus: 'success',
        metrics: expect.objectContaining({
          coverage: expect.any(Number),
          chunkCount: expect.any(Number),
        }),
      })
    );
  });
});
