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
} from 'lucide-react';
import Link from 'next/link';

interface FinancialProfile {
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

  // Estado do perfil financeiro
  const [financialProfile, setFinancialProfile] = useState<FinancialProfile>({
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

  // Carregar perfil financeiro
  useEffect(() => {
    if (session?.user?.id) {
      loadFinancialProfile();
    }
  }, [session]);

  const loadFinancialProfile = async () => {
    try {
      setInitialLoading(true);
      const response = await fetch('/api/user/financial-profile');
      if (response.ok) {
        const data = await response.json();
        setFinancialProfile(data);
        setTempProfile(data);
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
        setSaveMessage('Perfil financeiro salvo com sucesso!');
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
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <User className="h-8 w-8" />
          Perfil do Usuário
        </h1>
        <p className="text-muted-foreground mt-2">
          Gerencie suas informações pessoais e perfil financeiro
        </p>
      </div>

      {saveMessage && (
        <Alert className="mb-6">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{saveMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informações Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações Pessoais
            </CardTitle>
            <CardDescription>Seus dados básicos de cadastro</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Nome</Label>
              <p className="text-lg">{session.user.name || 'Não informado'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Email</Label>
              <p className="text-lg">{session.user.email}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Função</Label>
              <Badge variant="outline" className="capitalize">
                {session.user.role || 'user'}
              </Badge>
            </div>
            <div>
              <Label className="text-sm font-medium">ID do Usuário</Label>
              <p className="text-sm text-muted-foreground font-mono">
                {session.user.id}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Resumo Financeiro */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Resumo Financeiro
            </CardTitle>
            <CardDescription>
              Visão geral do seu perfil financeiro
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {initialLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                <div>
                  <Label className="text-sm font-medium">Renda Mensal</Label>
                  <p className="text-2xl font-semibold text-green-600">
                    {formatCurrency(financialProfile.monthlyIncome)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Perfil de Risco</Label>
                  <Badge
                    className={getRiskProfileColor(
                      financialProfile.riskProfile
                    )}
                  >
                    {getRiskProfileLabel(financialProfile.riskProfile)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">
                    Experiência em Investimentos
                  </Label>
                  <p className="text-lg">
                    {getExperienceLabel(financialProfile.investmentExperience)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">
                    Reserva de Emergência
                  </Label>
                  <p className="text-lg font-semibold text-blue-600">
                    {formatCurrency(financialProfile.emergencyFund)}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Perfil Financeiro Detalhado */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Perfil Financeiro Completo
              </CardTitle>
              <CardDescription>
                Configure suas informações financeiras para análises
                personalizadas
              </CardDescription>
            </div>
            {!editingProfile ? (
              <Button
                variant="outline"
                onClick={() => setEditingProfile(true)}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Editar
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {loading ? 'Salvando...' : 'Salvar'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancelar
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {initialLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Informações Básicas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="monthlyIncome">Renda Mensal (R$)</Label>
                  {editingProfile ? (
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
                      placeholder="0"
                    />
                  ) : (
                    <p className="mt-1 text-lg font-semibold">
                      {formatCurrency(financialProfile.monthlyIncome)}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="riskProfile">Perfil de Risco</Label>
                  {editingProfile ? (
                    <Select
                      value={tempProfile.riskProfile}
                      onValueChange={(
                        value: 'conservative' | 'moderate' | 'aggressive'
                      ) =>
                        setTempProfile({ ...tempProfile, riskProfile: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
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
                      className={`mt-1 ${getRiskProfileColor(financialProfile.riskProfile)}`}
                    >
                      {getRiskProfileLabel(financialProfile.riskProfile)}
                    </Badge>
                  )}
                </div>

                <div>
                  <Label htmlFor="emergencyFund">
                    Reserva de Emergência (R$)
                  </Label>
                  {editingProfile ? (
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
                      placeholder="0"
                    />
                  ) : (
                    <p className="mt-1 text-lg font-semibold">
                      {formatCurrency(financialProfile.emergencyFund)}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="investmentExperience">
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
                      <SelectTrigger>
                        <SelectValue />
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
                    <p className="mt-1 text-lg">
                      {getExperienceLabel(
                        financialProfile.investmentExperience
                      )}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Categorias de Gastos */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <PiggyBank className="h-5 w-5" />
                  Distribuição de Gastos Mensais (R$)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(tempProfile.spendingCategories).map(
                    ([category, value]) => {
                      const labels = {
                        housing: 'Moradia',
                        food: 'Alimentação',
                        transport: 'Transporte',
                        entertainment: 'Entretenimento',
                        healthcare: 'Saúde',
                        education: 'Educação',
                        other: 'Outros',
                      };

                      return (
                        <div key={category}>
                          <Label htmlFor={category}>
                            {labels[category as keyof typeof labels]}
                          </Label>
                          {editingProfile ? (
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
                              placeholder="0"
                            />
                          ) : (
                            <p className="mt-1 font-semibold">
                              {formatCurrency(value)}
                            </p>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Objetivos Financeiros */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Objetivos Financeiros
                </h3>
                {financialProfile.financialGoals.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {financialProfile.financialGoals.map((goal, index) => (
                      <Badge key={index} variant="secondary">
                        {goal}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Nenhum objetivo financeiro configurado.
                    <Link
                      href="/goals"
                      className="text-blue-600 hover:underline ml-1"
                    >
                      Configure suas metas aqui.
                    </Link>
                  </p>
                )}
              </div>

              {/* Alertas e Sugestões */}
              {!editingProfile && financialProfile.monthlyIncome > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Análise do Perfil
                  </h3>

                  {/* Sugestão de reserva de emergência */}
                  {financialProfile.emergencyFund <
                    financialProfile.monthlyIncome * 3 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Reserva de Emergência:</strong> Recomendamos ter
                        entre 3-6 meses de gastos guardados. Sua reserva atual
                        representa{' '}
                        {Math.round(
                          (financialProfile.emergencyFund /
                            financialProfile.monthlyIncome) *
                            100
                        ) / 100}{' '}
                        meses.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Total de gastos vs renda */}
                  {(() => {
                    const totalExpenses = Object.values(
                      financialProfile.spendingCategories
                    ).reduce((a, b) => a + b, 0);
                    const expenseRatio =
                      totalExpenses / financialProfile.monthlyIncome;

                    if (expenseRatio > 0.8) {
                      return (
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Alto Nível de Gastos:</strong> Seus gastos
                            representam {Math.round(expenseRatio * 100)}% da sua
                            renda. Considere revisar seus gastos para aumentar
                            sua capacidade de poupança.
                          </AlertDescription>
                        </Alert>
                      );
                    } else if (expenseRatio < 0.6) {
                      return (
                        <Alert>
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Ótimo Controle:</strong> Seus gastos
                            representam apenas {Math.round(expenseRatio * 100)}%
                            da sua renda. Você tem boa capacidade de poupança!
                          </AlertDescription>
                        </Alert>
                      );
                    }
                  })()}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Ações */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Ações da Conta</CardTitle>
          <CardDescription>Gerenciar sua conta e navegação</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Link href="/dashboard" className="flex-1">
            <Button className="w-full" variant="outline">
              Voltar ao Dashboard
            </Button>
          </Link>
          <Link href="/settings" className="flex-1">
            <Button className="w-full" variant="outline">
              Configurações
            </Button>
          </Link>
          <Link href="/integracoes" className="flex-1">
            <Button className="w-full" variant="outline">
              Integrações Bancárias
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
