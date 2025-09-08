// Jest test cleanup helper
const mongoose = require('mongoose');
const { mongoConnection } = require('../connection');

/**
 * Limpa todas as coleções do banco de dados de teste
 */
async function cleanupTestDatabase() {
  try {
    // Conectar ao banco de dados se ainda não estiver conectado
    if (!mongoConnection.isConnected()) {
      await mongoConnection.connect();
    }

    // Pegar todas as coleções
    const collections = mongoose.connection.collections;

    // Para cada coleção, excluir todos os documentos
    const deletePromises = [];
    for (const key in collections) {
      const collection = collections[key];
      deletePromises.push(collection.deleteMany({}));
    }

    // Aguardar todas as operações de exclusão
    await Promise.allSettled(deletePromises);
    console.log('✅ Banco de dados de teste limpo com sucesso');
  } catch (error) {
    console.error('❌ Erro ao limpar o banco de dados de teste:', error);
  }
}

module.exports = {
  cleanupTestDatabase,
};
