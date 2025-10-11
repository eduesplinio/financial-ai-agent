import 'dotenv/config';
import { mongoConnection } from '../src/connection';
import { KnowledgeDocument } from '../src/models';

async function verifyEmbeddings() {
  try {
    console.log('🔄 Conectando ao MongoDB...');
    await mongoConnection.connect();

    const docs = await KnowledgeDocument.find({});

    console.log(`\n📊 Total de documentos: ${docs.length}\n`);

    docs.forEach((doc, index) => {
      console.log(`${index + 1}. ${doc.title}`);
      console.log(`   Categoria: ${doc.category}`);
      console.log(`   Tem embedding: ${doc.embedding ? 'Sim' : 'Não'}`);
      if (doc.embedding) {
        console.log(`   Dimensões: ${doc.embedding.length}`);
        console.log(
          `   Primeiros valores: [${doc.embedding
            .slice(0, 3)
            .map(v => v.toFixed(6))
            .join(', ')}...]`
        );
      }
      console.log('');
    });

    await mongoConnection.disconnect();
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  verifyEmbeddings();
}
