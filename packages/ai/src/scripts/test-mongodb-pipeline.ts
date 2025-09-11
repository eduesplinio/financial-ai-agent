import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import { KnowledgeBaseUpdater } from '../knowledge-base-updater';
// Importação removida pois já está sendo usada internamente no KnowledgeBaseUpdater

// Carrega variáveis de ambiente
dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/financial_ai';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error(
    'ERRO: OPENAI_API_KEY não está definida nas variáveis de ambiente'
  );
  process.exit(1);
}

async function runTest() {
  try {
    // Conectar ao MongoDB
    console.log(`Conectando ao MongoDB: ${MONGODB_URI}`);
    await mongoose.connect(MONGODB_URI);
    console.log('Conexão com MongoDB estabelecida');

    // Caminho para o documento de teste
    const docPath = path.join(
      process.cwd(),
      '..',
      '..',
      'docs',
      'mercado-financeiro.md'
    );

    if (!fs.existsSync(docPath)) {
      console.error(`Arquivo não encontrado: ${docPath}`);
      process.exit(1);
    }

    console.log(`Processando documento: ${docPath}`);

    // Inicializar o atualizador da base de conhecimento
    const updater = new KnowledgeBaseUpdater({
      watchDir: path.dirname(docPath),
      formats: ['md', 'txt', 'pdf', 'html'],
      embeddingApiKey: OPENAI_API_KEY!,
    });

    // Processar documento
    const result = await updater.processFile(docPath, 'md');

    console.log('Resultado do processamento:', {
      documentId: result.documentId,
      chunks: result.chunks.length,
      embeddings: result.embeddings.length,
      metrics: result.metrics,
      status: result.processingStatus,
    });

    // Desconectar do MongoDB
    await mongoose.disconnect();
    console.log('Teste concluído com sucesso!');
  } catch (err) {
    console.error('Erro durante o teste:', err);
    process.exit(1);
  }
}

// Executar o teste
runTest();
