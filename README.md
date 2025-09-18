# Financial AI Agent

Um agente de IA financeira baseado em arquitetura RAG (Retrieval-Augmented Generation) que fornece orientação financeira personalizada através da integração segura com contas bancárias dos usuários.

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
cd financial-ai-agent
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
- **Chat IA**: `/chat` - Assistente financeiro conversacional (requer login)
- **Perfil**: `/profile` - Página de perfil do usuário
- **Admin**: `/admin` - Painel administrativo (apenas admins)

## 🤖 Chat IA - Assistente Financeiro

### Configuração Rápida

1. **Configure a chave da OpenAI**:

   ```bash
   # Crie o arquivo .env.local na pasta apps/web/
   echo "OPENAI_API_KEY=sk-your-openai-api-key-here" > apps/web/.env.local
   ```

2. **Inicie o servidor**:

   ```bash
   npm run dev
   ```

3. **Acesse o chat**:
   - Faça login na aplicação
   - Vá para `/chat`
   - Comece a conversar com o assistente!

### Funcionalidades do Chat

- **Conversação Natural**: Interface intuitiva para perguntas financeiras
- **Respostas Contextualizadas**: Baseadas em conhecimento financeiro especializado
- **Citações de Fontes**: Referências aos documentos utilizados
- **Gerenciamento de Sessão**: Mantém contexto da conversa
- **Tratamento de Erros**: Fallbacks e mensagens amigáveis

### Exemplos de Perguntas

- "Como posso começar a investir?"
- "Qual a diferença entre CDB e Tesouro Direto?"
- "Como calcular minha reserva de emergência?"
- "Quais são os tipos de investimento em renda fixa?"
- "Como funciona o sistema de juros compostos?"

### Teste Rápido

```bash
# Teste a integração sem interface
node scripts/test-chat-ai.js
```

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
financial-ai-agent/
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
- [ ] Dashboard financeiro avançado
- [ ] Sistema de metas e notificações

### ✅ Chat IA Implementado

- [x] **Agente Conversacional**: Integração real com OpenAI GPT-4
- [x] **Sistema RAG**: Busca semântica em base de conhecimento
- [x] **Interface de Chat**: Componente React responsivo
- [x] **Gerenciamento de Sessões**: Contexto conversacional
- [x] **Citações de Fontes**: Referências às fontes utilizadas

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
