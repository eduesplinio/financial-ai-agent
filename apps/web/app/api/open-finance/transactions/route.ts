import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import type { TransactionData } from '@financial-ai/open-finance';
import { sandboxService } from '@/lib/sandbox-service';

/**
 * API para gerenciar transações bancárias do Open Finance
 */

/**
 * GET /api/open-finance/transactions
 * Lista transações bancárias do usuário
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

    // Em uma implementação real, buscaríamos do banco de dados
    // Por enquanto, retornamos dados simulados
    const mockTransactions: TransactionData[] = [
      {
        transactionId: 'txn_001',
        accountId: 'acc_bb_001',
        type: 'TRANSFER',
        creditDebitType: 'DEBIT',
        transactionAmount: -150.0,
        currency: 'BRL',
        transactionDate: '2024-01-15T10:30:00Z',
        valueDate: '2024-01-15T10:30:00Z',
        description: 'Transferência PIX para João Silva',
        status: 'COMPLETED',
        category: 'TRANSFER',
        counterparty: {
          name: 'João Silva',
          documentNumber: '12345678901',
          documentType: 'CPF',
          accountInfo: {
            accountType: 'CHECKING',
            branch: '1234',
            number: '56789-0',
            ispb: '00000000',
            bankName: 'Banco do Brasil',
          },
        },
        correlationId: 'corr_001',
        details: {
          pixKey: 'joao.silva@email.com',
          pixKeyType: 'EMAIL',
        },
      },
      {
        transactionId: 'txn_002',
        accountId: 'acc_bb_001',
        type: 'PAYMENT',
        creditDebitType: 'DEBIT',
        transactionAmount: -89.9,
        currency: 'BRL',
        transactionDate: '2024-01-14T14:20:00Z',
        valueDate: '2024-01-14T14:20:00Z',
        description: 'Pagamento Netflix',
        status: 'COMPLETED',
        category: 'ENTERTAINMENT',
        merchant: {
          name: 'Netflix',
          documentNumber: '12345678000199',
          documentType: 'CNPJ',
        },
        correlationId: 'corr_002',
        details: {
          subscriptionId: 'netflix_001',
          recurringPayment: true,
        },
      },
      {
        transactionId: 'txn_003',
        accountId: 'acc_bb_001',
        type: 'DEPOSIT',
        creditDebitType: 'CREDIT',
        transactionAmount: 5000.0,
        currency: 'BRL',
        transactionDate: '2024-01-13T09:00:00Z',
        valueDate: '2024-01-13T09:00:00Z',
        description: 'Salário - Empresa XYZ',
        status: 'COMPLETED',
        category: 'SALARY',
        counterparty: {
          name: 'Empresa XYZ Ltda',
          documentNumber: '12345678000199',
          documentType: 'CNPJ',
        },
        correlationId: 'corr_003',
        details: {
          payrollId: 'payroll_001',
          employeeId: 'emp_001',
        },
      },
      {
        transactionId: 'txn_004',
        accountId: 'acc_nubank_001',
        type: 'PURCHASE',
        creditDebitType: 'DEBIT',
        transactionAmount: -45.5,
        currency: 'BRL',
        transactionDate: '2024-01-12T16:45:00Z',
        valueDate: '2024-01-12T16:45:00Z',
        description: 'Supermercado ABC',
        status: 'COMPLETED',
        category: 'FOOD',
        merchant: {
          name: 'Supermercado ABC',
          documentNumber: '98765432000188',
          documentType: 'CNPJ',
        },
        correlationId: 'corr_004',
        details: {
          storeLocation: 'São Paulo - SP',
          itemsCount: 12,
        },
      },
      {
        transactionId: 'txn_005',
        accountId: 'acc_nubank_001',
        type: 'TRANSFER',
        creditDebitType: 'CREDIT',
        transactionAmount: 200.0,
        currency: 'BRL',
        transactionDate: '2024-01-11T11:15:00Z',
        valueDate: '2024-01-11T11:15:00Z',
        description: 'Transferência recebida de Maria Santos',
        status: 'COMPLETED',
        category: 'TRANSFER',
        counterparty: {
          name: 'Maria Santos',
          documentNumber: '98765432100',
          documentType: 'CPF',
        },
        correlationId: 'corr_005',
        details: {
          pixKey: 'maria.santos@email.com',
          pixKeyType: 'EMAIL',
        },
      },
    ];

    let transactions = mockTransactions;

    // Filtrar por instituição
    if (institutionId) {
      transactions = transactions.filter(txn => {
        // Em uma implementação real, buscaríamos a conta pela instituição
        return txn.accountId.includes(institutionId);
      });
    }

    // Filtrar por conta
    if (accountId) {
      transactions = transactions.filter(txn => txn.accountId === accountId);
    }

    // Filtrar por data
    if (fromDate) {
      const from = new Date(fromDate);
      transactions = transactions.filter(
        txn => new Date(txn.transactionDate) >= from
      );
    }

    if (toDate) {
      const to = new Date(toDate);
      transactions = transactions.filter(
        txn => new Date(txn.transactionDate) <= to
      );
    }

    // Filtrar por categoria
    if (category) {
      transactions = transactions.filter(
        txn => txn.category === category.toUpperCase()
      );
    }

    // Filtrar por tipo
    if (type && type !== 'all') {
      transactions = transactions.filter(
        txn => txn.creditDebitType === type.toUpperCase()
      );
    }

    // Ordenar por data (mais recente primeiro)
    transactions.sort(
      (a, b) =>
        new Date(b.transactionDate).getTime() -
        new Date(a.transactionDate).getTime()
    );

    // Paginação
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTransactions = transactions.slice(startIndex, endIndex);

    // Calcular estatísticas
    const stats = {
      totalTransactions: transactions.length,
      totalCredits: transactions
        .filter(txn => txn.creditDebitType === 'CREDIT')
        .reduce((sum, txn) => sum + txn.transactionAmount, 0),
      totalDebits: Math.abs(
        transactions
          .filter(txn => txn.creditDebitType === 'DEBIT')
          .reduce((sum, txn) => sum + txn.transactionAmount, 0)
      ),
      netAmount: transactions.reduce(
        (sum, txn) => sum + txn.transactionAmount,
        0
      ),
      categories: [...new Set(transactions.map(txn => txn.category))],
      accounts: [...new Set(transactions.map(txn => txn.accountId))],
    };

    return NextResponse.json({
      success: true,
      data: paginatedTransactions,
      stats,
      pagination: {
        page,
        limit,
        total: transactions.length,
        totalPages: Math.ceil(transactions.length / limit),
        hasNext: endIndex < transactions.length,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/open-finance/transactions
 * Cria uma nova transação (para testes ou importação manual)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      accountId,
      type,
      amount,
      description,
      category,
      transactionDate,
      counterparty,
    } = body;

    if (!accountId || !type || !amount || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Em uma implementação real, salvaríamos no banco de dados
    const newTransaction: TransactionData = {
      transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      accountId,
      type: type.toUpperCase(),
      creditDebitType: amount > 0 ? 'CREDIT' : 'DEBIT',
      transactionAmount: amount,
      currency: 'BRL',
      transactionDate: transactionDate || new Date().toISOString(),
      valueDate: transactionDate || new Date().toISOString(),
      description,
      status: 'COMPLETED',
      category: category || 'OTHER',
      counterparty,
      correlationId: `corr_${Date.now()}`,
      details: {},
    };

    return NextResponse.json({
      success: true,
      data: newTransaction,
      message: 'Transaction created successfully',
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/open-finance/transactions/:transactionId
 * Atualiza uma transação (categoria, descrição, etc.)
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('transactionId');

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { category, description, notes } = body;

    // Em uma implementação real, atualizaríamos no banco de dados
    const updatedTransaction = {
      transactionId,
      category: category || 'OTHER',
      description: description || 'Transação atualizada',
      notes: notes || '',
      updatedAt: new Date().toISOString(),
      updatedBy: session.user.id,
    };

    return NextResponse.json({
      success: true,
      data: updatedTransaction,
      message: 'Transaction updated successfully',
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
