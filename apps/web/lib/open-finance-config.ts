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
 * Instituições financeiras disponíveis no Open Finance Brasil
 */
export const OPEN_FINANCE_INSTITUTIONS: OpenFinanceInstitution[] = [
  {
    id: 'nubank',
    name: 'Nubank',
    logoUrl: '/bank-logos/nubank.svg',
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
    id: 'banco-do-brasil',
    name: 'Banco do Brasil',
    logoUrl: '/bank-logos/banco-do-brasil.svg',
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
    id: 'bradesco',
    name: 'Bradesco',
    logoUrl: '/bank-logos/bradesco.svg',
    authUrl: 'https://auth.bradesco.com.br',
    apiUrl: 'https://api.bradesco.com.br/open-banking',
    type: 'BANK',
    compeCode: '237',
    ispb: '60746948',
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
    logoUrl: '/bank-logos/inter.svg',
    authUrl: 'https://auth.bancointer.com.br',
    apiUrl: 'https://api.bancointer.com.br/open-banking',
    type: 'BANK',
    compeCode: '077',
    ispb: '00416968',
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
    id: 'itau',
    name: 'Itaú',
    logoUrl: '/bank-logos/itau.svg',
    authUrl: 'https://auth.itau.com.br',
    apiUrl: 'https://api.itau.com.br/open-banking',
    type: 'BANK',
    compeCode: '341',
    ispb: '60701190',
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
    id: 'btg',
    name: 'BTG Pactual',
    logoUrl: '/bank-logos/btg.svg',
    authUrl: 'https://auth.btgpactual.com',
    apiUrl: 'https://api.btgpactual.com/open-banking',
    type: 'BANK',
    compeCode: '208',
    ispb: '30306294',
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
    id: 'caixa',
    name: 'Caixa Econômica Federal',
    logoUrl: '/bank-logos/caixa.svg',
    authUrl: 'https://auth.caixa.gov.br',
    apiUrl: 'https://api.caixa.gov.br/open-banking',
    type: 'BANK',
    compeCode: '104',
    ispb: '00360305',
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
    id: 'c6',
    name: 'C6 Bank',
    logoUrl: '/bank-logos/c6.svg',
    authUrl: 'https://auth.c6bank.com.br',
    apiUrl: 'https://api.c6bank.com.br/open-banking',
    type: 'BANK',
    compeCode: '336',
    ispb: '31872495',
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
    id: 'santander',
    name: 'Santander',
    logoUrl: '/bank-logos/santander.svg',
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
    certificateRequired: false,
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
