'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
// ...existing code...
import { useState } from 'react';
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

export function FinancialDashboard({ userId }: FinancialDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  // Mock de dados financeiros
  const mockData = {
    balance: 12450.75,
    income: 8500.0,
    expenses: 3200.5,
    savings: 9250.25,
    monthlyTrend: [
      { month: 'Jan', income: 8000, expenses: 3500 },
      { month: 'Fev', income: 8200, expenses: 3200 },
      { month: 'Mar', income: 8500, expenses: 3000 },
      { month: 'Abr', income: 8300, expenses: 3400 },
      { month: 'Mai', income: 8700, expenses: 3100 },
      { month: 'Jun', income: 8500, expenses: 3200 },
    ],
    categoryExpenses: [
      { category: 'Alimentação', amount: 850, color: '#FF6384' },
      { category: 'Transporte', amount: 420, color: '#36A2EB' },
      { category: 'Moradia', amount: 1200, color: '#FFCE56' },
      { category: 'Saúde', amount: 300, color: '#4BC0C0' },
      { category: 'Lazer', amount: 280, color: '#9966FF' },
      { category: 'Outros', amount: 150, color: '#FF9F40' },
    ],
  };

  // Configuração do gráfico de tendências
  const trendChartData = {
    labels: mockData.monthlyTrend.map(item => item.month),
    datasets: [
      {
        label: 'Receitas',
        data: mockData.monthlyTrend.map(item => item.income),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Gastos',
        data: mockData.monthlyTrend.map(item => item.expenses),
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
      },
    ],
  };

  // Configuração do gráfico de gastos por categoria
  const categoryChartData = {
    labels: mockData.categoryExpenses.map(item => item.category),
    datasets: [
      {
        data: mockData.categoryExpenses.map(item => item.amount),
        backgroundColor: mockData.categoryExpenses.map(item => item.color),
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
              {mockData.balance.toLocaleString('pt-BR', {
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
              {mockData.income.toLocaleString('pt-BR', {
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
              {mockData.expenses.toLocaleString('pt-BR', {
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
              {mockData.savings.toLocaleString('pt-BR', {
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
              {mockData.categoryExpenses.map((item, index) => (
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
                      {((item.amount / mockData.expenses) * 100).toFixed(1)}% do
                      total
                    </div>
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
