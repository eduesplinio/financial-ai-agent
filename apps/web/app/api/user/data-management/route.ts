import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const { action } = await request.json();

    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db();

    let result;
    switch (action) {
      case 'export':
        result = await exportUserData(db, session.user.id);
        break;

      case 'delete':
        result = await deleteUserData(db, session.user.id);
        break;

      case 'portability':
        result = await exportPortableData(db, session.user.id);
        break;

      default:
        await client.close();
        return NextResponse.json({ message: 'Ação inválida' }, { status: 400 });
    }

    await client.close();
    return result;
  } catch (error) {
    console.error('LGPD action error:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

async function exportUserData(db: any, userId: string) {
  const collections = [
    'users',
    'user_preferences',
    'user_consents',
    'user_consent_history',
    'notification_settings',
    'financial_profiles',
  ];
  const userData: any = {};

  for (const collection of collections) {
    const data = await db.collection(collection).find({ userId }).toArray();
    userData[collection] = data;
  }

  // Adicionar dados do usuário principal
  const user = await db
    .collection('users')
    .findOne({ _id: new ObjectId(userId) });
  if (user) {
    userData.user_profile = user;
  }

  const exportData = {
    exportedAt: new Date().toISOString(),
    userId,
    data: userData,
    description: 'Exportação completa dos dados pessoais conforme LGPD',
    lgpd_compliance: {
      legal_basis: 'Art. 15, LGPD - Direito de acesso',
      export_type: 'complete',
      retention_policy:
        'Dados mantidos enquanto conta ativa ou conforme obrigação legal',
    },
  };

  return new Response(JSON.stringify(exportData, null, 2), {
    status: 200,
    headers: {
      'Content-Disposition': `attachment; filename="meus-dados-${Date.now()}.json"`,
      'Content-Type': 'application/json',
    },
  });
}

async function exportPortableData(db: any, userId: string) {
  // Formato estruturado para portabilidade
  const user = await db
    .collection('users')
    .findOne({ _id: new ObjectId(userId) });
  const preferences = await db
    .collection('user_preferences')
    .findOne({ userId });
  const consents = await db.collection('user_consents').findOne({ userId });
  const notifications = await db
    .collection('notification_settings')
    .findOne({ userId });
  const financialProfile = await db
    .collection('financial_profiles')
    .findOne({ userId });

  const portableData = {
    format_version: '1.0',
    export_date: new Date().toISOString(),
    user_profile: {
      name: user?.name,
      email: user?.email,
      created_at: user?.createdAt,
    },
    preferences: preferences
      ? {
          theme: preferences.theme,
          language: preferences.language,
        }
      : null,
    notifications: notifications || null,
    financial_profile: financialProfile
      ? {
          monthly_income: financialProfile.monthlyIncome,
          risk_profile: financialProfile.riskProfile,
          investment_experience: financialProfile.investmentExperience,
          spending_categories: financialProfile.spendingCategories,
          emergency_fund: financialProfile.emergencyFund,
        }
      : null,
    privacy_settings: consents
      ? {
          analytics_consent: consents.analytics,
          marketing_consent: consents.marketing,
          data_processing_consent: consents.dataProcessing,
          last_updated: consents.updatedAt,
        }
      : null,
    export_info: {
      lgpd_compliance: true,
      format: 'JSON estruturado para portabilidade',
      usage:
        'Dados exportados em formato legível por máquina conforme Art. 18, LGPD',
    },
  };

  return new Response(JSON.stringify(portableData, null, 2), {
    status: 200,
    headers: {
      'Content-Disposition': `attachment; filename="dados-portaveis-${Date.now()}.json"`,
      'Content-Type': 'application/json',
    },
  });
}

async function deleteUserData(db: any, userId: string) {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const session = await client.startSession();

  try {
    await session.withTransaction(async () => {
      // Collections que devem ser completamente removidas
      const collectionsToDelete = [
        'user_preferences',
        'user_consents',
        'user_consent_history',
        'notification_settings',
        'financial_profiles',
      ];

      for (const collection of collectionsToDelete) {
        await db.collection(collection).deleteMany({ userId });
      }

      // Para o usuário principal, marcar como deletado em vez de remover
      // (para manter integridade referencial e auditoria)
      await db.collection('users').updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            deleted: true,
            deletedAt: new Date(),
            // Anonizar dados sensíveis
            name: '[USUÁRIO REMOVIDO]',
            email: `deleted-${userId}@removed.local`,
          },
        }
      );

      // Registrar a exclusão para auditoria
      await db.collection('data_deletion_log').insertOne({
        userId,
        deletedAt: new Date(),
        reason: 'user_request',
        status: 'completed',
      });
    });

    return NextResponse.json(
      {
        message: 'Dados removidos com sucesso conforme LGPD',
        deletion_id: `DEL-${Date.now()}-${userId.slice(-6)}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete user data error:', error);
    return NextResponse.json(
      { message: 'Erro ao remover dados' },
      { status: 500 }
    );
  } finally {
    await session.endSession();
    await client.close();
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

    // Buscar histórico de consentimentos para compliance
    const consentHistory = await db
      .collection('user_consent_history')
      .find({ userId: session.user.id })
      .sort({ updatedAt: -1 })
      .limit(10)
      .toArray();

    // Verificar se existem dados para exportação
    const dataCollections = [
      'user_preferences',
      'user_consents',
      'notification_settings',
      'financial_profiles',
    ];
    const dataAvailable: any = {};

    for (const collection of dataCollections) {
      const count = await db
        .collection(collection)
        .countDocuments({ userId: session.user.id });
      dataAvailable[collection] = count;
    }

    await client.close();

    return NextResponse.json(
      {
        consent_history: consentHistory,
        data_available: dataAvailable,
        lgpd_rights: {
          access: true,
          correction: true,
          deletion: true,
          portability: true,
          information: true,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('LGPD info fetch error:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
