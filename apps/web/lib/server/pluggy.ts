import { randomUUID } from 'crypto';
import { getDatabase } from '@/lib/mongodb';

const PLUGGY_API_URL = process.env.PLUGGY_API_URL || 'https://api.pluggy.ai';

type BeginConnectionParams = {
  userId: string;
  institutionId?: string;
  appRedirectUri: string;
  origin: string;
  platform: string;
};

type FinalizeConnectionParams = {
  sessionId: string;
  itemId: string;
};

type ReconcileConnectionParams = {
  userId: string;
  itemId: string;
  appRedirectUri?: string | null;
  platform?: string | null;
};

type SyncAccountsParams = {
  userId: string;
};

type PluggySession = {
  sessionId: string;
  userId: string;
  platform: string;
  appRedirectUri: string;
  connectToken: string;
  institutionId?: string | null;
  createdAt: Date;
  expiresAt: Date;
};

type IntegrationConnection = {
  userId: string;
  provider: 'pluggy';
  itemId: string;
  status: string;
  executionStatus?: string | null;
  connectorId?: number | null;
  connectorName?: string | null;
  appRedirectUri: string;
  platform: string;
  lastSyncAt?: Date | null;
  connectedAt?: Date | null;
  errorMessage?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type PluggyItem = {
  id: string;
  status?: string | null;
  executionStatus?: string | null;
  lastUpdatedAt?: string | null;
  connector?: {
    id?: number;
    name?: string;
    imageUrl?: string;
  } | null;
  error?: {
    message?: string;
    code?: string;
    codeDescription?: string;
  } | null;
  clientUserId?: string | null;
};

type PluggyAccount = {
  id: string;
  itemId: string;
  name?: string | null;
  number?: string | null;
  type?: string | null;
  subtype?: string | null;
  currencyCode?: string | null;
};

type PluggyTransaction = {
  id: string;
  accountId: string;
  description?: string | null;
  amount: number;
  currencyCode?: string | null;
  date: string;
  type?: string | null;
  status?: string | null;
};

let apiKeyCache: { token: string; expiresAt: number } | null = null;

export async function beginPluggyConnection({
  userId,
  institutionId,
  appRedirectUri,
  origin,
  platform,
}: BeginConnectionParams) {
  const sessionId = randomUUID();
  const connectToken = await createPluggyConnectToken({
    clientUserId: userId,
    webhookUrl: buildWebhookUrl(origin),
  });
  const db = await getDatabase();
  const sessions = db.collection<PluggySession>('pluggy_connect_sessions');
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 30 * 60 * 1000);

  await sessions.updateOne(
    { sessionId },
    {
      $set: {
        sessionId,
        userId,
        platform,
        appRedirectUri,
        connectToken,
        institutionId: institutionId || null,
        createdAt: now,
        expiresAt,
      },
    },
    { upsert: true }
  );

  const connectURL = new URL('/v1/integrations/connect', origin);
  connectURL.searchParams.set('sessionId', sessionId);
  connectURL.searchParams.set('connectToken', connectToken);
  connectURL.searchParams.set('redirectUri', appRedirectUri);
  connectURL.searchParams.set('platform', platform);
  if (institutionId) {
    connectURL.searchParams.set('institutionId', institutionId);
  }

  return {
    connectToken: sessionId,
    connectURL: connectURL.toString(),
  };
}

export async function finalizePluggyConnection({
  sessionId,
  itemId,
}: FinalizeConnectionParams) {
  const db = await getDatabase();
  const sessions = db.collection<PluggySession>('pluggy_connect_sessions');
  const connections = db.collection<IntegrationConnection>(
    'open_finance_connections'
  );
  const connectedAccounts = db.collection('connected_accounts');

  const session = await sessions.findOne({
    sessionId,
    expiresAt: { $gt: new Date() },
  });

  if (!session) {
    throw new Error('Sessão de conexão expirada.');
  }

  await reconcilePluggyItem({
    userId: session.userId,
    itemId,
    appRedirectUri: session.appRedirectUri,
    platform: session.platform,
  });
  await sessions.deleteOne({ sessionId });

  return {
    redirectURL: appendQueryParams(session.appRedirectUri, {
      status: 'success',
      itemId,
      userId: session.userId,
    }),
  };
}

export async function reconcilePluggyItem({
  userId,
  itemId,
  appRedirectUri,
  platform,
}: ReconcileConnectionParams) {
  const db = await getDatabase();
  const connections = db.collection<IntegrationConnection>(
    'open_finance_connections'
  );
  const connectedAccounts = db.collection('connected_accounts');
  const item = await getPluggyItem(itemId);
  const accounts = await listPluggyAccounts(itemId);
  const existingConnection = await connections.findOne({
    userId,
    provider: 'pluggy',
    itemId,
  });
  const now = new Date();
  const resolvedRedirectUri =
    appRedirectUri ||
    existingConnection?.appRedirectUri ||
    'linio://integrations/callback';
  const resolvedPlatform = platform || existingConnection?.platform || 'ios';

  await connections.updateOne(
    { userId, provider: 'pluggy', itemId },
    {
      $set: {
        userId,
        provider: 'pluggy',
        itemId,
        status: item.status || 'UPDATING',
        executionStatus: item.executionStatus || null,
        connectorId: item.connector?.id || null,
        connectorName: item.connector?.name || null,
        appRedirectUri: resolvedRedirectUri,
        platform: resolvedPlatform,
        lastSyncAt: item.lastUpdatedAt ? new Date(item.lastUpdatedAt) : null,
        connectedAt: existingConnection?.connectedAt || now,
        errorMessage: item.error?.message || null,
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
      },
    },
    { upsert: true }
  );

  for (const account of accounts) {
    await connectedAccounts.updateOne(
      {
        userId,
        institutionId: `pluggy:${item.connector?.id || 'unknown'}`,
        accountId: account.id,
      },
      {
        $set: {
          userId,
          institutionId: `pluggy:${item.connector?.id || 'unknown'}`,
          institutionName: item.connector?.name || 'Pluggy',
          accountId: account.id,
          itemId,
          accountType: mapPluggyAccountType(account.type, account.subtype),
          accountName: account.name || account.number || 'Conta',
          currency: account.currencyCode || 'BRL',
          status: 'ACTIVE',
          permissions: ['accounts', 'transactions'],
          lastSync: item.lastUpdatedAt ? new Date(item.lastUpdatedAt) : null,
          updatedAt: now,
        },
        $setOnInsert: {
          createdAt: now,
        },
      },
      { upsert: true }
    );
  }

  await persistPluggyTransactions(userId, itemId, accounts);
}

export async function getPluggyStatus(userId: string) {
  const db = await getDatabase();
  const connections = db.collection<IntegrationConnection>(
    'open_finance_connections'
  );
  const sessions = db.collection<PluggySession>('pluggy_connect_sessions');
  const latestConnection = await connections.findOne(
    { userId, provider: 'pluggy' },
    { sort: { updatedAt: -1 } }
  );
  const pendingSession = await sessions.findOne(
    { userId, expiresAt: { $gt: new Date() } },
    { sort: { createdAt: -1 } }
  );

  if (!latestConnection && pendingSession) {
    return {
      connectionStatus: 'connecting',
      lastSyncTimestamp: null,
      errorMessage: null,
    };
  }

  if (!latestConnection) {
    return {
      connectionStatus: 'notConnected',
      lastSyncTimestamp: null,
      errorMessage: null,
    };
  }

  const item = await getPluggyItem(latestConnection.itemId).catch(() => null);
  const status = item?.status || latestConnection.status;
  const executionStatus =
    item?.executionStatus || latestConnection.executionStatus || null;
  const lastSyncAt = item?.lastUpdatedAt
    ? new Date(item.lastUpdatedAt)
    : latestConnection.lastSyncAt || latestConnection.connectedAt || null;
  const errorMessage =
    item?.error?.message || latestConnection.errorMessage || null;

  await connections.updateOne(
    { userId, provider: 'pluggy', itemId: latestConnection.itemId },
    {
      $set: {
        status,
        executionStatus,
        lastSyncAt,
        errorMessage,
        updatedAt: new Date(),
      },
    }
  );

  return {
    connectionStatus: mapPluggyItemStatus(status, executionStatus),
    lastSyncTimestamp: lastSyncAt
      ? Math.floor(lastSyncAt.getTime() / 1000)
      : null,
    errorMessage,
  };
}

export async function syncPluggyItem({ userId }: SyncAccountsParams) {
  const db = await getDatabase();
  const connections = db.collection<IntegrationConnection>(
    'open_finance_connections'
  );
  const latestConnection = await connections.findOne(
    { userId, provider: 'pluggy' },
    { sort: { updatedAt: -1 } }
  );

  if (!latestConnection?.itemId) {
    throw new Error('Nenhuma integração Pluggy conectada.');
  }

  await updatePluggyItem(latestConnection.itemId);

  await connections.updateOne(
    { userId, provider: 'pluggy', itemId: latestConnection.itemId },
    {
      $set: {
        status: 'UPDATING',
        executionStatus: 'PENDING',
        updatedAt: new Date(),
      },
    }
  );

  return {
    connectionStatus: 'syncing',
    lastSyncTimestamp: latestConnection.lastSyncAt
      ? Math.floor(latestConnection.lastSyncAt.getTime() / 1000)
      : null,
  };
}

export async function persistPluggyTransactions(
  userId: string,
  itemId: string,
  existingAccounts?: PluggyAccount[]
) {
  const db = await getDatabase();
  const connectedAccounts = db.collection('connected_accounts');
  const transactions = db.collection('transactions');
  const accounts = existingAccounts || (await listPluggyAccounts(itemId));
  const userAccounts = await connectedAccounts
    .find({ userId, itemId, deletedAt: { $exists: false } })
    .toArray();
  const now = new Date();

  for (const account of accounts) {
    const backendAccount = userAccounts.find(
      entry => entry.accountId === account.id
    );
    if (!backendAccount) {
      continue;
    }

    const accountTransactions = await listPluggyTransactions(account.id);
    for (const transaction of accountTransactions) {
      await transactions.updateOne(
        {
          userId,
          accountId: backendAccount.accountId,
          'metadata.pluggyTransactionId': transaction.id,
        },
        {
          $set: {
            userId,
            accountId: backendAccount.accountId,
            institutionId: backendAccount.institutionId,
            amount: normalizeTransactionAmount(
              transaction.amount,
              transaction.type
            ),
            currency: transaction.currencyCode || 'BRL',
            date: new Date(transaction.date),
            description: transaction.description || 'Transacao',
            category: {
              primary: inferTransactionCategory(transaction.description),
              confidence: 0.4,
            },
            merchant: {
              name: transaction.description || 'Pluggy',
            },
            type: normalizeTransactionType(
              transaction.type,
              transaction.amount
            ),
            status: transaction.status || 'COMPLETED',
            metadata: {
              source: 'pluggy',
              pluggyTransactionId: transaction.id,
              itemId,
            },
            updatedAt: now,
          },
          $setOnInsert: {
            createdAt: now,
          },
        },
        { upsert: true }
      );
    }
  }
}

async function createPluggyConnectToken({
  clientUserId,
  webhookUrl,
}: {
  clientUserId: string;
  webhookUrl?: string;
}) {
  const apiKey = await getPluggyApiKey();
  const response = await fetch(`${PLUGGY_API_URL}/connect_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': apiKey,
    },
    body: JSON.stringify({
      clientUserId,
      avoidDuplicates: true,
      ...(webhookUrl ? { webhookUrl } : {}),
    }),
  });

  const payload = await parseJSON(response);
  if (!response.ok || !payload?.accessToken) {
    throw new Error(
      payload?.message || 'Falha ao criar Connect Token da Pluggy.'
    );
  }

  return payload.accessToken;
}

async function getPluggyItem(itemId: string): Promise<PluggyItem> {
  const apiKey = await getPluggyApiKey();
  const response = await fetch(`${PLUGGY_API_URL}/items/${itemId}`, {
    headers: {
      'X-API-KEY': apiKey,
    },
  });
  const payload = await parseJSON(response);
  if (!response.ok || !payload?.id) {
    throw new Error(payload?.message || 'Falha ao consultar item da Pluggy.');
  }
  return payload;
}

async function updatePluggyItem(itemId: string) {
  const apiKey = await getPluggyApiKey();
  const response = await fetch(`${PLUGGY_API_URL}/items/${itemId}`, {
    method: 'PATCH',
    headers: {
      'X-API-KEY': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });
  const payload = await parseJSON(response);
  if (!response.ok) {
    throw new Error(
      payload?.message || 'Falha ao iniciar sincronização na Pluggy.'
    );
  }
  return payload;
}

async function listPluggyAccounts(itemId: string): Promise<PluggyAccount[]> {
  const apiKey = await getPluggyApiKey();
  const response = await fetch(
    `${PLUGGY_API_URL}/accounts?itemId=${encodeURIComponent(itemId)}`,
    {
      headers: {
        'X-API-KEY': apiKey,
      },
    }
  );
  const payload = await parseJSON(response);
  if (!response.ok) {
    throw new Error(payload?.message || 'Falha ao listar contas da Pluggy.');
  }
  return normalizeListPayload(payload);
}

async function listPluggyTransactions(
  accountId: string
): Promise<PluggyTransaction[]> {
  const apiKey = await getPluggyApiKey();
  const response = await fetch(
    `${PLUGGY_API_URL}/transactions?accountId=${encodeURIComponent(accountId)}&pageSize=500`,
    {
      headers: {
        'X-API-KEY': apiKey,
      },
    }
  );
  const payload = await parseJSON(response);
  if (!response.ok) {
    throw new Error(
      payload?.message || 'Falha ao listar transações da Pluggy.'
    );
  }
  return normalizeListPayload(payload);
}

async function getPluggyApiKey() {
  if (apiKeyCache && Date.now() < apiKeyCache.expiresAt) {
    return apiKeyCache.token;
  }

  const clientId = requireEnv('PLUGGY_CLIENT_ID');
  const clientSecret = requireEnv('PLUGGY_CLIENT_SECRET');
  const response = await fetch(`${PLUGGY_API_URL}/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      clientId,
      clientSecret,
    }),
  });
  const payload = await parseJSON(response);
  if (!response.ok || (!payload?.apiKey && !payload?.accessToken)) {
    throw new Error(payload?.message || 'Falha ao autenticar na Pluggy.');
  }

  const token = payload.apiKey || payload.accessToken;
  apiKeyCache = {
    token,
    expiresAt: Date.now() + 110 * 60 * 1000,
  };
  return token;
}

function buildWebhookUrl(origin: string) {
  return origin.startsWith('https://')
    ? `${origin}/v1/integrations/webhook`
    : undefined;
}

function appendQueryParams(baseURL: string, params: Record<string, string>) {
  const url = new URL(baseURL);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return url.toString();
}

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Configure ${name}.`);
  }
  return value;
}

function mapPluggyItemStatus(
  status?: string | null,
  executionStatus?: string | null
) {
  if (status === 'UPDATED') {
    return 'connected';
  }

  if (status === 'UPDATING') {
    return 'syncing';
  }

  if (
    status === 'LOGIN_ERROR' ||
    status === 'OUTDATED' ||
    status === 'ERROR' ||
    executionStatus === 'ERROR' ||
    executionStatus === 'WAITING_USER_INPUT' ||
    executionStatus === 'USER_AUTHORIZATION_PENDING'
  ) {
    return 'failed';
  }

  if (!status || status === 'CREATED') {
    return 'connecting';
  }

  return 'connecting';
}

function mapPluggyAccountType(type?: string | null, subtype?: string | null) {
  const normalized = `${type || ''}:${subtype || ''}`.toUpperCase();
  if (normalized.includes('SAVINGS') || normalized.includes('SVGS')) {
    return 'SAVINGS';
  }
  if (normalized.includes('CREDIT')) {
    return 'CREDIT_CARD';
  }
  if (normalized.includes('INVEST')) {
    return 'INVESTMENT';
  }
  return 'CHECKING';
}

function normalizeListPayload(payload: any) {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (Array.isArray(payload?.results)) {
    return payload.results;
  }
  if (Array.isArray(payload?.data)) {
    return payload.data;
  }
  return [];
}

function normalizeTransactionType(type?: string | null, amount?: number) {
  const upper = (type || '').toUpperCase();
  if (upper.includes('CREDIT')) {
    return 'CREDIT';
  }
  if (upper.includes('DEBIT')) {
    return 'DEBIT';
  }
  return amount && amount > 0 ? 'CREDIT' : 'DEBIT';
}

function normalizeTransactionAmount(amount: number, type?: string | null) {
  const normalizedType = normalizeTransactionType(type, amount);
  return normalizedType === 'DEBIT' ? -Math.abs(amount) : Math.abs(amount);
}

function inferTransactionCategory(description?: string | null) {
  const value = (description || '').toLowerCase();
  if (value.includes('uber') || value.includes('posto')) return 'Transporte';
  if (value.includes('mercado') || value.includes('padaria'))
    return 'Alimentação';
  if (value.includes('farmacia') || value.includes('hospital')) return 'Saúde';
  if (value.includes('salario') || value.includes('pix recebido'))
    return 'Receita';
  return 'Outros';
}

async function parseJSON(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
