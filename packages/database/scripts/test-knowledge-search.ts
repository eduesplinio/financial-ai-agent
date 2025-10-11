import 'dotenv/config';
import { mongoConnection } from '../src/connection';
import { VectorSearchService } from '../src/vector-search';
import { OpenAIEmbeddingProvider } from '../../ai/src/rag/embedding-generator';

async function testKnowledgeSearch() {
  try {
    console.log('🔄 Conectando ao MongoDB...');
    await mongoConnection.connect();

    const embeddingProvider = new OpenAIEmbeddingProvider(
      process.env.OPENAI_API_KEY!
    );

    const queries = [
      'Como posso investir melhor meu dinheiro?',
      'O que é Tesouro Direto?',
      'Como criar uma reserva de emergência?',
      'Quais são os melhores investimentos?',
    ];

    for (const query of queries) {
      console.log(`\n🔍 Buscando: "${query}"`);

      const queryEmbedding = await embeddingProvider.getEmbedding(query);

      const results = await VectorSearchService.semanticSearch({
        queryVector: queryEmbedding,
        numCandidates: 100,
        limit: 5,
      });

      console.log(`   Encontrados: ${results.length} documentos`);

      results.forEach((result, index) => {
        console.log(`   ${index + 1}. ${result.document.title}`);
        console.log(`      Score: ${result.score.toFixed(4)}`);
        console.log(`      Categoria: ${result.document.category}`);
      });
    }

    await mongoConnection.disconnect();
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  testKnowledgeSearch();
}
