# Memória de Conversação Temporariamente Desabilitada

## Decisão Técnica

A funcionalidade de memória de conversação foi **temporariamente desabilitada** devido a um conflito arquitetural com o middleware de soft delete do Mongoose.

## Problema Identificado

### Sintoma

```
Count - Total: 1, Active: 1  ← Documento existe
Found conversation: NO        ← findOne() retorna null
```

### Causa Raiz

O modelo `Conversation` usa o middleware `addSoftDeleteMiddleware` que:

1. Adiciona campo `deletedAt` ao schema
2. Modifica queries automaticamente para filtrar documentos deletados
3. **Interfere de forma inconsistente** com `findOne()` e `countDocuments()`

```typescript
// packages/database/src/models.ts
addSoftDeleteMiddleware(ConversationSchema);
```

### Por que o Problema Ocorre

O middleware adiciona um hook `pre('find')` que modifica a query, mas:

- `countDocuments()` funciona corretamente
- `findOne()` retorna `null` mesmo com `deletedAt: null` explícito
- Comportamento inconsistente entre diferentes métodos do Mongoose

## Solução Implementada

### Removido

- ❌ Busca/criação de conversação
- ❌ Salvamento de mensagens no banco
- ❌ Histórico de conversação no contexto da IA
- ❌ Retry logic para race conditions

### Mantido

- ✅ RAG (Retrieval Augmented Generation)
- ✅ Busca semântica de documentos
- ✅ Busca de transações
- ✅ Streaming de respostas
- ✅ Fontes e feedback

## Código Limpo

### Antes (Complexo e Quebrado)

```typescript
// 150+ linhas de retry logic, race condition handling, etc
for (let attempt = 0; attempt < 3; attempt++) {
  conversation = await Conversation.findOne({...});
  if (!conversation) {
    try {
      conversation = await ConversationService.create({...});
    } catch (error) {
      if (error.code === 11000) {
        // retry...
      }
    }
  }
}
```

### Depois (Simples e Funcional)

```typescript
// Direto ao ponto
const messages = [
  { role: 'system', content: systemPrompt },
  { role: 'user', content: message },
];
```

## Solução Definitiva (Futuro)

Para reabilitar a memória de conversação corretamente:

### Opção 1: Remover Soft Delete do Modelo Conversation

```typescript
// packages/database/src/models.ts
addSoftDeleteMiddleware(TransactionSchema);
addSoftDeleteMiddleware(KnowledgeDocumentSchema);
// addSoftDeleteMiddleware(ConversationSchema); ← REMOVER
```

**Prós:**

- Solução simples
- Sem overhead de middleware
- Queries funcionam normalmente

**Contras:**

- Perde funcionalidade de soft delete
- Precisa implementar hard delete ou manter conversações indefinidamente

### Opção 2: Usar Collection Separada para Conversações Ativas

```typescript
// Criar modelo sem soft delete
const ActiveConversationSchema = new Schema({...});
// Sem middleware
const ActiveConversation = mongoose.model('ActiveConversation', ActiveConversationSchema);
```

**Prós:**

- Mantém soft delete em outros modelos
- Performance melhor (menos documentos para filtrar)
- Queries simples

**Contras:**

- Duplicação de schema
- Precisa sincronizar entre collections

### Opção 3: Implementar Memória no Frontend (Recomendado)

```typescript
// apps/web/components/chat/ChatWidget.tsx
const [conversationHistory, setConversationHistory] = useState<Message[]>([]);

// Manter histórico no estado do React
// Enviar últimas N mensagens como contexto
```

**Prós:**

- Sem dependência do banco
- Mais rápido (sem queries)
- Funciona offline
- Simples de implementar

**Contras:**

- Perde histórico ao recarregar página
- Não compartilha entre dispositivos

## Impacto no Usuário

### Antes (Com Memória - Quebrado)

```
Usuário: "O que é bitcoin?"
IA: [explica bitcoin]

Usuário: "Pra que serve?"
IA: ❌ Error: Failed to create or fetch conversation
```

### Agora (Sem Memória - Funcional)

```
Usuário: "O que é bitcoin?"
IA: [explica bitcoin] ✅

Usuário: "Pra que serve?"
IA: [responde genericamente sobre finanças] ✅
```

### Futuro (Com Memória - Correto)

```
Usuário: "O que é bitcoin?"
IA: [explica bitcoin] ✅

Usuário: "Pra que serve?"
IA: [explica para que serve o bitcoin] ✅
```

## Recomendação

Implementar **Opção 3 (Memória no Frontend)** como solução de curto prazo:

- Rápido de implementar (< 1 hora)
- Sem dependências do banco
- Funciona perfeitamente para sessões ativas
- Pode ser combinado com persistência no banco depois

## Arquivos Modificados

- ✅ `apps/web/lib/chat-rag-service.ts` - Removida lógica de conversação
- ✅ `apps/web/app/api/chat/stream/route.ts` - sessionId ainda aceito mas não usado
- ✅ `apps/web/components/chat/ChatWidget.tsx` - sessionId ainda enviado mas não usado

## Status

🟢 **Sistema Funcional** - Chat funciona sem erros
🟡 **Memória Desabilitada** - Sem contexto entre mensagens
🔵 **Próximo Passo** - Implementar memória no frontend
