import 'dotenv/config';
import { mongoConnection } from '../src/connection';
import mongoose from 'mongoose';
import { OpenAIEmbeddingProvider } from '../../ai/src/rag/embedding-generator';

async function fixEmbeddings() {
  try {
    console.log('🔄 Conectando ao MongoDB...');
    await mongoConnection.connect();

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    const collection = db.collection('knowledgedocuments');
    const embeddingProvider = new OpenAIEmbeddingProvider(
      process.env.OPENAI_API_KEY!
    );

    const docs = await collection.find({}).toArray();
    console.log(`\n📊 Total de documentos: ${docs.length}\n`);

    for (const doc of docs) {
      try {
        console.log(`   Processando: "${doc.title}"`);

        // Gerar embedding
        const embedding = await embeddingProvider.getEmbedding(doc.content);
        console.log(`   Embedding gerado com ${embedding.length} dimensões`);

        // Atualizar diretamente no MongoDB
        const result = await collection.updateOne(
          { _id: doc._id },
          { $set: { embedding: embedding } }
        );

        console.log(`   ✅ Atualizado (${result.modifiedCount} documento)`);

        // Verificar se foi salvo
        const updated = await collection.findOne({ _id: doc._id });
        if (updated && updated.embedding) {
          console.log(
            `   ✓ Verificado: ${updated.embedding.length} dimensões\n`
          );
        } else {
          console.log(
            `   ⚠️  Aviso: Embedding não encontrado após atualização\n`
          );
        }
      } catch (error) {
        console.error(`   ❌ Erro ao processar "${doc.title}":`, error);
      }
    }

    console.log('\n✅ Processo concluído!');
    await mongoConnection.disconnect();
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  fixEmbeddings();
}
