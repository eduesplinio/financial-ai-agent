import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import type { AccountData } from '@financial-ai/open-finance';
import { sandboxService, SandboxAccount } from '@/lib/sandbox-service';
import {
  realisticSandboxService,
  RealisticAccount,
} from '@/lib/realistic-sandbox';

// Armazenamento temporário em memória para demonstração
// Em produção, isso seria feito no banco de dados
const connectedAccountsStore = new Map<string, any[]>();

// Inicializar com todas as instituições conectadas automaticamente
const initializeConnectedAccounts = () => {
  const institutions = [
    'banco-do-brasil',
    'caixa-economica',
    'bradesco',
    'itau',
    'santander',
    'nubank',
  ];

  institutions.forEach(institutionId => {
    const mockAccount = {
      accountId: `acc_${institutionId}_001`,
      institutionId,
      institutionName: getInstitutionName(institutionId),
      accountType: 'CHECKING',
      nickname: `Conta Corrente ${getInstitutionName(institutionId)}`,
      connectedAt: new Date().toISOString(),
      status: 'ACTIVE',
      lastSyncAt: new Date().toISOString(),
    };

    if (!connectedAccountsStore.has('demo_user')) {
      connectedAccountsStore.set('demo_user', []);
    }

    const userAccounts = connectedAccountsStore.get('demo_user') || [];
    if (!userAccounts.find(acc => acc.institutionId === institutionId)) {
      userAccounts.push(mockAccount);
      connectedAccountsStore.set('demo_user', userAccounts);
    }
  });
};

const getInstitutionName = (institutionId: string): string => {
  const names: Record<string, string> = {
    'banco-do-brasil': 'Banco do Brasil',
    'caixa-economica': 'Caixa Econômica Federal',
    bradesco: 'Bradesco',
    itau: 'Itaú Unibanco',
    santander: 'Santander',
    nubank: 'Nubank',
  };
  return names[institutionId] || institutionId;
};

// Inicializar contas conectadas
initializeConnectedAccounts();

// Função para adicionar conta conectada
export function addConnectedAccount(userId: string, account: any) {
  const userAccounts = connectedAccountsStore.get(userId) || [];
  userAccounts.push(account);
  connectedAccountsStore.set(userId, userAccounts);
}

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

    // Buscar contas conectadas do usuário
    const userAccounts = connectedAccountsStore.get(session.user.id) || [];

    // Dados simulados iniciais (apenas se não houver contas conectadas)
    const mockConnectedAccounts = [
      {
        id: 'conn_bb_001',
        institutionId: 'banco-do-brasil',
        accountId: 'acc_bb_001',
        nickname: 'Conta Corrente Principal',
        connectedAt: '2024-01-15T10:30:00Z',
        status: 'CONNECTED' as const,
        lastSyncAt: '2024-01-20T14:22:00Z',
      },
      {
        id: 'conn_nubank_001',
        institutionId: 'nubank',
        accountId: 'acc_nubank_001',
        nickname: 'Conta Poupança Nubank',
        connectedAt: '2024-01-10T09:15:00Z',
        status: 'CONNECTED' as const,
        lastSyncAt: '2024-01-20T14:22:00Z',
      },
    ];

    // Se não há contas conectadas, usar dados de demonstração
    if (userAccounts.length === 0) {
      userAccounts.push(...mockConnectedAccounts);
    }

    // Para contas conectadas, buscar dados reais do sandbox
    const accountsWithData = await Promise.all(
      userAccounts.map(async account => {
        try {
          // Simular token de acesso (em produção, viria do banco de dados)
          const mockToken = `sandbox_token_${account.institutionId}_${Date.now()}`;

          // Buscar dados realistas da conta no sandbox
          const realisticAccounts =
            await realisticSandboxService.getRealisticAccounts(
              account.institutionId,
              mockToken
            );
          const realisticAccount = realisticAccounts.find(
            acc => acc.accountId === account.accountId
          );

          if (realisticAccount) {
            return {
              ...account,
              // Adicionar dados realistas do sandbox
              balance: realisticAccount.balance,
              available: realisticAccount.available,
              blocked: realisticAccount.blocked,
              accountType: realisticAccount.accountType,
              currency: realisticAccount.currency,
              status: realisticAccount.status,
              lastSyncAt: new Date().toISOString(),
              // Dados adicionais realistas
              customer: realisticAccount.customer,
              monthlyAverageBalance: realisticAccount.monthlyAverageBalance,
              transactionCount: realisticAccount.transactionCount,
              overdraftLimit: realisticAccount.overdraftLimit,
            };
          }

          return account;
        } catch (error) {
          console.error(
            `Error fetching sandbox data for ${account.institutionId}:`,
            error
          );
          return account;
        }
      })
    );

    let accounts = accountsWithData;

    // Filtrar por instituição
    if (institutionId) {
      accounts = accounts.filter(acc => acc.institutionId === institutionId);
    }

    // Calcular estatísticas
    const stats = {
      totalAccounts: accounts.length,
      institutions: [...new Set(accounts.map(acc => acc.institutionId))],
      connectedAccounts: accounts.filter(acc => acc.status === 'CONNECTED')
        .length,
      disconnectedAccounts: accounts.filter(
        acc => acc.status === 'DISCONNECTED'
      ).length,
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
