import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { OpenFinanceClient } from '@financial-ai/open-finance';

/**
 * API para gerenciar instituições financeiras do Open Finance
 */

// Instituições financeiras disponíveis no Brasil (exemplo)
const AVAILABLE_INSTITUTIONS = [
  {
    id: 'banco-do-brasil',
    name: 'Banco do Brasil',
    logoUrl: 'https://logos.bancos.com.br/banco-do-brasil.png',
    authUrl: 'https://auth.bb.com.br',
    apiUrl: 'https://api.bb.com.br/open-banking',
    type: 'BANK' as const,
    compeCode: '001',
    ispb: '00000000',
    scopes: ['accounts', 'transactions', 'credit-cards'],
    certificateRequired: false,
  },
  {
    id: 'caixa-economica',
    name: 'Caixa Econômica Federal',
    logoUrl: 'https://logos.bancos.com.br/caixa.png',
    authUrl: 'https://auth.caixa.gov.br',
    apiUrl: 'https://api.caixa.gov.br/open-banking',
    type: 'BANK' as const,
    compeCode: '104',
    ispb: '00360305',
    scopes: ['accounts', 'transactions'],
    certificateRequired: false,
  },
  {
    id: 'bradesco',
    name: 'Bradesco',
    logoUrl: 'https://logos.bancos.com.br/bradesco.png',
    authUrl: 'https://auth.bradesco.com.br',
    apiUrl: 'https://api.bradesco.com.br/open-banking',
    type: 'BANK' as const,
    compeCode: '237',
    ispb: '60746948',
    scopes: ['accounts', 'transactions', 'credit-cards', 'loans'],
    certificateRequired: true,
  },
  {
    id: 'itau',
    name: 'Itaú Unibanco',
    logoUrl: 'https://logos.bancos.com.br/itau.png',
    authUrl: 'https://auth.itau.com.br',
    apiUrl: 'https://api.itau.com.br/open-banking',
    type: 'BANK' as const,
    compeCode: '341',
    ispb: '60701190',
    scopes: ['accounts', 'transactions', 'credit-cards', 'investments'],
    certificateRequired: true,
  },
  {
    id: 'santander',
    name: 'Santander',
    logoUrl: 'https://logos.bancos.com.br/santander.png',
    authUrl: 'https://auth.santander.com.br',
    apiUrl: 'https://api.santander.com.br/open-banking',
    type: 'BANK' as const,
    compeCode: '033',
    ispb: '90400888',
    scopes: ['accounts', 'transactions', 'credit-cards'],
    certificateRequired: true,
  },
  {
    id: 'nubank',
    name: 'Nubank',
    logoUrl: 'https://logos.bancos.com.br/nubank.png',
    authUrl: 'https://auth.nubank.com.br',
    apiUrl: 'https://api.nubank.com.br/open-banking',
    type: 'BANK' as const,
    compeCode: '260',
    ispb: '18236120',
    scopes: ['accounts', 'transactions', 'credit-cards'],
    certificateRequired: false,
  },
];

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

    return NextResponse.json({
      success: true,
      data: institutions,
      total: institutions.length,
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
