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

      // Carregar configurações de notificação
      const notifResponse = await fetch('/api/user/notifications');
      if (notifResponse.ok) {
        const notifData = await notifResponse.json();
        setNotifications(notifData);
      }

      // Carregar consentimentos
      const consentsResponse = await fetch('/api/user/consents');
      if (consentsResponse.ok) {
        const consentsData = await consentsResponse.json();
        setConsents(consentsData);
      }
    } catch (error) {
      console.error('Error loading user settings:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notifications),
      });

      if (response.ok) {
        setSaveMessage('Configurações de notificação salvas com sucesso!');
      } else {
        setSaveMessage('Erro ao salvar configurações de notificação');
      }
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Erro ao salvar configurações');
    } finally {
      setLoading(false);
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

      const response = await fetch('/api/user/consents', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedConsents),
      });

      if (response.ok) {
        setConsents(updatedConsents);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Configurações
          </h1>
        </div>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8" />
          Configurações
        </h1>
        <p className="text-muted-foreground mt-2">
          Gerencie suas preferências e configurações da conta
        </p>
      </div>

      {saveMessage && (
        <Alert className="mb-6">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{saveMessage}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-8">
        {/* Configurações de Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
            </CardTitle>
            <CardDescription>
              Configure como e quando receber notificações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
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

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
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

              <Separator />

              <div className="flex items-center justify-between">
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

            <div className="pt-4">
              <h4 className="text-sm font-medium mb-3">Alertas Específicos</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Transações</Label>
                  <div className="space-y-2">
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

                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Metas e Orçamento
                  </Label>
                  <div className="space-y-2">
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

            <div className="pt-4 border-t">
              <Button onClick={handleSaveNotifications} disabled={loading}>
                {loading
                  ? 'Salvando...'
                  : 'Salvar Configurações de Notificação'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Privacidade e LGPD */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacidade e Dados Pessoais
            </CardTitle>
            <CardDescription>
              Gerencie seus dados pessoais e consentimentos conforme a LGPD
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Seus direitos pela LGPD:</strong> Acesso, correção,
                exclusão, portabilidade e informação sobre o uso dos seus dados
                pessoais.{' '}
                <a href="/privacy" className="underline font-medium">
                  Ver Política de Privacidade completa
                </a>
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="border rounded-lg p-4">
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

              <div className="border rounded-lg p-4">
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

              <div className="border rounded-lg p-4">
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

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Gerenciar Seus Dados</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => handleDataAction('export')}
                  disabled={loading}
                >
                  <Download className="h-4 w-4" />
                  Baixar Dados
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => window.open('/privacy', '_blank')}
                >
                  <Eye className="h-4 w-4" />
                  Ver Política
                </Button>

                <Button
                  variant="destructive"
                  className="flex items-center gap-2"
                  onClick={() => handleDataAction('delete')}
                  disabled={loading}
                >
                  <Trash className="h-4 w-4" />
                  Excluir Conta
                </Button>
              </div>
            </div>

            <div className="text-xs text-muted-foreground pt-4 border-t">
              <p>
                <strong>Encarregado de Dados:</strong> privacy@financial-ai.com
                | <strong>Última atualização:</strong> Janeiro 2025
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
