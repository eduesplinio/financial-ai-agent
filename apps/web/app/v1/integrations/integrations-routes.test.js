const { NextRequest } = require('next/server');

const mockGetAuthorizedUserId = jest.fn();
const mockBeginPluggyConnection = jest.fn();
const mockFinalizePluggyConnection = jest.fn();
const mockGetPluggyStatus = jest.fn();
const mockSyncPluggyItem = jest.fn();
const mockReconcilePluggyItem = jest.fn();
const mockPersistPluggyTransactions = jest.fn();

jest.mock('@/lib/server/mobile-auth', () => ({
  getAuthorizedUserId: (...args) => mockGetAuthorizedUserId(...args),
}));

jest.mock('@/lib/server/pluggy', () => ({
  beginPluggyConnection: (...args) => mockBeginPluggyConnection(...args),
  finalizePluggyConnection: (...args) => mockFinalizePluggyConnection(...args),
  getPluggyStatus: (...args) => mockGetPluggyStatus(...args),
  syncPluggyItem: (...args) => mockSyncPluggyItem(...args),
  reconcilePluggyItem: (...args) => mockReconcilePluggyItem(...args),
  persistPluggyTransactions: (...args) =>
    mockPersistPluggyTransactions(...args),
}));

describe('pluggy integrations routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReconcilePluggyItem.mockResolvedValue(undefined);
    mockPersistPluggyTransactions.mockResolvedValue(undefined);
  });

  test('POST /v1/integrations/connect/token returns hosted Pluggy connect URL', async () => {
    mockGetAuthorizedUserId.mockResolvedValue('user-123');
    mockBeginPluggyConnection.mockResolvedValue({
      connectToken: 'session-123',
      connectURL:
        'https://financial-ai-agent-web.vercel.app/v1/integrations/connect?sessionId=session-123&connectToken=connect-token-123',
    });

    const { POST } = require('./connect/token/route');
    const request = new NextRequest(
      'http://localhost:3000/v1/integrations/connect/token',
      {
        method: 'POST',
        body: JSON.stringify({
          redirectUri: 'linio://integrations/callback',
          platform: 'ios',
          institutionId: '201',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const response = await POST(request);
    const payload = await response.json();
    const connectURL = new URL(payload.connectURL);

    expect(response.status).toBe(200);
    expect(payload.connectionStatus).toBe('connecting');
    expect(payload.connectToken).toBe('session-123');
    expect(connectURL.origin).toBe('https://financial-ai-agent-web.vercel.app');
    expect(connectURL.pathname).toBe('/v1/integrations/connect');
    expect(mockBeginPluggyConnection).toHaveBeenCalledWith({
      userId: 'user-123',
      institutionId: '201',
      appRedirectUri: 'linio://integrations/callback',
      origin: 'http://localhost:3000',
      platform: 'ios',
    });
  });

  test('POST /v1/integrations/connect/finalize persists Pluggy item and returns redirect', async () => {
    mockFinalizePluggyConnection.mockResolvedValue({
      redirectURL:
        'linio://integrations/callback?status=success&itemId=item-123',
    });

    const { POST } = require('./connect/finalize/route');
    const request = new NextRequest(
      'http://localhost:3000/v1/integrations/connect/finalize',
      {
        method: 'POST',
        body: JSON.stringify({
          sessionId: 'session-123',
          itemId: 'item-123',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.redirectURL).toBe(
      'linio://integrations/callback?status=success&itemId=item-123'
    );
    expect(mockFinalizePluggyConnection).toHaveBeenCalledWith({
      sessionId: 'session-123',
      itemId: 'item-123',
    });
  });

  test('GET /v1/integrations/sync/status returns current connection status', async () => {
    mockGetAuthorizedUserId.mockResolvedValue('user-123');
    mockGetPluggyStatus.mockResolvedValue({
      connectionStatus: 'connected',
      lastSyncTimestamp: 1775574000,
      errorMessage: null,
    });

    const { GET } = require('./sync/status/route');
    const request = new NextRequest(
      'http://localhost:3000/v1/integrations/sync/status'
    );

    const response = await GET(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.connectionStatus).toBe('connected');
    expect(payload.lastSyncTimestamp).toBe(1775574000);
  });

  test('POST /v1/integrations/sync delegates to real sync service', async () => {
    mockGetAuthorizedUserId.mockResolvedValue('user-123');
    mockSyncPluggyItem.mockResolvedValue({
      connectionStatus: 'syncing',
      lastSyncTimestamp: 1775574000,
    });

    const { POST } = require('./sync/route');
    const request = new NextRequest(
      'http://localhost:3000/v1/integrations/sync',
      { method: 'POST' }
    );

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.connectionStatus).toBe('syncing');
    expect(payload.lastSyncTimestamp).toBe(1775574000);
    expect(mockSyncPluggyItem).toHaveBeenCalledWith({
      userId: 'user-123',
    });
  });

  test('POST /v1/integrations/webhook reconciles item lifecycle events', async () => {
    const { POST } = require('./webhook/route');
    const request = new NextRequest(
      'http://localhost:3000/v1/integrations/webhook',
      {
        method: 'POST',
        body: JSON.stringify({
          event: 'item/updated',
          itemId: 'item-123',
          clientUserId: 'user-123',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(mockReconcilePluggyItem).toHaveBeenCalledWith({
      userId: 'user-123',
      itemId: 'item-123',
    });
    expect(mockPersistPluggyTransactions).not.toHaveBeenCalled();
  });

  test('POST /v1/integrations/webhook persists transactions for transaction events', async () => {
    const { POST } = require('./webhook/route');
    const request = new NextRequest(
      'http://localhost:3000/v1/integrations/webhook',
      {
        method: 'POST',
        body: JSON.stringify({
          event: 'transactions/updated',
          itemId: 'item-123',
          clientUserId: 'user-123',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(mockPersistPluggyTransactions).toHaveBeenCalledWith(
      'user-123',
      'item-123'
    );
  });
});
