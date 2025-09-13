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
import { PiggyBank, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
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
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="text-muted-foreground">
            Acompanhe suas finanças em tempo real
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2 w-full md:w-auto">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full sm:w-[150px] bg-white dark:bg-neutral-900">
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
            <Wallet className="text-green-600" size={28} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R${' '}
              {mockData.balance.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              +5.2% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas</CardTitle>
            <TrendingUp className="text-blue-600" size={28} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              R${' '}
              {mockData.income.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              +2.1% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos</CardTitle>
            <TrendingDown className="text-red-600" size={28} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R${' '}
              {mockData.expenses.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              -3.4% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investimentos</CardTitle>
            <PiggyBank className="text-purple-600" size={28} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              R${' '}
              {mockData.savings.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              +8.7% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de tendências */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Tendência Mensal</CardTitle>
            <CardDescription>
              Evolução das receitas e gastos nos últimos meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Line data={trendChartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de categorias e detalhamento lado a lado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de gastos por categoria */}
        <Card>
          <CardHeader>
            <CardTitle>Gastos por Categoria</CardTitle>
            <CardDescription>
              Distribuição dos seus gastos por categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">
                      R${' '}
                      {item.amount.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                    <div className="text-xs text-muted-foreground">
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
