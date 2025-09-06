import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('A variável de ambiente MONGODB_URI não está definida');
}

const client = new MongoClient(process.env.MONGODB_URI);

export interface CreateUserData {
  email: string;
  password: string;
  name?: string;
  profile?: {
    riskTolerance?: 'conservative' | 'moderate' | 'aggressive';
    incomeRange?: string;
    ageGroup?: string;
    financialKnowledgeLevel?: 'beginner' | 'intermediate' | 'advanced';
  };
}

export async function createUser(userData: CreateUserData) {
  try {
    await client.connect();
    const db = client.db('financial_ai');
    const users = db.collection('users');

    // Check if user already exists
    const existingUser = await users.findOne({
      email: userData.email.toLowerCase(),
    });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // Create user document
    const newUser = {
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      name: userData.name || userData.email,
      role: 'user',
      profile: {
        riskTolerance: userData.profile?.riskTolerance || 'moderate',
        financialGoals: [],
        incomeRange: userData.profile?.incomeRange || '2k-5k',
        ageGroup: userData.profile?.ageGroup || '26-35',
        financialKnowledgeLevel:
          userData.profile?.financialKnowledgeLevel || 'beginner',
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
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await users.insertOne(newUser);

    return {
      id: result.insertedId.toString(),
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    };
  } catch (error) {
    console.error('Create user error:', error);
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  try {
    await client.connect();
    const db = client.db('financial_ai');
    const users = db.collection('users');

    const user = await users.findOne({ email: email.toLowerCase() });
    return user;
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
}

export async function updateUserPassword(email: string, newPassword: string) {
  try {
    await client.connect();
    const db = client.db('financial_ai');
    const users = db.collection('users');

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const result = await users.updateOne(
      { email: email.toLowerCase() },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      }
    );

    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Update password error:', error);
    throw error;
  }
}

export async function verifyPassword(email: string, password: string) {
  try {
    const user = await getUserByEmail(email);
    if (!user || !user.password) {
      return false;
    }

    return await bcrypt.compare(password, user.password);
  } catch (error) {
    console.error('Verify password error:', error);
    return false;
  }
}
