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
  Plus,
  Settings,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

interface FinancialProfile {
  // User info (comes from session)
  userName: string;

  // Financial data (stored in MongoDB profile field)
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
  emergencyFund: number;

  // Risk and knowledge
  riskProfile: 'conservative' | 'moderate' | 'aggressive'; // maps to riskTolerance in DB
  financialKnowledgeLevel: 'beginner' | 'intermediate' | 'advanced';
  investmentExperience?: 'beginner' | 'intermediate' | 'advanced'; // might be redundant with financialKnowledgeLevel

  // Goals
  financialGoals: string[];
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
    financialKnowledgeLevel: 'intermediate',
  });

  // Estados temporários para edição
  const [tempProfile, setTempProfile] =
    useState<FinancialProfile>(financialProfile);

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
        const apiData = await response.json();

        // Map backend data to frontend model
        const profileData: FinancialProfile = {
          userName: session?.user?.name || '',
          monthlyIncome: apiData.monthlyIncome || 0,
          spendingCategories: apiData.spendingCategories || {
            housing: 0,
            food: 0,
            transport: 0,
            entertainment: 0,
            healthcare: 0,
            education: 0,
            other: 0,
          },
          emergencyFund: apiData.emergencyFund || 0,
          // Map backend riskTolerance to frontend riskProfile
          riskProfile: apiData.riskProfile || 'moderate',
          financialGoals: apiData.financialGoals || [],
          // Map backend investmentExperience to frontend financialKnowledgeLevel
          // and keep investmentExperience as a duplicate (might need to be removed later)
          financialKnowledgeLevel: apiData.investmentExperience || 'beginner',
          investmentExperience: apiData.investmentExperience || 'beginner',
        };

        setFinancialProfile(profileData);
        setTempProfile(profileData);
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
      // Map frontend fields to backend fields
      const apiPayload = {
        monthlyIncome: tempProfile.monthlyIncome,
        spendingCategories: tempProfile.spendingCategories,
        emergencyFund: tempProfile.emergencyFund,
        // Map frontend riskProfile to backend riskTolerance
        riskProfile: tempProfile.riskProfile,
        financialGoals: tempProfile.financialGoals,
        // Map frontend financialKnowledgeLevel to backend investmentExperience
        investmentExperience: tempProfile.financialKnowledgeLevel,
      };

      const response = await fetch('/api/user/financial-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload),
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

  // Função para salvar o nome do usuário foi removida

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
        return 'bg-secondary text-secondary-foreground';
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 lg:px-8 py-6">
      <div className="mb-8">
        <h1 className="text-xl font-semibold">Meu Perfil</h1>
        <p className="text-muted-foreground">
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
      <Card className="mb-8 border-none shadow-md">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold border-2 border-primary/20">
              {session.user.name ? (
                session.user.name.substring(0, 1).toUpperCase()
              ) : (
                <User size={36} />
              )}
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">
                  {session.user.name || 'Nome não informado'}
                </h2>

                <div>{/* Edição de nome desativada */}</div>
              </div>

              <div className="text-muted-foreground">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {session.user.email}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Badge
                  variant="outline"
                  className="border-primary/20 text-primary hover:bg-primary/10"
                >
                  <User className="h-3 w-3 mr-1" />
                  Membro desde 2025
                </Badge>
                <Badge
                  variant="outline"
                  className="border-green-500/20 text-green-500 hover:bg-green-500/10"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Perfil Completo
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Goals have been removed - accessible through /goals page */}

      {/* Separator */}
      <div className="mt-6 mb-10">
        <Separator />
      </div>

      {/* Detalhes do Perfil */}
      <Card className="mb-8 shadow-md overflow-hidden">
        <CardHeader className="bg-primary/5 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-medium flex items-center">
                <PiggyBank className="h-5 w-5 mr-2 text-primary" />
                Detalhes do Perfil Financeiro
              </CardTitle>
              <CardDescription className="mt-1">
                Informações importantes sobre seu perfil financeiro
              </CardDescription>
            </div>
            {!editingProfile ? (
              <Button
                variant="outline"
                onClick={() => setEditingProfile(true)}
                className="bg-background hover:bg-primary/10 text-primary border-primary/20"
              >
                <Edit className="h-4 w-4 mr-2" />
                Personalizar Perfil
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="bg-primary hover:bg-primary/90"
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
                  className="border-border"
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
                <h3 className="text-base font-medium mb-4 border-b pb-2">
                  Informações Financeiras Básicas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-card p-4 rounded-lg border border-border hover:shadow-sm transition-shadow">
                    <Label
                      htmlFor="monthlyIncome"
                      className="text-sm block mb-2"
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

                  <div className="bg-card p-4 rounded-lg border border-border hover:shadow-sm transition-shadow">
                    <Label
                      htmlFor="emergencyFund"
                      className="text-sm block mb-2"
                    >
                      Reserva
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

                  <div className="bg-card p-4 rounded-lg border border-border hover:shadow-sm transition-shadow">
                    <Label htmlFor="riskProfile" className="text-sm block mb-2">
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

              {/* Conhecimento Financeiro */}
              <div className="mb-8">
                <h3 className="text-base font-medium mb-4 border-b pb-2">
                  Conhecimento e Experiência
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-card p-4 rounded-lg border border-border hover:shadow-sm transition-shadow">
                    <Label
                      htmlFor="financialKnowledgeLevel"
                      className="text-sm block mb-2"
                    >
                      Nível de Conhecimento Financeiro
                    </Label>
                    {editingProfile ? (
                      <Select
                        value={tempProfile.financialKnowledgeLevel}
                        onValueChange={(
                          value: 'beginner' | 'intermediate' | 'advanced'
                        ) =>
                          setTempProfile({
                            ...tempProfile,
                            financialKnowledgeLevel: value,
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
                        <span className="px-2 py-1 rounded-md text-sm font-medium bg-primary/10 text-primary">
                          {getExperienceLabel(
                            financialProfile.financialKnowledgeLevel
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="bg-card p-4 rounded-lg border border-border hover:shadow-sm transition-shadow">
                    <Label
                      htmlFor="investmentExperience"
                      className="text-sm block mb-2"
                    >
                      Experiência em Investimentos
                    </Label>
                    {editingProfile ? (
                      <Select
                        value={tempProfile.investmentExperience || 'beginner'}
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
                        <span className="px-2 py-1 rounded-md text-sm font-medium bg-primary/10 text-primary">
                          {getExperienceLabel(
                            financialProfile.investmentExperience || 'beginner'
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Seção de Distribuição de Gastos Mensais removida - já existe no dashboard */}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
