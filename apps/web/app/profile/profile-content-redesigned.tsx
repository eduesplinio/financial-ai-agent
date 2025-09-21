'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BankLogo } from '@/components/ui/bank-logo';
import { NubankLogo } from '@/components/ui/nubank-logo';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  User,
  DollarSign,
  Target,
  TrendingUp,
  PiggyBank,
  AlertCircle,
  CheckCircle,
  Edit,
  Save,
  X,
  AlertTriangle,
  Mail,
  FileText,
  BarChart,
  Shield,
  Settings,
  ArrowRight,
  Plus,
} from 'lucide-react';
import Link from 'next/link';

interface FinancialProfile {
  userName: string;
  monthlyIncome: number;
  spendingCategories: {
    housing: number;
    food: number;
    transport: number;
    entertainment: number;
    healthcare: number;
    education: number;
    other: number;
  };
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
  financialGoals: string[];
  emergencyFund: number;
  investmentExperience: 'beginner' | 'intermediate' | 'advanced';
  // Campos adicionais do perfil
  preferences?: {
    currency: string;
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
      budgetAlerts: boolean;
      goalReminders: boolean;
      anomalyDetection: boolean;
    };
  };
  connectedAccounts?: Array<{
    id: string;
    institutionId: string;
    institutionName: string;
    accountType: 'checking' | 'savings' | 'credit_card' | 'investment' | 'loan';
    accountNumber?: string;
    balance?: number;
    currency: string;
    isActive: boolean;
    lastSyncAt?: Date;
  }>;
}

export function ProfileContent() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Estado do perfil financeiro
  const [financialProfile, setFinancialProfile] = useState<FinancialProfile>({
    userName: '',
    monthlyIncome: 0,
    spendingCategories: {
      housing: 0,
      food: 0,
      transport: 0,
      entertainment: 0,
      healthcare: 0,
      education: 0,
      other: 0,
    },
    riskProfile: 'moderate',
    financialGoals: [],
    emergencyFund: 0,
    investmentExperience: 'beginner',
    preferences: {
      currency: 'BRL',
      language: 'pt-BR',
      timezone: 'America/Sao_Paulo',
      notifications: {
        email: true,
        push: true,
        sms: false,
        budgetAlerts: true,
        goalReminders: true,
        anomalyDetection: true,
      },
    },
    connectedAccounts: [],
  });

  const [tempProfile, setTempProfile] = useState<FinancialProfile>({
    userName: '',
    monthlyIncome: 0,
    spendingCategories: {
      housing: 0,
      food: 0,
      transport: 0,
      entertainment: 0,
      healthcare: 0,
      education: 0,
      other: 0,
    },
    riskProfile: 'moderate',
    financialGoals: [],
    emergencyFund: 0,
    investmentExperience: 'beginner',
    preferences: {
      currency: 'BRL',
      language: 'pt-BR',
      timezone: 'America/Sao_Paulo',
      notifications: {
        email: true,
        push: true,
        sms: false,
        budgetAlerts: true,
        goalReminders: true,
        anomalyDetection: true,
      },
    },
    connectedAccounts: [],
  });

  const loadFinancialProfile = useCallback(async () => {
    try {
      setInitialLoading(true);

      // Carregar perfil financeiro
      const profileResponse = await fetch('/api/user/financial-profile');
      let profileData = {};

      if (profileResponse.ok) {
        profileData = await profileResponse.json();
      }

      // Carregar contas conectadas
      const accountsResponse = await fetch('/api/open-finance/accounts');
      let connectedAccounts = [];

      if (accountsResponse.ok) {
        const accountsData = await accountsResponse.json();
        if (accountsData.success) {
          connectedAccounts = accountsData.data.map((account: any) => ({
            id: account.accountId,
            institutionId: account.institutionId,
            institutionName: account.institutionName,
            accountType: account.accountType?.toLowerCase() || 'checking',
            accountNumber: account.accountId,
            balance: account.balance,
            currency: account.currency || 'BRL',
            isActive: account.status === 'ACTIVE',
            lastSyncAt: account.lastSyncAt
              ? new Date(account.lastSyncAt)
              : undefined,
          }));
        }
      }

      // Combinar dados
      const finalProfileData = {
        ...profileData,
        userName: session?.user?.name || '',
        connectedAccounts,
      };

      setFinancialProfile(finalProfileData);
      setTempProfile(finalProfileData);
    } catch (error) {
      console.error('❌ Erro ao carregar perfil financeiro:', error);
    } finally {
      setInitialLoading(false);
    }
  }, [session?.user?.name]);

  useEffect(() => {
    if (session?.user?.id) {
      loadFinancialProfile();
    }
  }, [session, loadFinancialProfile]);

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/financial-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tempProfile),
      });

      if (response.ok) {
        // Recarregar dados do servidor para garantir consistência
        await loadFinancialProfile();

        // Aguardar um pouco para garantir que o estado foi atualizado
        await new Promise(resolve => setTimeout(resolve, 100));

        setEditingProfile(false);
        setSaveMessage('Perfil financeiro atualizado com sucesso!');
      } else {
        setSaveMessage('Erro ao salvar perfil financeiro');
      }
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('❌ Erro ao salvar perfil:', error);
      setSaveMessage('Erro ao salvar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setTempProfile(financialProfile);
    setEditingProfile(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getRiskProfileColor = (risk: string) => {
    switch (risk) {
      case 'conservative':
        return 'bg-green-100 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'aggressive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskProfileLabel = (risk: string) => {
    switch (risk) {
      case 'conservative':
        return 'Conservador';
      case 'moderate':
        return 'Moderado';
      case 'aggressive':
        return 'Agressivo';
      default:
        return 'Não definido';
    }
  };

  const getExperienceLabel = (experience: string) => {
    switch (experience) {
      case 'beginner':
        return 'Iniciante';
      case 'intermediate':
        return 'Intermediário';
      case 'advanced':
        return 'Avançado';
      default:
        return 'Não definido';
    }
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="mt-2 text-gray-600">
            Visualize e personalize seu perfil financeiro para uma experiência
            personalizada
          </p>
        </div>

        {/* Toast notification for save message */}
        {saveMessage && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-lg flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              {saveMessage}
            </div>
          </div>
        )}

        {/* Header do usuário */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {(session.user as any).image ? (
                  <img
                    src={(session.user as any).image}
                    alt="Profile"
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <User size={36} />
                )}
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">
                    {session.user.name || 'Nome não informado'}
                  </h2>
                </div>

                <div className="text-gray-500">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {session.user.email}
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <Shield className="h-4 w-4 mr-2" />
                  Membro desde {new Date().getFullYear()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações Financeiras Básicas */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-800">
                  Informações Financeiras Básicas
                </CardTitle>
                <CardDescription className="mt-1">
                  Informações importantes sobre seu perfil financeiro
                </CardDescription>
              </div>
              <div>
                {!editingProfile ? (
                  <Button
                    variant="outline"
                    onClick={() => setEditingProfile(true)}
                    className="text-blue-500 border-blue-200 hover:bg-blue-50"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Personalizar Perfil
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? 'Salvando...' : 'Salvar'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancelEdit}
                      className="border-gray-300"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Renda Mensal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="monthlyIncome"
                  className="text-sm font-medium text-gray-700"
                >
                  Renda Mensal
                </Label>
                {editingProfile ? (
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="monthlyIncome"
                      type="number"
                      value={tempProfile.monthlyIncome}
                      onChange={e =>
                        setTempProfile({
                          ...tempProfile,
                          monthlyIncome: Number(e.target.value),
                        })
                      }
                      placeholder="0,00"
                      className="pl-10"
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className="text-lg font-semibold text-gray-800">
                      {formatCurrency(financialProfile.monthlyIncome)}
                    </span>
                  </div>
                )}
              </div>

              {/* Reserva de Emergência */}
              <div className="space-y-2">
                <Label
                  htmlFor="emergencyFund"
                  className="text-sm font-medium text-gray-700"
                >
                  Reserva de Emergência
                </Label>
                {editingProfile ? (
                  <div className="relative">
                    <PiggyBank className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="emergencyFund"
                      type="number"
                      value={tempProfile.emergencyFund}
                      onChange={e =>
                        setTempProfile({
                          ...tempProfile,
                          emergencyFund: Number(e.target.value),
                        })
                      }
                      placeholder="0,00"
                      className="pl-10"
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-y-2">
                    <PiggyBank className="h-4 w-4 text-gray-400" />
                    <span className="text-lg font-semibold text-gray-800">
                      {formatCurrency(financialProfile.emergencyFund)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Perfil de Risco */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Perfil de Risco
              </Label>
              {editingProfile ? (
                <Select
                  value={tempProfile.riskProfile}
                  onValueChange={(
                    value: 'conservative' | 'moderate' | 'aggressive'
                  ) => setTempProfile({ ...tempProfile, riskProfile: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conservative">Conservador</SelectItem>
                    <SelectItem value="moderate">Moderado</SelectItem>
                    <SelectItem value="aggressive">Agressivo</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                  <Badge
                    className={
                      getRiskProfileColor(financialProfile.riskProfile) +
                      ' ml-auto'
                    }
                  >
                    {getRiskProfileLabel(financialProfile.riskProfile)}
                  </Badge>
                </div>
              )}
            </div>

            {/* Conhecimento e Experiência */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Nível de Conhecimento Financeiro
              </Label>
              {editingProfile ? (
                <Select
                  value={tempProfile.investmentExperience}
                  onValueChange={(
                    value: 'beginner' | 'intermediate' | 'advanced'
                  ) =>
                    setTempProfile({
                      ...tempProfile,
                      investmentExperience: value,
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Iniciante</SelectItem>
                    <SelectItem value="intermediate">Intermediário</SelectItem>
                    <SelectItem value="advanced">Avançado</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center space-x-2">
                  <BarChart className="h-4 w-4 text-gray-400" />
                  <span className="text-lg font-semibold text-gray-800">
                    {getExperienceLabel(financialProfile.investmentExperience)}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Distribuição de Gastos Mensais */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">
              Distribuição de Gastos Mensais
            </CardTitle>
            <CardDescription>
              Configure como você distribui seus gastos mensais por categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            {editingProfile ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(tempProfile.spendingCategories).map(
                  ([category, value]) => (
                    <div key={category} className="space-y-2">
                      <Label
                        htmlFor={category}
                        className="text-sm font-medium text-gray-700 capitalize"
                      >
                        {category === 'housing'
                          ? 'Moradia'
                          : category === 'food'
                            ? 'Alimentação'
                            : category === 'transport'
                              ? 'Transporte'
                              : category === 'entertainment'
                                ? 'Entretenimento'
                                : category === 'healthcare'
                                  ? 'Saúde'
                                  : category === 'education'
                                    ? 'Educação'
                                    : 'Outros'}
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id={category}
                          type="number"
                          value={value}
                          onChange={e =>
                            setTempProfile({
                              ...tempProfile,
                              spendingCategories: {
                                ...tempProfile.spendingCategories,
                                [category]: Number(e.target.value),
                              },
                            })
                          }
                          placeholder="0,00"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(financialProfile.spendingCategories).map(
                  ([category, value]) => {
                    const total = Object.values(
                      financialProfile.spendingCategories
                    ).reduce((sum, val) => sum + val, 0);
                    const percentage =
                      total > 0 ? Math.round((value / total) * 100) : 0;

                    return (
                      <div key={category} className="space-y-1">
                        <div className="flex justify-between items-center text-sm">
                          <span className="capitalize text-gray-700">
                            {category === 'housing'
                              ? 'Moradia'
                              : category === 'food'
                                ? 'Alimentação'
                                : category === 'transport'
                                  ? 'Transporte'
                                  : category === 'entertainment'
                                    ? 'Entretenimento'
                                    : category === 'healthcare'
                                      ? 'Saúde'
                                      : category === 'education'
                                        ? 'Educação'
                                        : 'Outros'}
                          </span>
                          <span className="font-medium text-gray-800">
                            {formatCurrency(value)} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Informações Adicionais */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-800">
                  Informações Adicionais
                </CardTitle>
                <CardDescription>
                  Preferências e configurações do seu perfil
                </CardDescription>
              </div>
              <div>
                {!editingProfile ? (
                  <Button
                    variant="outline"
                    onClick={() => setEditingProfile(true)}
                    className="text-blue-500 border-blue-200 hover:bg-blue-50"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Informações
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? 'Salvando...' : 'Salvar'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancelEdit}
                      className="border-gray-300"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Preferências */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-800">
                Preferências
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Moeda
                  </Label>
                  {editingProfile ? (
                    <Select
                      value={tempProfile.preferences?.currency || 'BRL'}
                      onValueChange={value =>
                        setTempProfile({
                          ...tempProfile,
                          preferences: {
                            ...tempProfile.preferences,
                            currency: value,
                          },
                        })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BRL">Real (BRL)</SelectItem>
                        <SelectItem value="USD">Dólar (USD)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-gray-600">
                      {financialProfile.preferences?.currency || 'BRL'}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Idioma
                  </Label>
                  {editingProfile ? (
                    <Select
                      value={tempProfile.preferences?.language || 'pt-BR'}
                      onValueChange={value =>
                        setTempProfile({
                          ...tempProfile,
                          preferences: {
                            ...tempProfile.preferences,
                            language: value,
                          },
                        })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">
                          Português (Brasil)
                        </SelectItem>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="es-ES">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-gray-600">
                      {financialProfile.preferences?.language || 'pt-BR'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Contas Conectadas */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium text-gray-800">
                  Contas Conectadas
                </h4>
                <Link href="/integrations">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-500 border-blue-200 hover:bg-blue-50"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Gerenciar Contas
                  </Button>
                </Link>
              </div>
              {financialProfile.connectedAccounts &&
              financialProfile.connectedAccounts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {financialProfile.connectedAccounts.map(account => {
                    // URLs dos logos dos bancos
                    const bankLogos: Record<string, string[]> = {
                      nubank: [
                        'https://nubank.com.br/images/nu-logo.png',
                        'https://assets.nubank.com.br/images/nu-logo.png',
                        'https://cdn.nubank.com.br/images/nu-logo.png',
                        'https://logos.bancos.com.br/nubank.png',
                      ],
                    };

                    const bankLogoUrls = bankLogos[account.institutionId];

                    return (
                      <div
                        key={account.id}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                            {account.institutionId === 'nubank' ? (
                              <NubankLogo size="lg" />
                            ) : (
                              <BankLogo
                                logoUrls={bankLogoUrls}
                                institutionName={account.institutionName}
                                institutionType="fintech"
                                size="lg"
                              />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {account.institutionName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {account.accountType === 'checking'
                                ? 'Conta Corrente'
                                : account.accountType === 'savings'
                                  ? 'Conta Poupança'
                                  : account.accountType === 'credit_card'
                                    ? 'Cartão de Crédito'
                                    : account.accountType === 'investment'
                                      ? 'Investimentos'
                                      : 'Empréstimo'}
                            </p>
                            <p className="text-xs text-gray-400">
                              Desde{' '}
                              {account.lastSyncAt
                                ? account.lastSyncAt.toLocaleDateString('pt-BR')
                                : 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-800 text-lg">
                            {account.balance
                              ? formatCurrency(account.balance)
                              : 'N/A'}
                          </p>
                          <Badge
                            variant={account.isActive ? 'default' : 'secondary'}
                            className={
                              account.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600'
                            }
                          >
                            {account.isActive ? 'Ativa' : 'Inativa'}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhuma conta conectada</p>
                  <p className="text-sm mb-4">
                    Conecte suas contas para uma experiência mais completa
                  </p>
                  <Link href="/integrations">
                    <Button className="bg-blue-500 hover:bg-blue-600">
                      <Plus className="h-4 w-4 mr-2" />
                      Conectar Contas
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
