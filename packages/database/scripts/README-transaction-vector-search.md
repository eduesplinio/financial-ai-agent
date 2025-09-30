# Transaction Vector Search Setup

Este diretório contém scripts para configurar e testar a busca vetorial de transações no MongoDB Atlas.

## Scripts Disponíveis

### 1. Setup Script (`setup-transaction-vector-search.ts`)

Configura a infraestrutura básica para busca vetorial de transações:

```bash
# Via npm script (recomendado)
npm run setup:transaction-vector-search

# Ou diretamente
tsx scripts/setup-transaction-vector-search.ts
```

**O que faz:**

- ✅ Adiciona campos de embedding às transações existentes
- ✅ Cria índice vetorial no MongoDB Atlas
- ✅ Valida conexão e permissões
- ✅ Mostra estatísticas das transações

### 2. Test Script (`test-transaction-vector-search.ts`)

Testa a configuração e valida se tudo está funcionando:

```bash
# Via npm script (recomendado)
npm run test:transaction-vector-search

# Ou diretamente
tsx scripts/test-transaction-vector-search.ts
```

**O que faz:**

- 🧪 Testa queries básicas de transação
- 🔍 Verifica status do índice vetorial
- 📊 Analisa qualidade dos dados para embeddings
- 🎯 Simula estrutura de query vetorial

## Pré-requisitos

### 1. Variáveis de Ambiente

Certifique-se de ter as seguintes variáveis configuradas no `.env`:

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# OpenAI (para embeddings futuros)
OPENAI_API_KEY=sk-...
```

### 2. MongoDB Atlas Vector Search

- Cluster MongoDB Atlas (M10+ recomendado para produção)
- Atlas Search habilitado
- Permissões para criar índices de busca

### 3. Transações Existentes

Para testar adequadamente, você precisa de transações no banco. Você pode:

```bash
# Poplar com dados de exemplo
npm run db:seed

# Ou usar dados do Open Finance sandbox
# (configurar integração Open Finance primeiro)
```

## Fluxo de Configuração

### Passo 1: Configuração Inicial

```bash
# 1. Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais

# 2. Execute o setup
npm run setup:transaction-vector-search
```

### Passo 2: Validação

```bash
# Teste se tudo está funcionando
npm run test:transaction-vector-search
```

### Passo 3: Aguardar Índice

O MongoDB Atlas pode levar alguns minutos para construir o índice. Monitore o status:

- Via MongoDB Atlas UI: Database > Search > Indexes
- Via script de teste (execute periodicamente)

### Passo 4: Próximos Passos

Após a configuração manual, você pode:

1. **Gerar embeddings** para transações existentes
2. **Testar buscas vetoriais** reais
3. **Integrar com sistema RAG** para IA

## Estrutura do Índice Vetorial

O índice criado tem a seguinte configuração:

```json
{
  "name": "transaction_vector_index",
  "type": "vectorSearch",
  "definition": {
    "fields": [
      {
        "type": "vector",
        "path": "embedding",
        "numDimensions": 1536,
        "similarity": "cosine"
      },
      {
        "type": "filter",
        "path": "userId"
      },
      {
        "type": "filter",
        "path": "date"
      },
      {
        "type": "filter",
        "path": "amount"
      },
      {
        "type": "filter",
        "path": "category.primary"
      },
      {
        "type": "filter",
        "path": "accountId"
      },
      {
        "type": "filter",
        "path": "metadata.source"
      }
    ]
  }
}
```

## Campos Adicionados às Transações

Os seguintes campos são adicionados ao schema de transações:

```typescript
{
  // Campos existentes...

  // Novos campos para busca vetorial
  embedding?: number[];           // Vetor de 1536 dimensões (OpenAI)
  embeddingVersion?: string;      // Versão do modelo (ex: "openai-ada-002-v1")
  embeddingGeneratedAt?: Date;    // Timestamp da geração
  searchableContent?: string;     // Conteúdo processado usado no embedding
}
```

## Troubleshooting

### Erro: "Database connection not established"

```bash
# Verifique a string de conexão
echo $MONGODB_URI

# Teste a conexão
mongosh "$MONGODB_URI"
```

### Erro: "Search index permissions may be limited"

- Verifique se o usuário MongoDB tem permissões para Atlas Search
- Confirme se o cluster suporta Atlas Search (M10+)

### Índice não aparece ou status "BUILDING"

- Aguarde alguns minutos (normal para índices grandes)
- Verifique no MongoDB Atlas UI
- Execute o teste novamente: `npm run test:transaction-vector-search`

### Sem transações para testar

```bash
# Popule com dados de exemplo
npm run db:seed

# Ou verifique integração Open Finance
# (consulte documentação do pacote open-finance)
```

## Monitoramento

### Via MongoDB Atlas UI

1. Acesse MongoDB Atlas
2. Vá para Database > Search
3. Verifique o status do índice `transaction_vector_index`

### Via Script de Teste

```bash
# Execute periodicamente para monitorar
npm run test:transaction-vector-search
```

### Métricas Importantes

- **Total de transações**: Quantas transações existem
- **Cobertura de embeddings**: % de transações com embeddings
- **Status do índice**: READY, BUILDING, ou ERROR
- **Qualidade dos dados**: Cobertura de descrições e categorias

## Próximos Passos

Após completar a configuração manual:

1. **Implementar geração automática de embeddings**
2. **Criar TransactionVectorSearchService**
3. **Integrar com RAGService**
4. **Desenvolver APIs de busca**
5. **Testar com dados reais do Open Finance**

## Suporte

Para problemas ou dúvidas:

1. Verifique os logs dos scripts
2. Consulte a documentação do MongoDB Atlas Search
3. Teste com dados de exemplo primeiro
4. Verifique as variáveis de ambiente
