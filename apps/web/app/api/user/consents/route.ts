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

const consentSchema = z.object({
  dataProcessing: z.boolean(),
  analytics: z.boolean(),
  marketing: z.boolean(),
});

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = consentSchema.parse(body);

    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db();

    // Salvar em duas coleções: consentimentos atuais e histórico de auditoria
    const consents = db.collection('user_consents');
    const consentHistory = db.collection('user_consent_history');

    const timestamp = new Date();
    const consentRecord = {
      userId: session.user.id,
      ...validatedData,
      updatedAt: timestamp,
      ipAddress:
        request.headers.get('x-forwarded-for') ||
        request.headers.get('x-real-ip') ||
        'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    };

    // Buscar consentimentos anteriores para histórico
    const previousConsents = await consents.findOne({
      userId: session.user.id,
    });

    // Atualizar consentimentos atuais
    const result = await consents.findOneAndUpdate(
      { userId: session.user.id },
      {
        $set: consentRecord,
        $setOnInsert: {
          createdAt: timestamp,
        },
      },
      {
        upsert: true,
        returnDocument: 'after',
      }
    );

    // Salvar no histórico apenas se houve mudanças
    if (previousConsents) {
      const hasChanges = Object.keys(validatedData).some(
        key =>
          previousConsents[key] !==
          validatedData[key as keyof typeof validatedData]
      );

      if (hasChanges) {
        await consentHistory.insertOne({
          ...consentRecord,
          action: 'updated',
          previousState: {
            dataProcessing: previousConsents.dataProcessing,
            analytics: previousConsents.analytics,
            marketing: previousConsents.marketing,
          },
        });
      }
    } else {
      // Primeiro consentimento
      await consentHistory.insertOne({
        ...consentRecord,
        action: 'created',
        previousState: null,
      });
    }

    await client.close();

    return NextResponse.json(
      { message: 'Consentimentos salvos com sucesso', consents: result },
      { status: 200 }
    );
  } catch (error) {
    console.error('Consents save error:', error);

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
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db();
    const consents = db.collection('user_consents');

    const userConsents = await consents.findOne(
      { userId: session.user.id },
      { projection: { _id: 0, userId: 0, ipAddress: 0, userAgent: 0 } }
    );

    await client.close();

    if (!userConsents) {
      // Retorna consentimentos padrão (apenas essenciais)
      const defaultConsents = {
        dataProcessing: true, // Essencial, não pode ser false
        analytics: false,
        marketing: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return NextResponse.json(defaultConsents, { status: 200 });
    }

    return NextResponse.json(userConsents, { status: 200 });
  } catch (error) {
    console.error('Consents fetch error:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
