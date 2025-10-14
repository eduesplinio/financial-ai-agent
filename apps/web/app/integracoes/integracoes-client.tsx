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
  Building2,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useConfirmationModal } from '@/components/ui/confirmation-modal';

// Função para obter logo do banco
const getBankLogo = (bankId: string, institutionName: string) => {
  const logos: Record<string, string> = {
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

  const logoUrl = logos[bankId];

  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={`Logo ${institutionName}`}
        className="w-full h-full object-contain"
        onError={e => {
          console.error(`Erro ao carregar logo: ${logoUrl} para ${bankId}`);
          e.currentTarget.style.display = 'none';
        }}
        onLoad={() => {
          console.log(`Logo carregado com sucesso: ${logoUrl}`);
        }}
      />
    );
  }

  // Fallback para ícone genérico
  return <Building2 className="h-8 w-8 text-muted-foreground" />;
};

interface Institution {
  id: string;
  name: string;
  type: string;
  logoUrl: string;
  status: string;
  supportedServices: string[];
  description: string;
}

interface ConnectedAccount {
  id: string;
  institutionId: string;
  institutionName: string;
  accountId: string;
  accountType: string;
  accountName: string;
  status: string;
  permissions: string[];
  lastSync?: string;
  connectedAt: string;
}

interface GroupedAccounts {
  institutionId: string;
  institutionName: string;
  accounts: ConnectedAccount[];
  totalAccounts: number;
  lastSync?: string;
}

export function IntegracoesClient() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [connectedAccounts, setConnectedAccounts] = useState<
    ConnectedAccount[]
  >([]);
  const [groupedAccounts, setGroupedAccounts] = useState<GroupedAccounts[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('connected');
  const { toast } = useToast();
  const { openModal, ModalComponent } = useConfirmationModal();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Carregar instituições disponíveis
      const institutionsRes = await fetch('/api/open-finance/institutions');
      if (institutionsRes.ok) {
        const institutionsData = await institutionsRes.json();
        setInstitutions(institutionsData.institutions || []);
      }

      // Carregar contas conectadas
      const accountsRes = await fetch('/api/open-finance/accounts');
      if (accountsRes.ok) {
        const accountsData = await accountsRes.json();
        setConnectedAccounts(accountsData.accounts || []);
        setGroupedAccounts(accountsData.groupedByInstitution || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao carregar dados das integrações',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConnectBank = async (institution: Institution) => {
    try {
      setConnecting(institution.id);

      // Simular conexão (em produção seria o fluxo OAuth2)
      const mockAccount = {
        institutionId: institution.id,
        institutionName: institution.name,
        accountId: `acc_${Date.now()}`,
        accountType: 'CHECKING',
        accountName: `Conta Corrente`,
        permissions: ['accounts', 'transactions'],
        status: 'ACTIVE', // Já conecta ativa
      };

      const response = await fetch('/api/open-finance/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockAccount),
      });

      if (response.ok) {
        const result = await response.json();
        const newAccountId = result.account.id;

        // Fazer sincronização automática após conectar
        try {
          const syncResponse = await fetch('/api/open-finance/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accountId: newAccountId, syncType: 'full' }),
          });

          if (syncResponse.ok) {
            const syncResult = await syncResponse.json();
            toast({
              title: 'Conta conectada e sincronizada',
              description: `${institution.name} conectado com ${syncResult.results.recordsProcessed} registros importados`,
              variant: 'default',
              className: 'bg-green-50 border-green-200 text-green-800',
            });
          } else {
            // Se a sincronização falhar, ainda mostra sucesso da conexão
            toast({
              title: 'Conta conectada',
              description: `${institution.name} conectado com sucesso! Sincronização será feita em breve.`,
              variant: 'default',
              className: 'bg-green-50 border-green-200 text-green-800',
            });
          }
        } catch (syncError) {
          // Se a sincronização falhar, ainda mostra sucesso da conexão
          toast({
            title: 'Conta conectada',
            description: `${institution.name} conectado com sucesso! Sincronização será feita em breve.`,
            variant: 'default',
            className: 'bg-green-50 border-green-200 text-green-800',
          });
        }

        loadData(); // Recarregar dados
        setActiveTab('connected'); // Voltar para aba de contas conectadas
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Falha ao conectar conta',
        variant: 'destructive',
      });
    } finally {
      setConnecting(null);
    }
  };

  const handleSyncAccount = async (accountId: string) => {
    try {
      setSyncing(accountId);

      const response = await fetch('/api/open-finance/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId, syncType: 'full' }),
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: 'Sincronização concluída',
          description: `${result.results.recordsProcessed} registros processados e armazenados`,
          variant: 'default',
          className: 'bg-green-50 border-green-200 text-green-800',
        });
        loadData(); // Recarregar dados
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error: any) {
      toast({
        title: 'Erro na sincronização',
        description: error.message || 'Falha ao sincronizar dados',
        variant: 'destructive',
      });
    } finally {
      setSyncing(null);
    }
  };

  const handleDisconnectAccount = (
    accountId: string,
    institutionName: string
  ) => {
    openModal({
      title: 'Desconectar Conta',
      description: `Desconectar ${institutionName}?`,
      confirmText: 'Desconectar',
      cancelText: 'Cancelar',
      variant: 'destructive',
      onConfirm: async () => {
        try {
          const response = await fetch(
            `/api/open-finance/accounts/${accountId}`,
            {
              method: 'DELETE',
            }
          );

          if (response.ok) {
            toast({
              title: 'Conta desconectada',
              description: `${institutionName} desconectado`,
              variant: 'default',
              className: 'bg-green-50 border-green-200 text-green-800',
            });
            loadData(); // Recarregar dados
          } else {
            const error = await response.json();
            throw new Error(error.message);
          }
        } catch (error: any) {
          toast({
            title: 'Erro',
            description: error.message || 'Falha ao desconectar conta',
            variant: 'destructive',
          });
          throw error; // Re-throw para manter o modal aberto em caso de erro
        }
      },
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'INACTIVE':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'EXPIRED':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      ACTIVE: 'default',
      INACTIVE: 'destructive',
      EXPIRED: 'secondary',
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status === 'ACTIVE'
          ? 'Ativa'
          : status === 'INACTIVE'
            ? 'Inativa'
            : status === 'EXPIRED'
              ? 'Expirada'
              : status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 lg:px-8 py-6">
      <div className="mb-8">
        <h1 className="text-xl font-semibold">Integrações Bancárias</h1>
        <p className="text-muted-foreground">
          Conecte suas contas bancárias para análise financeira automatizada
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="connected">
            Contas Conectadas ({connectedAccounts.length})
          </TabsTrigger>
          <TabsTrigger value="available">
            Bancos Disponíveis ({institutions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="connected" className="space-y-4">
          {groupedAccounts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Nenhuma conta conectada
                </h3>
                <p className="text-muted-foreground text-center mb-4">
                  Conecte suas contas bancárias para começar a análise
                  financeira
                </p>
                <Button onClick={() => setActiveTab('available')}>
                  Conectar Primeira Conta
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {groupedAccounts.map(group =>
                group.accounts.map(account => (
                  <Card key={account.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-white shadow-sm border border-gray-100 p-1.5">
                            {getBankLogo(
                              group.institutionId,
                              group.institutionName
                            )}
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="font-semibold">
                              {group.institutionName}
                            </span>
                            {group.lastSync && (
                              <span className="text-sm text-muted-foreground">
                                Última sincronização:{' '}
                                {new Date(group.lastSync).toLocaleString(
                                  'pt-BR'
                                )}
                              </span>
                            )}
                            <span className="font-medium">
                              {account.accountName}
                            </span>
                            {getStatusBadge(account.status)}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSyncAccount(account.id)}
                            disabled={syncing === account.id}
                            className="border-primary text-primary hover:bg-primary/10"
                          >
                            {syncing === account.id ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <RefreshCw className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              handleDisconnectAccount(
                                account.id,
                                account.institutionName
                              )
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {institutions.map(institution => {
              const isConnected = connectedAccounts.some(
                acc => acc.institutionId === institution.id
              );

              return (
                <Card key={institution.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-white shadow-sm border border-gray-100 p-1.5">
                        {getBankLogo(institution.id, institution.name)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">
                          {institution.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {institution.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => handleConnectBank(institution)}
                      disabled={connecting === institution.id || isConnected}
                    >
                      {connecting === institution.id
                        ? 'Conectando...'
                        : isConnected
                          ? 'Conectado'
                          : 'Conectar'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal de confirmação */}
      {ModalComponent}
    </div>
  );
}
