const { MongoClient } = require('mongodb');
require('dotenv').config();

async function testRAGStatus() {
  console.log('🧪 Testando status da base de conhecimento RAG...\n');

  try {
    // Connect to MongoDB
    console.log('📡 Conectando ao MongoDB Atlas...');
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('✅ Conectado ao MongoDB Atlas\n');

    // Check knowledge documents
    console.log('📚 Verificando documentos de conhecimento...');
    const db = client.db();
    const collection = db.collection('knowledgedocuments');

    const totalDocs = await collection.countDocuments();
    const docsWithEmbeddings = await collection.countDocuments({
      embedding: { $exists: true, $ne: null },
    });

    console.log(`📊 Estatísticas da base de conhecimento:`);
    console.log(`   - Total de documentos: ${totalDocs}`);
    console.log(`   - Documentos com embeddings: ${docsWithEmbeddings}`);
    console.log(
      `   - Cobertura de embeddings: ${totalDocs > 0 ? ((docsWithEmbeddings / totalDocs) * 100).toFixed(1) : 0}%\n`
    );

    if (totalDocs > 0) {
      console.log('📝 Primeiros documentos:');
      const sampleDocs = await collection.find({}).limit(3).toArray();
      sampleDocs.forEach((doc, i) => {
        console.log(`   ${i + 1}. ${doc.title} (${doc.category})`);
        console.log(`      - Embedding: ${doc.embedding ? '✅' : '❌'}`);
        console.log(`      - Palavras: ${doc.metadata?.wordCount || 'N/A'}`);
      });
    } else {
      console.log('⚠️  Base de conhecimento vazia!');
      console.log('💡 Execute: pnpm -w run setup:rag');
    }

    console.log('\n🎉 Teste concluído!');
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  } finally {
    await client.close();
  }
}

testRAGStatus().catch(console.error);
