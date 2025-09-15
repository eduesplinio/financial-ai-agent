import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { MongoClient, ObjectId } from 'mongodb';
import { z } from 'zod';

const client = new MongoClient(process.env.MONGODB_URI!);

const preferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  language: z.enum(['pt-BR', 'en-US']),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    marketing: z.boolean(),
    largeTransactions: z.boolean().optional(),
    unusualSpending: z.boolean().optional(),
    goalProgress: z.boolean().optional(),
    budgetExceeded: z.boolean().optional(),
    // Migrar campos antigos para novos
    sms: z.boolean().optional(),
    budgetAlerts: z.boolean().optional(),
    goalReminders: z.boolean().optional(),
    anomalyDetection: z.boolean().optional(),
  }),
  // Campos adicionais compatíveis com estrutura antiga
  currency: z.string().optional(),
  timezone: z.string().optional(),
});

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const userId = session.user.id;
    console.log('[API Preferences] ID do usuário para atualização:', userId);

    const body = await request.json();
    console.log('[API Preferences] Payload recebido:', body);

    const validatedData = preferencesSchema.parse(body);

    await client.connect();
    console.log('[API Preferences] Conexão com MongoDB estabelecida');

    const db = client.db();

    // Atualizar diretamente na collection de usuários
    const users = db.collection('users');

    // Buscar usuário antes da atualização
    const userBefore = await users.findOne({ _id: new ObjectId(userId) });
    console.log(
      '[API Preferences] Usuário antes da atualização:',
      userBefore
        ? `ID: ${userBefore._id}, Email: ${userBefore.email}`
        : 'Não encontrado'
    );
    console.log(
      '[API Preferences] Preferências antes:',
      userBefore?.preferences
    );

    // Atualizar o documento do usuário
    const updateResult = await users.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          preferences: validatedData,
          updatedAt: new Date(),
        },
        // Remover campos antigos de preferências caso existam
        $unset: {
          'preferences.currency': '',
          'preferences.timezone': '',
          'preferences.privacy': '',
          privacy: '',
        },
      }
    );

    console.log('[API Preferences] Resultado da atualização:', updateResult);

    // Buscar usuário após atualização para conferência
    const updatedUser = await users.findOne({ _id: new ObjectId(userId) });
    console.log(
      '[API Preferences] Usuário após atualização:',
      updatedUser
        ? `ID: ${updatedUser._id}, Email: ${updatedUser.email}`
        : 'Não encontrado'
    );
    console.log(
      '[API Preferences] Preferências após atualização:',
      updatedUser?.preferences
    );

    // Para compatibilidade, manter a atualização na tabela antiga também
    const preferences = db.collection('user_preferences');
    const result = await preferences.findOneAndUpdate(
      { userId: userId },
      {
        $set: {
          ...validatedData,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          userId: userId,
          createdAt: new Date(),
        },
      },
      {
        upsert: true,
        returnDocument: 'after',
      }
    );

    console.log('[API Preferences] Preferências salvas com sucesso');
    return NextResponse.json(
      {
        message: 'Preferências salvas com sucesso',
        preferences: validatedData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Preferences save error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Dados inválidos', errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const userId = session.user.id;
    console.log('[API Preferences GET] ID do usuário:', userId);

    await client.connect();
    console.log('[API Preferences GET] Conexão com MongoDB estabelecida');

    const db = client.db();

    // Primeiro buscar no documento do usuário
    const users = db.collection('users');
    const user = await users.findOne({ _id: new ObjectId(userId) });

    console.log(
      '[API Preferences GET] Usuário encontrado:',
      user ? `ID: ${user._id}, Email: ${user.email}` : 'Não encontrado'
    );

    if (user && user.preferences) {
      console.log(
        '[API Preferences GET] Preferências encontradas no documento do usuário:',
        user.preferences
      );
      return NextResponse.json(user.preferences, { status: 200 });
    }

    // Se não encontrar no documento principal, buscar na collection antiga
    console.log(
      '[API Preferences GET] Preferências não encontradas no documento do usuário, buscando na collection antiga'
    );
    const preferences = db.collection('user_preferences');
    const userPreferences = await preferences.findOne({
      userId: userId,
    });

    console.log(
      '[API Preferences GET] Resultado da busca na collection antiga:',
      userPreferences ? 'Encontrado' : 'Não encontrado'
    );

    if (!userPreferences) {
      // Retorna preferências padrão
      const defaultPreferences = {
        theme: 'system',
        language: 'pt-BR',
        notifications: {
          email: true,
          push: true,
          marketing: false,
          largeTransactions: true,
          unusualSpending: true,
          goalProgress: true,
          budgetExceeded: true,
        },
      };

      console.log('[API Preferences GET] Retornando preferências padrão');
      return NextResponse.json(defaultPreferences, { status: 200 });
    }

    console.log(
      '[API Preferences GET] Retornando preferências da collection antiga'
    );
    return NextResponse.json(userPreferences, { status: 200 });
  } catch (error) {
    console.error('Preferences fetch error:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
