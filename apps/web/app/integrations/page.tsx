'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BankLogo } from '@/components/ui/bank-logo';
import { NubankLogo } from '@/components/ui/nubank-logo';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Building2,
  CreditCard,
  Wallet,
  TrendingUp,
  Shield,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  Plus,
  ExternalLink,
  Trash2,
  Settings,
} from 'lucide-react';

interface Institution {
  id: string;
  name: string;
  logoUrl?: string;
  authUrl: string;
  apiUrl: string;
  type: 'BANK' | 'INVESTMENT' | 'CREDIT_CARD' | 'OTHER';
  compeCode?: string;
  ispb?: string;
  scopes: string[];
  certificateRequired: boolean;
  isConnected?: boolean;
  connectedAt?: string;
  lastSyncAt?: string;
  accountCount?: number;
  status?: string;
}

interface ConnectedAccount {
  id: string;
  institutionId: string;
  accountId: string;
  nickname: string;
  connectedAt: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  lastSyncAt?: string;
}

interface Consent {
  id: string;
  institutionId: string;
  scopes: string[];
  status:
    | 'AWAITING_AUTHORIZATION'
    | 'AUTHORIZED'
    | 'REJECTED'
    | 'EXPIRED'
    | 'REVOKED';
  expirationDate: string;
  authorizationUrl?: string;
}

export default function IntegrationsPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [connectedAccounts, setConnectedAccounts] = useState<
    ConnectedAccount[]
  >([]);
  const [consents, setConsents] = useState<Consent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [syncing, setSyncing] = useState<string | null>(null);

  // Carregar dados iniciais
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Carregar instituições disponíveis
      const institutionsResponse = await fetch(
        '/api/open-finance/institutions'
      );
      const institutionsData = await institutionsResponse.json();
      if (institutionsData.success) {
        setInstitutions(institutionsData.data);
      }

      // Carregar contas conectadas
      const accountsResponse = await fetch('/api/open-finance/accounts');
      const accountsData = await accountsResponse.json();
      if (accountsData.success) {
        setConnectedAccounts(accountsData.data);
      }

      // Carregar consentimentos
      const consentsResponse = await fetch('/api/open-finance/consents');
      const consentsData = await consentsResponse.json();
      if (consentsData.success) {
        setConsents(consentsData.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectInstitution = async (institution: Institution) => {
    try {
      const response = await fetch('/api/open-finance/consents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          institutionId: institution.id,
          scopes: institution.scopes,
          expirationDays: 90,
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (
          data.data.status === 'AWAITING_AUTHORIZATION' &&
          data.data.authorizationUrl
        ) {
          // Redirecionar para a URL de autorização OAuth2 real
          console.log(
            'Redirecionando para autorização OAuth2:',
            data.data.authorizationUrl
          );
          window.location.href = data.data.authorizationUrl;
        } else {
          console.error('Unexpected response format:', data);
          alert('Resposta inesperada da API');
        }
      } else {
        console.error('Error creating consent:', data.error);
        alert('Erro ao conectar conta: ' + (data.error || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Error connecting institution:', error);
    }
  };

  const handleSyncAccount = async (accountId: string) => {
    try {
      setSyncing(accountId);

      const response = await fetch('/api/open-finance/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          institutionId: accountId.split('_')[0], // Assumindo formato acc_institutionId_xxx
          syncType: 'all',
          options: {
            forceRefresh: true,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Recarregar dados após sincronização
        await loadData();
      } else {
        console.error('Error syncing account:', data.error);
      }
    } catch (error) {
      console.error('Error syncing account:', error);
    } finally {
      setSyncing(null);
    }
  };

  const handleDisconnectAccount = async (accountId: string) => {
    if (!confirm('Tem certeza que deseja desconectar esta conta?')) {
      return;
    }

    try {
      const response = await fetch(
        `/api/open-finance/accounts?accountId=${accountId}`,
        {
          method: 'DELETE',
        }
      );

      const data = await response.json();

      if (data.success) {
        // Recarregar dados após desconexão
        await loadData();
      } else {
        console.error('Error disconnecting account:', data.error);
      }
    } catch (error) {
      console.error('Error disconnecting account:', error);
    }
  };

  const filteredInstitutions = institutions.filter(institution => {
    const matchesSearch =
      institution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      institution.compeCode?.includes(searchTerm) ||
      institution.ispb?.includes(searchTerm);

    const matchesFilter =
      filterType === 'all' || institution.type === filterType.toUpperCase();

    return matchesSearch && matchesFilter;
  });

  const getInstitutionIcon = (type: string) => {
    switch (type) {
      case 'BANK':
        return <Building2 className="h-6 w-6" />;
      case 'CREDIT_CARD':
        return <CreditCard className="h-6 w-6" />;
      case 'INVESTMENT':
        return <TrendingUp className="h-6 w-6" />;
      default:
        return <Wallet className="h-6 w-6" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONNECTED':
      case 'ACTIVE':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Ativo
          </Badge>
        );
      case 'DISCONNECTED':
        return (
          <Badge variant="secondary">
            <AlertCircle className="h-3 w-3 mr-1" />
            Desconectado
          </Badge>
        );
      case 'ERROR':
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Erro
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando integrações...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Integrações Bancárias</h1>
          <p className="text-muted-foreground mt-2">
            Conecte suas contas bancárias para análise financeira completa
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Seguro e Criptografado
          </Badge>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Contas Conectadas
                </p>
                <p className="text-2xl font-bold">{connectedAccounts.length}</p>
              </div>
              <Wallet className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Instituições</p>
                <p className="text-2xl font-bold">{institutions.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Última Sincronização
                </p>
                <p className="text-sm font-medium">Há 2 horas</p>
              </div>
              <RefreshCw className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-sm font-medium text-green-600">Ativo</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conta Nubank */}
      <Card>
        <CardContent className="p-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
              <NubankLogo size="sm" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium">Nubank</h3>
              <p className="text-xs text-muted-foreground">Conta Corrente</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="default"
                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs"
              >
                <CheckCircle className="h-2 w-2 mr-1" />
                Ativo
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSyncAccount('nubank')}
                className="h-7 w-7 p-0"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
