'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function PrivacyContent() {
  const lastUpdated = 'Janeiro de 2025';
  const effectiveDate = '01 de Janeiro de 2025';

  return (
    <div className="w-full px-4 lg:px-8 py-6">
      <div className="mb-8">
        <h1 className="text-xl font-semibold">Política de Privacidade</h1>
        <p className="text-muted-foreground">
          Como coletamos, usamos e protegemos seus dados pessoais
        </p>
      </div>

      <Card className="mb-8 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            Informações que Coletamos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Coletamos informações pessoais, financeiras e técnicas para oferecer
            nossos serviços.
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Nome completo, email e preferências de notificação</li>
            <li>Informações financeiras fornecidas voluntariamente</li>
            <li>Dados técnicos como endereço IP e logs de acesso</li>
            <li>Dados de transações bancárias integradas via Open Finance</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            Como Usamos Seus Dados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Utilizamos seus dados para personalizar sua experiência, garantir
            segurança e melhorar nossos serviços.
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Prestação de serviços financeiros personalizados</li>
            <li>Autenticação e segurança da conta</li>
            <li>Comunicação sobre atualizações importantes</li>
            <li>Geração de insights financeiros e relatórios</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            Proteção de Dados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Implementamos medidas técnicas e organizacionais para proteger suas
            informações.
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Criptografia de dados sensíveis em trânsito e em repouso</li>
            <li>Auditorias regulares de segurança</li>
            <li>Controle de acesso baseado em papéis (RBAC)</li>
            <li>Detecção e resposta a incidentes de segurança</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            Compartilhamento de Dados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Compartilhamos seus dados apenas quando necessário e autorizado.
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Prestadores de serviço com contratos rígidos</li>
            <li>Obrigações legais e regulatórias</li>
            <li>Prevenção de fraudes e segurança</li>
            <li>Transações financeiras autorizadas pelo usuário</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            Direitos do Usuário
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Você tem os seguintes direitos sob a LGPD:
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Acesso aos seus dados</li>
            <li>Correção de informações</li>
            <li>Exclusão de dados pessoais</li>
            <li>Portabilidade de dados</li>
            <li>Revogação de consentimento</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            Retenção de Dados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Mantemos seus dados apenas pelo tempo necessário para cumprir nossas
            obrigações legais e contratuais.
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Dados da conta: enquanto ativa</li>
            <li>Dados financeiros: 5 anos</li>
            <li>Logs de segurança: 1 ano</li>
            <li>Dados de marketing: até revogação do consentimento</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-8 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            Conformidade com a LGPD
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Estamos comprometidos com a conformidade com a LGPD e outras
            regulamentações aplicáveis.
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Consentimento explícito para coleta e uso de dados</li>
            <li>Minimização de dados coletados</li>
            <li>Transparência nas práticas de dados</li>
            <li>Relatórios de auditoria disponíveis mediante solicitação</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
