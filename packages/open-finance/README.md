# @financial-ai/open-finance

Pacote para integração com APIs Open Finance/Open Banking para o Financial AI Agent.

## Funcionalidades

- Cliente HTTP com retry logic e autenticação OAuth2
- Autenticação com instituições financeiras
- Sincronização de contas e transações
- Cache em memória para otimizar chamadas de API
- Agendamento automático de sincronizações
- Sistema de webhooks para notificações em tempo real
- Ambiente de sandbox para testes e desenvolvimento

## Instalação

```bash
pnpm add @financial-ai/open-finance
```

## Uso Básico

### Cliente API

```typescript
import { OpenFinanceClient } from '@financial-ai/open-finance';

const client = new OpenFinanceClient({
  baseUrl: 'https://api.openfinance.example.com',
  clientId: 'seu-client-id',
  clientSecret: 'seu-client-secret',
});

// Fazer requisições
const response = await client.get('/accounts');
```

### Autenticação

```typescript
import { OpenFinanceAuth } from '@financial-ai/open-finance';

const auth = new OpenFinanceAuth({
  clientId: 'seu-client-id',
  clientSecret: 'seu-client-secret',
});

// Obter token de acesso
const token = await auth.getAccessToken('institution-123');
```

### Sincronização de Dados

```typescript
import { SyncService } from '@financial-ai/open-finance';

const syncService = new SyncService({
  client,
  auth,
});

// Sincronizar contas
const accounts = await syncService.syncAccounts('institution-123');

// Sincronizar transações
const transactions = await syncService.syncTransactions(
  'institution-123',
  'account-456',
  {
    fromDate: new Date('2023-01-01'),
    toDate: new Date(),
  }
);
```

### Sincronização Automática

```typescript
import { SyncScheduler } from '@financial-ai/open-finance';

const scheduler = new SyncScheduler(syncService, {
  accountSyncInterval: 24 * 60 * 60 * 1000, // 24 horas
  transactionSyncInterval: 6 * 60 * 60 * 1000, // 6 horas
});

// Registrar instituições para sincronização periódica
scheduler.registerInstitutions(['bank-123', 'bank-456']);

// Iniciar sincronização automática
scheduler.start();
```

### Webhooks para Atualizações em Tempo Real

```typescript
import { WebhookService, WebhookEventType } from '@financial-ai/open-finance';

const webhookService = new WebhookService();

// Registrar destinatário para receber notificações
webhookService.addSubscriber({
  id: 'app-backend',
  url: 'https://minha-aplicacao.com/webhooks',
  events: [
    WebhookEventType.ACCOUNT_UPDATED,
    WebhookEventType.TRANSACTION_CREATED,
  ],
  enabled: true,
});
```

## Documentação Detalhada

Para informações mais detalhadas sobre o uso deste pacote, consulte:

- [Sincronização de Dados](./docs/SYNC.md)
- [Exemplos de Uso](./src/examples/sync-example.ts)

## Testes

```bash
# Executar testes
pnpm test
```

## Licença

MIT
