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
 * Apenas Nubank disponível
 */
export const OPEN_FINANCE_INSTITUTIONS: OpenFinanceInstitution[] = [
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
