import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { program } from 'commander';

// Carrega as variáveis de ambiente
dotenv.config();

// Configuração do comando
program
  .requiredOption('-e, --email <email>', 'Email do usuário')
  .requiredOption('-p, --password <password>', 'Senha do usuário')
  .option('-n, --name <name>', 'Nome do usuário', 'Usuário de Teste')
  .option('-r, --role <role>', 'Função do usuário', 'user')
  .parse(process.argv);

const options = program.opts();

async function createTestUser() {
  if (!process.env.MONGODB_URI) {
    console.error('❌ A variável de ambiente MONGODB_URI não está definida');
    process.exit(1);
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('financial_ai');
    const usersCollection = db.collection('users');

    // Verifica se o usuário já existe
    const existingUser = await usersCollection.findOne({
      email: options.email.toLowerCase(),
    });

    if (existingUser) {
      console.log('ℹ️  Usuário já existe com este email');
      process.exit(0);
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(options.password, 12);

    // Cria o usuário com todos os campos obrigatórios do esquema
    const userData = {
      email: options.email.toLowerCase(),
      profile: {
        riskTolerance: 'moderate',
        financialGoals: [],
        incomeRange: '5k-10k',
        ageGroup: '26-35',
        financialKnowledgeLevel: 'intermediate'
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
          anomalyDetection: true
        },
        privacy: {
          dataSharing: false,
          analytics: true,
          marketing: false
        }
      },
      connectedAccounts: [],
      name: options.name,
      password: hashedPassword,
      role: options.role,
      isActive: true,
      lastLogin: null,
      emailVerified: null,
      image: null,
      accounts: [],
      sessions: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await usersCollection.insertOne(userData);

    console.log('✅ Usuário criado com sucesso!');
    console.log('ID:', result.insertedId);
    console.log('Email:', options.email);
    console.log('Senha:', options.password);
    console.log('Role:', options.role);
  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

createTestUser();
