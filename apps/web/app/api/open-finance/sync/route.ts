import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  SyncService,
  OpenFinanceClient,
  OpenFinanceAuth,
} from '@financial-ai/open-finance';
import type {
  SyncConfig,
  AccountSyncOptions,
  TransactionSyncOptions,
} from '@financial-ai/open-finance';

/**
 * API para sincronização de dados bancários do Open Finance
 */

// Configurações para cada instituição (apenas Nubank por enquanto)
const INSTITUTION_CONFIGS = {
  nubank: {
    baseUrl: 'https://api.nubank.com.br/open-banking',
    clientId: process.env.NUBANK_CLIENT_ID || 'nubank-client-id',
    clientSecret: process.env.NUBANK_CLIENT_SECRET || 'nubank-client-secret',
    authUrl: 'https://auth.nubank.com.br',
  },
};

/**
 * GET /api/open-finance/sync
 * Lista status de sincronização do usuário
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const institutionId = searchParams.get('institution_id');

    // Em uma implementação real, buscaríamos do banco de dados
    // Por enquanto, retornamos dados simulados
    const syncStatus = {
      userId: session.user.id,
      lastSync: new Date().toISOString(),
      institutions: institutionId
        ? [institutionId]
        : Object.keys(INSTITUTION_CONFIGS),
      totalAccounts: 0,
      totalTransactions: 0,
      lastTransactionSync: null,
    };

    return NextResponse.json({
      success: true,
      data: syncStatus,
    });
  } catch (error) {
    console.error('Error fetching sync status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/open-finance/sync
 * Inicia sincronização de dados bancários
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
      syncType = 'all', // 'accounts', 'transactions', 'all'
      options = {},
    } = body;

    if (!institutionId) {
      return NextResponse.json(
        { error: 'Institution ID is required' },
        { status: 400 }
      );
    }

    // Verificar se a instituição está configurada
    const config = INSTITUTION_CONFIGS[institutionId];
    if (!config) {
      return NextResponse.json(
        { error: 'Institution not supported' },
        { status: 400 }
      );
    }

    // Criar instâncias dos serviços
    const client = new OpenFinanceClient({
      baseUrl: config.baseUrl,
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      authUrl: config.authUrl,
      useAuth: true,
    });

    const auth = new OpenFinanceAuth({
      baseUrl: config.baseUrl,
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      authUrl: config.authUrl,
    });

    const syncService = new SyncService({
      client,
      auth,
      cacheLifetime: 5 * 60 * 1000, // 5 minutos
    });

    const results: any = {
      institutionId,
      userId: session.user.id,
      syncType,
      timestamp: new Date().toISOString(),
      results: {},
    };

    try {
      // Sincronizar contas se solicitado
      if (syncType === 'accounts' || syncType === 'all') {
        console.log(`Syncing accounts for institution: ${institutionId}`);

        const accountOptions: AccountSyncOptions = {
          forceRefresh: options.forceRefresh || false,
          includeBalances: options.includeBalances !== false,
          includeCreditCards: options.includeCreditCards !== false,
        };

        const accountResult = await syncService.syncAccounts(
          institutionId,
          accountOptions
        );
        results.results.accounts = {
          status: accountResult.status,
          count: accountResult.data?.length || 0,
          error: accountResult.error,
        };

        // Em uma implementação real, salvaríamos as contas no banco de dados
        if (accountResult.data) {
          console.log(`Found ${accountResult.data.length} accounts`);
          // Salvar contas no banco de dados associadas ao usuário
        }
      }

      // Sincronizar transações se solicitado
      if (syncType === 'transactions' || syncType === 'all') {
        console.log(`Syncing transactions for institution: ${institutionId}`);

        const transactionOptions: TransactionSyncOptions = {
          forceRefresh: options.forceRefresh || false,
          fromDate: options.fromDate ? new Date(options.fromDate) : undefined,
          toDate: options.toDate ? new Date(options.toDate) : undefined,
          pageSize: options.pageSize || 100,
          includeDetails: options.includeDetails !== false,
        };

        // Em uma implementação real, buscaríamos as contas do usuário para esta instituição
        // Por enquanto, vamos simular com uma conta
        const mockAccountId = `account_${institutionId}_001`;

        const transactionResult = await syncService.syncTransactions(
          institutionId,
          mockAccountId,
          transactionOptions
        );

        results.results.transactions = {
          status: transactionResult.status,
          count: transactionResult.data?.length || 0,
          error: transactionResult.error,
        };

        // Em uma implementação real, salvaríamos as transações no banco de dados
        if (transactionResult.data) {
          console.log(`Found ${transactionResult.data.length} transactions`);
          // Salvar transações no banco de dados associadas ao usuário
        }
      }

      return NextResponse.json({
        success: true,
        data: results,
        message: 'Sync completed successfully',
      });
    } catch (syncError: any) {
      console.error('Error during sync:', syncError);

      return NextResponse.json(
        {
          success: false,
          error: syncError.message || 'Sync failed',
          data: results,
        },
        { status: 500 }
      );
    } finally {
      // Limpar recursos
      syncService.dispose();
    }
  } catch (error) {
    console.error('Error initiating sync:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/open-finance/sync
 * Limpa cache de sincronização
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const institutionId = searchParams.get('institution_id');
    const cacheKey = searchParams.get('cache_key');

    // Em uma implementação real, limparíamos o cache do serviço de sincronização
    // Por enquanto, apenas retornamos sucesso

    return NextResponse.json({
      success: true,
      message: 'Cache cleared successfully',
      clearedKeys: cacheKey ? [cacheKey] : 'all',
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
