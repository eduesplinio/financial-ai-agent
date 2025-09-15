// Script para forçar a renomeação do campo perfil para profile em todos os usuários
// Para garantir que a estrutura do documento seja padronizada

import { MongoClient } from 'mongodb';
import 'dotenv/config';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI não definida. Configure-a em .env.local');
  process.exit(1);
}

async function forceRenamePerfilToProfile() {
  console.log('Iniciando renomeação forçada do campo perfil para profile...');

  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    console.log('Conectado ao MongoDB');

    const db = client.db();
    const users = db.collection('users');

    // Buscar todos os usuários com o campo perfil
    const usersWithPerfil = await users
      .find({ perfil: { $exists: true } })
      .toArray();
    console.log(
      `Encontrados ${usersWithPerfil.length} usuários com campo perfil para atualizar`
    );

    if (usersWithPerfil.length === 0) {
      console.log(
        'Nenhum usuário com campo perfil encontrado. Verificando possíveis problemas...'
      );

      // Verificar se existem documentos sem o campo profile
      const usersWithoutProfile = await users
        .find({ profile: { $exists: false } })
        .toArray();
      console.log(
        `Existem ${usersWithoutProfile.length} usuários sem o campo profile`
      );

      if (usersWithoutProfile.length > 0) {
        console.log('Exemplo de documento sem profile:');
        console.log(JSON.stringify(usersWithoutProfile[0], null, 2));
      }

      return;
    }

    // Atualização para cada usuário
    let successCount = 0;

    for (const user of usersWithPerfil) {
      console.log(`\nProcessando usuário: ${user.email}`);

      // Extrair o valor de perfil
      const perfilData = user.perfil;

      if (!perfilData) {
        console.log('- Campo perfil existe mas está vazio, pulando');
        continue;
      }

      // Atualizar o documento
      const result = await users.updateOne(
        { _id: user._id },
        {
          $set: { profile: perfilData, updatedAt: new Date() },
          $unset: { perfil: '' },
        }
      );

      if (result.modifiedCount > 0) {
        console.log(`✅ Usuário ${user.email} atualizado com sucesso`);
        successCount++;
      } else {
        console.log(`⚠️ Não foi possível atualizar o usuário ${user.email}`);
      }
    }

    console.log(
      `\n${successCount} de ${usersWithPerfil.length} usuários atualizados com sucesso`
    );
  } catch (error) {
    console.error('Erro durante a operação:', error);
  } finally {
    await client.close();
    console.log('Conexão com MongoDB fechada');
  }
}

// Executar a função
forceRenamePerfilToProfile()
  .then(() => console.log('Operação concluída'))
  .catch(error => console.error('Erro:', error));
