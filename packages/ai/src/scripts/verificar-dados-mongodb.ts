import dotenv from 'dotenv';
import mongoose from 'mongoose';
// Importando diretamente do caminho relativo para evitar problemas de resolução de módulo
// Na produção, isto deve ser importado corretamente via packages
import path from 'path';
import {
  DocumentChunk,
  ProcessedDocument,
} from '../../../database/src/document-index';

// Carrega variáveis de ambiente
dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/financial_ai';

async function verificarDados() {
  try {
    // Conectar ao MongoDB
    console.log(`Conectando ao MongoDB: ${MONGODB_URI}`);
    await mongoose.connect(MONGODB_URI);
    console.log('Conexão com MongoDB estabelecida');

    // Verificar documentos processados
    const documentos = await ProcessedDocument.find({})
      .sort({ createdAt: -1 })
      .limit(5);
    console.log(`\n=== Documentos Processados (${documentos.length}) ===`);
    documentos.forEach(doc => {
      console.log(`- ID: ${doc._id}`);
      console.log(`  Arquivo: ${doc.filename}`);
      console.log(`  Status: ${doc.processingStatus}`);
      console.log(`  Formato: ${doc.format}`);
      console.log(`  Total Chunks: ${doc.totalChunks}`);
      console.log(`  Cobertura: ${doc.metrics.coverage * 100}%`);
      console.log(`  Criado em: ${doc.createdAt}`);
      console.log(`  -----------------------------`);
    });

    // Verificar chunks
    const chunks = await DocumentChunk.find({})
      .sort({ createdAt: -1 })
      .limit(5);
    console.log(`\n=== Chunks de Documentos (${chunks.length}) ===`);
    chunks.forEach(chunk => {
      console.log(`- ID: ${chunk._id}`);
      console.log(`  Doc ID: ${chunk.documentId}`);
      console.log(`  Índice: ${chunk.chunkIndex}`);
      console.log(`  Formato: ${chunk.metadata.format}`);
      console.log(`  Tamanho Conteúdo: ${chunk.content.length} caracteres`);
      console.log(
        `  Tamanho Embedding: ${chunk.embedding ? chunk.embedding.length : 0} dimensões`
      );
      // createdAt pode não estar disponível diretamente devido ao tipo
      console.log(`  -----------------------------`);
    });

    // Desconectar do MongoDB
    await mongoose.disconnect();
    console.log('\nVerificação concluída com sucesso!');
  } catch (err) {
    console.error('Erro durante a verificação:', err);
    try {
      await mongoose.disconnect();
    } catch (e) {
      // Ignorar erro de desconexão
    }
    process.exit(1);
  }
}

// Executar a verificação
verificarDados();
