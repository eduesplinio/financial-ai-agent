const mockGetDatabase = jest.fn();

jest.mock('@/lib/mongodb', () => ({
  getDatabase: (...args) => mockGetDatabase(...args),
}));

describe('pluggy helper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    process.env.PLUGGY_CLIENT_ID = 'pluggy-client-id';
    process.env.PLUGGY_CLIENT_SECRET = 'pluggy-client-secret';
    process.env.PLUGGY_API_URL = 'https://api.pluggy.ai';
    global.fetch = jest.fn();
  });

  afterEach(() => {
    delete global.fetch;
  });

  test('beginPluggyConnection creates connect token and stores session', async () => {
    const updateOne = jest.fn().mockResolvedValue({});
    mockGetDatabase.mockResolvedValue({
      collection: jest.fn().mockReturnValue({
        updateOne,
      }),
    });
    global.fetch
      .mockResolvedValueOnce(jsonResponse({ apiKey: 'api-key-123' }))
      .mockResolvedValueOnce(
        jsonResponse({ accessToken: 'connect-token-123' })
      );

    const { beginPluggyConnection } = require('./pluggy');

    const result = await beginPluggyConnection({
      userId: 'user-123',
      institutionId: '201',
      appRedirectUri: 'linio://integrations/callback',
      origin: 'https://linio.test',
      platform: 'ios',
    });

    expect(result.connectToken).toBeTruthy();
    expect(result.connectURL).toContain('/v1/integrations/connect?');
    expect(result.connectURL).toContain('connectToken=connect-token-123');
    expect(updateOne).toHaveBeenCalledWith(
      { sessionId: expect.any(String) },
      expect.objectContaining({
        $set: expect.objectContaining({
          userId: 'user-123',
          appRedirectUri: 'linio://integrations/callback',
          connectToken: 'connect-token-123',
        }),
      }),
      { upsert: true }
    );
  });

  test('finalizePluggyConnection stores item and accounts and returns app redirect', async () => {
    const sessionsCollection = {
      findOne: jest.fn().mockResolvedValue({
        sessionId: 'session-123',
        userId: 'user-123',
        appRedirectUri: 'linio://integrations/callback',
        platform: 'ios',
        expiresAt: new Date(Date.now() + 60_000),
      }),
      deleteOne: jest.fn().mockResolvedValue({}),
    };
    const connectionsCollection = {
      updateOne: jest.fn().mockResolvedValue({}),
    };
    const accountsCollection = {
      updateOne: jest.fn().mockResolvedValue({}),
      find: jest.fn().mockReturnValue({
        toArray: jest.fn().mockResolvedValue([
          {
            accountId: 'acc-1',
            institutionId: 'pluggy:201',
          },
        ]),
      }),
    };
    const transactionsCollection = {
      updateOne: jest.fn().mockResolvedValue({}),
    };

    mockGetDatabase.mockResolvedValue({
      collection: jest.fn().mockImplementation(name => {
        if (name === 'pluggy_connect_sessions') return sessionsCollection;
        if (name === 'open_finance_connections') return connectionsCollection;
        if (name === 'connected_accounts') return accountsCollection;
        if (name === 'transactions') return transactionsCollection;
        throw new Error(`Unexpected collection ${name}`);
      }),
    });

    global.fetch
      .mockResolvedValueOnce(jsonResponse({ apiKey: 'api-key-123' }))
      .mockResolvedValueOnce(
        jsonResponse({
          id: 'item-123',
          status: 'UPDATED',
          executionStatus: 'SUCCESS',
          lastUpdatedAt: '2026-04-07T15:00:00.000Z',
          connector: { id: 201, name: 'Banco X' },
        })
      )
      .mockResolvedValueOnce(
        jsonResponse({
          results: [
            {
              id: 'acc-1',
              itemId: 'item-123',
              type: 'BANK',
              subtype: 'CHECKING_ACCOUNT',
              name: 'Conta Corrente',
              currencyCode: 'BRL',
            },
          ],
        })
      )
      .mockResolvedValueOnce(
        jsonResponse({
          results: [
            {
              id: 'tx-1',
              accountId: 'acc-1',
              description: 'Uber',
              amount: 25.5,
              currencyCode: 'BRL',
              date: '2026-04-07T12:00:00.000Z',
              type: 'DEBIT',
              status: 'COMPLETED',
            },
          ],
        })
      );

    const { finalizePluggyConnection } = require('./pluggy');
    const result = await finalizePluggyConnection({
      sessionId: 'session-123',
      itemId: 'item-123',
    });

    expect(result.redirectURL).toContain('linio://integrations/callback');
    expect(result.redirectURL).toContain('status=success');
    expect(connectionsCollection.updateOne).toHaveBeenCalled();
    expect(accountsCollection.updateOne).toHaveBeenCalled();
    expect(transactionsCollection.updateOne).toHaveBeenCalled();
  });

  test('getPluggyStatus maps item status to connected', async () => {
    const connectionsCollection = {
      findOne: jest.fn().mockResolvedValue({
        userId: 'user-123',
        provider: 'pluggy',
        itemId: 'item-123',
        status: 'UPDATING',
      }),
      updateOne: jest.fn().mockResolvedValue({}),
    };

    mockGetDatabase.mockResolvedValue({
      collection: jest.fn().mockImplementation(name => {
        if (name === 'open_finance_connections') return connectionsCollection;
        throw new Error(`Unexpected collection ${name}`);
      }),
    });

    global.fetch
      .mockResolvedValueOnce(jsonResponse({ apiKey: 'api-key-123' }))
      .mockResolvedValueOnce(
        jsonResponse({
          id: 'item-123',
          status: 'UPDATED',
          executionStatus: 'SUCCESS',
          lastUpdatedAt: '2026-04-07T15:00:00.000Z',
        })
      );

    const { getPluggyStatus } = require('./pluggy');
    const result = await getPluggyStatus('user-123');

    expect(result).toEqual({
      connectionStatus: 'connected',
      lastSyncTimestamp: 1775574000,
      errorMessage: null,
    });
  });

  test('syncPluggyItem triggers Pluggy item update and returns syncing', async () => {
    const connectionsCollection = {
      findOne: jest.fn().mockResolvedValue({
        userId: 'user-123',
        provider: 'pluggy',
        itemId: 'item-123',
        lastSyncAt: new Date('2026-04-07T15:00:00.000Z'),
      }),
      updateOne: jest.fn().mockResolvedValue({}),
    };

    mockGetDatabase.mockResolvedValue({
      collection: jest.fn().mockImplementation(name => {
        if (name === 'open_finance_connections') return connectionsCollection;
        throw new Error(`Unexpected collection ${name}`);
      }),
    });

    global.fetch
      .mockResolvedValueOnce(jsonResponse({ apiKey: 'api-key-123' }))
      .mockResolvedValueOnce(
        jsonResponse({ id: 'item-123', status: 'UPDATING' })
      );

    const { syncPluggyItem } = require('./pluggy');
    const result = await syncPluggyItem({ userId: 'user-123' });

    expect(result).toEqual({
      connectionStatus: 'syncing',
      lastSyncTimestamp: 1775574000,
    });
    expect(connectionsCollection.updateOne).toHaveBeenCalled();
  });
});

function jsonResponse(payload, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => payload,
  };
}
