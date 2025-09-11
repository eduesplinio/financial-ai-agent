import path from 'path';
import fs from 'fs';
import { calculateQualityMetrics } from '../quality-metrics';
import { chunkFinancialDocument } from '../chunking';

async function testDocumentIndexing() {
  try {
    // Simular processamento sem dependências externas
    console.log('Testando pipeline de indexação (sem MongoDB/OpenAI)');

    // Caminho para o documento de teste
    const docPath =
      '/Users/eduesplinio/Documents/financial-ai-agent/docs/mercado-financeiro.md';
    console.log(`Procurando arquivo em: ${docPath}`);

    if (!fs.existsSync(docPath)) {
      console.error(`Arquivo não encontrado: ${docPath}`);
      process.exit(1);
    }

    console.log(`Processando documento: ${docPath}`);

    // Ler o conteúdo do arquivo
    const text = fs.readFileSync(docPath, 'utf8');
    console.log(`Arquivo lido: ${text.length} caracteres`);

    // Chunking
    const chunks = chunkFinancialDocument(text);
    console.log(`Chunks gerados: ${chunks.length}`);
    chunks.forEach((chunk, i) => {
      console.log(`Chunk ${i + 1}: ${chunk.content.length} caracteres`);
    });

    // Simular embeddings
    const mockEmbeddings = chunks.map(() => Array(5).fill(0.1));

    // Calcular métricas de qualidade
    const metrics = calculateQualityMetrics({
      text,
      chunks,
      embeddings: mockEmbeddings,
      format: 'md',
      fileSize: fs.statSync(docPath).size,
      extractionSuccess: true,
      errorMessage: '',
    });

    console.log('Métricas de qualidade:');
    console.log(JSON.stringify(metrics, null, 2));

    console.log('Teste concluído com sucesso!');
  } catch (err) {
    console.error('Erro durante o teste:', err);
    process.exit(1);
  }
}

// Executar o teste
testDocumentIndexing();
