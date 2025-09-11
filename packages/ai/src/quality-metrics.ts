import { z } from 'zod';

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

export function calculateQualityMetrics({
  text,
  chunks,
  embeddings,
  format,
  fileSize,
  extractionSuccess,
  errorMessage,
}: {
  text: string;
  chunks: { content: string }[];
  embeddings: (number[] | undefined)[];
  format: 'pdf' | 'html' | 'md' | 'txt';
  fileSize: number;
  extractionSuccess: boolean;
  errorMessage?: string;
}): QualityMetrics {
  const totalTextLength = text.length;
  const totalChunkLength = chunks.reduce((acc, c) => acc + c.content.length, 0);
  const coverage =
    totalTextLength > 0 ? Math.min(totalChunkLength / totalTextLength, 1) : 0;
  const chunkCount = chunks.length;
  const avgChunkSize = chunkCount > 0 ? totalChunkLength / chunkCount : 0;
  const embeddingCompleteness =
    chunkCount > 0
      ? embeddings.filter(e => Array.isArray(e)).length / chunkCount
      : 0;
  return {
    coverage,
    chunkCount,
    avgChunkSize,
    embeddingCompleteness,
    format,
    fileSize,
    extractionSuccess,
    errorMessage,
  };
}
