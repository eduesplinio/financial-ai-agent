import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { MongoClient, ObjectId } from 'mongodb';
import { z } from 'zod';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

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
    console.log('[API] ID do usuário para atualização:', userId);

    const body = await request.json();
    console.log('[API] Payload recebido para financialProfile:', body);

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
    console.log('[API] Conexão com MongoDB estabelecida');

    const db = client.db();
    const users = db.collection('users');

    // Buscar usuário antes da atualização
    const userBefore = await users.findOne({ _id: new ObjectId(userId) });
    console.log(
      '[API] Usuário antes da atualização:',
      userBefore
        ? `ID: ${userBefore._id}, Email: ${userBefore.email}`
        : 'Não encontrado'
    );
    console.log('[API] financialProfile antes:', userBefore?.financialProfile);

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
          updatedAt: new Date(),
        },
        // Remover o campo perfil se existir
        $unset: {
          perfil: '',
        },
      }
    );

    console.log('[API] Resultado da atualização:', updateResult);

    // Buscar o valor salvo para conferência
    const updatedUser = await users.findOne({ _id: new ObjectId(userId) });
    console.log(
      '[API] Usuário após atualização:',
      updatedUser
        ? `ID: ${updatedUser._id}, Email: ${updatedUser.email}`
        : 'Não encontrado'
    );
    console.log(
      '[API] financialProfile após atualização:',
      updatedUser?.financialProfile
    );

    await client.close();
    console.log('[API] Conexão com MongoDB fechada');

    return NextResponse.json({ success: true, data: validationResult.data });
  } catch (error) {
    console.error('[API] Erro ao atualizar financialProfile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
