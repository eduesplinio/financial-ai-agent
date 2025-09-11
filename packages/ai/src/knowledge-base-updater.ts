import fs from 'fs';
import path from 'path';
import { extractText } from './document-format-processor';
import { chunkFinancialDocument } from './chunking';
import { OpenAIEmbeddingProvider } from './embedding-generator';
import { calculateQualityMetrics, QualityMetrics } from './quality-metrics';

export interface KnowledgeBaseUpdaterOptions {
  watchDir: string;
  formats: ('pdf' | 'html' | 'md' | 'txt')[];
  embeddingApiKey: string;
}

export class KnowledgeBaseUpdater {
  private options: KnowledgeBaseUpdaterOptions;
  private embeddingProvider: OpenAIEmbeddingProvider;

  constructor(options: KnowledgeBaseUpdaterOptions) {
    this.options = options;
    this.embeddingProvider = new OpenAIEmbeddingProvider(
      options.embeddingApiKey
    );
  }

  async processFile(filePath: string, format: string) {
    let extractionSuccess = true;
    let errorMessage: string | undefined = undefined;
    let text = '';
    try {
      text = await extractText(filePath, format as any);
    } catch (err: any) {
      extractionSuccess = false;
      errorMessage = err?.message || String(err);
    }
    const chunks = extractionSuccess ? chunkFinancialDocument(text) : [];
    const embeddings = extractionSuccess
      ? await Promise.all(
          chunks.map(async chunk => {
            try {
              return await this.embeddingProvider.getEmbedding(chunk.content);
            } catch {
              return undefined;
            }
          })
        )
      : [];
    const fileSize = fs.existsSync(filePath) ? fs.statSync(filePath).size : 0;
    const metrics: QualityMetrics = calculateQualityMetrics({
      text,
      chunks,
      embeddings,
      format: format as any,
      fileSize,
      extractionSuccess,
      errorMessage: errorMessage ?? '',
    });
    // TODO: Salvar chunks, embeddings e metrics na base de conhecimento (MongoDB)
    return { chunks, embeddings, metrics };
  }

  watch() {
    fs.watch(this.options.watchDir, async (eventType, filename) => {
      if (!filename) return;
      const ext = path.extname(filename).replace('.', '');
      if (!this.options.formats.includes(ext as any)) return;
      const filePath = path.join(this.options.watchDir, filename);
      await this.processFile(filePath, ext);
      // TODO: Atualizar/inserir no MongoDB
    });
  }
}

// Exemplo de uso:
// const updater = new KnowledgeBaseUpdater({ watchDir: './docs', formats: ['pdf','md','html','txt'], embeddingApiKey: process.env.OPENAI_API_KEY! });
// updater.watch();
