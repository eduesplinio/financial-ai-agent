#!/usr/bin/env tsx

import 'dotenv/config';
import { mongoConnection } from '../packages/database/src/connection';

async function testRAGSimple() {
  console.log('🧪 Testando configuração RAG simples...\n');

  try {
    // 1. Connect to MongoDB
    console.log('📡 Conectando ao MongoDB Atlas...');
    await mongoConnection.connect();
    console.log('✅ Conectado ao MongoDB Atlas\n');

    // 2. Test VectorSearchService import
    console.log('🔍 Testando import do VectorSearchService...');
    const { VectorSearchService } = await import(
      '../packages/database/src/vector-search'
    );
    console.log('✅ VectorSearchService importado com sucesso\n');

    // 3. Test KnowledgeDocumentService import
    console.log('📚 Testando import do KnowledgeDocumentService...');
    const { KnowledgeDocumentService } = await import(
      '../packages/database/src/models'
    );
    console.log('✅ KnowledgeDocumentService importado com sucesso\n');

    // 4. Check if we have documents
    console.log('📊 Verificando documentos na base...');
    const stats = await KnowledgeDocumentService.findAll(1, 10);
    console.log(`📈 Total de documentos na base: ${stats.total}`);

    if (stats.total > 0) {
      console.log('✅ Base de conhecimento já populada!');
      console.log('📝 Primeiros documentos:');
      stats.documents.slice(0, 3).forEach((doc, i) => {
        console.log(`   ${i + 1}. ${doc.title} (${doc.category})`);
      });
    } else {
      console.log(
        '⚠️  Base de conhecimento vazia. Execute: pnpm -w run setup:rag'
      );
    }

    console.log('\n🎉 Teste RAG concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro no teste RAG:', error);
    process.exit(1);
  } finally {
    await mongoConnection.disconnect();
  }
}

if (require.main === module) {
  testRAGSimple().catch(console.error);
}

export { testRAGSimple };
