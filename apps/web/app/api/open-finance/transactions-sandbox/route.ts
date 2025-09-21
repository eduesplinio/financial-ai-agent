import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';

// Conectar ao MongoDB
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(
    process.env.MONGODB_URI ||
      'mongodb+srv://esplinone_db_user:XyY0siKX2Ib2LZCw@cluster0.ih76fqj.mongodb.net/financial_ai?retryWrites=true&w=majority&appName=Cluster0'
  );
};

// Schema de transação
const TransactionSchema = new mongoose.Schema(
  {
    id: String,
    accountId: String,
    type: String,
    creditDebitType: String,
    amount: Number,
    currency: String,
    date: Date,
    valueDate: Date,
    description: String,
    status: String,
    category: {
      primary: String,
      secondary: String,
    },
    subcategory: String,
    counterparty: String,
    correlationId: String,
    details: String,
    tags: [String],
    isRecurring: Boolean,
    recurringPattern: String,
    institutionName: String,
  },
  { strict: false }
);

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model('Transaction', TransactionSchema);

/**
 * API para transações do Open Finance usando dados reais do banco
 */

/**
 * GET /api/open-finance/transactions-sandbox
 * Lista transações bancárias usando dados reais do banco de dados
 */
export async function GET(request: NextRequest) {
  try {
    // const session = await getServerSession(authOptions);

    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const institutionId = searchParams.get('institution_id');
    const accountId = searchParams.get('account_id');
    const fromDate = searchParams.get('from_date');
    const toDate = searchParams.get('to_date');
    const category = searchParams.get('category');
    const type = searchParams.get('type'); // 'credit', 'debit', 'all'
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Conectar ao banco de dados
    await connectDB();

    // Construir filtros para busca no banco
    const filters: any = {};

    if (institutionId) {
      filters.institutionName = institutionId;
    }

    if (accountId) {
      filters.accountId = accountId;
    }

    if (fromDate) {
      filters.date = { ...filters.date, $gte: new Date(fromDate) };
    }

    if (toDate) {
      filters.date = { ...filters.date, $lte: new Date(toDate) };
    }

    if (category) {
      filters['category.primary'] = category;
    }

    if (type && type !== 'all') {
      filters.creditDebitType = type.toUpperCase();
    }

    // Buscar transações reais do banco de dados
    const transactions = await Transaction.find(filters)
      .sort({ date: -1 }) // Mais recente primeiro
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Contar total de transações para paginação
    const totalTransactions = await Transaction.countDocuments(filters);

    // Converter para formato da API (os dados já estão no formato correto)
    const formattedTransactions = transactions.map(txn => ({
      id: txn.id || txn._id,
      accountId: txn.accountId,
      type: txn.type,
      creditDebitType: txn.creditDebitType,
      amount: txn.amount,
      currency: txn.currency || 'BRL',
      date: txn.date,
      valueDate: txn.valueDate,
      description: txn.description,
      status: txn.status || 'SETTLED',
      category: txn.category || { primary: 'Outros' },
      subcategory: txn.subcategory,
      counterparty: txn.counterparty,
      correlationId: txn.correlationId,
      details: txn.details,
      tags: txn.tags || [],
      isRecurring: txn.isRecurring || false,
      recurringPattern: txn.recurringPattern,
    }));

    // Calcular estatísticas
    const stats = {
      totalTransactions: totalTransactions,
      totalCredits: formattedTransactions
        .filter(txn => txn.creditDebitType === 'CREDIT')
        .reduce((sum, txn) => sum + txn.amount, 0),
      totalDebits: Math.abs(
        formattedTransactions
          .filter(txn => txn.creditDebitType === 'DEBIT')
          .reduce((sum, txn) => sum + txn.amount, 0)
      ),
      netAmount: formattedTransactions.reduce(
        (sum, txn) => sum + txn.amount,
        0
      ),
      categories: [
        ...new Set(formattedTransactions.map(txn => txn.category.primary)),
      ],
      accounts: [...new Set(formattedTransactions.map(txn => txn.accountId))],
    };

    return NextResponse.json({
      success: true,
      data: formattedTransactions,
      stats,
      pagination: {
        page,
        limit,
        total: totalTransactions,
        totalPages: Math.ceil(totalTransactions / limit),
        hasNext: page * limit < totalTransactions,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching transactions from database:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
