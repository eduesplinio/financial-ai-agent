import 'dotenv/config';
import { mongoConnection } from '../src/connection';
import { User } from '../src/models';

async function populateUsers() {
  await mongoConnection.connect();

  const users = [
    {
      email: 'admin@example.com',
      profile: {
        riskTolerance: 'moderate',
        financialGoals: [],
        incomeRange: '5k-10k',
        ageGroup: '26-35',
        financialKnowledgeLevel: 'intermediate',
      },
      preferences: {
        currency: 'BRL',
        language: 'pt-BR',
        timezone: 'America/Sao_Paulo',
        notifications: {
          email: true,
          push: true,
          sms: false,
          budgetAlerts: true,
          goalReminders: true,
          anomalyDetection: true,
        },
        privacy: {
          dataSharing: false,
          analytics: true,
          marketing: false,
        },
      },
      connectedAccounts: [],
    },
    {
      email: 'user1@example.com',
      profile: {
        riskTolerance: 'conservative',
        financialGoals: [],
        incomeRange: '2k-5k',
        ageGroup: '18-25',
        financialKnowledgeLevel: 'beginner',
      },
      preferences: {
        currency: 'BRL',
        language: 'pt-BR',
        timezone: 'America/Sao_Paulo',
        notifications: {
          email: true,
          push: false,
          sms: false,
          budgetAlerts: true,
          goalReminders: false,
          anomalyDetection: true,
        },
        privacy: {
          dataSharing: false,
          analytics: true,
          marketing: false,
        },
      },
      connectedAccounts: [],
    },
    {
      email: 'user2@example.com',
      profile: {
        riskTolerance: 'aggressive',
        financialGoals: [],
        incomeRange: '10k-20k',
        ageGroup: '36-45',
        financialKnowledgeLevel: 'advanced',
      },
      preferences: {
        currency: 'BRL',
        language: 'pt-BR',
        timezone: 'America/Sao_Paulo',
        notifications: {
          email: true,
          push: true,
          sms: true,
          budgetAlerts: true,
          goalReminders: true,
          anomalyDetection: true,
        },
        privacy: {
          dataSharing: true,
          analytics: true,
          marketing: true,
        },
      },
      connectedAccounts: [],
    },
  ];

  await User.insertMany(users);
  console.log('✅ Usuários populados com sucesso!');
  await mongoConnection.disconnect();
}

if (require.main === module) {
  populateUsers();
}
