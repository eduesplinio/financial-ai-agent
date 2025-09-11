import mongoose, { Schema, Document, Model } from 'mongoose';
import { z } from 'zod';

// =============================================================================
// ZOD SCHEMAS PARA DOCUMENTOS FINANCEIROS PROCESSADOS
// =============================================================================

// Definindo QualityMetrics localmente para evitar dependências circulares
export const QualityMetricsSchema = z.object({
  coverage: z.number().min(0).max(1), // Proporção do texto indexado
  chunkCount: z.number().int().min(1), // Quantidade de chunks gerados
  avgChunkSize: z.number().min(1), // Tamanho médio dos chunks (caracteres)
  embeddingCompleteness: z.number().min(0).max(1), // % de chunks com embedding válido
  format: z.enum(['pdf', 'html', 'md', 'txt']),
  fileSize: z.number().int().min(0), // Tamanho do arquivo em bytes
  extractionSuccess: z.boolean(), // Se a extração do texto foi bem-sucedida
  errorMessage: z.string().optional(),
});

export type QualityMetrics = z.infer<typeof QualityMetricsSchema>;

// Schema Zod para chunks de documentos (após chunking)
export const DocumentChunkZodSchema = z.object({
  documentId: z.string(), // ID do documento original
  chunkIndex: z.number().int().min(0), // Índice do chunk no documento
  content: z.string(), // Conteúdo do chunk
  embedding: z.array(z.number()).optional(), // Embedding vetorial
  metadata: z.object({
    startChar: z.number().int().min(0).optional(),
    endChar: z.number().int().min(0).optional(),
    filename: z.string().optional(),
    format: z.enum(['pdf', 'html', 'md', 'txt']),
    title: z.string().optional(),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
  }),
});

// Schema para métricas de qualidade dos documentos
// Schema Zod para documento original (antes do chunking)
export const ProcessedDocumentZodSchema = z.object({
  filename: z.string(),
  filepath: z.string(),
  format: z.enum(['pdf', 'html', 'md', 'txt']),
  processingStatus: z
    .enum(['success', 'partial_success', 'failed'])
    .default('success'),
  metrics: QualityMetricsSchema,
  totalChunks: z.number().int().min(0),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  lastProcessedAt: z.date().default(() => new Date()),
});

// =============================================================================
// INTERFACES MONGOOSE
// =============================================================================

export interface IDocumentChunk extends Document {
  documentId: string;
  chunkIndex: number;
  content: string;
  embedding?: number[];
  metadata: {
    startChar?: number;
    endChar?: number;
    filename?: string;
    format: 'pdf' | 'html' | 'md' | 'txt';
    title?: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface IProcessedDocument extends Document {
  filename: string;
  filepath: string;
  format: 'pdf' | 'html' | 'md' | 'txt';
  processingStatus: 'success' | 'partial_success' | 'failed';
  metrics: QualityMetrics;
  totalChunks: number;
  createdAt: Date;
  updatedAt: Date;
  lastProcessedAt: Date;
}

// =============================================================================
// SCHEMAS MONGOOSE
// =============================================================================

// Schema Mongoose para chunks de documentos
const DocumentChunkMongooseSchema = new Schema<IDocumentChunk>(
  {
    documentId: {
      type: String,
      required: true,
      index: true,
    },
    chunkIndex: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    embedding: [Number], // Array de números para vetor de embedding
    metadata: {
      startChar: Number,
      endChar: Number,
      filename: String,
      format: {
        type: String,
        enum: ['pdf', 'html', 'md', 'txt'],
        required: true,
      },
      title: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
    collection: 'document_chunks',
  }
);

// Índice para busca vetorial
// Nota: Em produção, precisamos criar índice vetorial no Atlas diretamente
DocumentChunkMongooseSchema.index(
  { embedding: 1 },
  {
    name: 'vector_index',
    // MongoDB Atlas Vector Search precisa ser configurado via Atlas UI ou API
  }
);

// Índice composto para recuperar chunks de um documento específico em ordem
DocumentChunkMongooseSchema.index({ documentId: 1, chunkIndex: 1 });

const ProcessedDocumentMongooseSchema = new Schema<IProcessedDocument>(
  {
    filename: {
      type: String,
      required: true,
    },
    filepath: {
      type: String,
      required: true,
      unique: true,
    },
    format: {
      type: String,
      enum: ['pdf', 'html', 'md', 'txt'],
      required: true,
    },
    processingStatus: {
      type: String,
      enum: ['success', 'partial_success', 'failed'],
      default: 'success',
    },
    metrics: {
      coverage: Number,
      chunkCount: Number,
      avgChunkSize: Number,
      embeddingCompleteness: Number,
      format: String,
      fileSize: Number,
      extractionSuccess: Boolean,
      errorMessage: String,
    },
    totalChunks: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    lastProcessedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: 'processed_documents',
  }
);

// =============================================================================
// MODELOS MONGOOSE
// =============================================================================

export const DocumentChunk: Model<IDocumentChunk> =
  mongoose.models.DocumentChunk ||
  mongoose.model<IDocumentChunk>('DocumentChunk', DocumentChunkMongooseSchema);

export const ProcessedDocument: Model<IProcessedDocument> =
  mongoose.models.ProcessedDocument ||
  mongoose.model<IProcessedDocument>(
    'ProcessedDocument',
    ProcessedDocumentMongooseSchema
  );

// =============================================================================
// SERVIÇOS
// =============================================================================

export class DocumentIndexService {
  /**
   * Salva um documento processado com seus chunks e embeddings
   */
  static async saveProcessedDocument({
    filename,
    filepath,
    format,
    metrics,
    chunks,
    embeddings,
  }: {
    filename: string;
    filepath: string;
    format: 'pdf' | 'html' | 'md' | 'txt';
    metrics: QualityMetrics;
    chunks: { content: string }[];
    embeddings: (number[] | undefined)[];
  }): Promise<IProcessedDocument> {
    // 1. Criar ou atualizar o documento processado
    const processedDoc = await ProcessedDocument.findOneAndUpdate(
      { filepath },
      {
        filename,
        filepath,
        format,
        metrics,
        processingStatus: metrics.extractionSuccess ? 'success' : 'failed',
        totalChunks: chunks.length,
        lastProcessedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    // 2. Se a extração foi bem-sucedida, salvar os chunks
    if (metrics.extractionSuccess && chunks.length > 0) {
      // Remover chunks anteriores deste documento
      await DocumentChunk.deleteMany({ documentId: processedDoc._id });

      // Inserir novos chunks com embeddings
      const chunksToInsert = chunks.map((chunk, index) => ({
        documentId: processedDoc._id,
        chunkIndex: index,
        content: chunk.content,
        embedding: embeddings[index],
        metadata: {
          filename,
          format,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      }));

      if (chunksToInsert.length > 0) {
        await DocumentChunk.insertMany(chunksToInsert);
      }
    }

    return processedDoc;
  }

  /**
   * Busca chunks por similaridade semântica
   */
  static async searchChunks(
    query: string,
    embedding: number[],
    limit: number = 5
  ): Promise<IDocumentChunk[]> {
    return DocumentChunk.aggregate([
      {
        $vectorSearch: {
          queryVector: embedding,
          path: 'embedding',
          numCandidates: limit * 10,
          limit: limit,
          index: 'vector_index',
        },
      },
      {
        $project: {
          _id: 1,
          documentId: 1,
          chunkIndex: 1,
          content: 1,
          metadata: 1,
          score: { $meta: 'vectorSearchScore' },
        },
      },
    ]);
  }
}
