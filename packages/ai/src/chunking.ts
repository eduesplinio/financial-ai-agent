/**
 * Chunking inteligente para documentos financeiros
 * - Divide documentos em partes semânticas relevantes para indexação e embeddings
 * - Suporte para diferentes formatos e heurísticas financeiras
 */

export interface DocumentChunk {
  id: string;
  content: string;
  startIndex: number;
  endIndex: number;
  metadata?: Record<string, any>;
}

/**
 * Estratégia básica: divide por parágrafo, mas pode ser expandida para seções, tabelas, tópicos, etc.
 * TODO: Adicionar heurísticas financeiras e suporte a formatos (PDF, HTML, MD)
 */
export function chunkFinancialDocument(
  text: string,
  options?: { minLength?: number; maxLength?: number }
): DocumentChunk[] {
  const minLength = options?.minLength ?? 200;
  const maxLength = options?.maxLength ?? 1200;
  const paragraphs = text
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean);

  const chunks: DocumentChunk[] = [];
  let chunkId = 0;
  let buffer = '';
  let startIdx = 0;

  for (const para of paragraphs) {
    if (buffer.length + para.length < maxLength) {
      buffer += (buffer ? '\n\n' : '') + para;
    } else {
      if (buffer.length >= minLength) {
        chunks.push({
          id: `chunk_${chunkId++}`,
          content: buffer,
          startIndex: startIdx,
          endIndex: startIdx + buffer.length,
        });
        startIdx += buffer.length;
        buffer = para;
      } else {
        buffer += (buffer ? '\n\n' : '') + para;
      }
    }
  }
  if (buffer.length >= minLength) {
    chunks.push({
      id: `chunk_${chunkId++}`,
      content: buffer,
      startIndex: startIdx,
      endIndex: startIdx + buffer.length,
    });
  }
  return chunks;
}

// Futuro: Adicionar chunking para tabelas, listas, seções financeiras, etc.
