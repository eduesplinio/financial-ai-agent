'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowUpCircle,
  ArrowDownCircle,
  RefreshCw,
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Marcar como página dinâmica
export const dynamic = 'force-dynamic';

interface Transaction {
  id: string;
  accountId: string;
  institutionId: string;
  amount: number;
  currency: string;
  date: string;
  description: string;
  category: {
    primary: string;
    confidence: number;
  };
  merchant?: {
    name: string;
    category: string;
  };
  type: 'CREDIT' | 'DEBIT';
  status: string;
  metadata: {
    source: string;
    processed: boolean;
    tags: string[];
  };
  createdAt: string;
}

interface TransactionStats {
  totalTransactions: number;
  totalCredits: number;
  totalDebits: number;
  avgAmount: number;
  categories: number;
  uniqueCategories: string[];
}

export default function TransacoesPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<TransactionStats>({
    totalTransactions: 0,
    totalCredits: 0,
    totalDebits: 0,
    avgAmount: 0,
    categories: 0,
    uniqueCategories: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadTransactions();
  }, [selectedCategory]);

  const loadTransactions = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (selectedCategory) {
        params.append('category', selectedCategory);
      }
      params.append('limit', '100');

      const response = await fetch(`/api/transactions?${params}`, {
        cache: 'no-store',
      });

      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
        setStats(data.statistics || {});
      } else {
        throw new Error('Falha ao carregar transações');
      }
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Falha ao carregar transações',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Alimentação: 'bg-green-100 text-green-800',
      Transporte: 'bg-blue-100 text-blue-800',
      Saúde: 'bg-red-100 text-red-800',
      Educação: 'bg-purple-100 text-purple-800',
      Lazer: 'bg-yellow-100 text-yellow-800',
      Casa: 'bg-orange-100 text-orange-800',
      Vestuário: 'bg-pink-100 text-pink-800',
      Receita: 'bg-emerald-100 text-emerald-800',
    };
    return (
      colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
    );
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transações</h1>
          <p className="text-muted-foreground mt-2">
            Visualize e analise suas transações sincronizadas
          </p>
        </div>
        <Button onClick={loadTransactions} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">transações</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.totalCredits)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(stats.totalDebits)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                stats.totalCredits - stats.totalDebits >= 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {formatCurrency(stats.totalCredits - stats.totalDebits)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorias</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.categories}</div>
            <p className="text-xs text-muted-foreground">diferentes</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros por categoria */}
      {stats.uniqueCategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Filtrar por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                Todas
              </Button>
              {stats.uniqueCategories.map(category => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? 'default' : 'outline'
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de transações */}
      <Card>
        <CardHeader>
          <CardTitle>
            Transações Recentes
            {selectedCategory && ` - ${selectedCategory}`}
          </CardTitle>
          <CardDescription>
            {transactions.length} transação(ões) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Nenhuma transação encontrada
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                Sincronize suas contas bancárias para ver as transações aqui
              </p>
              <Button onClick={() => (window.location.href = '/integracoes')}>
                Ir para Integrações
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map(transaction => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {transaction.type === 'CREDIT' ? (
                        <ArrowUpCircle className="h-8 w-8 text-green-500" />
                      ) : (
                        <ArrowDownCircle className="h-8 w-8 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">
                        {transaction.description}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(transaction.date)} •{' '}
                        {transaction.merchant?.name || 'N/A'}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge
                          className={getCategoryColor(
                            transaction.category.primary
                          )}
                        >
                          {transaction.category.primary}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {Math.round(transaction.category.confidence * 100)}%
                          confiança
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-lg font-semibold ${
                        transaction.amount >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {formatCurrency(Math.abs(transaction.amount))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.currency}
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
