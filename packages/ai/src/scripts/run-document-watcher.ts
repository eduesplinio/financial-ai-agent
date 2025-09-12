import { KnowledgeBaseUpdater } from '../rag/knowledge-base-updater';
import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';

// Carrega variáveis de ambiente
dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/financial_ai';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const DOCS_DIR = process.env.DOCS_DIR || path.join(process.cwd(), 'docs');

if (!OPENAI_API_KEY) {
  console.error(
    'ERRO: OPENAI_API_KEY não está definida nas variáveis de ambiente'
  );
  process.exit(1);
}

async function main() {
  try {
    // Conectar ao MongoDB
    console.log(`Conectando ao MongoDB: ${MONGODB_URI}`);
    await mongoose.connect(MONGODB_URI);
    console.log('Conexão com MongoDB estabelecida');

    // Inicializar o atualizador da base de conhecimento
    const updater = new KnowledgeBaseUpdater({
      watchDir: DOCS_DIR,
      formats: ['pdf', 'html', 'md', 'txt'],
      embeddingApiKey: OPENAI_API_KEY!,
    });

    // Iniciar observação do diretório
    updater.watch();
    console.log(`Monitorando diretório: ${DOCS_DIR}`);
    console.log('Pressione Ctrl+C para encerrar');
  } catch (err) {
    console.error('Erro:', err);
    process.exit(1);
  }
}

// Executar o programa
main();
