// Script para testar a conexão com MongoDB Atlas
require('dotenv').config({ path: './packages/database/.env.test' });
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('Tentando conectar ao MongoDB Atlas...');
    console.log(
      'MONGODB_URI:',
      process.env.MONGODB_URI ? 'Definida' : 'Não definida'
    );

    if (!process.env.MONGODB_URI) {
      throw new Error(
        'MONGODB_URI não está definida. Configure uma string de conexão do MongoDB Atlas.'
      );
    }

    // Mostrar apenas o host do URI (para segurança)
    const uri = process.env.MONGODB_URI;
    const host = uri.match(/@([^\/]+)/)?.[1] || 'não identificado';
    console.log('Host do MongoDB:', host);

    // Opções para conexão com MongoDB Atlas
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    };

    await mongoose.connect(process.env.MONGODB_URI, options);
    console.log('Conexão com MongoDB Atlas bem sucedida!');

    // Fazer ping para testar a conexão
    const adminDb = mongoose.connection.db.admin();
    const result = await adminDb.ping();
    console.log('Ping ao banco de dados:', result);

    // Verificar as coleções disponíveis
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      'Coleções disponíveis:',
      collections.map(c => c.name)
    );

    await mongoose.disconnect();
    console.log('Desconexão concluída.');
  } catch (error) {
    console.error('Erro ao conectar com MongoDB Atlas:', error);
  }
}

testConnection();
