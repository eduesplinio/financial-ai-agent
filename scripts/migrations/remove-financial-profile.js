// Script para remover o campo financialProfile de todos os documentos de usuário
// Garantindo que todos os dados estejam apenas no campo perfil

import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI não definida. Configure-a em .env.local');
  process.exit(1);
}

async function removeFinancialProfileField() {
  console.log('Iniciando remoção do campo financialProfile...');

  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    console.log('Conectado ao MongoDB');

    const db = client.db();
    const users = db.collection('users');

    // Buscar todos os usuários que ainda têm financialProfile
    const usersWithFinancialProfile = await users
      .find({ financialProfile: { $exists: true } })
      .toArray();
    console.log(
      `Encontrados ${usersWithFinancialProfile.length} usuários com financialProfile para atualizar`
    );

    let updatedCount = 0;
    let skippedCount = 0;

    for (const user of usersWithFinancialProfile) {
      console.log(`\nProcessando usuário: ${user.email} (${user._id})`);

      // Verificar se já existe perfil
      if (!user.perfil) {
        console.log(
          '- Usuário não tem campo perfil, criando a partir do financialProfile'
        );

        const financialData = user.financialProfile;
        const perfilData = {
          // Dados financeiros
          monthlyIncome: financialData.monthlyIncome,
          spendingCategories: financialData.spendingCategories,
          emergencyFund: financialData.emergencyFund,
          // Campos convertidos
          riskTolerance: financialData.riskProfile,
          financialGoals: financialData.financialGoals,
          financialKnowledgeLevel: financialData.investmentExperience,
        };

        // Atualizar usuário
        const result = await users.updateOne(
          { _id: user._id },
          {
            $set: {
              perfil: perfilData,
              updatedAt: new Date(),
            },
            $unset: { financialProfile: '' },
          }
        );

        if (result.modifiedCount > 0) {
          console.log(
            `✅ Campo financialProfile removido e dados migrados para perfil em ${user.email}`
          );
          updatedCount++;
        } else {
          console.log(`⚠️ Não foi possível atualizar ${user.email}`);
          skippedCount++;
        }
      } else {
        console.log(
          '- Usuário já tem campo perfil, apenas removendo financialProfile'
        );

        // Apenas remover o campo financialProfile
        const result = await users.updateOne(
          { _id: user._id },
          {
            $unset: { financialProfile: '' },
            $set: { updatedAt: new Date() },
          }
        );

        if (result.modifiedCount > 0) {
          console.log(`✅ Campo financialProfile removido de ${user.email}`);
          updatedCount++;
        } else {
          console.log(
            `⚠️ Não foi possível remover financialProfile de ${user.email}`
          );
          skippedCount++;
        }
      }
    }

    console.log('\n=== Resumo da Operação ===');
    console.log(
      `Total de usuários com financialProfile: ${usersWithFinancialProfile.length}`
    );
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
removeFinancialProfileField()
  .then(() => console.log('Operação concluída'))
  .catch(err => console.error('Erro na operação:', err));
