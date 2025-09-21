import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import type { AccountData } from '@financial-ai/open-finance';

/**
 * API para gerenciar contas bancárias conectadas do Open Finance
 */

/**
 * GET /api/open-finance/accounts
 * Lista contas bancárias conectadas do usuário
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const institutionId = searchParams.get('institution_id');
    const accountType = searchParams.get('account_type');
    const includeBalances = searchParams.get('include_balances') === 'true';

    // Em uma implementação real, buscaríamos do banco de dados
    // Por enquanto, retornamos dados simulados
    const mockAccounts: AccountData[] = [
      {
        accountId: 'acc_bb_001',
        accountType: 'CHECKING',
        accountSubType: 'STANDARD',
        currency: 'BRL',
        nickname: 'Conta Corrente Principal',
        name: 'Conta Corrente',
        balance: 12500.75,
        available: 12000.0,
        blocked: 500.75,
        overdraftLimit: 2000.0,
        openingDate: '2020-01-15T00:00:00Z',
        status: 'ACTIVE',
        branch: '1234',
        number: '12345-6',
        institution: {
          id: 'banco-do-brasil',
          name: 'Banco do Brasil',
          compeCode: '001',
          ispb: '00000000',
        },
        updatedAt: new Date().toISOString(),
      },
      {
        accountId: 'acc_nubank_001',
        accountType: 'SAVINGS',
        accountSubType: 'STANDARD',
        currency: 'BRL',
        nickname: 'Conta Poupança Nubank',
        name: 'Conta Poupança',
        balance: 8500.0,
        available: 8500.0,
        blocked: 0,
        openingDate: '2021-03-20T00:00:00Z',
        status: 'ACTIVE',
        branch: '0001',
        number: '12345678-9',
        institution: {
          id: 'nubank',
          name: 'Nubank',
          compeCode: '260',
          ispb: '18236120',
        },
        updatedAt: new Date().toISOString(),
      },
    ];

    let accounts = mockAccounts;

    // Filtrar por instituição
    if (institutionId) {
      accounts = accounts.filter(acc => acc.institution.id === institutionId);
    }

    // Filtrar por tipo de conta
    if (accountType) {
      accounts = accounts.filter(
        acc => acc.accountType === accountType.toUpperCase()
      );
    }

    // Remover saldos se não solicitado
    if (!includeBalances) {
      accounts = accounts.map(acc => ({
        ...acc,
        balance: 0,
        available: 0,
        blocked: 0,
        overdraftLimit: 0,
      }));
    }

    // Calcular estatísticas
    const stats = {
      totalAccounts: accounts.length,
      totalBalance: accounts.reduce((sum, acc) => sum + acc.balance, 0),
      totalAvailable: accounts.reduce((sum, acc) => sum + acc.available, 0),
      institutions: [...new Set(accounts.map(acc => acc.institution.id))],
      accountTypes: [...new Set(accounts.map(acc => acc.accountType))],
    };

    return NextResponse.json({
      success: true,
      data: accounts,
      stats,
      total: accounts.length,
    });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/open-finance/accounts
 * Conecta uma nova conta bancária
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { institutionId, accountId, nickname } = body;

    if (!institutionId || !accountId) {
      return NextResponse.json(
        { error: 'Institution ID and Account ID are required' },
        { status: 400 }
      );
    }

    // Em uma implementação real, conectaríamos a conta através do fluxo OAuth2
    // Por enquanto, apenas simulamos a conexão

    const connectedAccount = {
      id: `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: session.user.id,
      institutionId,
      accountId,
      nickname: nickname || `Conta ${institutionId}`,
      connectedAt: new Date().toISOString(),
      status: 'CONNECTED',
      lastSyncAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: connectedAccount,
      message: 'Account connected successfully',
    });
  } catch (error) {
    console.error('Error connecting account:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/open-finance/accounts/:accountId
 * Atualiza informações de uma conta conectada
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');

    if (!accountId) {
      return NextResponse.json(
        { error: 'Account ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { nickname, isActive } = body;

    // Em uma implementação real, atualizaríamos no banco de dados
    const updatedAccount = {
      id: accountId,
      userId: session.user.id,
      nickname: nickname || 'Conta Atualizada',
      isActive: isActive !== false,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: updatedAccount,
      message: 'Account updated successfully',
    });
  } catch (error) {
    console.error('Error updating account:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/open-finance/accounts/:accountId
 * Desconecta uma conta bancária
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');

    if (!accountId) {
      return NextResponse.json(
        { error: 'Account ID is required' },
        { status: 400 }
      );
    }

    // Em uma implementação real, desconectaríamos a conta e revogaríamos o consentimento
    // Por enquanto, apenas simulamos a desconexão

    return NextResponse.json({
      success: true,
      message: 'Account disconnected successfully',
      disconnectedAccountId: accountId,
    });
  } catch (error) {
    console.error('Error disconnecting account:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
