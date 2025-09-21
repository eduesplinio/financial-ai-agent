'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  Download,
  Search,
  CreditCard,
  Building2,
} from 'lucide-react';
import Link from 'next/link';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: {
    primary: string;
    secondary?: string;
  };
  accountId: string;
  institutionName?: string;
}

interface TransactionSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  transactionCount: number;
}

export function TransactionsContent() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<TransactionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Buscar transações e dados da conta
  useEffect(() => {
    const fetchTransactions = async () => {
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
          const transactionsList = transactionsData.data || [];

          // Calcular resumo
          const totalBalance = accounts.reduce(
            (sum: number, acc: any) => sum + (acc.balance || 0),
            0
          );
          const totalIncome = transactionsList
            .filter((tx: any) => tx.amount > 0)
            .reduce((sum: number, tx: any) => sum + tx.amount, 0);
          const totalExpenses = Math.abs(
            transactionsList
              .filter((tx: any) => tx.amount < 0)
              .reduce((sum: number, tx: any) => sum + tx.amount, 0)
          );

          setSummary({
            totalBalance,
            totalIncome,
            totalExpenses,
            transactionCount: transactionsList.length,
          });

          // Mapear transações com dados da conta
          const mappedTransactions = transactionsList.map((tx: any) => {
            const account = accounts.find(
              (acc: any) => acc.accountId === tx.accountId
            );
            return {
              id: tx.id,
              description: tx.description,
              amount: tx.amount,
              date: tx.date,
              category: tx.category || { primary: 'Outros' },
              accountId: tx.accountId,
              institutionName: account?.institutionName || 'Nubank',
            };
          });

          setTransactions(mappedTransactions);
        }
      } catch (error) {
        console.error('Erro ao buscar transações:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [selectedPeriod]);

  // Filtrar transações
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' ||
      transaction.category.primary === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Obter categorias únicas
  const categories = Array.from(
    new Set(transactions.map(tx => tx.category.primary))
  );

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando transações...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full px-4 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando transações...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-2xl font-semibold">Transações</h1>
            <p className="text-muted-foreground">
              Gerencie e visualize suas transações financeiras
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Voltar ao Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800 dark:text-green-300">
              Saldo Total
            </CardTitle>
            <Building2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              R${' '}
              {summary?.totalBalance.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              }) || '0,00'}
            </div>
            <p className="text-xs text-green-700/70 dark:text-green-300/70">
              Conta Nubank
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-300">
              Receitas
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              R${' '}
              {summary?.totalIncome.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              }) || '0,00'}
            </div>
            <p className="text-xs text-blue-700/70 dark:text-blue-300/70">
              Este mês
            </p>
          </CardContent>
        </Card>

        <Card className="bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800 dark:text-red-300">
              Despesas
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              R${' '}
              {summary?.totalExpenses.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              }) || '0,00'}
            </div>
            <p className="text-xs text-red-700/70 dark:text-red-300/70">
              Este mês
            </p>
          </CardContent>
        </Card>

        <Card className="bg-purple-100 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-300">
              Transações
            </CardTitle>
            <CreditCard className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {summary?.transactionCount || 0}
            </div>
            <p className="text-xs text-purple-700/70 dark:text-purple-300/70">
              Total registradas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar transações..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Últimos 7 dias</SelectItem>
                  <SelectItem value="30d">Últimos 30 dias</SelectItem>
                  <SelectItem value="90d">Últimos 90 dias</SelectItem>
                  <SelectItem value="1y">Último ano</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-muted-foreground">
              {filteredTransactions.length} de {transactions.length} transações
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Transações */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Transações</CardTitle>
          <CardDescription>
            Todas as suas movimentações financeiras
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma transação encontrada</p>
              <p className="text-sm text-gray-400 mt-2">
                Tente ajustar os filtros ou período selecionado
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map(transaction => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-full ${transaction.amount > 0 ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'}`}
                    >
                      {transaction.amount > 0 ? (
                        <TrendingUp className="h-5 w-5" />
                      ) : (
                        <TrendingDown className="h-5 w-5" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">
                          {transaction.description}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {transaction.institutionName}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {transaction.category.primary}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          {new Date(transaction.date).toLocaleDateString(
                            'pt-BR'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-lg font-bold ${transaction.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                    >
                      {transaction.amount > 0 ? '+' : ''}R${' '}
                      {Math.abs(transaction.amount).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      {transaction.accountId}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
