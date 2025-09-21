'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown, TrendingUp, TrendingDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface FinancialDashboardProps {
  userId?: string;
}

interface DashboardData {
  balance: number;
  income: number;
  expenses: number;
  savings: number;
  monthlyTrend: Array<{ month: string; income: number; expenses: number }>;
  categoryExpenses: Array<{ category: string; amount: number; color: string }>;
  connectedAccounts: Array<{
    id: string;
    institutionName: string;
    balance: number;
    accountType: string;
  }>;
  recentTransactions: Array<{
    id: string;
    description: string;
    amount: number;
    date: string;
    category: string;
  }>;
}

export function FinancialDashboard({ userId }: FinancialDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  // Buscar dados reais do dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Buscar dados das contas conectadas
        const accountsResponse = await fetch('/api/open-finance/accounts');
        const accountsData = await accountsResponse.json();

        // Buscar transações
        const transactionsResponse = await fetch(
          '/api/open-finance/transactions-sandbox'
        );
        const transactionsData = await transactionsResponse.json();

        if (accountsData.success && transactionsData.success) {
          const accounts = accountsData.data || [];
          const transactions = transactionsData.data || [];

          // Calcular métricas
          const totalBalance = accounts.reduce(
            (sum: number, acc: any) => sum + (acc.balance || 0),
            0
          );
          const income = transactions
            .filter((tx: any) => tx.amount > 0)
            .reduce((sum: number, tx: any) => sum + tx.amount, 0);
          const expenses = Math.abs(
            transactions
              .filter((tx: any) => tx.amount < 0)
              .reduce((sum: number, tx: any) => sum + tx.amount, 0)
          );

          // Agrupar gastos por categoria
          const categoryMap = new Map();
          transactions
            .filter((tx: any) => tx.amount < 0)
            .forEach((tx: any) => {
              const category = tx.category?.primary || 'Outros';
              const amount = Math.abs(tx.amount);
              categoryMap.set(
                category,
                (categoryMap.get(category) || 0) + amount
              );
            });

          const categoryExpenses = Array.from(categoryMap.entries()).map(
            ([category, amount], index) => ({
              category,
              amount,
              color: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9F40',
              ][index % 6],
            })
          );

          // Dados de tendência mensal (simulados baseados nos dados atuais)
          const monthlyTrend = [
            { month: 'Abr', income: income * 0.95, expenses: expenses * 1.1 },
            { month: 'Mai', income: income * 0.98, expenses: expenses * 1.05 },
            { month: 'Jun', income: income * 1.02, expenses: expenses * 0.95 },
            { month: 'Jul', income: income * 0.99, expenses: expenses * 1.08 },
            { month: 'Ago', income: income * 1.01, expenses: expenses * 0.97 },
            { month: 'Set', income: income, expenses: expenses },
          ];

          // Transações recentes
          const recentTransactions = transactions
            .sort(
              (a: any, b: any) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .slice(0, 5)
            .map((tx: any) => ({
              id: tx.id,
              description: tx.description,
              amount: tx.amount,
              date: new Date(tx.date).toLocaleDateString('pt-BR'),
              category: tx.category?.primary || 'Outros',
            }));

          setDashboardData({
            balance: totalBalance,
            income,
            expenses,
            savings: totalBalance * 0.6, // Simulado
            monthlyTrend,
            categoryExpenses,
            connectedAccounts: accounts.map((acc: any) => ({
              id: acc.id,
              institutionName: acc.institutionName,
              balance: acc.balance || 0,
              accountType: acc.accountType,
            })),
            recentTransactions,
          });
        }
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [selectedPeriod]);

  // Dados mock como fallback
  const mockData = {
    balance: 2847.5,
    income: 10200.0,
    expenses: 7372.5,
    savings: 1500.0,
    monthlyTrend: [
      { month: 'Abr', income: 9690, expenses: 8109 },
      { month: 'Mai', income: 9996, expenses: 7737 },
      { month: 'Jun', income: 10404, expenses: 6998 },
      { month: 'Jul', income: 10098, expenses: 7962 },
      { month: 'Ago', income: 10302, expenses: 7151 },
      { month: 'Set', income: 10200, expenses: 7372 },
    ],
    categoryExpenses: [
      { category: 'ALIMENTACAO', amount: 570, color: '#FF6384' },
      { category: 'TRANSPORTE', amount: 365, color: '#36A2EB' },
      { category: 'MORADIA', amount: 1200, color: '#FFCE56' },
      { category: 'SAUDE', amount: 320, color: '#4BC0C0' },
      { category: 'ENTRETENIMENTO', amount: 109, color: '#9966FF' },
      { category: 'UTILIDADES', amount: 530, color: '#FF9F40' },
    ],
  };

  const data = dashboardData || mockData;

  // Configuração do gráfico de tendências
  const trendChartData = {
    labels: data.monthlyTrend.map(item => item.month),
    datasets: [
      {
        label: 'Receitas',
        data: data.monthlyTrend.map(item => item.income),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Gastos',
        data: data.monthlyTrend.map(item => item.expenses),
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
      },
    ],
  };

  // Configuração do gráfico de gastos por categoria
  const categoryChartData = {
    labels: data.categoryExpenses.map(item => item.category),
    datasets: [
      {
        data: data.categoryExpenses.map(item => item.amount),
        backgroundColor: data.categoryExpenses.map(item => item.color),
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return 'R$ ' + value.toLocaleString('pt-BR');
          },
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '90%', // borda fina
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Header com controles */}
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <p className="text-muted-foreground">
            Acompanhe suas finanças em tempo real
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2 w-full md:w-auto">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
              <SelectItem value="90d">Últimos 90 dias</SelectItem>
              <SelectItem value="1y">Último ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="w-full sm:w-auto">
            <FileDown className="mr-2" size={18} /> Exportar Relatório
          </Button>
        </div>
      </div>

      {/* Cards de métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800 dark:text-green-300">
              Saldo Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              R${' '}
              {data.balance.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-green-700/70 dark:text-green-300/70">
              +5.2% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-300">
              Receitas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              R${' '}
              {data.income.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-blue-700/70 dark:text-blue-300/70">
              +2.1% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card className="bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800 dark:text-red-300">
              Gastos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              R${' '}
              {data.expenses.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-red-700/70 dark:text-red-300/70">
              -3.4% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card className="bg-purple-100 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-300">
              Investimentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              R${' '}
              {data.savings.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-purple-700/70 dark:text-purple-300/70">
              +8.7% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de tendências */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="xl:col-span-2 bg-muted/40">
          <CardHeader>
            <CardTitle>Tendência Mensal</CardTitle>
            <CardDescription>
              Evolução das receitas e gastos nos últimos meses
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-muted/30 rounded-lg">
            <div className="h-[300px]">
              <Line data={trendChartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de categorias e detalhamento lado a lado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de gastos por categoria */}
        <Card className="bg-muted/40">
          <CardHeader>
            <CardTitle>Gastos por Categoria</CardTitle>
            <CardDescription>
              Distribuição dos seus gastos por categoria
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-muted/30 rounded-lg">
            <div className="h-[300px]">
              <Doughnut data={categoryChartData} options={doughnutOptions} />
            </div>
          </CardContent>
        </Card>
        {/* Detalhamento por categoria */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhamento por Categoria</CardTitle>
            <CardDescription>
              Análise detalhada dos gastos por categoria no período selecionado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.categoryExpenses.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ background: `${item.color}22` }}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {item.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-800 dark:text-gray-200">
                      R${' '}
                      {item.amount.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                    <div className="text-xs opacity-90 text-gray-700 dark:text-gray-300">
                      {((item.amount / data.expenses) * 100).toFixed(1)}% do
                      total
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contas Conectadas e Transações Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contas Conectadas */}
        <Card>
          <CardHeader>
            <CardTitle>Contas Conectadas</CardTitle>
            <CardDescription>Suas contas bancárias integradas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.connectedAccounts?.map(account => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-100 dark:border-purple-800"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                      <span className="text-white font-bold text-sm">N</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-800 dark:text-gray-200">
                        {account.institutionName}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {account.accountType}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-800 dark:text-gray-200">
                      R${' '}
                      {account.balance.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400">
                      Ativo
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transações Recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Transações Recentes</CardTitle>
            <CardDescription>
              Últimas movimentações da sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentTransactions?.map(transaction => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${transaction.amount > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                    >
                      {transaction.amount > 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800 dark:text-gray-200">
                        {transaction.description}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {transaction.category} • {transaction.date}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {transaction.amount > 0 ? '+' : ''}R${' '}
                    {Math.abs(transaction.amount).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
