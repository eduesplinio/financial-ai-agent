import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { z } from 'zod';
import { getDatabase } from '@/lib/mongodb';

// Schema para validação de conta conectada
const connectedAccountSchema = z.object({
  institutionId: z.string().min(1),
  institutionName: z.string().min(1),
  accountId: z.string().min(1),
  accountType: z.enum(['CHECKING', 'SAVINGS', 'CREDIT_CARD', 'INVESTMENT']),
  accountName: z.string().min(1),
  currency: z.string().default('BRL'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'EXPIRED']).default('ACTIVE'),
  permissions: z.array(z.string()).default(['accounts', 'transactions']),
  lastSync: z.date().optional(),
});

type ConnectedAccount = z.infer<typeof connectedAccountSchema>;

/**
 * GET /api/open-finance/accounts
 * Lista todas as contas conectadas do usuário
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const userId = session.user.id;
    const db = await getDatabase();
    const connectedAccounts = db.collection('connected_accounts');

    // Buscar contas conectadas do usuário
    const accounts = await connectedAccounts
      .find({
        userId: userId,
        deletedAt: { $exists: false },
      })
      .sort({ createdAt: -1 })
      .toArray();

    // Transformar dados para resposta
    const accountsResponse = accounts.map(account => ({
      id: account._id.toString(),
      institutionId: account.institutionId,
      institutionName: account.institutionName,
      accountId: account.accountId,
      accountType: account.accountType,
      accountName: account.accountName,
      currency: account.currency,
      status: account.status,
      permissions: account.permissions,
      lastSync: account.lastSync,
      connectedAt: account.createdAt,
      updatedAt: account.updatedAt,
    }));

    // Agrupar por instituição para melhor visualização
    const groupedByInstitution = accountsResponse.reduce(
      (acc, account) => {
        const institutionId = account.institutionId;
        if (!acc[institutionId]) {
          acc[institutionId] = {
            institutionId,
            institutionName: account.institutionName,
            accounts: [],
            totalAccounts: 0,
            lastSync: null,
          };
        }

        acc[institutionId].accounts.push(account);
        acc[institutionId].totalAccounts += 1;

        // Atualizar último sync
        if (
          account.lastSync &&
          (!acc[institutionId].lastSync ||
            new Date(account.lastSync) > new Date(acc[institutionId].lastSync))
        ) {
          acc[institutionId].lastSync = account.lastSync;
        }

        return acc;
      },
      {} as Record<string, any>
    );

    return NextResponse.json({
      accounts: accountsResponse,
      groupedByInstitution: Object.values(groupedByInstitution),
      total: accountsResponse.length,
      summary: {
        totalAccounts: accountsResponse.length,
        activeAccounts: accountsResponse.filter(acc => acc.status === 'ACTIVE')
          .length,
        institutions: Object.keys(groupedByInstitution).length,
      },
    });
  } catch (error) {
    console.error('Error fetching connected accounts:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/open-finance/accounts
 * Conecta uma nova conta bancária (simulação sem OAuth2)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();

    // Validar dados de entrada
    const validatedData = connectedAccountSchema.parse({
      ...body,
      lastSync: body.lastSync ? new Date(body.lastSync) : undefined,
    });

    const db = await getDatabase();
    const connectedAccounts = db.collection('connected_accounts');

    // Verificar se a conta já está conectada
    const existingAccount = await connectedAccounts.findOne({
      userId: userId,
      institutionId: validatedData.institutionId,
      accountId: validatedData.accountId,
      deletedAt: { $exists: false },
    });

    if (existingAccount) {
      return NextResponse.json(
        { message: 'Esta conta já está conectada' },
        { status: 409 }
      );
    }

    // Criar nova conta conectada
    const newAccount = {
      userId: userId,
      ...validatedData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await connectedAccounts.insertOne(newAccount);

    return NextResponse.json(
      {
        message: 'Conta conectada com sucesso',
        account: {
          id: result.insertedId.toString(),
          ...newAccount,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error connecting account:', error);

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
