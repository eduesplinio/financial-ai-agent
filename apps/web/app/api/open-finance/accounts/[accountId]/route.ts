import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';

/**
 * GET /api/open-finance/accounts/[accountId]
 * Obtém detalhes de uma conta específica
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { accountId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const { accountId } = params;
    const userId = session.user.id;

    if (!ObjectId.isValid(accountId)) {
      return NextResponse.json(
        { message: 'ID da conta inválido' },
        { status: 400 }
      );
    }

    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db();
    const connectedAccounts = db.collection('connected_accounts');

    // Buscar conta específica do usuário
    const account = await connectedAccounts.findOne({
      _id: new ObjectId(accountId),
      userId: userId,
      deletedAt: { $exists: false },
    });

    if (!account) {
      await client.close();
      return NextResponse.json(
        { message: 'Conta não encontrada' },
        { status: 404 }
      );
    }

    // Buscar histórico de sincronizações
    const syncHistory = db.collection('sync_history');
    const recentSyncs = await syncHistory
      .find({
        userId: userId,
        accountId: account.accountId,
        institutionId: account.institutionId,
      })
      .sort({ timestamp: -1 })
      .limit(10)
      .toArray();

    await client.close();

    return NextResponse.json({
      account: {
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
      },
      syncHistory: recentSyncs.map(sync => ({
        id: sync._id.toString(),
        status: sync.status,
        recordsProcessed: sync.recordsProcessed || 0,
        timestamp: sync.timestamp,
        error: sync.error || null,
      })),
    });
  } catch (error) {
    console.error('Error fetching account details:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/open-finance/accounts/[accountId]
 * Atualiza configurações de uma conta conectada
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { accountId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const { accountId } = params;
    const userId = session.user.id;
    const body = await request.json();

    if (!ObjectId.isValid(accountId)) {
      return NextResponse.json(
        { message: 'ID da conta inválido' },
        { status: 400 }
      );
    }

    // Campos permitidos para atualização
    const allowedUpdates = ['accountName', 'permissions', 'status'];
    const updates: any = {};

    for (const field of allowedUpdates) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { message: 'Nenhum campo válido para atualização' },
        { status: 400 }
      );
    }

    updates.updatedAt = new Date();

    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db();
    const connectedAccounts = db.collection('connected_accounts');

    // Buscar conta antes da atualização
    const existingAccount = await connectedAccounts.findOne({
      _id: new ObjectId(accountId),
      userId: userId,
      deletedAt: { $exists: false },
    });

    if (!existingAccount) {
      await client.close();
      return NextResponse.json(
        { message: 'Conta não encontrada' },
        { status: 404 }
      );
    }

    // Atualizar conta
    const result = await connectedAccounts.updateOne(
      { _id: new ObjectId(accountId), userId: userId },
      { $set: updates }
    );

    await client.close();

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: 'Conta não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Conta atualizada com sucesso',
      updates,
    });
  } catch (error) {
    console.error('Error updating account:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/open-finance/accounts/[accountId]
 * Remove/revoga uma conta conectada
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { accountId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const { accountId } = params;
    const userId = session.user.id;

    if (!ObjectId.isValid(accountId)) {
      return NextResponse.json(
        { message: 'ID da conta inválido' },
        { status: 400 }
      );
    }

    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db();
    const connectedAccounts = db.collection('connected_accounts');

    // Buscar conta antes da remoção
    const existingAccount = await connectedAccounts.findOne({
      _id: new ObjectId(accountId),
      userId: userId,
      deletedAt: { $exists: false },
    });

    if (!existingAccount) {
      await client.close();
      return NextResponse.json(
        { message: 'Conta não encontrada' },
        { status: 404 }
      );
    }

    // Remover transações relacionadas à conta (por segurança)
    const transactions = db.collection('transactions');
    const transactionsDeleteResult = await transactions.deleteMany({
      userId: userId,
      accountId: existingAccount.accountId,
      institutionId: existingAccount.institutionId,
    });

    console.log(
      `Removidas ${transactionsDeleteResult.deletedCount} transações da conta ${existingAccount.institutionName}`
    );

    // Remover histórico de sincronizações relacionadas
    const syncHistory = db.collection('sync_history');
    const syncDeleteResult = await syncHistory.deleteMany({
      userId: userId,
      accountId: existingAccount.accountId,
      institutionId: existingAccount.institutionId,
    });

    console.log(
      `Removidos ${syncDeleteResult.deletedCount} registros de sincronização da conta ${existingAccount.institutionName}`
    );

    // Soft delete - marcar como removida
    const result = await connectedAccounts.updateOne(
      { _id: new ObjectId(accountId), userId: userId },
      {
        $set: {
          deletedAt: new Date(),
          status: 'INACTIVE',
          updatedAt: new Date(),
        },
      }
    );

    await client.close();

    return NextResponse.json({
      message: 'Conta desconectada com sucesso',
      revokedAt: new Date(),
      dataCleanup: {
        transactionsRemoved: transactionsDeleteResult.deletedCount,
        syncHistoryRemoved: syncDeleteResult.deletedCount,
      },
    });
  } catch (error) {
    console.error('Error revoking account:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
