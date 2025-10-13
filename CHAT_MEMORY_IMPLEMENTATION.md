# Implementação de Memória no Chat

## Resumo

Implementei memória de conversação no chat widget, permitindo que a IA mantenha contexto entre mensagens e todas as conversas sejam salvas no banco de dados MongoDB.

## Mudanças Realizadas

### 1. Backend - ChatRAGService (`apps/web/lib/chat-rag-service.ts`)

**Adicionado suporte a sessionId:**

- Método `streamResponse` agora aceita `sessionId` opcional
- Cria ou recupera conversação existente do banco de dados
- Salva mensagens do usuário e da IA automaticamente

**Gerenciamento de conversação:**

```typescript
// Get or create conversation
let conversation = null;
if (sessionId) {
  conversation = await ConversationService.findBySessionId(sessionId);
}

if (!conversation) {
  const newSessionId = sessionId || `session_${Date.now()}_${userId}`;
  conversation = await ConversationService.create({
    userId,
    sessionId: newSessionId,
    messages: [],
    context: {},
  });
}
```

**Histórico de conversação:**

- Recupera últimas 10 mensagens para contexto
- Inclui histórico nas chamadas para OpenAI
- Permite que a IA entenda perguntas de acompanhamento (ex: "pra que serve?" após "o que é bitcoin")

**Persistência:**

- Salva mensagem do usuário antes de processar
- Salva resposta da IA após streaming completo
- Todas as mensagens ficam armazenadas no MongoDB

### 2. API Route (`apps/web/app/api/chat/stream/route.ts`)

**Adicionado parâmetro sessionId:**

```typescript
const sessionId = searchParams.get('sessionId');

// Pass to ChatRAGService
for await (const chunk of chatRAGService.streamResponse(
  session.user.id,
  message,
  sessionId || undefined
)) {
  // ...
}
```

### 3. Frontend - ChatWidget (`apps/web/components/chat/ChatWidget.tsx`)

**Estado de sessão:**

```typescript
const [sessionId, setSessionId] = useState<string>('');

// Initialize sessionId when widget opens
useEffect(() => {
  if (showWidget && !sessionId && session?.user?.id) {
    const newSessionId = `session_${Date.now()}_${session.user.id}`;
    setSessionId(newSessionId);
  }
}, [showWidget, sessionId, session?.user?.id]);
```

**Envio de sessionId:**

```typescript
const url = `/api/chat/stream?message=${encodeURIComponent(userMessage.content)}${sessionId ? `&sessionId=${sessionId}` : ''}`;
const response = await fetch(url);
```

### 4. System Prompt Atualizado

Adicionada instrução para usar histórico:

```
5. Use o histórico da conversa para entender o contexto e dar respostas mais relevantes
   (ex: se o usuário pergunta "pra que serve?", veja a mensagem anterior para saber
   sobre o que ele está falando)
```

## Estrutura de Dados

### Conversation Model (já existente no banco)

```typescript
interface IConversation {
  userId: string;
  sessionId: string;
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
  context: {
    currentTopic?: string;
    userIntent?: string;
    // ... outros campos
  };
  createdAt: Date;
  updatedAt: Date;
}
```

## Fluxo de Funcionamento

1. **Usuário abre o chat:**
   - Frontend cria um `sessionId` único
   - Formato: `session_${timestamp}_${userId}`

2. **Usuário envia mensagem:**
   - Frontend envia mensagem + sessionId para API
   - Backend busca ou cria conversação no MongoDB
   - Salva mensagem do usuário

3. **IA processa:**
   - Recupera últimas 10 mensagens da conversação
   - Inclui histórico no contexto para OpenAI
   - Gera resposta considerando mensagens anteriores

4. **Resposta é enviada:**
   - Streaming da resposta para o frontend
   - Após completar, salva resposta no MongoDB

5. **Próximas mensagens:**
   - Usam o mesmo sessionId
   - IA tem contexto completo da conversa
   - Pode responder perguntas de acompanhamento

## Benefícios

✅ **Contexto mantido:** IA entende perguntas de acompanhamento
✅ **Histórico persistente:** Todas conversas salvas no banco
✅ **Melhor UX:** Conversas mais naturais e fluidas
✅ **Rastreabilidade:** Possível analisar conversas depois
✅ **Escalável:** Usa modelo existente do banco de dados

## Exemplo de Uso

**Antes (sem memória):**

```
Usuário: "O que é bitcoin?"
IA: [explica bitcoin]

Usuário: "Pra que serve?"
IA: "Sou especializado em finanças..." ❌ (não entende contexto)
```

**Depois (com memória):**

```
Usuário: "O que é bitcoin?"
IA: [explica bitcoin]

Usuário: "Pra que serve?"
IA: [explica para que serve o bitcoin] ✅ (entende que se refere ao bitcoin)
```

## Correções Aplicadas

### Race Condition na Criação de Conversação

**Problema:** Erro de chave duplicada ao tentar criar conversação que já existe
**Solução:**

- Sempre buscar conversação primeiro
- Try/catch ao criar nova conversação
- Se erro 11000 (duplicate key), buscar novamente
- Logs para debug: "Created new conversation" ou "Using existing conversation"

### Mensagens Não Sendo Salvas

**Problema:** Array `messages` vazio no banco de dados
**Solução:**

- Capturar retorno de `addMessage` que retorna conversação atualizada
- Usar conversação atualizada para pegar histórico

```typescript
const updatedConversation = await ConversationService.addMessage(...);
const conversationHistory = (updatedConversation || conversation).messages.slice(-10);
```

## Próximos Passos (Opcional)

- [ ] Adicionar botão "Nova conversa" para criar novo sessionId
- [ ] Implementar visualização de conversas antigas no ChatHistory
- [ ] Adicionar limite de mensagens no histórico (atualmente 10)
- [ ] Implementar limpeza de conversas antigas (soft delete)
- [ ] Adicionar analytics sobre conversas (tópicos mais perguntados, etc)
