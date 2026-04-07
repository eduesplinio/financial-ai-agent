import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  const userId = request.nextUrl.searchParams.get('userId');
  const redirectUri = request.nextUrl.searchParams.get('redirectUri');
  const action = request.nextUrl.searchParams.get('action') ?? 'success';

  if (!token || !userId || !redirectUri) {
    return NextResponse.json(
      { message: 'Parâmetros obrigatórios ausentes' },
      { status: 400 }
    );
  }

  if (action === 'cancelled') {
    return NextResponse.redirect(
      appendQueryParams(redirectUri, {
        status: 'cancelled',
      })
    );
  }

  await ensureMockConnectedAccount(userId, token);

  return NextResponse.redirect(
    appendQueryParams(redirectUri, {
      status: 'success',
    })
  );
}

async function ensureMockConnectedAccount(userId: string, token: string) {
  const db = await getDatabase();
  const connectedAccounts = db.collection('connected_accounts');

  const existingAccount = await connectedAccounts.findOne({
    userId,
    institutionId: 'mock-bank-001',
    deletedAt: { $exists: false },
  });

  if (existingAccount) {
    return;
  }

  const now = new Date();
  await connectedAccounts.insertOne({
    userId,
    institutionId: 'mock-bank-001',
    institutionName: 'Banco Sandbox',
    accountId: `mock-ios-${token.slice(-8)}`,
    accountType: 'CHECKING',
    accountName: 'Conta Corrente Sandbox',
    currency: 'BRL',
    status: 'ACTIVE',
    permissions: ['accounts', 'transactions'],
    lastSync: null,
    createdAt: now,
    updatedAt: now,
  });
}

function appendQueryParams(baseURL: string, params: Record<string, string>) {
  const url = new URL(baseURL);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return url.toString();
}
