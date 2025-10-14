'use client';
import {
  DollarSign,
  ShoppingCart,
  Utensils,
  Home,
  Car,
  Heart,
  Book,
  Gift,
  CreditCard,
  HelpCircle,
} from 'lucide-react';
import React from 'react';
import { useSession } from 'next-auth/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Eraser } from 'lucide-react';
import Link from 'next/link';

export function TransactionsContent() {
  // Mock para categorias e bancos (depois pode ser buscado via API)
  const [categories, setCategories] = React.useState<string[]>([]);
  const [accounts, setAccounts] = React.useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = React.useState('');
  // Mapeamento de categoria para ícone Lucide
  const categoryIcons: Record<string, JSX.Element> = {
    Alimentação: <Utensils size={24} className="text-blue-500" />,
    Transporte: <Car size={24} className="text-yellow-500" />,
    Saúde: <Heart size={24} className="text-pink-500" />,
    Educação: <Book size={24} className="text-indigo-500" />,
    Lazer: <Gift size={24} className="text-purple-500" />,
    Compras: <ShoppingCart size={24} className="text-green-500" />,
    Moradia: <Home size={24} className="text-orange-500" />,
    Receita: <DollarSign size={24} className="text-green-700" />,
    Pagamento: <CreditCard size={24} className="text-gray-500" />,
  };
  function getCategoryIcon(cat?: string) {
    if (!cat) return <HelpCircle size={24} className="text-gray-300" />;
    return (
      categoryIcons[cat] || <HelpCircle size={24} className="text-gray-300" />
    );
  }

  // Buscar categorias e contas conectadas do usuário
  React.useEffect(() => {
    // Buscar categorias únicas das transações (pode ser melhorado para buscar da API)
    fetch('/api/transactions?limit=1')
      .then(res => res.json())
      .then(data => {
        setCategories(data.statistics?.uniqueCategories || []);
      });
    // Buscar contas conectadas
    fetch('/api/open-finance/accounts')
      .then(res => res.json())
      .then(data => {
        setAccounts(data.accounts || []);
      });
  }, []);
  const { data: session } = useSession();

  const [loading, setLoading] = React.useState(true);
  const [transactions, setTransactions] = React.useState<any[]>([]);
  const [stats, setStats] = React.useState<any | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [filters, setFilters] = React.useState({
    startDate: '',
    endDate: '',
    type: '',
    category: '',
    period: '',
  });
  const [page, setPage] = React.useState(0);
  const [limit] = React.useState(20);
  const [total, setTotal] = React.useState(0);

  const fetchTransactions = React.useCallback(() => {
    if (!session?.user) return;
    setLoading(true);
    const params = new URLSearchParams({
      ...(filters.startDate ? { startDate: filters.startDate } : {}),
      ...(filters.endDate ? { endDate: filters.endDate } : {}),
      ...(filters.type ? { type: filters.type } : {}),
      ...(filters.category ? { category: filters.category } : {}),
      ...(selectedAccount ? { accountId: selectedAccount } : {}),
      limit: String(limit),
      offset: String(page * limit),
    });
    fetch(`/api/transactions?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setTransactions(data.transactions || []);
        setStats(data.statistics || null);
        setTotal(data.pagination?.total || 0);
        setLoading(false);
      })
      .catch(err => {
        setError('Erro ao carregar transações');
        setLoading(false);
      });
  }, [session?.user, filters, selectedAccount, page, limit]);

  React.useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters(f => ({ ...f, [name]: value }));
    setPage(0);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (!session?.user || loading) {
    if (!session?.user) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background">
          <div className="text-center">
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Faça login para visualizar as transações.
            </p>
          </div>
        </div>
      );
    }
  }

  if (error) {
    return <div className="text-red-600 p-8">{error}</div>;
  }

  return (
    <TooltipProvider>
      <div className="space-y-6 w-full px-8 py-6">
        {/* Título e subtítulo */}
        <div>
          <h2 className="text-xl font-semibold">Transações</h2>
          <p className="text-muted-foreground">
            Acompanhe e filtre suas transações financeiras
          </p>
        </div>

        {/* Filtros no padrão dashboard, sem fundo */}
        <div className="flex flex-wrap gap-4 mb-6 items-end">
          <div className="flex flex-wrap gap-2 w-full items-end justify-start">
            {/* Banco - campo maior, filtra dinamicamente */}
            <div className="w-full sm:w-[280px]">
              <Select
                value={selectedAccount}
                onValueChange={v => {
                  setSelectedAccount(v);
                  setFilters(f => ({ ...f, accountId: v }));
                  setPage(0);
                }}
              >
                <SelectTrigger className="w-full h-8">
                  <SelectValue placeholder="Banco" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map(acc => (
                    <SelectItem key={acc.accountId} value={acc.accountId}>
                      {acc.institutionName} - {acc.accountName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Período */}
            <div className="w-full sm:w-[150px]">
              <Select
                value={filters.period || ''}
                onValueChange={value => {
                  let startDate = '';
                  let endDate = '';
                  const today = new Date();
                  if (value === '7') {
                    startDate = new Date(
                      today.getFullYear(),
                      today.getMonth(),
                      today.getDate() - 7
                    )
                      .toISOString()
                      .slice(0, 10);
                    endDate = today.toISOString().slice(0, 10);
                  } else if (value === '30') {
                    startDate = new Date(
                      today.getFullYear(),
                      today.getMonth(),
                      today.getDate() - 30
                    )
                      .toISOString()
                      .slice(0, 10);
                    endDate = today.toISOString().slice(0, 10);
                  } else if (value === '90') {
                    startDate = new Date(
                      today.getFullYear(),
                      today.getMonth(),
                      today.getDate() - 90
                    )
                      .toISOString()
                      .slice(0, 10);
                    endDate = today.toISOString().slice(0, 10);
                  } else if (value === '365') {
                    startDate = new Date(
                      today.getFullYear() - 1,
                      today.getMonth(),
                      today.getDate()
                    )
                      .toISOString()
                      .slice(0, 10);
                    endDate = today.toISOString().slice(0, 10);
                  } else {
                    startDate = '';
                    endDate = '';
                  }
                  setFilters(f => ({
                    ...f,
                    period: value,
                    startDate,
                    endDate,
                  }));
                  setPage(0);
                }}
              >
                <SelectTrigger className="w-full h-8">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Últimos 7 dias</SelectItem>
                  <SelectItem value="30">Últimos 30 dias</SelectItem>
                  <SelectItem value="90">Últimos 90 dias</SelectItem>
                  <SelectItem value="365">Último ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Tipo */}
            <div className="w-full sm:w-[120px]">
              <Select
                value={filters.type}
                onValueChange={value => {
                  setFilters(f => ({ ...f, type: value }));
                  setPage(0);
                }}
              >
                <SelectTrigger className="w-full h-8">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CREDIT">Receita</SelectItem>
                  <SelectItem value="DEBIT">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Categoria */}
            <div className="w-full sm:w-[160px]">
              <Select
                value={filters.category || ''}
                onValueChange={value => {
                  setFilters(f => ({
                    ...f,
                    category: value,
                  }));
                  setPage(0);
                }}
              >
                <SelectTrigger className="w-full h-8">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Botão Limpar filtros padrão */}
            <div className="w-full sm:w-auto flex items-center">
              <Button
                type="button"
                variant="default"
                className="h-8 px-4 text-sm font-medium"
                onClick={() => {
                  setSelectedAccount('');
                  setFilters({
                    startDate: '',
                    endDate: '',
                    type: '',
                    category: '',
                    period: '',
                  });
                  setPage(0);
                }}
              >
                Limpar filtros
              </Button>
            </div>
          </div>
        </div>

        {/* Tabela/lista de transações ocupando toda a página, alinhada à esquerda */}
        <Card className="bg-white dark:bg-muted/40 shadow mt-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Transações</CardTitle>
            <CardDescription>Lista das transações filtradas</CardDescription>
          </CardHeader>
          <CardContent className="relative">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-muted/60 z-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
            {!loading && transactions.length === 0 ? (
              <p className="text-muted-foreground">
                Nenhuma transação encontrada.
              </p>
            ) : (
              <ul
                className={`w-full divide-y divide-muted ${loading ? 'opacity-40 pointer-events-none' : ''}`}
              >
                {transactions.slice(0, 15).map(tx => {
                  const acc = accounts.find(a => a.accountId === tx.accountId);
                  const isDebit = tx.amount < 0;

                  // Mapear logo do banco
                  const bankLogos: Record<string, string> = {
                    'banco-do-brasil': '/bank-logos/banco-do-brasil.svg',
                    bradesco: '/bank-logos/bradesco.svg',
                    nubank: '/bank-logos/nubank.svg',
                    inter: '/bank-logos/inter.svg',
                    itau: '/bank-logos/itau.svg',
                    'btg-pactual-001': '/bank-logos/btg.svg',
                    caixa: '/bank-logos/caixa.svg',
                    'c6-bank': '/bank-logos/c6.svg',
                    santander: '/bank-logos/santander.svg',
                  };
                  const bankLogo = acc?.institutionId
                    ? bankLogos[acc.institutionId]
                    : null;

                  return (
                    <li
                      key={tx.id}
                      className="flex items-center gap-3 py-3 px-4 w-full hover:bg-muted/30 transition"
                    >
                      {/* Logo do banco */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          {bankLogo ? (
                            <div className="flex-shrink-0 w-8 h-8 rounded bg-white dark:bg-white shadow-sm border border-gray-200 dark:border-gray-300 p-1 flex items-center justify-center cursor-help transition-transform hover:scale-105">
                              <img
                                src={bankLogo}
                                alt={acc?.institutionName || 'Banco'}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          ) : (
                            <div className="flex-shrink-0 w-8 h-8 rounded bg-muted flex items-center justify-center border border-border cursor-help">
                              <span className="text-xs text-muted-foreground">
                                ?
                              </span>
                            </div>
                          )}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{acc?.institutionName || 'Banco desconhecido'}</p>
                        </TooltipContent>
                      </Tooltip>

                      {/* Nome da transação e data */}
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-base font-medium text-foreground truncate">
                          {tx.description}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground">
                            {new Date(tx.date).toLocaleDateString()}
                          </span>
                          {tx.category?.primary && (
                            <>
                              <span className="text-xs text-muted-foreground">
                                •
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {tx.category.primary}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Valor */}
                      <div className="flex flex-col items-end ml-3">
                        <span
                          className={`text-base font-bold ${isDebit ? 'text-red-500' : 'text-green-600'}`}
                        >
                          R${' '}
                          {Math.abs(tx.amount).toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="flex justify-between items-center mt-4 w-full">
              <Button
                variant="outline"
                disabled={page === 0 || loading}
                onClick={() => handlePageChange(page - 1)}
              >
                Página anterior
              </Button>
              <span>
                Página {page + 1} de {Math.ceil(total / limit) || 1}
              </span>
              <Button
                variant="outline"
                disabled={(page + 1) * limit >= total || loading}
                onClick={() => handlePageChange(page + 1)}
              >
                Próxima página
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
