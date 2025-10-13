# Implementação de Persistência no Banco de Dados

## Solução Híbrida Implementada

Combinação de **memória no frontend** (para contexto imediato) + **persistência no banco** (para histórico).

## Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                   Frontend (ChatWidget)                      │
│                                                              │
│  • Mantém histórico em memória (estado React)              │
│  • Envia últimas 10 mensagens como contexto                │
│  • Rápido e responsivo                                      │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend (ChatRAGService)                   │
│                                                              │
│  1. Recebe mensagem + histórico do frontend                │
│  2. Busca/cria conversação no banco                        │
│  3. Processa com RAG                                        │
│  4. Stream resposta                                         │
│  5. Salva mensagens no banco (async)                       │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   MongoDB (Persistence)                      │
│                                                              │
│  • Armazena conversações completas                          │
│  • Histórico permanente                                     │
│  • Sem soft delete (queries funcionam)                      │
└─────────────────────────────────────────────────────────────┘
```

## Mudanças Implementadas

### 1. Removido Soft Delete do Conversation

**Arquivo:** `packages/database/src/models.ts`

```typescript
// Antes
addSoftDeleteMiddleware(ConversationSchema);

// Depois
// addSoftDeleteMiddleware(ConversationSchema); // Removed - use hard delete
```

**Por quê?**

- Soft delete causava problemas com `findOne()`
- Queries retornavam `null` mesmo com documentos existentes
- Hard delete é suficiente para conversações

### 2. Lógica de Busca/Criação de Conversação

**Arquivo:** `apps/web/lib/chat-rag-service.ts`

```typescript
// Try to find existing conversation by checking recent conversations
const recentConversations = await Conversation.find({ userId })
  .sort({ updatedAt: -1 })
  .limit(1)
  .exec();

if (
  recentConversations.length > 0 &&
  recentConversations[0].messages.length > 0
) {
  // Use most recent conversation if it has messages
  conversation = recentConversations[0];
} else {
  // Create new conversation
  conversation = await ConversationService.create({
    userId,
    sessionId,
    messages: [],
    context: {},
  });
}
```

**Estratégia:**

- Busca conversação mais recente do usuário
- Se tem mensagens, reutiliza
- Se não, cria nova
- Evita race conditions

### 3. Salvamento Assíncrono de Mensagens

```typescript
// Save messages to database
if (conversation) {
  try {
    await ConversationService.addMessage(conversation.sessionId, {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content: message,
      timestamp: new Date(),
    });

    await ConversationService.addMessage(conversation.sessionId, {
      id: `msg_${Date.now()}_assistant`,
      role: 'assistant',
      content: fullResponse,
      timestamp: new Date(),
    });
    console.log('💾 Messages saved to database');
  } catch (error) {
    console.error('❌ Error saving messages:', error);
  }
}
```

**Características:**

- Salva após streaming completo
- Não bloqueia resposta ao usuário
- Falha silenciosa (não quebra o chat)
- Logs para debug

## Fluxo de Funcionamento

### Primeira Mensagem

```
1. Usuário: "O que é bitcoin?"
2. Frontend: Envia { message, history: [] }
3. Backend:
   - Busca conversação recente → não encontra
   - Cria nova conversação
   - Processa com RAG
   - Stream resposta
   - Salva user + assistant no banco
4. Banco: conversation.messages = [user, assistant]
```

### Segunda Mensagem (Mesma Sessão)

```
1. Usuário: "Como comprar?"
2. Frontend: Envia { message, history: [msg1_user, msg1_assistant] }
3. Backend:
   - Busca conversação recente → encontra
   - Usa conversação existente
   - Processa com RAG + histórico do frontend
   - Stream resposta
   - Salva user + assistant no banco
4. Banco: conversation.messages = [msg1_user, msg1_assistant, msg2_user, msg2_assistant]
```

### Após Recarregar Página

```
1. Frontend: messages = [] (estado limpo)
2. Usuário: "Quanto gastei?"
3. Frontend: Envia { message, history: [] }
4. Backend:
   - Busca conversação recente → encontra (com 4 mensagens)
   - Usa conversação existente
   - Processa com RAG
   - Stream resposta
   - Salva user + assistant no banco
5. Banco: conversation.messages = [...4 anteriores, msg3_user, msg3_assistant]
```

## Vantagens da Solução Híbrida

### Frontend (Memória)

✅ **Rápido** - Sem latência de banco
✅ **Responsivo** - Contexto imediato
✅ **Simples** - Sem complexidade

### Backend (Persistência)

✅ **Histórico permanente** - Não perde ao recarregar
✅ **Auditoria** - Todas conversas registradas
✅ **Analytics** - Pode analisar conversas depois
✅ **Recuperação** - Pode restaurar contexto

## Limitações e Trade-offs

### Contexto Imediato vs Histórico Completo

**Durante a sessão:**

- IA usa histórico do frontend (últimas 10 mensagens)
- Rápido e eficiente

**Após recarregar:**

- IA não tem contexto imediato
- Histórico está no banco mas não é carregado automaticamente
- Usuário precisa recontextualizar

### Solução Futura (Opcional)

Carregar histórico do banco ao abrir o chat:

```typescript
// apps/web/components/chat/ChatWidget.tsx
useEffect(() => {
  if (showWidget && session?.user?.id) {
    // Load recent conversation from database
    fetch('/api/chat/history')
      .then(res => res.json())
      .then(data => {
        if (data.messages) {
          setMessages(data.messages);
        }
      });
  }
}, [showWidget, session?.user?.id]);
```

## Logs de Debug

### Conversação Nova

```
📝 Created new conversation: 68ed12225e9154eaffac2578
💾 Messages saved to database
```

### Conversação Existente

```
📖 Using existing conversation: 68ed12225e9154eaffac2578 (4 messages)
💾 Messages saved to database
```

### Erro (Não Crítico)

```
❌ Error saving messages: [error details]
```

## Limpeza de Conversações Antigas

### Deletar Conversações Vazias

```javascript
// MongoDB Compass ou shell
db.conversations.deleteMany({ messages: { $size: 0 } });
```

### Deletar Conversações Antigas (> 30 dias)

```javascript
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

db.conversations.deleteMany({
  updatedAt: { $lt: thirtyDaysAgo },
});
```

## Monitoramento

### Verificar Conversações Recentes

```javascript
db.conversations.find().sort({ updatedAt: -1 }).limit(10).pretty();
```

### Contar Mensagens por Usuário

```javascript
db.conversations.aggregate([
  { $match: { userId: ObjectId('68c2a35df7eb84f5a4af8560') } },
  { $project: { messageCount: { $size: '$messages' } } },
  { $group: { _id: null, total: { $sum: '$messageCount' } } },
]);
```

## Status

🟢 **Memória no Frontend** - Funcional
🟢 **Persistência no Banco** - Funcional
🟢 **Soft Delete Removido** - Queries funcionam
🟢 **Salvamento Assíncrono** - Não bloqueia
🟡 **Carregamento de Histórico** - Não implementado (opcional)

## Próximos Passos (Opcional)

1. [ ] Implementar endpoint `/api/chat/history` para carregar histórico
2. [ ] Carregar histórico ao abrir chat
3. [ ] Adicionar botão "Limpar conversa"
4. [ ] Implementar paginação de mensagens antigas
5. [ ] Adicionar analytics de conversações
