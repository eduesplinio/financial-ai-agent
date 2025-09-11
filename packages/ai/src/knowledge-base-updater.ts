import fs from 'fs';
import path from 'path';
import { extractText } from './document-format-processor';
import { chunkFinancialDocument } from './chunking';
import { OpenAIEmbeddingProvider } from './embedding-generator';
import { calculateQualityMetrics, QualityMetrics } from './quality-metrics';

// Mock local temporário do DocumentIndexService
// Este será substituído pelo import real quando @financial-ai/database estiver configurado corretamente
const DocumentIndexService = {
  saveProcessedDocument: async (document: any) => {
    console.log('Salvando documento no MongoDB:', document.filename);
    return {
      _id: 'temp-document-id',
      filename: document.filename,
      filepath: document.filepath,
      format: document.format,
      processingStatus: 'success',
      metrics: document.metrics,
      totalChunks: document.chunks?.length || 0,
    };
  },
};

export interface KnowledgeBaseUpdaterOptions {
  watchDir: string;
  formats: ('pdf' | 'html' | 'md' | 'txt')[];
  embeddingApiKey: string;
}

export interface ProcessingResult {
  documentId?: string;
  chunks: { content: string }[];
  embeddings: (number[] | undefined)[];
  metrics: QualityMetrics;
  processingStatus: 'success' | 'partial_success' | 'failed';
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

  async processFile(
    filePath: string,
    format: string
  ): Promise<ProcessingResult> {
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

    // Salvar no MongoDB usando DocumentIndexService
    try {
      const filename = path.basename(filePath);
      const savedDoc = await DocumentIndexService.saveProcessedDocument({
        filename,
        filepath: filePath,
        format: format as any,
        metrics,
        chunks,
        embeddings,
      });

      return {
        documentId: savedDoc._id.toString(),
        chunks,
        embeddings,
        metrics,
        processingStatus: savedDoc.processingStatus as
          | 'success'
          | 'partial_success'
          | 'failed',
      };
    } catch (err: any) {
      console.error('Erro ao salvar documento no MongoDB:', err);
      return {
        chunks,
        embeddings,
        metrics,
        processingStatus: 'failed',
      };
    }
  }

  watch() {
    fs.watch(this.options.watchDir, async (eventType, filename) => {
      if (!filename) return;
      const ext = path.extname(filename).replace('.', '');
      if (!this.options.formats.includes(ext as any)) return;
      const filePath = path.join(this.options.watchDir, filename);

      console.log(
        `[${new Date().toISOString()}] Arquivo detectado: ${filename}`
      );

      try {
        const result = await this.processFile(filePath, ext);
        console.log(
          `[${new Date().toISOString()}] Processado ${filename}: ${result.processingStatus}`
        );
        console.log(
          `Chunks: ${result.chunks.length}, Qualidade: ${Math.round(result.metrics.coverage * 100)}% cobertura`
        );
      } catch (error) {
        console.error(
          `[${new Date().toISOString()}] Erro ao processar ${filename}:`,
          error
        );
      }
    });

    console.log(
      `[${new Date().toISOString()}] Observando diretório: ${this.options.watchDir}`
    );
    console.log(`Formatos monitorados: ${this.options.formats.join(', ')}`);
  }
}

// Exemplo de uso:
// const updater = new KnowledgeBaseUpdater({ watchDir: './docs', formats: ['pdf','md','html','txt'], embeddingApiKey: process.env.OPENAI_API_KEY! });
// updater.watch();
