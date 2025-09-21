import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sandboxService } from '@/lib/sandbox-service';

/**
 * API para transações do Open Finance usando sandbox real
 */

/**
 * GET /api/open-finance/transactions-sandbox
 * Lista transações bancárias usando dados reais do sandbox
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const institutionId = searchParams.get('institution_id');
    const accountId = searchParams.get('account_id');
    const fromDate = searchParams.get('from_date');
    const toDate = searchParams.get('to_date');
    const category = searchParams.get('category');
    const type = searchParams.get('type'); // 'credit', 'debit', 'all'
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!institutionId || !accountId) {
      return NextResponse.json(
        { error: 'Institution ID and Account ID are required' },
        { status: 400 }
      );
    }

    // Simular token de acesso (em produção, viria do banco de dados)
    const mockToken = `sandbox_token_${institutionId}_${Date.now()}`;

    // Buscar transações reais do sandbox
    const sandboxTransactions = await sandboxService.getTransactions(
      institutionId,
      accountId,
      mockToken,
      fromDate ? new Date(fromDate) : undefined,
      toDate ? new Date(toDate) : undefined
    );

    // Converter para formato da API
    const transactions = sandboxTransactions.map(txn => ({
      transactionId: txn.transactionId,
      accountId: txn.accountId,
      type: txn.type,
      creditDebitType: txn.creditDebitType,
      transactionAmount: txn.transactionAmount,
      currency: txn.currency,
      transactionDate: txn.transactionDate,
      valueDate: txn.transactionDate,
      description: txn.description,
      status: 'COMPLETED',
      category: txn.category,
      counterparty: txn.merchantName
        ? {
            name: txn.merchantName,
            documentNumber: '12345678000195',
            documentType: 'CNPJ' as const,
          }
        : undefined,
      correlationId: `corr_${txn.transactionId}`,
      details: txn.location
        ? {
            location: `${txn.location.city}, ${txn.location.state}`,
          }
        : undefined,
    }));

    // Aplicar filtros
    let filteredTransactions = transactions;

    if (fromDate) {
      const from = new Date(fromDate);
      filteredTransactions = filteredTransactions.filter(
        txn => new Date(txn.transactionDate) >= from
      );
    }

    if (toDate) {
      const to = new Date(toDate);
      filteredTransactions = filteredTransactions.filter(
        txn => new Date(txn.transactionDate) <= to
      );
    }

    if (category) {
      filteredTransactions = filteredTransactions.filter(
        txn => txn.category === category.toUpperCase()
      );
    }

    if (type && type !== 'all') {
      filteredTransactions = filteredTransactions.filter(
        txn => txn.creditDebitType === type.toUpperCase()
      );
    }

    // Ordenar por data (mais recente primeiro)
    filteredTransactions.sort(
      (a, b) =>
        new Date(b.transactionDate).getTime() -
        new Date(a.transactionDate).getTime()
    );

    // Paginação
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTransactions = filteredTransactions.slice(
      startIndex,
      endIndex
    );

    // Calcular estatísticas
    const stats = {
      totalTransactions: filteredTransactions.length,
      totalCredits: filteredTransactions
        .filter(txn => txn.creditDebitType === 'CREDIT')
        .reduce((sum, txn) => sum + txn.transactionAmount, 0),
      totalDebits: Math.abs(
        filteredTransactions
          .filter(txn => txn.creditDebitType === 'DEBIT')
          .reduce((sum, txn) => sum + txn.transactionAmount, 0)
      ),
      netAmount: filteredTransactions.reduce(
        (sum, txn) => sum + txn.transactionAmount,
        0
      ),
      categories: [...new Set(filteredTransactions.map(txn => txn.category))],
      accounts: [...new Set(filteredTransactions.map(txn => txn.accountId))],
    };

    return NextResponse.json({
      success: true,
      data: paginatedTransactions,
      stats,
      pagination: {
        page,
        limit,
        total: filteredTransactions.length,
        totalPages: Math.ceil(filteredTransactions.length / limit),
        hasNext: endIndex < filteredTransactions.length,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching transactions from sandbox:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/open-finance/transactions-sandbox
 * Simula uma nova transação no sandbox (para testes)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { institutionId, accountId, amount, description, type } = body;

    if (!institutionId || !accountId || !amount || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Simular criação de transação no sandbox
    const mockToken = `sandbox_token_${institutionId}_${Date.now()}`;

    // Em um ambiente real, isso criaria uma transação real
    // Por enquanto, apenas simulamos a resposta
    const simulatedTransaction = {
      transactionId: `txn_sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      accountId,
      type: type || 'PURCHASE',
      creditDebitType: amount > 0 ? 'CREDIT' : 'DEBIT',
      transactionAmount: amount,
      currency: 'BRL',
      transactionDate: new Date().toISOString(),
      valueDate: new Date().toISOString(),
      description,
      status: 'PENDING',
      category: type || 'PURCHASE',
      correlationId: `corr_sim_${Date.now()}`,
    };

    return NextResponse.json({
      success: true,
      data: simulatedTransaction,
      message: 'Transaction simulated successfully in sandbox',
    });
  } catch (error) {
    console.error('Error simulating transaction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
