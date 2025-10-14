/**
 * Linio - Configurações de Branding
 */

export const BRAND = {
  name: 'Linio',
  tagline: 'Seu Assistente de IA Financeira',
  description:
    'Assistente de IA financeira personalizado que oferece orientação inteligente para suas finanças',

  colors: {
    primary: '#2563EB', // Azul confiança
    secondary: '#10B981', // Verde crescimento
    accent: '#F59E0B', // Dourado prosperidade
    muted: '#64748B', // Cinza moderno
  },

  social: {
    twitter: '@linio_ai',
    linkedin: 'linio-ai',
    github: 'linio-ai',
  },

  contact: {
    email: 'contato@linio.ai',
    support: 'suporte@linio.ai',
  },

  meta: {
    title: 'Linio - Assistente de IA Financeira',
    description:
      'Transforme sua vida financeira com inteligência artificial. Linio oferece orientação personalizada, análise de gastos e planejamento financeiro inteligente.',
    keywords: [
      'IA financeira',
      'assistente financeiro',
      'planejamento financeiro',
      'análise de gastos',
      'investimentos',
    ],
  },
} as const;

export const CHAT_CONFIG = {
  welcomeMessage:
    '🤖 Olá! Eu sou o Linio, seu assistente de IA financeira personalizado. Posso ajudá-lo com consultas sobre transações, investimentos, planejamento financeiro e muito mais. Como posso ajudá-lo hoje?',
  placeholderText: 'Digite sua pergunta sobre finanças...',
  examples: [
    'Qual meu saldo atual?',
    'Gastos em alimentação este mês',
    'Como investir R$ 1000?',
    'Análise dos meus gastos',
    'Sugestões de economia',
  ],
} as const;
