# Tarefa 4.2: Sincronização de Dados Bancários

## Componentes Implementados

1. **SyncService**
   - Serviço de sincronização de contas e transações
   - Cache em memória para minimizar chamadas à API
   - Tratamento de erros e lógica de retry

2. **SyncScheduler**
   - Agendamento automático de sincronizações com intervalos configuráveis
   - Suporte para sincronização periódica de várias instituições financeiras
   - Tratamento de erros durante a sincronização
   - Logs detalhados para monitoramento

3. **WebhookService**
   - Sistema de notificações em tempo real para mudanças nos dados bancários
   - Suporte para vários tipos de eventos (atualização de conta, novas transações, etc.)
   - Sistema de assinaturas para aplicações interessadas nos eventos
   - Assinatura de eventos para validação de autenticidade
   - Mecanismo de retentativa para entrega confiável

## Como Usar

### Sincronização Básica

```typescript
import {
  OpenFinanceClient,
  OpenFinanceAuth,
  SyncService,
} from '@financial-ai/open-finance';

// Configurar cliente e autenticação
const client = new OpenFinanceClient({
  /* ... */
});
const auth = new OpenFinanceAuth({
  /* ... */
});

// Criar serviço de sincronização
const syncService = new SyncService({ client, auth });

// Sincronizar contas de uma instituição
const accounts = await syncService.syncAccounts('bank-123');

// Sincronizar transações de uma conta específica
const transactions = await syncService.syncTransactions(
  'bank-123',
  'account-456'
);
```

### Sincronização Automática

```typescript
import { SyncService, SyncScheduler } from '@financial-ai/open-finance';

// Criar agendador
const scheduler = new SyncScheduler(syncService, {
  accountSyncInterval: 24 * 60 * 60 * 1000, // 24 horas
  transactionSyncInterval: 6 * 60 * 60 * 1000, // 6 horas
});

// Registrar instituições para sincronização
scheduler.registerInstitutions(['bank-123', 'bank-456']);

// Iniciar sincronização automática
scheduler.start();

// Para interromper quando necessário
scheduler.stop();
```

### Notificações em Tempo Real

```typescript
import { WebhookService, WebhookEventType } from '@financial-ai/open-finance';

// Criar serviço de webhooks
const webhookService = new WebhookService();

// Registrar destinatário para receber notificações
webhookService.addSubscriber({
  id: 'app-backend',
  url: 'https://minha-aplicacao.com/webhooks/openfinance',
  events: [
    WebhookEventType.ACCOUNT_UPDATED,
    WebhookEventType.TRANSACTION_CREATED,
  ],
  enabled: true,
  secret: 'chave-secreta-para-assinatura',
});

// Publicar um evento (normalmente usado internamente)
webhookService.publish(WebhookEventType.TRANSACTION_CREATED, {
  accountId: '123',
  transactionId: '789',
  amount: 100,
});

// Para criar um endpoint que recebe webhooks (com Express)
app.post('/webhooks/openfinance', webhookService.createExpressHandler());
```

## Considerações Futuras

1. **Persistência de Cache**: Implementar cache persistente para dados entre reinícios da aplicação
2. **Métricas de Sincronização**: Adicionar telemetria para monitorar desempenho das sincronizações
3. **Rate Limiting Adaptativo**: Ajustar rate limits com base nas respostas das instituições
4. **Otimização de Sincronização**: Sincronizar apenas transações novas após a primeira sincronização completa
