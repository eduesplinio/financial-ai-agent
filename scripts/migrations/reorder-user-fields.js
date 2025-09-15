// Script para reordenar os campos do documento de usuário
// Garantindo que o campo profile apareça acima de preferences

import { MongoClient } from 'mongodb';
import 'dotenv/config';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI não definida. Configure-a em .env.local');
  process.exit(1);
}

async function reorderUserFields() {
  console.log('Iniciando reordenação de campos do documento de usuário...');

  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    console.log('Conectado ao MongoDB');

    const db = client.db();
    const users = db.collection('users');

    // Buscar todos os usuários
    const allUsers = await users.find({}).toArray();
    console.log(`Encontrados ${allUsers.length} usuários para processar`);

    let updatedCount = 0;

    for (const user of allUsers) {
      console.log(`\nProcessando usuário: ${user.email} (${user._id})`);

      // Criar um novo objeto com os campos na ordem desejada
      const orderedUser = {
        _id: user._id,
        email: user.email,
        name: user.name,
      };

      // Adicionar o campo profile se existir
      if (user.profile) {
        orderedUser.profile = user.profile;
      }

      // Adicionar o campo preferences se existir
      if (user.preferences) {
        orderedUser.preferences = user.preferences;
      }

      // Adicionar todos os outros campos na ordem original
      for (const [key, value] of Object.entries(user)) {
        if (!['_id', 'email', 'name', 'profile', 'preferences'].includes(key)) {
          orderedUser[key] = value;
        }
      }

      // Substituir o documento pelo novo ordenado
      const result = await users.replaceOne({ _id: user._id }, orderedUser);

      if (result.modifiedCount > 0) {
        console.log(`✅ Documento reordenado para ${user.email}`);
        updatedCount++;
      } else {
        console.log(`⚠️ Documento não foi modificado para ${user.email}`);
      }
    }

    console.log(
      `\n${updatedCount} de ${allUsers.length} documentos reordenados com sucesso`
    );
  } catch (error) {
    console.error('Erro durante a operação:', error);
  } finally {
    await client.close();
    console.log('Conexão com MongoDB fechada');
  }
}

// Executar a função
reorderUserFields()
  .then(() => console.log('Operação concluída'))
  .catch(error => console.error('Erro:', error));
