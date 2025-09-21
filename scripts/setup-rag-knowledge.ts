#!/usr/bin/env tsx

import 'dotenv/config';
import { populateKnowledgeWithRealEmbeddings } from '../packages/ai/src/scripts/populate-knowledge-with-embeddings';
import { mongoConnection } from '../packages/database/src/connection';

async function setupRAGKnowledge() {
  console.log('🚀 Configurando base de conhecimento RAG...\n');

  try {
    // 1. Connect to MongoDB
    console.log('📡 Conectando ao MongoDB Atlas...');
    await mongoConnection.connect();
    console.log('✅ Conectado ao MongoDB Atlas\n');

    // 2. Create vector search index
    console.log('🔍 Criando índice de busca vetorial...');
    const { VectorSearchService } = await import(
      '../packages/database/src/vector-search'
    );
    await VectorSearchService.createVectorSearchIndex();
    console.log('✅ Índice de busca vetorial criado\n');

    // 3. Populate knowledge documents with real embeddings
    console.log('📚 Populando documentos de conhecimento...');
    await populateKnowledgeWithRealEmbeddings();
    console.log('✅ Documentos de conhecimento populados\n');

    // 4. Verify setup
    console.log('🔍 Verificando configuração...');
    const stats = await VectorSearchService.getVectorSearchStats();
    console.log('📊 Estatísticas da base de conhecimento:');
    console.log(`   - Total de documentos: ${stats.totalDocuments}`);
    console.log(
      `   - Documentos com embeddings: ${stats.documentsWithEmbeddings}`
    );
    console.log(
      `   - Dimensões médias dos embeddings: ${stats.averageEmbeddingDimensions}`
    );
    console.log(
      `   - Categorias disponíveis: ${Object.keys(stats.categoriesCount).join(', ')}`
    );
    console.log(
      `   - Idiomas disponíveis: ${Object.keys(stats.languagesCount).join(', ')}\n`
    );

    console.log('🎉 Configuração RAG concluída com sucesso!');
    console.log(
      '💡 O chat agora pode usar busca semântica para respostas especializadas.'
    );
  } catch (error) {
    console.error('❌ Erro na configuração RAG:', error);
    process.exit(1);
  } finally {
    await mongoConnection.disconnect();
  }
}

if (require.main === module) {
  setupRAGKnowledge().catch(console.error);
}

export { setupRAGKnowledge };
