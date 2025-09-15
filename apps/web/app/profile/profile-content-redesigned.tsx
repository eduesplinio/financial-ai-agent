'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
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
} from 'lucide-react';
import Link from 'next/link';

interface FinancialProfile {
  userName: string; // Added userName property
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
}

export function ProfileContent() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [userName, setUserName] = useState('');

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
  });

  // Estados temporários para edição
  const [tempProfile, setTempProfile] =
    useState<FinancialProfile>(financialProfile);

  useEffect(() => {
    if (session?.user?.id) {
      loadFinancialProfile();
      setUserName(session.user.name || '');
    }
  }, [session]);

  const loadFinancialProfile = async () => {
    try {
      setInitialLoading(true);
      const response = await fetch('/api/user/financial-profile');
      if (response.ok) {
        const data = await response.json();
        // Garante que os dados vêm do campo financialProfile
        setFinancialProfile({
          ...data,
          userName: session?.user?.name || '',
        });
        setTempProfile({
          ...data,
          userName: session?.user?.name || '',
        });
      }
    } catch (error) {
      console.error('Error loading financial profile:', error);
    } finally {
      setInitialLoading(false);
    }
  };

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
        setFinancialProfile(tempProfile);
        setEditingProfile(false);
        setSaveMessage('Perfil financeiro atualizado com sucesso!');
      } else {
        setSaveMessage('Erro ao salvar perfil financeiro');
      }
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Erro ao salvar perfil');
    } finally {
      setLoading(false);
    }
  };

  // Função para salvar o nome do usuário
  const saveUserName = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: userName }),
      });

      if (response.ok) {
        setSaveMessage('Nome atualizado com sucesso!');
        setEditingName(false);
      } else {
        setSaveMessage('Erro ao atualizar o nome');
      }
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving user name:', error);
      setSaveMessage('Erro ao salvar o nome');
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

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl bg-slate-50 min-h-screen rounded-lg shadow-sm">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-4">
          Meu Perfil
        </h1>
        <p className="text-center text-gray-600 max-w-xl mx-auto">
          Visualize e personalize seu perfil financeiro para uma experiência
          personalizada
        </p>
      </div>

      {/* Toast notification for save message */}
      {saveMessage && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-lg flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            <span className="font-medium">{saveMessage}</span>
          </div>
        </div>
      )}

      {/* Profile Header Card with User Info */}
      <Card className="mb-8 border-none shadow-md bg-white">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-3xl font-bold border-2 border-blue-200">
              {session.user.name ? (
                session.user.name.substring(0, 2).toUpperCase()
              ) : (
                <User size={36} />
              )}
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                {editingName ? (
                  <div className="flex-1 mr-2">
                    <Input
                      type="text"
                      value={userName}
                      onChange={e => setUserName(e.target.value)}
                      placeholder="Digite seu nome"
                      className="text-lg font-medium"
                      autoFocus
                    />
                  </div>
                ) : (
                  <h2 className="text-xl font-bold text-gray-800">
                    {session.user.name || 'Nome não informado'}
                  </h2>
                )}

                <div>
                  {editingName ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={saveUserName}
                        disabled={loading}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        {loading ? (
                          <span className="flex items-center">
                            <span className="animate-spin h-4 w-4 mr-1 border-2 border-white border-t-transparent rounded-full"></span>
                            Salvando
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Save className="h-4 w-4 mr-1" />
                            Salvar
                          </span>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingName(false);
                          setUserName(session.user.name || '');
                        }}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingName(true)}
                      className="text-blue-500 border-blue-200 hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar nome
                    </Button>
                  )}
                </div>
              </div>

              <div className="text-gray-500">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {session.user.email}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">
                  <User className="h-3 w-3 mr-1" />
                  Membro desde 2023
                </Badge>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Perfil Completo
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Financial Summary Card */}
        <Card className="lg:col-span-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
              <DollarSign className="h-5 w-5 text-green-500" />
              Resumo Financeiro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {initialLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                <div className="bg-green-50 p-4 rounded-lg">
                  <Label className="text-sm font-medium text-green-700">
                    Renda Mensal
                  </Label>
                  <p className="text-2xl font-semibold text-green-600">
                    {formatCurrency(financialProfile.monthlyIncome)}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium text-gray-700">
                      Perfil de Risco
                    </Label>
                    <Badge
                      className={
                        getRiskProfileColor(financialProfile.riskProfile) +
                        ' ml-auto'
                      }
                    >
                      {getRiskProfileLabel(financialProfile.riskProfile)}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium text-gray-700">
                      Experiência em Investimentos
                    </Label>
                    <span className="text-sm font-medium text-gray-600">
                      {getExperienceLabel(
                        financialProfile.investmentExperience
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-medium text-gray-700">
                      Reserva de Emergência
                    </Label>
                    <span className="text-sm font-semibold text-blue-600">
                      {formatCurrency(financialProfile.emergencyFund)}
                    </span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Financial Goals Card */}
        <Card className="lg:col-span-7 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
              <Target className="h-5 w-5 text-blue-500" />
              Metas Financeiras
            </CardTitle>
          </CardHeader>
          <CardContent>
            {initialLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : financialProfile.financialGoals &&
              financialProfile.financialGoals.length > 0 ? (
              <ul className="space-y-2">
                {financialProfile.financialGoals.map((goal, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md"
                  >
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Target className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                <p>Você ainda não definiu metas financeiras</p>
                <Button variant="link" className="mt-2 text-blue-500">
                  Definir metas
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Análise do Perfil */}
      <div className="mt-6 mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
          Análise do Perfil Financeiro
        </h2>
        <p className="text-gray-600 mb-6">
          Visualize e configure seu perfil financeiro para receber análises
          personalizadas
        </p>
      </div>

      {/* Detalhes do Perfil */}
      <Card className="mb-8 border border-gray-100 shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg text-gray-800 flex items-center">
                <PiggyBank className="h-5 w-5 mr-2 text-blue-500" />
                Perfil Financeiro Detalhado
              </CardTitle>
              <CardDescription>
                Configure suas preferências e informações financeiras
              </CardDescription>
            </div>
            {!editingProfile ? (
              <Button
                variant="outline"
                onClick={() => setEditingProfile(true)}
                className="bg-white hover:bg-blue-50 text-blue-600 border-blue-200"
              >
                <Edit className="h-4 w-4 mr-2" />
                Personalizar Perfil
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? (
                    <span className="flex items-center">
                      <span className="animate-spin h-4 w-4 mr-1 border-2 border-white border-t-transparent rounded-full"></span>
                      Salvando
                    </span>
                  ) : (
                    'Salvar Alterações'
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="border-gray-200"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-6 pb-8">
          {initialLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-500"></div>
              <p className="mt-4 text-gray-500">
                Carregando seu perfil financeiro...
              </p>
            </div>
          ) : (
            <>
              {/* Informações Básicas - Visual melhorado com cards agrupados */}
              <div className="mb-8">
                <h3 className="text-md font-medium text-gray-700 mb-4 border-b pb-2">
                  Informações Principais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
                    <Label
                      htmlFor="monthlyIncome"
                      className="text-sm text-gray-600 block mb-2"
                    >
                      Renda Mensal
                    </Label>
                    {editingProfile ? (
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">R$</span>
                        </div>
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
                      <p className="text-xl font-semibold text-green-600">
                        {formatCurrency(financialProfile.monthlyIncome)}
                      </p>
                    )}
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
                    <Label
                      htmlFor="emergencyFund"
                      className="text-sm text-gray-600 block mb-2"
                    >
                      Reserva de Emergência
                    </Label>
                    {editingProfile ? (
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">R$</span>
                        </div>
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
                      <p className="text-xl font-semibold text-blue-600">
                        {formatCurrency(financialProfile.emergencyFund)}
                      </p>
                    )}
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
                    <Label
                      htmlFor="riskProfile"
                      className="text-sm text-gray-600 block mb-2"
                    >
                      Perfil de Risco
                    </Label>
                    {editingProfile ? (
                      <Select
                        value={tempProfile.riskProfile}
                        onValueChange={(
                          value: 'conservative' | 'moderate' | 'aggressive'
                        ) =>
                          setTempProfile({ ...tempProfile, riskProfile: value })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="conservative">
                            Conservador
                          </SelectItem>
                          <SelectItem value="moderate">Moderado</SelectItem>
                          <SelectItem value="aggressive">Agressivo</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge
                        className={getRiskProfileColor(
                          financialProfile.riskProfile
                        )}
                      >
                        {getRiskProfileLabel(financialProfile.riskProfile)}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Experiência em Investimentos */}
              <div className="mb-8">
                <h3 className="text-md font-medium text-gray-700 mb-4 border-b pb-2">
                  Experiência e Objetivos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
                    <Label
                      htmlFor="investmentExperience"
                      className="text-sm text-gray-600 block mb-2"
                    >
                      Experiência em Investimentos
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
                          <SelectItem value="intermediate">
                            Intermediário
                          </SelectItem>
                          <SelectItem value="advanced">Avançado</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex items-center">
                        <span className="px-2 py-1 rounded-md text-sm font-medium bg-blue-50 text-blue-700">
                          {getExperienceLabel(
                            financialProfile.investmentExperience
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
                    <Label className="text-sm text-gray-600 block mb-2">
                      Metas Financeiras
                    </Label>
                    {editingProfile ? (
                      <div className="text-sm text-gray-500">
                        Edite suas metas na seção de Metas Financeiras
                      </div>
                    ) : (
                      <div className="text-sm">
                        {financialProfile.financialGoals &&
                        financialProfile.financialGoals.length > 0 ? (
                          <ul className="list-disc list-inside text-gray-700">
                            {financialProfile.financialGoals
                              .slice(0, 3)
                              .map((goal, index) => (
                                <li key={index}>{goal}</li>
                              ))}
                            {financialProfile.financialGoals.length > 3 && (
                              <li className="text-blue-600">
                                + {financialProfile.financialGoals.length - 3}{' '}
                                mais
                              </li>
                            )}
                          </ul>
                        ) : (
                          <p className="text-gray-500 italic">
                            Nenhuma meta definida
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Distribuição de Gastos */}
              <div className="mb-8">
                <h3 className="text-md font-medium text-gray-700 mb-4 border-b pb-2">
                  Distribuição de Gastos Mensais
                </h3>
                <div className="bg-white p-4 rounded-lg border border-gray-100">
                  {editingProfile ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(tempProfile.spendingCategories).map(
                        ([category, value]) => (
                          <div key={category} className="mb-2">
                            <Label
                              htmlFor={`spending-${category}`}
                              className="capitalize text-sm text-gray-600 block mb-1"
                            >
                              {category === 'housing'
                                ? 'Moradia'
                                : category === 'food'
                                  ? 'Alimentação'
                                  : category === 'transport'
                                    ? 'Transporte'
                                    : category === 'entertainment'
                                      ? 'Lazer'
                                      : category === 'healthcare'
                                        ? 'Saúde'
                                        : category === 'education'
                                          ? 'Educação'
                                          : 'Outros'}
                            </Label>
                            <div className="relative rounded-md shadow-sm">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">
                                  R$
                                </span>
                              </div>
                              <Input
                                id={`spending-${category}`}
                                type="number"
                                value={value}
                                onChange={e => {
                                  const newValue = Number(e.target.value);
                                  setTempProfile({
                                    ...tempProfile,
                                    spendingCategories: {
                                      ...tempProfile.spendingCategories,
                                      [category]: newValue,
                                    },
                                  });
                                }}
                                className="pl-10"
                                placeholder="0,00"
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
                          ).reduce((a, b) => a + b, 0);
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
                                          ? 'Lazer'
                                          : category === 'healthcare'
                                            ? 'Saúde'
                                            : category === 'education'
                                              ? 'Educação'
                                              : 'Outros'}
                                </span>
                                <span className="text-gray-600">
                                  {formatCurrency(value)} ({percentage}%)
                                </span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    category === 'housing'
                                      ? 'bg-blue-500'
                                      : category === 'food'
                                        ? 'bg-green-500'
                                        : category === 'transport'
                                          ? 'bg-purple-500'
                                          : category === 'entertainment'
                                            ? 'bg-yellow-500'
                                            : category === 'healthcare'
                                              ? 'bg-red-500'
                                              : category === 'education'
                                                ? 'bg-indigo-500'
                                                : 'bg-gray-500'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Links Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link href="/dashboard" passHref>
          <Card className="cursor-pointer hover:shadow-md transition-shadow border-gray-100">
            <CardContent className="p-4 flex gap-3 items-center">
              <div className="bg-blue-100 p-2 rounded-full">
                <BarChart className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">Dashboard</h3>
                <p className="text-sm text-gray-500">
                  Visualize seu panorama financeiro
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/goals" passHref>
          <Card className="cursor-pointer hover:shadow-md transition-shadow border-gray-100">
            <CardContent className="p-4 flex gap-3 items-center">
              <div className="bg-green-100 p-2 rounded-full">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">Metas</h3>
                <p className="text-sm text-gray-500">
                  Gerencie suas metas financeiras
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/settings" passHref>
          <Card className="cursor-pointer hover:shadow-md transition-shadow border-gray-100">
            <CardContent className="p-4 flex gap-3 items-center">
              <div className="bg-purple-100 p-2 rounded-full">
                <Settings className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">Configurações</h3>
                <p className="text-sm text-gray-500">
                  Ajuste preferências e privacidade
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
