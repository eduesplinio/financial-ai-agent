# Financial AI Agent

Um agente de IA financeira baseado em arquitetura RAG (Retrieval-Augmented Generation) que fornece orientação financeira personalizada através da integração segura com contas bancárias dos usuários.

## 🚀 Características

- **Integração Open Finance**: Conexão segura com instituições financeiras brasileiras
- **Análise Inteligente**: Categorização automática de transações usando ML
- **Assistente Conversacional**: Interface de chat natural para consultas financeiras
- **Sistema RAG**: Respostas baseadas em conhecimento financeiro confiável
- **Conformidade LGPD**: Proteção completa de dados pessoais
- **Dashboard Interativo**: Visualização intuitiva de dados financeiros

## 🏗️ Arquitetura

Este projeto utiliza uma arquitetura de monorepo com Turborepo, inspirada nas melhores práticas do [TabNews](https://github.com/filipedeschamps/tabnews.com.br).

### Stack Tecnológica

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Next.js API Routes
- **Database**: MongoDB Atlas com Vector Search
- **AI/ML**: LangChain, OpenAI GPT-4, Sentence Transformers
- **Cache**: Redis
- **Infraestrutura**: Vercel, Docker

### Estrutura do Projeto

```
financial-ai-agent/
├── apps/
│   └── web/                 # Next.js frontend
├── packages/
│   ├── shared/              # Tipos e utilitários compartilhados
│   ├── database/            # Modelos e conexões de banco
│   ├── ai/                  # Sistema RAG e integração LLM
│   ├── open-finance/        # Integração Open Finance
│   └── config/              # Configurações ESLint/Prettier
├── scripts/                 # Scripts de desenvolvimento
└── docs/                    # Documentação
```

## 🛠️ Desenvolvimento

### Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- npm 8+

### Configuração Inicial

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd financial-ai-agent
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env.local
   # Edite .env.local com suas configurações
   ```

4. **Inicie os serviços de desenvolvimento**
   ```bash
   docker-compose up -d
   ```

5. **Execute o projeto**
   ```bash
   npm run dev
   ```

### Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run test` - Executa os testes
- `npm run lint` - Executa o linter
- `npm run format` - Formata o código
- `npm run type-check` - Verifica tipos TypeScript

### Qualidade de Código

O projeto utiliza:

- **ESLint** com configurações rigorosas
- **Prettier** para formatação consistente
- **Husky** para git hooks
- **lint-staged** para linting incremental
- **Commitlint** para mensagens de commit padronizadas

## 🐳 Docker

### Desenvolvimento Local

```bash
# Inicia MongoDB e Redis
docker-compose up -d

# Para incluir MongoDB Express (opcional)
docker-compose --profile tools up -d
```

### Serviços Disponíveis

- **MongoDB**: `localhost:27017`
- **Redis**: `localhost:6379`
- **MongoDB Express**: `localhost:8081` (usuário: admin, senha: admin123)

## 📊 Banco de Dados

O projeto utiliza MongoDB Atlas com as seguintes collections:

- `users` - Dados dos usuários e perfis
- `transactions` - Transações financeiras
- `knowledge_documents` - Base de conhecimento para RAG
- `conversations` - Histórico de conversas

### Índices Configurados

- Vector Search para embeddings
- Índices compostos para queries otimizadas
- Índices de texto para busca

## 🔒 Segurança

- Criptografia AES-256 para dados sensíveis
- TLS 1.3 para comunicação
- Autenticação multifatorial
- Conformidade LGPD
- Rate limiting e proteção DDoS

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📈 Monitoramento

- **Sentry** para error tracking
- **Posthog** para analytics
- Health checks automatizados
- Métricas de performance

## 🚀 Deploy

O projeto está configurado para deploy automático na Vercel:

1. Conecte o repositório à Vercel
2. Configure as variáveis de ambiente
3. O deploy acontece automaticamente a cada push

## 📝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'feat: add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrão de Commits

Utilizamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` documentação
- `style:` formatação
- `refactor:` refatoração
- `test:` testes
- `chore:` tarefas de manutenção

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🤝 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato através do email: support@financial-ai.com

---

**Desenvolvido com ❤️ pela equipe Financial AI**