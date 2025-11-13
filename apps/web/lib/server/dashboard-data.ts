import { getDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export interface DashboardData {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  totalInvestments: number;
  transactions: any[];
  categoryExpenses: Array<{
    category: string;
    amount: number;
    color: string;
  }>;
  monthlyTrend: Array<{
    month: string;
    income: number;
    expenses: number;
  }>;
  statistics: {
    totalCredits: number;
    totalDebits: number;
    uniqueCategories: string[];
  };
}

const categoryColors = [
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#4BC0C0',
  '#9966FF',
  '#FF9F40',
  '#10B981',
  '#EF4444',
  '#F59E42',
  '#A3E635',
];

export async function getDashboardData(): Promise<DashboardData | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const db = await getDatabase();
  const transactions = await db
    .collection('transactions')
    .find({ userId: session.user.id, deletedAt: { $exists: false } })
    .sort({ date: -1 })
    .limit(1000)
    .toArray();

  const txs = transactions.map(tx => ({
    ...tx,
    _id: tx._id.toString(),
  }));

  const totalCredits = txs
    .filter(tx => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalDebits = Math.abs(
    txs.filter(tx => tx.amount < 0).reduce((sum, tx) => sum + tx.amount, 0)
  );

  const totalIncome = txs
    .filter(tx => tx.category?.primary === 'Receita')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalInvestments = txs
    .filter(tx => tx.category?.primary === 'Investimento')
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const catMap: Record<string, { amount: number; color: string }> = {};
  txs.forEach((tx, idx) => {
    const cat = tx.category?.primary || tx.category;
    if (
      cat &&
      typeof cat === 'string' &&
      cat !== 'Receita' &&
      cat !== 'Investimento'
    ) {
      if (!catMap[cat]) {
        catMap[cat] = {
          amount: 0,
          color: categoryColors[idx % categoryColors.length],
        };
      }
      catMap[cat].amount += Math.abs(tx.amount);
    }
  });

  const categoryExpenses = Object.entries(catMap).map(([category, obj]) => ({
    category,
    amount: obj.amount,
    color: obj.color,
  }));

  const months: Record<string, { income: number; expenses: number }> = {};
  txs.forEach(tx => {
    const d = new Date(tx.date);
    const month = d.toLocaleString('pt-BR', {
      month: 'short',
      year: '2-digit',
    });
    if (!months[month]) months[month] = { income: 0, expenses: 0 };
    if (tx.amount > 0) months[month].income += tx.amount;
    else months[month].expenses += Math.abs(tx.amount);
  });

  const monthlyTrend = Object.entries(months)
    .map(([month, v]) => ({ month, ...v }))
    .sort((a, b) => a.month.localeCompare(b.month));

  const uniqueCategories = Array.from(
    new Set(
      txs
        .map(tx => tx.category?.primary || tx.category)
        .filter(cat => cat && typeof cat === 'string')
    )
  );

  return {
    totalBalance: totalCredits - totalDebits,
    totalIncome,
    totalExpenses: totalDebits,
    totalInvestments,
    transactions: txs,
    categoryExpenses,
    monthlyTrend,
    statistics: {
      totalCredits,
      totalDebits,
      uniqueCategories,
    },
  };
}
