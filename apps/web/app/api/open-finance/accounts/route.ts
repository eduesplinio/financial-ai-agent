import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import type { AccountData } from '@financial-ai/open-finance';
import { sandboxService, SandboxAccount } from '@/lib/sandbox-service';
import {
  realisticSandboxService,
  RealisticAccount,
} from '@/lib/realistic-sandbox';
import { UserService } from '@financial-ai/database';

const getInstitutionName = (institutionId: string): string => {
  const names: Record<string, string> = {
    nubank: 'Nubank',
  };
  return names[institutionId] || institutionId;
};

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

    // Buscar usuário do banco de dados
    const user = await UserService.findByEmail(session.user.email || '');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Buscar contas conectadas do usuário do banco de dados
    let userAccounts = user.connectedAccounts || [];

    // Se não há contas conectadas, criar conta Nubank padrão
    if (userAccounts.length === 0) {
      const defaultNubankAccount = {
        id: 'conn_nubank_001',
        institutionId: 'nubank',
        institutionName: 'Nubank',
        accountType: 'checking' as const,
        accountNumber: 'acc_nubank_001',
        balance: 2847.5,
        currency: 'BRL',
        consentId: 'consent_nubank_demo',
        consentExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 ano
        lastSyncAt: new Date(),
        isActive: true,
        metadata: {
          nickname: 'Conta Nubank',
          connectedAt: '2024-01-10T09:15:00Z',
        },
      };

      // Adicionar conta padrão ao usuário
      user.connectedAccounts.push(defaultNubankAccount);
      await user.save();

      userAccounts = user.connectedAccounts;
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
            acc => acc.accountId === account.accountNumber
          );

          if (realisticAccount) {
            return {
              id: account.id,
              institutionId: account.institutionId,
              institutionName: account.institutionName,
              accountId: account.accountNumber,
              nickname:
                account.metadata?.nickname ||
                `Conta ${account.institutionName}`,
              accountType: realisticAccount.accountType,
              balance: realisticAccount.balance,
              currency: realisticAccount.currency,
              isActive: account.isActive,
              connectedAt:
                account.metadata?.connectedAt ||
                account.lastSyncAt?.toISOString(),
              lastSyncAt: new Date().toISOString(),
              // Dados adicionais realistas
              customer: realisticAccount.customer,
              monthlyAverageBalance: realisticAccount.monthlyAverageBalance,
              transactionCount: realisticAccount.transactionCount,
              overdraftLimit: realisticAccount.overdraftLimit,
              available: realisticAccount.available,
              blocked: realisticAccount.blocked,
              status: realisticAccount.status,
            };
          }

          // Retornar dados básicos se não encontrar no sandbox
          return {
            id: account.id,
            institutionId: account.institutionId,
            institutionName: account.institutionName,
            accountId: account.accountNumber,
            nickname:
              account.metadata?.nickname || `Conta ${account.institutionName}`,
            accountType: account.accountType,
            balance: account.balance || 0,
            currency: account.currency,
            isActive: account.isActive,
            connectedAt:
              account.metadata?.connectedAt ||
              account.lastSyncAt?.toISOString(),
            lastSyncAt: account.lastSyncAt?.toISOString(),
          };
        } catch (error) {
          console.error(
            `Error fetching sandbox data for ${account.institutionId}:`,
            error
          );
          // Retornar dados básicos em caso de erro
          return {
            id: account.id,
            institutionId: account.institutionId,
            institutionName: account.institutionName,
            accountId: account.accountNumber,
            nickname:
              account.metadata?.nickname || `Conta ${account.institutionName}`,
            accountType: account.accountType,
            balance: account.balance || 0,
            currency: account.currency,
            isActive: account.isActive,
            connectedAt:
              account.metadata?.connectedAt ||
              account.lastSyncAt?.toISOString(),
            lastSyncAt: account.lastSyncAt?.toISOString(),
          };
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
    const {
      institutionId,
      accountId,
      nickname,
      accessToken,
      refreshToken,
      consentId,
    } = body;

    if (!institutionId || !accountId) {
      return NextResponse.json(
        { error: 'Institution ID and Account ID are required' },
        { status: 400 }
      );
    }

    // Buscar usuário do banco de dados
    const user = await UserService.findByEmail(session.user.email || '');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verificar se a conta já existe
    const existingAccount = user.connectedAccounts.find(
      acc =>
        acc.institutionId === institutionId && acc.accountNumber === accountId
    );

    if (existingAccount) {
      return NextResponse.json(
        { error: 'Account already connected' },
        { status: 409 }
      );
    }

    // Criar nova conta conectada
    const connectedAccount = {
      id: `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      institutionId,
      institutionName: getInstitutionName(institutionId),
      accountType: 'checking' as const,
      accountNumber: accountId,
      balance: 0,
      currency: 'BRL',
      consentId: consentId || `consent_${institutionId}_${Date.now()}`,
      consentExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 ano
      lastSyncAt: new Date(),
      isActive: true,
      metadata: {
        nickname: nickname || `Conta ${getInstitutionName(institutionId)}`,
        connectedAt: new Date().toISOString(),
        accessToken,
        refreshToken,
      },
    };

    // Adicionar conta ao usuário
    user.connectedAccounts.push(connectedAccount);
    await user.save();

    return NextResponse.json({
      success: true,
      data: {
        id: connectedAccount.id,
        institutionId: connectedAccount.institutionId,
        institutionName: connectedAccount.institutionName,
        accountId: connectedAccount.accountNumber,
        nickname: connectedAccount.metadata.nickname,
        connectedAt: connectedAccount.metadata.connectedAt,
        status: 'CONNECTED',
        lastSyncAt: connectedAccount.lastSyncAt.toISOString(),
      },
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
