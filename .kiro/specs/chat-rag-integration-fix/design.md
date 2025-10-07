# Documento de Design - Correção da Integração Chat RAG

## Visão Geral

Refatorar `chat-rag-service.ts` para usar **todos os dados** das collections MongoDB (transactions + knowledge_documents) via serviços existentes, eliminando código hardcoded.

### Problemas Atuais

1. Array `financialKnowledge` hardcoded - deve buscar de `knowledgedocuments` collection
2. Só busca transactions - deve buscar knowledge_documents também
3. Não usa `VectorSearchService` - deve usar para busca semântica
4. Keyword matching manual - deve usar Atlas Vector Search

### Solução

- Usar `VectorSearchService.semanticSearch()` para encontrar knowledge_documents relevantes
- Usar `TransactionVectorSearchService.searchTransactions()` para encontrar transactions relevantes
- Usar `RAGService.hybridFinancialSearch()` quando precisar de ambos
- **Atlas Vector Search é usado para RANKING semântico** (encontrar documentos/transações relevantes)
- **Dados completos vêm das collections** (todos os campos: title, content, source, category, description, amount, date, merchant, etc)
- Remover array hardcoded
- Usar script de seed existente para popular knowledge_documents

## Arquitetura

### Arquitetura Atual (Problemática)

```mermaid
graph TB
    User[Usuário] --> ChatAPI[/api/chat/stream]
    ChatAPI --> ChatRAG[ChatRAGService]
    ChatRAG --> Hardcoded[Array Hardcoded<br/>financialKnowledge]
    ChatRAG --> TxSearch[getTransactionContext]
    TxSearch --> TxVector[TransactionVectorSearch]
    TxVector --> MongoDB[(MongoDB<br/>transactions)]
    ChatRAG --> OpenAI[OpenAI GPT-4]

    style Hardcoded fill:#f99,stroke:#f00
    style ChatRAG fill:#ff9,stroke:#f90
```

### Arquitetura Simplificada

```mermaid
graph TB
    User[Usuário] --> ChatAPI[/api/chat/stream]
    ChatAPI --> ChatRAG[ChatRAGService]

    ChatRAG --> RAGService[RAGService.hybridFinancialSearch]

    RAGService --> VectorService[VectorSearchService]
    RAGService --> TxService[TransactionVectorSearchService]

    VectorService --> KnowDB[(knowledgedocuments)]
    TxService --> TxDB[(transactions)]

    RAGService --> ChatRAG
    ChatRAG --> LLM[OpenAI + Streaming]
    LLM --> User
```

## Componentes

### ChatRAGService (Simplificado)

```typescript
export class ChatRAGService {
  // Método principal - usa RAGService para busca híbrida
  async *processMessage(userId: string, message: string) {
    // 1. Buscar dados usando RAGService
    // Vector Search encontra documentos/transações relevantes
    // Retorna objetos COMPLETOS das collections com todos os campos
    const results = await RAGService.hybridFinancialSearch(message, userId, {
      includeDocuments: true,
      includeTransactions: true,
      documentLimit: 5,
      transactionLimit: 20,
    });

    // results.documents contém: title, content, source, category, metadata, etc
    // results.transactions contém: description, amount, date, category, merchant, accountName, etc

    // 2. Construir contexto com TODOS os dados disponíveis
    const context = this.buildContext(results.documents, results.transactions);

    // 3. Streaming do LLM
    for await (const chunk of this.streamLLM(context, message)) {
      yield chunk;
    }

    // 4. Retornar fontes com dados completos
    yield { type: 'complete', sources: this.buildSources(results) };
  }

  private buildContext(documents, transactions): string {
    // Formatar TODOS os campos dos documentos e transações para o prompt
    // Não apenas description/title, mas category, source, amount, date, merchant, etc
  }

  private buildSources(results): Source[] {
    // Extrair fontes com informações completas
  }

  private async *streamLLM(context, message) {
    // Chamar OpenAI com streaming
  }
}
```

## Tipos

```typescript
interface ChatChunk {
  type: 'chunk' | 'complete';
  content: string;
  sources?: Source[];
}

interface Source {
  title: string;
  url: string;
}
```

## Tratamento de Erros

```typescript
try {
  const results = await RAGService.hybridFinancialSearch(...);

  if (results.documents.length === 0 && results.transactions.length === 0) {
    return 'Não encontrei informações relevantes. Tente reformular sua pergunta.';
  }

  // Processar normalmente
} catch (error) {
  console.error('Chat error:', error);
  return 'Ocorreu um erro. Tente novamente.';
}
```

## Testes

```typescript
describe('ChatRAGService', () => {
  it('deve buscar documentos e transações', async () => {
    const chunks = [];
    for await (const chunk of service.processMessage(
      'user123',
      'O que é Tesouro Direto?'
    )) {
      chunks.push(chunk);
    }

    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks[chunks.length - 1].type).toBe('complete');
  });
});
```

## Script de Seed

Usar o script existente `packages/database/scripts/populate-knowledge-documents.ts` que já está implementado no projeto.

## Resumo

Refatoração simples e direta:

1. Remover array `financialKnowledge` hardcoded
2. Usar `RAGService.hybridFinancialSearch()` para buscar dados
   - **Vector Search**: encontra documentos/transações semanticamente relevantes (ranking)
   - **Collection Query**: retorna objetos COMPLETOS com todos os campos
3. Construir contexto com **TODOS os dados** das collections (não apenas campos básicos)
4. Fazer streaming da resposta
5. Retornar fontes dos documentos e transações usados com informações completas

**Importante**: Atlas Vector Search é usado para **busca semântica/ranking**, mas os dados completos vêm das collections MongoDB normalmente.
