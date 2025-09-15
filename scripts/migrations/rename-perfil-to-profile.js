// Script para renomear o campo perfil para profile e ajustar a ordem dos campos
// Para que profile venha antes de preferences no documento

import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI não definida. Configure-a em .env.local');
  process.exit(1);
}

async function renameAndReorderFields() {
  console.log('Iniciando renomeação de campo perfil para profile...');

  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    console.log('Conectado ao MongoDB');

    const db = client.db();
    const users = db.collection('users');

    // Buscar todos os usuários com o campo perfil
    const usersWithPerfilField = await users
      .find({ perfil: { $exists: true } })
      .toArray();
    console.log(
      `Encontrados ${usersWithPerfilField.length} usuários com campo perfil para atualizar`
    );

    let updatedCount = 0;
    let skippedCount = 0;

    for (const user of usersWithPerfilField) {
      console.log(`\nProcessando usuário: ${user.email} (${user._id})`);

      // Extrair dados atuais
      const perfilData = user.perfil;

      if (!perfilData) {
        console.log('⚠️ Campo perfil existe mas está vazio, pulando usuário');
        skippedCount++;
        continue;
      }

      // Primeiro passo: remover o campo perfil
      await users.updateOne({ _id: user._id }, { $unset: { perfil: '' } });

      // Segundo passo: recriar o documento com os campos na ordem correta
      // Isso garante que profile venha antes de preferences
      const orderedFields = {
        _id: user._id,
        email: user.email,
        name: user.name,
        profile: perfilData, // Adicionando como profile em vez de perfil
      };

      // Adicionar o restante dos campos
      const userFields = Object.keys(user);
      for (const field of userFields) {
        // Pular campos que já adicionamos ou que não queremos
        if (['_id', 'email', 'name', 'perfil'].includes(field)) {
          continue;
        }

        // Adicionar o campo mantendo seu valor original
        orderedFields[field] = user[field];
      }

      // Atualizar o documento com a nova estrutura
      const result = await users.replaceOne({ _id: user._id }, orderedFields);

      if (result.modifiedCount > 0) {
        console.log(`✅ Campo renomeado e reordenado para ${user.email}`);
        updatedCount++;
      } else {
        console.log(`⚠️ Não foi possível atualizar ${user.email}`);
        skippedCount++;
      }
    }

    console.log('\n=== Resumo da Operação ===');
    console.log(`Total de usuários com perfil: ${usersWithPerfilField.length}`);
    console.log(`Atualizados com sucesso: ${updatedCount}`);
    console.log(`Não modificados: ${skippedCount}`);
  } catch (error) {
    console.error('Erro durante a operação:', error);
  } finally {
    await client.close();
    console.log('\nConexão com MongoDB fechada');
  }
}

// Executar a operação
renameAndReorderFields()
  .then(() => console.log('Operação concluída'))
  .catch(err => console.error('Erro na operação:', err));
