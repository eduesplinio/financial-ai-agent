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

    const userId = session.user.id;
    console.log('[API Consents] ID do usuário para atualização:', userId);

    const body = await request.json();
    console.log('[API Consents] Payload recebido:', body);

    const validatedData = consentSchema.parse(body);

    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('[API Consents] Conexão com MongoDB estabelecida');

    const db = client.db();

    // Atualizar no documento do usuário principal
    const users = db.collection('users');

    // Buscar usuário antes da atualização
    const userBefore = await users.findOne({ _id: new ObjectId(userId) });
    console.log(
      '[API Consents] Usuário antes da atualização:',
      userBefore
        ? `ID: ${userBefore._id}, Email: ${userBefore.email}`
        : 'Não encontrado'
    );
    console.log('[API Consents] Consentimentos antes:', userBefore?.consents);

    // Atualizar o documento do usuário
    const updateResult = await users.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          consents: validatedData,
          updatedAt: new Date(),
        },
      }
    );

    console.log('[API Consents] Resultado da atualização:', updateResult);

    // Buscar usuário após atualização para conferência
    const updatedUser = await users.findOne({ _id: new ObjectId(userId) });
    console.log(
      '[API Consents] Usuário após atualização:',
      updatedUser
        ? `ID: ${updatedUser._id}, Email: ${updatedUser.email}`
        : 'Não encontrado'
    );
    console.log(
      '[API Consents] Consentimentos após atualização:',
      updatedUser?.consents
    );

    // Salvar em duas coleções para compatibilidade: consentimentos atuais e histórico de auditoria
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

    const userId = session.user.id;
    console.log('[API Consents GET] ID do usuário:', userId);

    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('[API Consents GET] Conexão com MongoDB estabelecida');

    const db = client.db();

    // Primeiro buscar no documento do usuário
    const users = db.collection('users');
    const user = await users.findOne({ _id: new ObjectId(userId) });

    console.log(
      '[API Consents GET] Usuário encontrado:',
      user ? `ID: ${user._id}, Email: ${user.email}` : 'Não encontrado'
    );

    if (user && user.consents) {
      console.log(
        '[API Consents GET] Consentimentos encontrados no documento do usuário:',
        user.consents
      );
      await client.close();
      return NextResponse.json(user.consents, { status: 200 });
    }

    // Se não encontrar no documento principal, buscar na collection antiga
    console.log(
      '[API Consents GET] Consentimentos não encontrados no documento do usuário, buscando na collection antiga'
    );
    const consents = db.collection('user_consents');
    const userConsents = await consents.findOne(
      { userId: userId },
      { projection: { _id: 0, userId: 0, ipAddress: 0, userAgent: 0 } }
    );

    console.log(
      '[API Consents GET] Resultado da busca na collection antiga:',
      userConsents ? 'Encontrado' : 'Não encontrado'
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

      console.log('[API Consents GET] Retornando consentimentos padrão');
      return NextResponse.json(defaultConsents, { status: 200 });
    }

    console.log(
      '[API Consents GET] Retornando consentimentos da collection antiga'
    );
    return NextResponse.json(userConsents, { status: 200 });
  } catch (error) {
    console.error('Consents fetch error:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
