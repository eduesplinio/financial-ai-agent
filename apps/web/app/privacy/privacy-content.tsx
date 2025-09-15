'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Shield,
  Eye,
  FileText,
  Lock,
  Database,
  Share,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import Link from 'next/link';

export function PrivacyContent() {
  const [showFullPolicy, setShowFullPolicy] = useState(false);

  const lastUpdated = 'Janeiro de 2025';
  const effectiveDate = '01 de Janeiro de 2025';

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <Shield className="h-10 w-10 text-blue-600" />
          Política de Privacidade
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Como coletamos, usamos e protegemos seus dados pessoais
        </p>
        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Última atualização: {lastUpdated}
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4" />
            Vigência: {effectiveDate}
          </div>
        </div>
      </div>

      {/* Resumo Executivo */}
      <Alert className="mb-8 border-blue-200 bg-blue-50">
        <Eye className="h-5 w-5" />
        <AlertDescription className="text-base">
          <strong>Em Resumo:</strong> Respeitamos sua privacidade e seguimos a
          Lei Geral de Proteção de Dados (LGPD). Coletamos apenas dados
          necessários para ofertar nossos serviços financeiros, mantemos tudo
          seguro e você tem total controle sobre suas informações.
        </AlertDescription>
      </Alert>

      <div className="space-y-8">
        {/* Seção 1: Informações que Coletamos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              1. Quais Informações Coletamos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Dados Pessoais Básicos:</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Nome completo e email (para criação da conta)</li>
                <li>Informações de perfil escolhidas por você</li>
                <li>Preferências de notificação e configurações</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Dados Financeiros:</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>
                  Informações financeiras fornecidas voluntariamente (renda,
                  gastos)
                </li>
                <li>
                  Dados de conexões bancárias (via Open Finance - quando
                  autorizado)
                </li>
                <li>Transações e análises geradas pela plataforma</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Dados Técnicos:</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Endereço IP e informações do navegador</li>
                <li>Logs de acesso e uso da plataforma</li>
                <li>
                  Cookies de funcionalidade (apenas essenciais por padrão)
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Seção 2: Como Usamos os Dados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              2. Como Usamos Seus Dados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Finalidades Principais:</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>
                  <strong>Prestação do Serviço:</strong> Análise financeira,
                  recomendações e insights personalizados
                </li>
                <li>
                  <strong>Autenticação e Segurança:</strong> Login seguro e
                  proteção da sua conta
                </li>
                <li>
                  <strong>Comunicação:</strong> Notificações importantes sobre
                  sua conta e serviços
                </li>
                <li>
                  <strong>Melhoria do Produto:</strong> Análises agregadas e
                  anônimas para aprimorar a plataforma
                </li>
              </ul>
            </div>
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Importante:</strong> Nunca vendemos, alugamos ou
                compartilhamos seus dados pessoais com terceiros para fins
                comerciais ou marketing.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Seção 3: Base Legal (LGPD) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              3. Base Legal para Tratamento (LGPD)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-green-700">
                  Execução de Contrato
                </h3>
                <p className="text-sm text-muted-foreground">
                  Dados necessários para prestar os serviços solicitados por
                  você
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-blue-700">
                  Consentimento
                </h3>
                <p className="text-sm text-muted-foreground">
                  Para funcionalidades opcionais, marketing e melhorias (quando
                  você autorizar)
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-purple-700">
                  Interesse Legítimo
                </h3>
                <p className="text-sm text-muted-foreground">
                  Segurança da plataforma, prevenção de fraudes e melhorias
                  técnicas
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-orange-700">
                  Obrigação Legal
                </h3>
                <p className="text-sm text-muted-foreground">
                  Cumprimento de regulamentações financeiras e fiscais
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seção 4: Compartilhamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share className="h-5 w-5" />
              4. Compartilhamento de Dados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Princípio:</strong> Seus dados só são compartilhados
                quando estritamente necessário e autorizado.
              </AlertDescription>
            </Alert>
            <div>
              <h3 className="font-semibold mb-2">Quando Compartilhamos:</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>
                  <strong>Prestadores de Serviço:</strong> Fornecedores de
                  infraestrutura (hospedagem, email) com contratos rígidos
                </li>
                <li>
                  <strong>Obrigações Legais:</strong> Quando exigido por lei ou
                  autoridades competentes
                </li>
                <li>
                  <strong>Segurança:</strong> Para prevenir fraudes ou proteger
                  direitos legítimos
                </li>
                <li>
                  <strong>Transações:</strong> Em caso de fusão/aquisição (com
                  prévia notificação)
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Nunca Compartilhamos:</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Dados para fins de marketing de terceiros</li>
                <li>
                  Informações financeiras detalhadas sem autorização expressa
                </li>
                <li>
                  Dados agregados que possam identificá-lo individualmente
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Seção 5: Segurança */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              5. Como Protegemos Seus Dados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Medidas Técnicas:</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Criptografia em trânsito e em repouso</li>
                  <li>Autenticação segura e controle de acesso</li>
                  <li>Monitoramento contínuo e logs de segurança</li>
                  <li>Backups seguros e redundantes</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Medidas Organizacionais:</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Treinamento regular da equipe</li>
                  <li>Políticas internas de segurança</li>
                  <li>Acesso limitado por necessidade</li>
                  <li>Auditorias periódicas de segurança</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seção 6: Seus Direitos LGPD */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              6. Seus Direitos pela LGPD
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground mb-4">
              Você tem os seguintes direitos sobre seus dados pessoais:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold">Acesso</h3>
                  <p className="text-sm text-muted-foreground">
                    Ver quais dados temos sobre você
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold">Correção</h3>
                  <p className="text-sm text-muted-foreground">
                    Atualizar dados incorretos ou incompletos
                  </p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h3 className="font-semibold">Exclusão</h3>
                  <p className="text-sm text-muted-foreground">
                    Deletar seus dados pessoais
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold">Portabilidade</h3>
                  <p className="text-sm text-muted-foreground">
                    Exportar seus dados em formato legível
                  </p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-semibold">Revogação</h3>
                  <p className="text-sm text-muted-foreground">
                    Retirar consentimento a qualquer momento
                  </p>
                </div>
                <div className="border-l-4 border-gray-500 pl-4">
                  <h3 className="font-semibold">Informação</h3>
                  <p className="text-sm text-muted-foreground">
                    Saber como seus dados são tratados
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold mb-2">
                Como Exercer Seus Direitos:
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/settings" className="flex-1">
                  <Button className="w-full" variant="outline">
                    Gerenciar na Conta
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="flex-1 flex items-center gap-2"
                  onClick={() =>
                    (window.location.href = 'mailto:privacy@financial-ai.com')
                  }
                >
                  <Mail className="h-4 w-4" />
                  Email de Privacidade
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seção 7: Retenção de Dados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              7. Por Quanto Tempo Guardamos Seus Dados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 border rounded">
                <span className="font-medium">Dados da Conta</span>
                <span className="text-muted-foreground">
                  Enquanto a conta estiver ativa
                </span>
              </div>
              <div className="flex justify-between items-center p-3 border rounded">
                <span className="font-medium">Dados Financeiros</span>
                <span className="text-muted-foreground">
                  5 anos (obrigatório por lei)
                </span>
              </div>
              <div className="flex justify-between items-center p-3 border rounded">
                <span className="font-medium">Logs de Segurança</span>
                <span className="text-muted-foreground">1 ano</span>
              </div>
              <div className="flex justify-between items-center p-3 border rounded">
                <span className="font-medium">Dados de Marketing</span>
                <span className="text-muted-foreground">
                  Até revogação do consentimento
                </span>
              </div>
            </div>
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Exclusão Automática:</strong> Dados desnecessários são
                automaticamente deletados quando o período de retenção expira.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Política Completa (Seção Expandível) */}
        {showFullPolicy && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Política Completa e Termos Técnicos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">
                  8. Cookies e Tecnologias Similares
                </h3>
                <p className="text-muted-foreground mb-3">
                  Utilizamos cookies apenas essenciais para o funcionamento da
                  plataforma:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>
                    <strong>Autenticação:</strong> Para manter você logado de
                    forma segura
                  </li>
                  <li>
                    <strong>Preferências:</strong> Para lembrar suas
                    configurações
                  </li>
                  <li>
                    <strong>Segurança:</strong> Para detectar atividade suspeita
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground mt-3">
                  Você pode desabilitar cookies no seu navegador, mas isso pode
                  afetar a funcionalidade.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">
                  9. Transferências Internacionais
                </h3>
                <p className="text-muted-foreground">
                  Seus dados são processados principalmente no Brasil. Quando
                  necessário transferir dados para outros países, garantimos
                  proteção adequada através de cláusulas contratuais padrão ou
                  outros mecanismos aprovados pela ANPD.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">
                  10. Menores de Idade
                </h3>
                <p className="text-muted-foreground">
                  Nossa plataforma não é destinada a menores de 18 anos. Se
                  tomarmos conhecimento de que coletamos dados de menores sem
                  consentimento parental adequado, deletaremos imediatamente
                  essas informações.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">
                  11. Alterações na Política
                </h3>
                <p className="text-muted-foreground">
                  Podemos atualizar esta política periodicamente. Mudanças
                  significativas serão comunicadas por email e/ou notificação na
                  plataforma com pelo menos 30 dias de antecedência.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">
                  12. Contato e Reclamações
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Encarregado de Dados (DPO):</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        privacy@financial-ai.com
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        +55 11 1234-5678
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Autoridade Supervisora:</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        ANPD - Autoridade Nacional
                      </div>
                      <a
                        href="https://www.gov.br/anpd"
                        className="text-blue-600 hover:underline"
                      >
                        www.gov.br/anpd
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Botão para expandir/recolher */}
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setShowFullPolicy(!showFullPolicy)}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            {showFullPolicy
              ? 'Ocultar Política Completa'
              : 'Ver Política Completa'}
          </Button>
        </div>

        {/* Footer */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Esta política está em conformidade com a LGPD (Lei 13.709/2018)
              </div>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Link
                  href="/settings"
                  className="text-blue-600 hover:underline"
                >
                  Gerenciar Consentimentos
                </Link>
                <span className="hidden sm:inline">•</span>
                <a
                  href="mailto:privacy@financial-ai.com"
                  className="text-blue-600 hover:underline"
                >
                  Contato de Privacidade
                </a>
                <span className="hidden sm:inline">•</span>
                <Link
                  href="/dashboard"
                  className="text-blue-600 hover:underline"
                >
                  Voltar ao Dashboard
                </Link>
              </div>
              <div className="text-xs text-muted-foreground">
                Última atualização: {lastUpdated} | Vigência: {effectiveDate}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
