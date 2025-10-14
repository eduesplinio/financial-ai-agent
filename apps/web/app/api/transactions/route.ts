import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';

/**
 * GET /api/transactions
 * Lista transações do usuário com filtros e paginação
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);

    // Parâmetros de filtro
    const accountId = searchParams.get('accountId');
    const category = searchParams.get('category');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const type = searchParams.get('type'); // CREDIT, DEBIT
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const db = await getDatabase();
    const transactions = db.collection('transactions');

    // Construir filtro
    const filter: any = {
      userId: userId,
      deletedAt: { $exists: false },
    };

    if (accountId) {
      filter.accountId = accountId;
    }

    if (category) {
      filter['category.primary'] = {
        $regex: new RegExp(`^${category}$`, 'i'),
      };
    }

    if (type) {
      filter.type = type;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }

    // Buscar transações com paginação
    const userTransactions = await transactions
      .find(filter)
      .sort({ date: -1 })
      .skip(offset)
      .limit(limit)
      .toArray();

    // Contar total
    const total = await transactions.countDocuments(filter);

    // Calcular estatísticas
    const stats = await transactions
      .aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            totalTransactions: { $sum: 1 },
            totalCredits: {
              $sum: {
                $cond: [{ $gt: ['$amount', 0] }, '$amount', 0],
              },
            },
            totalDebits: {
              $sum: {
                $cond: [{ $lt: ['$amount', 0] }, { $abs: '$amount' }, 0],
              },
            },
            avgAmount: { $avg: '$amount' },
            categories: {
              $addToSet: {
                $toLower: {
                  $ifNull: [{ $toString: '$category.primary' }, ''],
                },
              },
            },
          },
        },
      ])
      .toArray();

    const statistics = stats[0] || {
      totalTransactions: 0,
      totalCredits: 0,
      totalDebits: 0,
      avgAmount: 0,
      categories: [],
    };

    // Transformar dados para resposta
    const transactionsResponse = userTransactions.map(transaction => ({
      id: transaction._id.toString(),
      accountId: transaction.accountId,
      institutionId: transaction.institutionId,
      amount: transaction.amount,
      currency: transaction.currency,
      date: transaction.date,
      description: transaction.description,
      category: transaction.category,
      merchant: transaction.merchant,
      type: transaction.type,
      status: transaction.status,
      metadata: transaction.metadata,
      createdAt: transaction.createdAt,
    }));

    return NextResponse.json({
      transactions: transactionsResponse,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
      statistics: {
        totalTransactions: statistics.totalTransactions,
        totalCredits: Math.round(statistics.totalCredits * 100) / 100,
        totalDebits: Math.round(statistics.totalDebits * 100) / 100,
        avgAmount: Math.round(statistics.avgAmount * 100) / 100,
        categories: statistics.categories.length,
        uniqueCategories: statistics.categories,
      },
      filters: {
        accountId: accountId || null,
        category: category || null,
        startDate: startDate || null,
        endDate: endDate || null,
        type: type || null,
      },
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
