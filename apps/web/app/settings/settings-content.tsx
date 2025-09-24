'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Settings,
  Bell,
  Shield,
  Smartphone,
  Mail,
  AlertTriangle,
  CheckCircle,
  Download,
  Trash,
  Eye,
} from 'lucide-react';

interface NotificationSettings {
  email: boolean;
  push: boolean;
  marketing: boolean;
  largeTransactions: boolean;
  unusualSpending: boolean;
  goalProgress: boolean;
  budgetExceeded: boolean;
}

interface PrivacyConsents {
  analytics: boolean;
  marketing: boolean;
  dataProcessing: boolean; // sempre true
}

export function SettingsContent() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);

  // Estados para notificações
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    push: true,
    marketing: false,
    largeTransactions: true,
    unusualSpending: true,
    goalProgress: true,
    budgetExceeded: true,
  });

  // Estados para LGPD
  const [consents, setConsents] = useState<PrivacyConsents>({
    analytics: false,
    marketing: false,
    dataProcessing: true,
  });

  // Carregar configurações do usuário
  useEffect(() => {
    if (session?.user?.id) {
      loadUserSettings();
    }
  }, [session]);

  const loadUserSettings = async () => {
    try {
      setInitialLoading(true);

      // Carregar configurações do usuário usando a preferencies do usuário
      const response = await fetch('/api/user/preferences');
      if (response.ok) {
        const userData = await response.json();
        const preferences = userData.preferences || {};

        // Configurar notificações usando os campos corretos
        if (preferences.notifications) {
          setNotifications({
            // Campos básicos
            email:
              preferences.notifications.email !== undefined
                ? preferences.notifications.email
                : true,
            push:
              preferences.notifications.push !== undefined
                ? preferences.notifications.push
                : true,
            marketing:
              preferences.notifications.marketing !== undefined
                ? preferences.notifications.marketing
                : false,

            // Usar os campos específicos quando disponíveis, caso contrário usar os campos genéricos
            largeTransactions:
              preferences.notifications.largeTransactions !== undefined
                ? preferences.notifications.largeTransactions
                : preferences.notifications.budgetAlerts !== undefined
                  ? preferences.notifications.budgetAlerts
                  : true,

            unusualSpending:
              preferences.notifications.unusualSpending !== undefined
                ? preferences.notifications.unusualSpending
                : preferences.notifications.anomalyDetection !== undefined
                  ? preferences.notifications.anomalyDetection
                  : true,

            goalProgress:
              preferences.notifications.goalProgress !== undefined
                ? preferences.notifications.goalProgress
                : preferences.notifications.goalReminders !== undefined
                  ? preferences.notifications.goalReminders
                  : true,

            budgetExceeded:
              preferences.notifications.budgetExceeded !== undefined
                ? preferences.notifications.budgetExceeded
                : preferences.notifications.budgetAlerts !== undefined
                  ? preferences.notifications.budgetAlerts
                  : true,
          });
        }

        // Configurar consentimentos de privacidade
        if (preferences.privacy) {
          setConsents({
            dataProcessing: true, // Sempre true
            analytics:
              preferences.privacy.analytics !== undefined
                ? preferences.privacy.analytics
                : false,
            marketing:
              preferences.privacy.marketing !== undefined
                ? preferences.privacy.marketing
                : false,
          });
        }
      }
    } catch (error) {
      console.error('Error loading user settings:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    try {
      // Cria um payload explícito com todos os valores para evitar problemas de undefined
      const updatedNotifications = {
        notifications: {
          // Campos básicos
          email: notifications.email,
          push: notifications.push,
          marketing: notifications.marketing,

          // Campos principais - usar valores específicos, não undefined
          largeTransactions: notifications.largeTransactions === true,
          unusualSpending: notifications.unusualSpending === true,
          goalProgress: notifications.goalProgress === true,
          budgetExceeded: notifications.budgetExceeded === true,

          // Campos legados - sincronizar explicitamente com os campos principais
          budgetAlerts: notifications.largeTransactions === true,
          anomalyDetection: notifications.unusualSpending === true,
          goalReminders: notifications.goalProgress === true,

          // Outros campos opcionais
          sms: false, // valor padrão explícito
        },
      };

      // Log para debug
      console.log(
        'Enviando payload de notificações:',
        JSON.stringify(updatedNotifications, null, 2)
      );

      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedNotifications),
      });

      if (response.ok) {
        setSaveMessage('Configurações de notificação salvas com sucesso!');
        console.log('Notificações salvas:', updatedNotifications);
      } else {
        setSaveMessage('Erro ao salvar configurações');
        console.error('Erro ao salvar notificações:', response.statusText);
      }
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao salvar notificações:', error);
      setSaveMessage('Erro ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConsentChange = async (
    type: keyof PrivacyConsents,
    value: boolean
  ) => {
    if (type === 'dataProcessing' && !value) {
      setSaveMessage(
        'Processamento de dados essenciais não pode ser desabilitado'
      );
      return;
    }

    setLoading(true);
    try {
      const updatedConsents = { ...consents, [type]: value };
      setConsents(updatedConsents);

      // Mapear todos os consentimentos para o formato do preferences no banco de dados
      const preferencesPayload = {
        privacy: {
          // Usar os valores atualizados no estado local
          analytics: updatedConsents.analytics,
          marketing: updatedConsents.marketing,
          // Manter dataSharing como false ou conforme o valor atual no banco
          dataSharing: false,
        },
      };

      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferencesPayload),
      });

      if (response.ok) {
        setSaveMessage(
          `Consentimento ${value ? 'concedido' : 'revogado'} com sucesso!`
        );
      } else {
        setSaveMessage('Erro ao atualizar consentimento');
      }
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Erro ao atualizar consentimento');
    } finally {
      setLoading(false);
    }
  };

  const handleDataAction = async (action: string) => {
    if (action === 'delete') {
      const confirm = window.confirm(
        'Esta ação irá excluir permanentemente todos os seus dados. Esta ação não pode ser desfeita. Tem certeza?'
      );
      if (!confirm) return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/user/data-management', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        if (action === 'export') {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `meus-dados-${Date.now()}.json`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          setSaveMessage('Download dos seus dados iniciado!');
        } else if (action === 'delete') {
          setSaveMessage('Conta excluída com sucesso. Redirecionando...');
          setTimeout(() => {
            window.location.href = '/auth/signin';
          }, 2000);
        }
      } else {
        setSaveMessage('Erro ao processar solicitação');
      }
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Erro interno do servidor');
    } finally {
      setLoading(false);
    }
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Carregando configurações...
          </p>
        </div>
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div className="w-full px-4 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-xl font-semibold">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie suas preferências e configurações da conta
          </p>
        </div>
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-500"></div>
        </div>
      </div>
    );
  }

  // Debug function para inspecionar o estado local e dados da API
  const debugState = async () => {
    console.log('Notificações locais:', notifications);
    console.log('Privacidade local:', consents);

    // Buscar dados atuais da API para comparação
    try {
      const response = await fetch('/api/user/preferences');
      if (response.ok) {
        const apiData = await response.json();
        console.log('--- DADOS DA API ---');
        console.log('Objeto completo:', apiData);

        if (apiData.notifications) {
          console.log('Notificações da API:');
          // Campos originais
          console.log(
            '  largeTransactions:',
            typeof apiData.notifications.largeTransactions,
            apiData.notifications.largeTransactions
          );
          console.log(
            '  unusualSpending:',
            typeof apiData.notifications.unusualSpending,
            apiData.notifications.unusualSpending
          );
          console.log(
            '  goalProgress:',
            typeof apiData.notifications.goalProgress,
            apiData.notifications.goalProgress
          );
          console.log(
            '  budgetExceeded:',
            typeof apiData.notifications.budgetExceeded,
            apiData.notifications.budgetExceeded
          );

          // Campos legados
          console.log(
            '  budgetAlerts:',
            typeof apiData.notifications.budgetAlerts,
            apiData.notifications.budgetAlerts
          );
          console.log(
            '  goalReminders:',
            typeof apiData.notifications.goalReminders,
            apiData.notifications.goalReminders
          );
          console.log(
            '  anomalyDetection:',
            typeof apiData.notifications.anomalyDetection,
            apiData.notifications.anomalyDetection
          );
        }
      }
    } catch (error) {
      console.error('Erro ao buscar dados da API para debug:', error);
    }
  };

  return (
    <div className="w-full px-4 lg:px-8 py-6">
      <div className="mb-8">
        <h1 className="text-xl font-semibold">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie suas preferências e configurações da conta
        </p>
      </div>

      {saveMessage && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md shadow-lg flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            <span className="font-medium">{saveMessage}</span>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {/* Privacidade e LGPD - Movido para o início por relevância */}
        <Card className="mb-8 shadow-md overflow-hidden">
          <CardHeader className="bg-primary/5 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-medium flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-primary" />
                  Privacidade e Dados Pessoais
                </CardTitle>
                <CardDescription className="mt-1">
                  Gerencie seus dados pessoais e consentimentos conforme a LGPD
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 pb-8">
            {/* <Alert className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Seus direitos pela LGPD:</strong> Acesso, correção,
                exclusão, portabilidade e informação sobre o uso dos seus dados
                pessoais.{' '}
              </AlertDescription>
            </Alert> */}

            <div className="space-y-4">
              <div className="bg-card p-4 rounded-lg border border-border hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Dados Essenciais</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Dados necessários para funcionamento básico (login,
                      transações)
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={true} disabled={true} />
                    <span className="text-xs text-green-600 font-medium">
                      Obrigatório
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-card p-4 rounded-lg border border-border hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Analytics e Melhorias</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Dados anônimos para melhorar a experiência do usuário
                    </p>
                  </div>
                  <Switch
                    checked={consents.analytics}
                    onCheckedChange={value =>
                      handleConsentChange('analytics', value)
                    }
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="bg-card p-4 rounded-lg border border-border hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">
                      Comunicações de Marketing
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Ofertas personalizadas e comunicações promocionais
                    </p>
                  </div>
                  <Switch
                    checked={consents.marketing}
                    onCheckedChange={value =>
                      handleConsentChange('marketing', value)
                    }
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 mt-2">
              <h3 className="text-base font-medium mb-4 border-b pb-2">
                Gerenciar Seus Dados
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-card border-border hover:bg-primary/10 text-primary"
                  onClick={() => handleDataAction('export')}
                  disabled={loading}
                >
                  <Download className="h-4 w-4" />
                  Baixar Dados
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-card border-border hover:bg-primary/10 text-primary"
                  onClick={() => (window.location.href = '/privacy')}
                >
                  <Eye className="h-4 w-4" />
                  Ver Política
                </Button>

                <Button
                  variant="destructive"
                  className="flex items-center gap-2 bg-red-500 border-red-500 hover:bg-red-600 text-white"
                  onClick={() => handleDataAction('delete')}
                  disabled={loading}
                >
                  <Trash className="h-4 w-4" />
                  Excluir Conta
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Notificações */}
        <Card className="mb-8 shadow-md overflow-hidden">
          <CardHeader className="bg-primary/5 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-medium flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-primary" />
                  Notificações
                </CardTitle>
                <CardDescription className="mt-1">
                  Configure como e quando receber notificações
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 pb-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-card p-4 rounded-lg border border-border hover:shadow-sm transition-shadow">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    Notificações por Email
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receba alertas importantes por email
                  </p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={value =>
                    setNotifications({ ...notifications, email: value })
                  }
                />
              </div>

              <div className="flex items-center justify-between bg-card p-4 rounded-lg border border-border hover:shadow-sm transition-shadow">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-primary" />
                    Notificações Push
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações no navegador
                  </p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={value =>
                    setNotifications({ ...notifications, push: value })
                  }
                />
              </div>

              <div className="flex items-center justify-between bg-card p-4 rounded-lg border border-border hover:shadow-sm transition-shadow">
                <div className="space-y-0.5">
                  <Label>Emails Promocionais</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba dicas financeiras e novidades
                  </p>
                </div>
                <Switch
                  checked={notifications.marketing}
                  onCheckedChange={value =>
                    setNotifications({ ...notifications, marketing: value })
                  }
                />
              </div>
            </div>

            <div className="pt-6 mt-2">
              <h3 className="text-base font-medium mb-4 border-b pb-2">
                Alertas Específicos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-card p-4 rounded-lg border border-border hover:shadow-sm transition-shadow">
                  <Label className="text-sm font-medium mb-3 block">
                    Transações
                  </Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm">
                        Transações grandes (&gt;R$ 1.000)
                      </label>
                      <Switch
                        checked={notifications.largeTransactions}
                        onCheckedChange={value =>
                          setNotifications({
                            ...notifications,
                            largeTransactions: value,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Gastos incomuns</label>
                      <Switch
                        checked={notifications.unusualSpending}
                        onCheckedChange={value =>
                          setNotifications({
                            ...notifications,
                            unusualSpending: value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-card p-4 rounded-lg border border-border hover:shadow-sm transition-shadow">
                  <Label className="text-sm font-medium mb-3 block">
                    Metas e Orçamento
                  </Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Progresso das metas</label>
                      <Switch
                        checked={notifications.goalProgress}
                        onCheckedChange={value =>
                          setNotifications({
                            ...notifications,
                            goalProgress: value,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Orçamento excedido</label>
                      <Switch
                        checked={notifications.budgetExceeded}
                        onCheckedChange={value =>
                          setNotifications({
                            ...notifications,
                            budgetExceeded: value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-2">
              <Button
                onClick={handleSaveNotifications}
                disabled={loading}
                className="bg-primary hover:bg-primary/90"
              >
                {loading ? (
                  <span className="flex items-center">
                    <span className="animate-spin h-4 w-4 mr-1 border-2 border-white border-t-transparent rounded-full"></span>
                    Salvando
                  </span>
                ) : (
                  'Salvar Configurações de Notificação'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Adicionado rodapé com encarregado de dados */}
        <div className="text-xs text-muted-foreground py-4 border-t mt-8">
          <p>
            {/* <strong>Encarregado de Dados:</strong> privacy@financial-ai.com |{' '}
            <strong>Última atualização:</strong> Setembro 2025 */}
          </p>
        </div>
      </div>
    </div>
  );
}
