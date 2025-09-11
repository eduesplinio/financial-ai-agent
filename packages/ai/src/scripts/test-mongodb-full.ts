import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import { KnowledgeBaseUpdater } from '../knowledge-base-updater';

// Carrega variáveis de ambiente
dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/financial_ai';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function runTest() {
  try {
    // Verificar API key
    if (!OPENAI_API_KEY) {
      console.error(
        'ERRO: OPENAI_API_KEY não está definida nas variáveis de ambiente'
      );
      process.exit(1);
    }

    // Conectar ao MongoDB
    console.log(`Conectando ao MongoDB: ${MONGODB_URI}`);
    await mongoose.connect(MONGODB_URI);
    console.log('Conexão com MongoDB estabelecida');

    // Caminho para o documento de teste
    const docPath =
      '/Users/eduesplinio/Documents/financial-ai-agent/docs/mercado-financeiro.md';

    if (!fs.existsSync(docPath)) {
      console.error(`Arquivo não encontrado: ${docPath}`);
      process.exit(1);
    }
    console.log(`Arquivo encontrado: ${docPath}`);

    console.log(`Processando documento: ${docPath}`);

    // Inicializar o atualizador da base de conhecimento
    const updater = new KnowledgeBaseUpdater({
      watchDir: path.dirname(docPath),
      formats: ['md', 'txt', 'pdf', 'html'],
      embeddingApiKey: OPENAI_API_KEY,
    });

    // Processar documento
    console.log('Iniciando processamento com OpenAI e MongoDB...');
    const result = await updater.processFile(docPath, 'md');

    console.log('Resultado do processamento:');
    console.log('- DocumentID:', result.documentId);
    console.log('- Status:', result.processingStatus);
    console.log('- Chunks:', result.chunks.length);
    console.log(
      '- Embeddings:',
      result.embeddings.filter(e => e !== undefined).length
    );
    console.log('- Métricas de qualidade:');
    console.log(JSON.stringify(result.metrics, null, 2));

    // Desconectar do MongoDB
    await mongoose.disconnect();
    console.log('Teste concluído com sucesso!');
  } catch (err) {
    console.error('Erro durante o teste:', err);
    try {
      await mongoose.disconnect();
    } catch (e) {
      // Ignorar erro de desconexão
    }
    process.exit(1);
  }
}

// Executar o teste
runTest();
