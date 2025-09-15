// Script para migrar todos os dados de usuários para a nova estrutura consolidada
// Combina profile, financialProfile e preferences em uma estrutura consolidada

import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI não definida. Configure-a em .env.local');
  process.exit(1);
}

async function migrateUserData() {
  console.log('Iniciando migração de dados de usuários...');

  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    console.log('Conectado ao MongoDB');

    const db = client.db();
    const users = db.collection('users');

    // Buscar todos os usuários
    const allUsers = await users.find({}).toArray();
    console.log(`Encontrados ${allUsers.length} usuários para migrar`);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const user of allUsers) {
      console.log(`\nProcessando usuário: ${user.email} (${user._id})`);

      const updateData = {
        updatedAt: new Date(),
      };

      // Migrar dados para o campo perfil
      let perfilData = {};

      // Incorporar dados do perfil existente
      if (user.perfil) {
        console.log('- Perfil já existe, preservando dados');
        perfilData = { ...user.perfil };
      } else if (user.profile) {
        console.log('- Migrando campo profile antigo para perfil');
        perfilData = { ...user.profile };
      }

      // Incorporar dados do financialProfile
      if (user.financialProfile) {
        console.log('- Incorporando dados do financialProfile no perfil');
        const financialData = user.financialProfile;

        perfilData = {
          ...perfilData,
          // Adicionar campos do financialProfile
          monthlyIncome: financialData.monthlyIncome,
          spendingCategories: financialData.spendingCategories,
          emergencyFund: financialData.emergencyFund,
          // Mapear campos similares (se não existirem no perfil)
          riskTolerance: perfilData.riskTolerance || financialData.riskProfile,
          financialGoals:
            perfilData.financialGoals || financialData.financialGoals,
          financialKnowledgeLevel:
            perfilData.financialKnowledgeLevel ||
            financialData.investmentExperience,
        };
      }

      // Se tem dados para atualizar
      if (Object.keys(perfilData).length > 0) {
        updateData.perfil = perfilData;

        // Remover campos antigos
        const unsetFields = {};
        if (user.profile) unsetFields.profile = '';

        const updateOp = {
          $set: updateData,
        };

        if (Object.keys(unsetFields).length > 0) {
          updateOp.$unset = unsetFields;
        }

        // Fazer a atualização
        const result = await users.updateOne({ _id: user._id }, updateOp);

        if (result.modifiedCount > 0) {
          console.log(`✅ Usuário ${user.email} migrado com sucesso`);
          migratedCount++;
        } else {
          console.log(`⚠️ Usuário ${user.email} não modificado`);
          skippedCount++;
        }
      } else {
        console.log(`⚠️ Usuário ${user.email} não tem dados para migrar`);
        skippedCount++;
      }
    }

    console.log('\n=== Resumo da Migração ===');
    console.log(`Total de usuários: ${allUsers.length}`);
    console.log(`Migrados com sucesso: ${migratedCount}`);
    console.log(`Não modificados: ${skippedCount}`);
  } catch (error) {
    console.error('Erro durante a migração:', error);
  } finally {
    await client.close();
    console.log('\nConexão com MongoDB fechada');
  }
}

// Executar migração
migrateUserData()
  .then(() => console.log('Migração concluída'))
  .catch(err => console.error('Erro na migração:', err));
