# Estrutura do Projeto

Este documento descreve a organização e estrutura do projeto Financial AI Agent.

## Visão Geral

O projeto utiliza uma arquitetura de monorepo com Turborepo, seguindo as melhores práticas de desenvolvimento moderno e inspirado na estrutura do TabNews.

## Estrutura de Diretórios

```
financial-ai-agent/
├── .github/                 # GitHub workflows e templates
├── .husky/                  # Git hooks
├── .kiro/                   # Especificações do projeto
│   └── specs/
│       └── financial-ai-agent/
├── .vscode/                 # Configurações do VS Code
├── apps/                    # Aplicações
│   └── web/                 # Frontend Next.js
│       ├── app/             # App Router do Next.js 14
│       ├── components/      # Componentes React
│       ├── lib/             # Utilitários específicos do frontend
│       └── types/           # Tipos específicos do frontend
├── packages/                # Pacotes compartilhados
│   ├── shared/              # Tipos e utilitários compartilhados
│   ├── database/            # Modelos e conexões de banco
│   ├── ai/                  # Sistema RAG e integração LLM
│   ├── open-finance/        # Integração Open Finance
│   └── config/              # Configurações ESLint/Prettier
├── scripts/                 # Scripts de desenvolvimento
├── docs/                    # Documentação
└── [arquivos de configuração]
```

## Aplicações (apps/)

### web/
Frontend principal da aplicação construído com Next.js 14.

**Tecnologias:**
- Next.js 14 com App Router
- React 18 com TypeScript
- Tailwind CSS para styling
- Radix UI para componentes acessíveis
- React Hook Form + Zod para formulários

**Estrutura:**
- `app/` - Rotas e layouts do Next.js 14
- `components/` - Componentes React reutilizáveis
- `lib/` - Utilitários específicos do frontend
- `types/` - Tipos TypeScript específicos do frontend

## Pacotes (packages/)

### shared/
Contém tipos, utilitários e constantes compartilhados entre todos os pacotes.

**Conteúdo:**
- Schemas Zod para validação
- Tipos TypeScript compartilhados
- Utilitários de formatação
- Constantes da aplicação

### database/
Gerencia conexões com banco de dados e modelos de dados.

**Responsabilidades:**
- Conexão com MongoDB Atlas
- Schemas e modelos de dados
- Operações de banco de dados
- Migrações e seeds

### ai/
Sistema de IA e RAG (Retrieval-Augmented Generation).

**Responsabilidades:**
- Integração com LLMs (OpenAI, Anthropic)
- Sistema RAG para busca semântica
- Processamento de linguagem natural
- Geração de embeddings

### open-finance/
Integração com APIs do Open Finance brasileiro.

**Responsabilidades:**
- Cliente para APIs Open Finance
- Autenticação OAuth2
- Sincronização de dados bancários
- Gerenciamento de consentimentos

### config/
Configurações compartilhadas de linting e formatação.

**Conteúdo:**
- Configurações ESLint
- Configurações Prettier
- Regras de linting compartilhadas

## Configurações de Qualidade

### ESLint
- Configuração rigorosa com TypeScript
- Regras específicas para React e Next.js
- Integração com Prettier

### Prettier
- Formatação consistente
- Configuração otimizada para TypeScript/React

### Husky + lint-staged
- Pre-commit hooks para qualidade
- Linting e formatação automática
- Validação de mensagens de commit

### Commitlint
- Padrão Conventional Commits
- Mensagens de commit estruturadas
- Integração com semantic release

## Desenvolvimento

### Scripts Principais
- `npm run dev` - Desenvolvimento
- `npm run build` - Build de produção
- `npm run test` - Testes
- `npm run lint` - Linting
- `npm run format` - Formatação

### Turborepo
- Build paralelo e cache inteligente
- Dependências entre pacotes
- Pipeline otimizado

### Docker
- MongoDB e Redis para desenvolvimento
- Configuração via docker-compose
- Scripts de inicialização

## Testes

### Estrutura
- Jest para testes unitários
- Testing Library para testes de componentes
- Playwright para testes E2E

### Cobertura
- Mínimo 90% para componentes críticos
- Testes de integração
- Testes de aceitação

## Deploy

### Vercel
- Deploy automático
- Preview deployments
- Edge functions

### Monitoramento
- Sentry para error tracking
- Posthog para analytics
- Health checks

## Segurança

### Dados
- Criptografia AES-256
- TLS 1.3
- Conformidade LGPD

### Autenticação
- NextAuth.js
- OAuth2 providers
- JWT tokens

### Rate Limiting
- Proteção contra abuse
- Limites por usuário/IP
- Circuit breakers

## Próximos Passos

1. Implementar autenticação (Task 2)
2. Configurar MongoDB e modelos (Task 3)
3. Desenvolver integração Open Finance (Task 4)
4. Implementar sistema RAG (Task 6)
5. Criar interface conversacional (Task 7)

---

Para mais detalhes sobre implementação específica, consulte os arquivos de especificação em `.kiro/specs/financial-ai-agent/`.