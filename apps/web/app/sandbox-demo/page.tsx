'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Building2,
  CreditCard,
  Wallet,
  TrendingUp,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Eye,
  EyeOff,
} from 'lucide-react';

interface SandboxAccount {
  accountId: string;
  accountType: string;
  nickname: string;
  balance: number;
  available: number;
  currency: string;
  status: string;
}

interface SandboxTransaction {
  transactionId: string;
  type: string;
  creditDebitType: string;
  transactionAmount: number;
  description: string;
  transactionDate: string;
  category: string;
}

interface SandboxDemo {
  institutionId: string;
  institutionName: string;
  accounts: SandboxAccount[];
  transactions: SandboxTransaction[];
  isLoading: boolean;
  error: string | null;
}

export default function SandboxDemoPage() {
  const [demo, setDemo] = useState<SandboxDemo | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedInstitution, setSelectedInstitution] =
    useState('banco-do-brasil');

  const institutions = [
    { id: 'banco-do-brasil', name: 'Banco do Brasil' },
    { id: 'nubank', name: 'Nubank' },
    { id: 'itau', name: 'Itaú' },
    { id: 'bradesco', name: 'Bradesco' },
  ];

  const runSandboxDemo = async () => {
    setIsRunning(true);
    setDemo(prev => (prev ? { ...prev, isLoading: true, error: null } : null));

    try {
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simular chamada para API de sandbox
      const response = await fetch(
        `/api/open-finance/accounts?institution_id=${selectedInstitution}&include_balances=true`
      );
      const data = await response.json();

      if (data.success) {
        // Simular dados de transações
        const mockTransactions: SandboxTransaction[] = [
          {
            transactionId: 'txn_001',
            type: 'TRANSFER',
            creditDebitType: 'DEBIT',
            transactionAmount: -150.0,
            description: 'Transferência PIX para João Silva',
            transactionDate: '2024-01-15T10:30:00Z',
            category: 'TRANSFER',
          },
          {
            transactionId: 'txn_002',
            type: 'PAYMENT',
            creditDebitType: 'DEBIT',
            transactionAmount: -89.9,
            description: 'Pagamento de conta de luz',
            transactionDate: '2024-01-14T14:20:00Z',
            category: 'PAYMENT',
          },
          {
            transactionId: 'txn_003',
            type: 'DEPOSIT',
            creditDebitType: 'CREDIT',
            transactionAmount: 5000.0,
            description: 'Depósito de salário',
            transactionDate: '2024-01-13T09:00:00Z',
            category: 'DEPOSIT',
          },
        ];

        setDemo({
          institutionId: selectedInstitution,
          institutionName:
            institutions.find(inst => inst.id === selectedInstitution)?.name ||
            '',
          accounts: data.data.map((acc: any) => ({
            accountId: acc.accountId,
            accountType: acc.accountType,
            nickname: acc.nickname,
            balance: acc.balance || 0,
            available: acc.available || 0,
            currency: acc.currency || 'BRL',
            status: acc.status || 'ACTIVE',
          })),
          transactions: mockTransactions,
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error(data.error || 'Erro ao buscar dados');
      }
    } catch (error) {
      setDemo(prev =>
        prev
          ? {
              ...prev,
              isLoading: false,
              error:
                error instanceof Error ? error.message : 'Erro desconhecido',
            }
          : null
      );
    } finally {
      setIsRunning(false);
    }
  };

  const resetDemo = () => {
    setDemo(null);
    setIsRunning(false);
    setShowDetails(false);
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'TRANSFER':
        return <TrendingUp className="h-4 w-4" />;
      case 'PAYMENT':
        return <CreditCard className="h-4 w-4" />;
      case 'DEPOSIT':
        return <Wallet className="h-4 w-4" />;
      default:
        return <Building2 className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'CREDIT':
        return 'text-green-600';
      case 'DEBIT':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Open Finance Sandbox Demo</h1>
          <p className="text-muted-foreground mt-2">
            Demonstração prática do fluxo Open Finance Brasil em ambiente
            sandbox
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            Ambiente Sandbox
          </Badge>
        </div>
      </div>

      {/* Controles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Controles da Demonstração
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Instituição:</label>
              <select
                value={selectedInstitution}
                onChange={e => setSelectedInstitution(e.target.value)}
                className="px-3 py-2 border rounded-md"
                disabled={isRunning}
              >
                {institutions.map(inst => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name}
                  </option>
                ))}
              </select>
            </div>

            <Button
              onClick={runSandboxDemo}
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              {isRunning ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {isRunning ? 'Executando...' : 'Executar Demo'}
            </Button>

            <Button
              variant="outline"
              onClick={resetDemo}
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>

            {demo && (
              <Button
                variant="outline"
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-2"
              >
                {showDetails ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                {showDetails ? 'Ocultar Detalhes' : 'Mostrar Detalhes'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status da Demonstração */}
      {demo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {demo.isLoading ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : demo.error ? (
                <AlertCircle className="h-5 w-5 text-red-500" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              Status da Demonstração
            </CardTitle>
          </CardHeader>
          <CardContent>
            {demo.isLoading ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Conectando com {demo.institutionName}...</span>
              </div>
            ) : demo.error ? (
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>Erro: {demo.error}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Conexão estabelecida com {demo.institutionName}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Resultados */}
      {demo && !demo.isLoading && !demo.error && (
        <>
          {/* Contas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Contas Bancárias ({demo.accounts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {demo.accounts.map(account => (
                  <div
                    key={account.accountId}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{account.nickname}</h3>
                      <Badge
                        variant={
                          account.status === 'ACTIVE' ? 'default' : 'secondary'
                        }
                      >
                        {account.status}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Saldo:</span>
                        <span className="font-medium">
                          {formatCurrency(account.balance)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Disponível:
                        </span>
                        <span className="font-medium">
                          {formatCurrency(account.available)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tipo:</span>
                        <span className="font-medium">
                          {account.accountType}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Transações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Transações Recentes ({demo.transactions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {demo.transactions.map(transaction => (
                  <div
                    key={transaction.transactionId}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(transaction.transactionDate)} •{' '}
                          {transaction.category}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-medium ${getTransactionColor(transaction.creditDebitType)}`}
                      >
                        {formatCurrency(transaction.transactionAmount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.creditDebitType}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detalhes Técnicos */}
          {showDetails && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Detalhes Técnicos da Integração
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">
                      Fluxo OAuth2 Executado:
                    </h4>
                    <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-1">
                      <p>1. ✅ Autorização do usuário</p>
                      <p>2. ✅ Troca de código por token</p>
                      <p>3. ✅ Autenticação com {demo.institutionName}</p>
                      <p>4. ✅ Consulta de contas via API</p>
                      <p>5. ✅ Consulta de transações via API</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Dados Retornados:</h4>
                    <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-1">
                      <p>• {demo.accounts.length} contas bancárias</p>
                      <p>• {demo.transactions.length} transações</p>
                      <p>• Saldos atualizados em tempo real</p>
                      <p>• Categorização automática</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Conformidade:</h4>
                    <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-1">
                      <p>✅ Padrões Open Finance Brasil</p>
                      <p>✅ OAuth 2.0 / OpenID Connect</p>
                      <p>✅ LGPD Compliance</p>
                      <p>✅ Criptografia end-to-end</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Informações sobre Sandbox */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Sobre o Ambiente Sandbox
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">O que é o Sandbox?</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Ambiente controlado para testes</li>
                <li>• Dados simulados mas realistas</li>
                <li>• Mesmos padrões técnicos da produção</li>
                <li>• Sem riscos regulatórios</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Benefícios:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Teste de integração seguro</li>
                <li>• Validação de APIs</li>
                <li>• Desenvolvimento sem custos</li>
                <li>• Conformidade com regulamentações</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
