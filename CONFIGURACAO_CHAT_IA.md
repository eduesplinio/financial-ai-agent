# Configuração do Chat IA - Agente Financeiro

## Visão Geral

O sistema de chat IA foi implementado com integração real ao OpenAI GPT-4, utilizando arquitetura RAG (Retrieval-Augmented Generation) para fornecer respostas precisas e contextualizadas sobre finanças pessoais.

## Configuração Necessária

### 1. Variáveis de Ambiente

Crie um arquivo `.env.local` na pasta `apps/web/` com as seguintes variáveis:

```bash
# OpenAI Configuration (OBRIGATÓRIO)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/financial-ai-agent?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Redis Configuration (opcional, para cache)
REDIS_URL=redis://localhost:6379

# Application Configuration
NODE_ENV=development
```

### 2. Obter Chave da OpenAI

1. Acesse [OpenAI Platform](https://platform.openai.com/)
2. Faça login ou crie uma conta
3. Vá para "API Keys" no menu lateral
4. Clique em "Create new secret key"
5. Copie a chave e cole no arquivo `.env.local`

## Arquitetura Implementada

### Componentes Principais

1. **ConversationalAgent** (`packages/ai/src/conversation/conversational-agent.ts`)
   - Orquestra a conversa entre usuário e IA
   - Integra LLM + RAG para respostas contextualizadas
   - Gerencia sessões de conversa

2. **ChatService** (`apps/web/lib/chat-service.ts`)
   - Camada de serviço para a aplicação web
   - Gerencia sessões em memória
   - Interface entre frontend e backend

3. **API Route** (`apps/web/app/api/chat/route.ts`)
   - Endpoint REST para processar mensagens
   - Autenticação e validação
   - Integração com o ChatService

4. **ChatInterface** (`apps/web/components/chat/chat-interface.tsx`)
   - Componente React para interface do chat
   - Comunicação com API
   - Exibição de mensagens e fontes

### Fluxo de Funcionamento

```mermaid
graph TD
    A[Usuário digita mensagem] --> B[ChatInterface]
    B --> C[API /api/chat]
    C --> D[ChatService]
    D --> E[ConversationalAgent]
    E --> F[RAGService]
    F --> G[Busca semântica]
    G --> H[LLMService]
    H --> I[OpenAI GPT-4]
    I --> J[Resposta contextualizada]
    J --> K[Exibição no chat]
```

## Funcionalidades Implementadas

### ✅ Funcionalidades Ativas

- **Conversação Real**: Integração completa com OpenAI GPT-4
- **Sistema RAG**: Busca semântica em base de conhecimento financeiro
- **Gerenciamento de Sessões**: Manutenção de contexto conversacional
- **Citações de Fontes**: Referências às fontes utilizadas nas respostas
- **Tratamento de Erros**: Fallbacks e mensagens de erro amigáveis
- **Personalização**: Adaptação baseada no perfil do usuário
- **Interface Responsiva**: Design moderno e intuitivo

### 🔄 Funcionalidades Pendentes

- **Streaming de Respostas**: Respostas em tempo real (em desenvolvimento)
- **Persistência de Sessões**: Armazenamento no banco de dados
- **Integração com Dados Reais**: Conexão com transações do usuário

## Como Testar

### 1. Iniciar o Servidor

```bash
# Na raiz do projeto
pnpm install
pnpm dev
```

### 2. Acessar o Chat

1. Acesse `http://localhost:3000/chat`
2. Faça login na aplicação
3. Digite uma mensagem no chat

### 3. Exemplos de Perguntas

- "Como posso começar a investir?"
- "Qual a diferença entre CDB e Tesouro Direto?"
- "Como calcular minha reserva de emergência?"
- "Quais são os tipos de investimento em renda fixa?"
- "Como funciona o sistema de juros compostos?"

## Estrutura de Resposta

As respostas incluem:

- **Conteúdo**: Resposta contextualizada do GPT-4
- **Fontes**: Referências aos documentos utilizados
- **Confiança**: Score de confiabilidade da resposta
- **Metadados**: Tempo de processamento e contexto

## Troubleshooting

### Erro: "OpenAI API key not configured"

- Verifique se a variável `OPENAI_API_KEY` está definida no `.env.local`
- Certifique-se de que a chave é válida e tem créditos disponíveis

### Erro: "Failed to process message"

- Verifique a conexão com a internet
- Confirme se a chave da OpenAI tem permissões adequadas
- Verifique os logs do servidor para mais detalhes

### Respostas Genéricas

- O sistema RAG está configurado com documentos mock
- Para respostas mais específicas, integre com base de conhecimento real

## Próximos Passos

1. **Integração com Dados Reais**: Conectar com transações do usuário
2. **Base de Conhecimento**: Popular com documentos financeiros reais
3. **Streaming**: Implementar respostas em tempo real
4. **Persistência**: Salvar conversas no banco de dados
5. **Analytics**: Métricas de uso e qualidade das respostas

## Suporte

Para dúvidas ou problemas:

1. Verifique os logs do servidor
2. Confirme as configurações de ambiente
3. Teste com perguntas simples primeiro
4. Consulte a documentação da OpenAI para limites de API
