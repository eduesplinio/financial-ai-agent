# Linio

Assistente de IA financeira personalizado baseado em arquitetura RAG (Retrieval-Augmented Generation) que fornece orientação financeira inteligente através da integração segura com suas contas bancárias.

## 🚀 Tecnologias

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes, NextAuth.js v5
- **Database**: MongoDB Atlas com Vector Search
- **Cache**: Redis
- **AI/ML**: OpenAI GPT-4, Sentence Transformers, LangChain
- **Monorepo**: Turborepo
- **Qualidade**: ESLint, Prettier, Husky, TypeScript strict

## 📋 Pré-requisitos

- Node.js 18+
- npm 8+
- Docker e Docker Compose (para desenvolvimento local)

## 🛠️ Configuração Local

### 1. Clone o repositório

```bash
git clone <repository-url>
cd linio
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite o arquivo `.env.local` com suas configurações:

```env
# Database
MONGODB_URI=mongodb://dev:dev123@localhost:27017/financial_ai?authSource=admin

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# OAuth Providers (opcional para teste)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### 4. Inicie os serviços de desenvolvimento

```bash
# Inicia MongoDB e Redis
docker-compose up -d

# Aguarde alguns segundos para os serviços iniciarem
```

### 5. Execute o projeto

```bash
# Desenvolvimento
npm run dev

# Ou para build de produção
npm run build
npm run start
```

### 6. Acesse a aplicação

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🔐 Testando a Autenticação

### Criando uma conta local

1. Acesse [http://localhost:3000/auth/signup](http://localhost:3000/auth/signup)
2. Preencha o formulário de cadastro
3. Faça login em [http://localhost:3000/auth/signin](http://localhost:3000/auth/signin)

### Testando diferentes roles

Para testar diferentes permissões, você pode alterar o role do usuário diretamente no MongoDB:

```javascript
// Conecte ao MongoDB
use financial_ai

// Torne um usuário admin
db.users.updateOne(
  { email: "seu@email.com" },
  { $set: { role: "admin" } }
)

// Ou support
db.users.updateOne(
  { email: "seu@email.com" },
  { $set: { role: "support" } }
)

// Voltar para user
db.users.updateOne(
  { email: "seu@email.com" },
  { $set: { role: "user" } }
)
```

## 📱 Páginas Disponíveis

- **Home**: `/` - Página inicial (redireciona para dashboard se logado)
- **Login**: `/auth/signin` - Página de login
- **Cadastro**: `/auth/signup` - Página de cadastro
- **Dashboard**: `/dashboard` - Dashboard principal (requer login)
- **Perfil**: `/profile` - Página de perfil do usuário
- **Admin**: `/admin` - Painel administrativo (apenas admins)

## 🧪 Executando Testes

```bash
# Testes unitários
npm run test

# Testes com watch mode
npm run test:watch

# Testes de cobertura
npm run test:coverage

# Testes E2E
npm run test:e2e
```

## 🏗️ Estrutura do Projeto

```
linio/
├── apps/
│   └── web/                 # Next.js frontend
│       ├── app/            # App Router pages
│       ├── components/     # React components
│       ├── lib/           # Utilities and configurations
│       └── hooks/         # Custom React hooks
├── packages/
│   ├── shared/            # Tipos e utilitários compartilhados
│   ├── database/          # MongoDB models e conexão
│   ├── ai/               # Sistema RAG e LLM integrations
│   └── open-finance/     # Integração Open Finance
├── docker-compose.yml    # Serviços de desenvolvimento
└── turbo.json           # Configuração Turborepo
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia modo desenvolvimento
npm run build           # Build de produção
npm run start           # Inicia servidor de produção

# Qualidade de código
npm run lint            # Executa ESLint
npm run lint:fix        # Corrige problemas do ESLint
npm run format          # Formata código com Prettier
npm run type-check      # Verifica tipos TypeScript

# Database
npm run db:generate     # Gera tipos do banco
npm run db:push         # Aplica mudanças no schema
npm run db:migrate      # Executa migrações
npm run db:seed         # Popula banco com dados de teste

# Limpeza
npm run clean           # Limpa builds e cache
```

## 🐳 Docker

### Serviços incluídos

- **MongoDB**: Banco de dados principal na porta 27017
- **Redis**: Cache e sessões na porta 6379
- **Mongo Express**: Interface web para MongoDB na porta 8081 (opcional)

### Comandos úteis

```bash
# Iniciar serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down

# Resetar dados (cuidado!)
docker-compose down -v
```

## 🔍 Monitoramento

### MongoDB Express (opcional)

Se quiser uma interface visual para o MongoDB:

```bash
# Inicia com Mongo Express
docker-compose --profile tools up -d

# Acesse: http://localhost:8081
# Usuário: admin
# Senha: admin123
```

## 🚧 Status do Desenvolvimento

### ✅ Completo

- [x] Fundação do projeto (Turborepo, ESLint, Prettier, TypeScript)
- [x] Sistema de autenticação (NextAuth.js v5, OAuth, Credentials)
- [x] RBAC (Role-Based Access Control)
- [x] MongoDB Atlas e modelos de dados
- [x] Vector Search para RAG
- [x] Interface de usuário básica
- [x] Testes unitários e de integração

### 🚧 Em Desenvolvimento

- [ ] Integração Open Finance
- [ ] Processador de transações com ML
- [ ] Sistema RAG completo
- [ ] Agente conversacional
- [ ] Dashboard financeiro avançado
- [ ] Sistema de metas e notificações

## 📝 Próximos Passos

1. **Integração Open Finance**: Conectar com APIs bancárias
2. **ML Pipeline**: Categorização automática de transações
3. **Sistema RAG**: Indexação e busca de conhecimento financeiro
4. **Chat IA**: Interface conversacional com LLM
5. **Analytics**: Dashboard com visualizações avançadas

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
