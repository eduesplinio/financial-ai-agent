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

const notificationSettingsSchema = z.object({
  email: z.boolean(),
  push: z.boolean(),
  marketing: z.boolean(),
  largeTransactions: z.boolean(),
  unusualSpending: z.boolean(),
  goalProgress: z.boolean(),
  budgetExceeded: z.boolean(),
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

    if (!user || !user.preferences || !user.preferences.notifications) {
      // Retornar configurações padrão se não existir
      const defaultSettings = {
        email: true,
        push: true,
        marketing: false,
        largeTransactions: true,
        unusualSpending: true,
        goalProgress: true,
        budgetExceeded: true,
      };
      return NextResponse.json(defaultSettings);
    }

    return NextResponse.json(user.preferences.notifications);
  } catch (error) {
    console.error('Error fetching notification settings:', error);
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
    console.log('[API Notifications] ID do usuário para atualização:', userId);

    const body = await request.json();
    console.log('[API Notifications] Payload recebido:', body);

    // Validar dados de entrada
    const validationResult = notificationSettingsSchema.safeParse(body);
    if (!validationResult.success) {
      console.log(
        '[API Notifications] Dados inválidos:',
        validationResult.error.errors
      );
      return NextResponse.json(
        { error: 'Invalid data', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('[API Notifications] Conexão com MongoDB estabelecida');

    const db = client.db();
    const users = db.collection('users');

    // Buscar usuário antes da atualização
    const userBefore = await users.findOne({ _id: new ObjectId(userId) });
    console.log(
      '[API Notifications] Usuário antes da atualização:',
      userBefore
        ? `ID: ${userBefore._id}, Email: ${userBefore.email}`
        : 'Não encontrado'
    );
    console.log(
      '[API Notifications] Preferências de notificação antes:',
      userBefore?.preferences?.notifications
    );

    // Fazer o update
    const updateResult = await users.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          'preferences.notifications': validationResult.data,
          'preferences.updatedAt': new Date(),
        },
      }
    );

    console.log('[API Notifications] Resultado da atualização:', updateResult);

    // Buscar usuário após atualização para conferência
    const updatedUser = await users.findOne({ _id: new ObjectId(userId) });
    console.log(
      '[API Notifications] Usuário após atualização:',
      updatedUser
        ? `ID: ${updatedUser._id}, Email: ${updatedUser.email}`
        : 'Não encontrado'
    );
    console.log(
      '[API Notifications] Preferências de notificação após:',
      updatedUser?.preferences?.notifications
    );

    await client.close();
    console.log('[API Notifications] Conexão com MongoDB fechada');

    return NextResponse.json({
      success: true,
      data: validationResult.data,
    });
  } catch (error) {
    console.error('Error updating notification settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
