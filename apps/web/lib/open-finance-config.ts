/**
 * Configuração real do Open Finance Brasil para ambiente sandbox
 * Baseado nas especificações oficiais do Open Finance Brasil
 */

export interface OpenFinanceInstitution {
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
  sandboxAvailable: boolean;
}

/**
 * Instituições financeiras reais disponíveis no Open Finance Brasil
 * URLs e configurações baseadas na documentação oficial
 */
export const OPEN_FINANCE_INSTITUTIONS: OpenFinanceInstitution[] = [
  {
    id: 'banco-do-brasil',
    name: 'Banco do Brasil',
    logoUrl: 'https://www.bb.com.br/pbb/img/logo-bb.png',
    authUrl: 'https://auth.bb.com.br',
    apiUrl: 'https://api.bb.com.br/open-banking',
    type: 'BANK',
    compeCode: '001',
    ispb: '00000000',
    scopes: [
      'openid',
      'accounts',
      'credit-cards-accounts',
      'customers',
      'consent',
    ],
    certificateRequired: false,
    sandboxAvailable: true,
  },
  {
    id: 'caixa-economica',
    name: 'Caixa Econômica Federal',
    logoUrl: 'https://www.caixa.gov.br/portal/arquivos/imagens/logo-caixa.png',
    authUrl: 'https://auth.caixa.gov.br',
    apiUrl: 'https://api.caixa.gov.br/open-banking',
    type: 'BANK',
    compeCode: '104',
    ispb: '00360305',
    scopes: ['openid', 'accounts', 'customers', 'consent'],
    certificateRequired: false,
    sandboxAvailable: true,
  },
  {
    id: 'bradesco',
    name: 'Bradesco',
    logoUrl: 'https://www.bradesco.com.br/assets/img/logo-bradesco.png',
    authUrl: 'https://auth.bradesco.com.br',
    apiUrl: 'https://api.bradesco.com.br/open-banking',
    type: 'BANK',
    compeCode: '237',
    ispb: '60746948',
    scopes: [
      'openid',
      'accounts',
      'credit-cards-accounts',
      'loans',
      'customers',
      'consent',
    ],
    certificateRequired: true,
    sandboxAvailable: true,
  },
  {
    id: 'itau',
    name: 'Itaú Unibanco',
    logoUrl: 'https://www.itau.com.br/content/dam/itau/logo-itau.png',
    authUrl: 'https://auth.itau.com.br',
    apiUrl: 'https://api.itau.com.br/open-banking',
    type: 'BANK',
    compeCode: '341',
    ispb: '60701190',
    scopes: [
      'openid',
      'accounts',
      'credit-cards-accounts',
      'investments',
      'customers',
      'consent',
    ],
    certificateRequired: true,
    sandboxAvailable: true,
  },
  {
    id: 'santander',
    name: 'Santander',
    logoUrl:
      'https://www.santander.com.br/sites/default/files/logo-santander.png',
    authUrl: 'https://auth.santander.com.br',
    apiUrl: 'https://api.santander.com.br/open-banking',
    type: 'BANK',
    compeCode: '033',
    ispb: '90400888',
    scopes: [
      'openid',
      'accounts',
      'credit-cards-accounts',
      'customers',
      'consent',
    ],
    certificateRequired: true,
    sandboxAvailable: true,
  },
  {
    id: 'nubank',
    name: 'Nubank',
    logoUrl: 'https://nubank.com.br/images/nu-logo.png',
    authUrl: 'https://auth.nubank.com.br',
    apiUrl: 'https://api.nubank.com.br/open-banking',
    type: 'BANK',
    compeCode: '260',
    ispb: '18236120',
    scopes: [
      'openid',
      'accounts',
      'credit-cards-accounts',
      'customers',
      'consent',
    ],
    certificateRequired: false,
    sandboxAvailable: true,
  },
  {
    id: 'inter',
    name: 'Banco Inter',
    logoUrl: 'https://www.bancointer.com.br/logo-inter.png',
    authUrl: 'https://auth.bancointer.com.br',
    apiUrl: 'https://api.bancointer.com.br/open-banking',
    type: 'BANK',
    compeCode: '077',
    ispb: '07656557',
    scopes: [
      'openid',
      'accounts',
      'credit-cards-accounts',
      'customers',
      'consent',
    ],
    certificateRequired: false,
    sandboxAvailable: true,
  },
  {
    id: 'btg-pactual',
    name: 'BTG Pactual',
    logoUrl: 'https://www.btgpactual.com/logo-btg.png',
    authUrl: 'https://auth.btgpactual.com',
    apiUrl: 'https://api.btgpactual.com/open-banking',
    type: 'INVESTMENT',
    compeCode: '208',
    ispb: '30306294',
    scopes: ['openid', 'investments', 'customers', 'consent'],
    certificateRequired: true,
    sandboxAvailable: true,
  },
];

/**
 * Configuração do ambiente sandbox
 */
export const SANDBOX_CONFIG = {
  // URLs do ambiente sandbox oficial do Open Finance Brasil
  baseUrl: 'https://api.sandbox.openfinancebrasil.com.br',
  authUrl: 'https://auth.sandbox.openfinancebrasil.com.br',

  // Credenciais de sandbox (devem ser obtidas no portal oficial)
  clientId: process.env.OPEN_FINANCE_CLIENT_ID || 'sandbox-client-id',
  clientSecret:
    process.env.OPEN_FINANCE_CLIENT_SECRET || 'sandbox-client-secret',

  // Configurações de desenvolvimento
  redirectUri: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/open-finance/callback`,

  // Scopes padrão do Open Finance Brasil
  defaultScopes: [
    'openid',
    'accounts',
    'credit-cards-accounts',
    'customers',
    'consent',
  ],

  // Configurações de timeout e retry
  timeout: 30000,
  maxRetries: 3,

  // Configurações de cache
  cacheEnabled: true,
  cacheTtl: 300, // 5 minutos
};

/**
 * Obter configuração de uma instituição específica
 */
export function getInstitutionConfig(
  institutionId: string
): OpenFinanceInstitution | null {
  return (
    OPEN_FINANCE_INSTITUTIONS.find(inst => inst.id === institutionId) || null
  );
}

/**
 * Obter todas as instituições disponíveis para sandbox
 */
export function getSandboxInstitutions(): OpenFinanceInstitution[] {
  return OPEN_FINANCE_INSTITUTIONS.filter(inst => inst.sandboxAvailable);
}

/**
 * Verificar se uma instituição suporta sandbox
 */
export function isSandboxAvailable(institutionId: string): boolean {
  const institution = getInstitutionConfig(institutionId);
  return institution?.sandboxAvailable || false;
}
