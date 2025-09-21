import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { MongoClient, ObjectId } from 'mongodb';
import { z } from 'zod';

// Usar a mesma string de conexão que o ChatService
const MONGODB_URI =
  'mongodb+srv://esplinone_db_user:XyY0siKX2Ib2LZCw@cluster0.ih76fqj.mongodb.net/financial_ai?retryWrites=true&w=majority&appName=Cluster0';

const financialProfileSchema = z.object({
  monthlyIncome: z.number().min(0),
  spendingCategories: z.object({
    housing: z.number().min(0),
    food: z.number().min(0),
    transport: z.number().min(0),
    entertainment: z.number().min(0),
    healthcare: z.number().min(0),
    education: z.number().min(0),
    other: z.number().min(0),
  }),
  riskProfile: z.enum(['conservative', 'moderate', 'aggressive']),
  financialGoals: z.array(z.string()),
  emergencyFund: z.number().min(0),
  investmentExperience: z.enum(['beginner', 'intermediate', 'advanced']),
  // Campos adicionais editáveis
  preferences: z
    .object({
      currency: z.string().optional(),
      language: z.string().optional(),
      timezone: z.string().optional(),
      notifications: z
        .object({
          email: z.boolean().optional(),
          push: z.boolean().optional(),
          sms: z.boolean().optional(),
          budgetAlerts: z.boolean().optional(),
          goalReminders: z.boolean().optional(),
          anomalyDetection: z.boolean().optional(),
        })
        .optional(),
    })
    .optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db();
    const users = db.collection('users');
    const user = await users.findOne({ _id: new ObjectId(session.user.id) });
    await client.close();

    // Verificar se o usuário tem o perfil financeiro no campo profile
    if (!user || !user.profile) {
      // Retornar perfil padrão se não existir
      return NextResponse.json({
        monthlyIncome: 0,
        spendingCategories: {
          housing: 0,
          food: 0,
          transport: 0,
          entertainment: 0,
          healthcare: 0,
          education: 0,
          other: 0,
        },
        riskProfile: 'moderate',
        financialGoals: [],
        emergencyFund: 0,
        investmentExperience: 'beginner',
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
        },
        connectedAccounts: [],
      });
    }
    // Extrair e transformar os dados financeiros do profile
    const profile = user.profile;
    const financialData = {
      monthlyIncome: profile.monthlyIncome || 0,
      spendingCategories: profile.spendingCategories || {
        housing: 0,
        food: 0,
        transport: 0,
        entertainment: 0,
        healthcare: 0,
        education: 0,
        other: 0,
      },
      riskProfile: profile.riskTolerance || 'moderate',
      financialGoals: profile.financialGoals || [],
      emergencyFund: profile.emergencyFund || 0,
      investmentExperience: profile.financialKnowledgeLevel || 'beginner',
      // Campos adicionais
      preferences: user.preferences || {
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
      },
      connectedAccounts: user.connectedAccounts || [],
    };

    return NextResponse.json(financialData);
  } catch (error) {
    console.error('Error fetching financial profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();

    // Validar dados de entrada
    const validationResult = financialProfileSchema.safeParse(body);
    if (!validationResult.success) {
      console.log('[API] Dados inválidos:', validationResult.error.errors);
      return NextResponse.json(
        { error: 'Invalid data', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db();
    const users = db.collection('users');

    // Buscar usuário antes da atualização
    const userBefore = await users.findOne({ _id: new ObjectId(userId) });

    // Migrar todos os dados apenas para o campo profile
    const updateResult = await users.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          profile: {
            // Manter dados do profile existente
            ...(userBefore?.profile || {}),
            // Adicionar dados financeiros atualizados
            monthlyIncome: validationResult.data.monthlyIncome,
            spendingCategories: validationResult.data.spendingCategories,
            emergencyFund: validationResult.data.emergencyFund,
            // Converter os campos específicos do perfil financeiro
            riskTolerance: validationResult.data.riskProfile,
            financialGoals: validationResult.data.financialGoals,
            financialKnowledgeLevel: validationResult.data.investmentExperience,
          },
          // Atualizar preferências se fornecidas
          ...(validationResult.data.preferences && {
            preferences: {
              ...(userBefore?.preferences || {}),
              ...validationResult.data.preferences,
            },
          }),
          updatedAt: new Date(),
        },
        // Remover o campo perfil se existir
        $unset: {
          perfil: '',
        },
      }
    );

    await client.close();

    return NextResponse.json({ success: true, data: validationResult.data });
  } catch (error) {
    console.error('[API] Erro ao atualizar financialProfile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
