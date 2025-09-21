import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { OpenFinanceClient } from '@financial-ai/open-finance';
import {
  OPEN_FINANCE_INSTITUTIONS,
  getSandboxInstitutions,
} from '@/lib/open-finance-config';

// URLs dos logos dos bancos brasileiros
const BANK_LOGOS: Record<string, string[]> = {
  nubank: ['https://logos.bancos.com.br/nubank.png'],
};

// Instituições conectadas (apenas Nubank por enquanto)
const CONNECTED_INSTITUTIONS = ['nubank'];

/**
 * API para gerenciar instituições financeiras do Open Finance
 */

// Usar instituições reais do Open Finance Brasil
const AVAILABLE_INSTITUTIONS = OPEN_FINANCE_INSTITUTIONS;

/**
 * GET /api/open-finance/institutions
 * Lista todas as instituições financeiras disponíveis para integração
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Filtrar instituições baseado em parâmetros de query
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    let institutions = AVAILABLE_INSTITUTIONS;

    // Filtrar por tipo
    if (type) {
      institutions = institutions.filter(
        inst => inst.type === type.toUpperCase()
      );
    }

    // Filtrar por busca
    if (search) {
      const searchLower = search.toLowerCase();
      institutions = institutions.filter(
        inst =>
          inst.name.toLowerCase().includes(searchLower) ||
          inst.compeCode?.includes(search) ||
          inst.ispb?.includes(search)
      );
    }

    // Adicionar informações de conexão e logos
    const institutionsWithConnection = institutions.map(inst => ({
      ...inst,
      logoUrl: BANK_LOGOS[inst.id] ? BANK_LOGOS[inst.id][0] : inst.logoUrl,
      logoUrls: BANK_LOGOS[inst.id] || [inst.logoUrl],
      isConnected: CONNECTED_INSTITUTIONS.includes(inst.id), // Apenas Nubank conectado
      connectedAt: CONNECTED_INSTITUTIONS.includes(inst.id)
        ? new Date().toISOString()
        : undefined,
      lastSyncAt: CONNECTED_INSTITUTIONS.includes(inst.id)
        ? new Date().toISOString()
        : undefined,
      accountCount: CONNECTED_INSTITUTIONS.includes(inst.id) ? 1 : 0,
      status: CONNECTED_INSTITUTIONS.includes(inst.id) ? 'ACTIVE' : 'AVAILABLE',
    }));

    return NextResponse.json({
      success: true,
      data: institutionsWithConnection,
      total: institutionsWithConnection.length,
    });
  } catch (error) {
    console.error('Error fetching institutions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/open-finance/institutions
 * Registra uma nova instituição financeira (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const {
      id,
      name,
      logoUrl,
      authUrl,
      apiUrl,
      type,
      compeCode,
      ispb,
      scopes,
      certificateRequired,
    } = body;

    // Validação básica
    if (!id || !name || !authUrl || !apiUrl || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verificar se já existe
    const existingInstitution = AVAILABLE_INSTITUTIONS.find(
      inst => inst.id === id
    );
    if (existingInstitution) {
      return NextResponse.json(
        { error: 'Institution already exists' },
        { status: 409 }
      );
    }

    const newInstitution = {
      id,
      name,
      logoUrl,
      authUrl,
      apiUrl,
      type: type.toUpperCase(),
      compeCode,
      ispb,
      scopes: scopes || ['accounts', 'transactions'],
      certificateRequired: certificateRequired || false,
    };

    // Em uma implementação real, salvaria no banco de dados
    // Por enquanto, apenas retorna a instituição criada
    return NextResponse.json({
      success: true,
      data: newInstitution,
      message: 'Institution registered successfully',
    });
  } catch (error) {
    console.error('Error creating institution:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
