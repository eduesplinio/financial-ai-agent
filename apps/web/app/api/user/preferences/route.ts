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
  }),
});

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = preferencesSchema.parse(body);

    await client.connect();
    const db = client.db();
    const preferences = db.collection('user_preferences');

    const result = await preferences.findOneAndUpdate(
      { userId: session.user.id },
      {
        $set: {
          ...validatedData,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          userId: session.user.id,
          createdAt: new Date(),
        },
      },
      {
        upsert: true,
        returnDocument: 'after',
      }
    );

    return NextResponse.json(
      { message: 'Preferências salvas com sucesso', preferences: result },
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

    await client.connect();
    const db = client.db();
    const preferences = db.collection('user_preferences');

    const userPreferences = await preferences.findOne({
      userId: session.user.id,
    });

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

      return NextResponse.json(defaultPreferences, { status: 200 });
    }

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
