/**
 * Títulos das páginas do Linio
 */

export const PAGE_TITLES = {
  dashboard: 'Dashboard',
  transactions: 'Transações',
  chat: 'Chat IA',
  goals: 'Metas',
  integracoes: 'Integrações',
  profile: 'Perfil',
  settings: 'Configurações',
  admin: 'Admin',
  support: 'Suporte',
  signin: 'Entrar',
  signup: 'Criar Conta',
} as const;

export function getPageTitle(page: keyof typeof PAGE_TITLES): string {
  return `Linio - ${PAGE_TITLES[page]}`;
}

export function getDefaultTitle(): string {
  return 'Linio - Assistente de IA Financeira';
}
