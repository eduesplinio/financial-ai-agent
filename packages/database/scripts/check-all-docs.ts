import 'dotenv/config';
import { mongoConnection } from '../src/connection';
import mongoose from 'mongoose';

async function checkAllDocs() {
  try {
    console.log('🔄 Conectando ao MongoDB...');
    await mongoConnection.connect();

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    const collection = db.collection('knowledgedocuments');

    const allDocs = await collection.find({}).toArray();
    console.log(
      `\n📊 Total de documentos (incluindo deletados): ${allDocs.length}\n`
    );

    allDocs.forEach((doc, index) => {
      console.log(`${index + 1}. ${doc.title}`);
      console.log(`   Categoria: ${doc.category}`);
      console.log(`   Deletado: ${doc.deletedAt ? 'Sim' : 'Não'}`);
      console.log(`   Tem embedding: ${doc.embedding ? 'Sim' : 'Não'}`);
      if (doc.embedding) {
        console.log(`   Dimensões: ${doc.embedding.length}`);
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
  checkAllDocs();
}
