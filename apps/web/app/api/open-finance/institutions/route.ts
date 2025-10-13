import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Lista de instituições financeiras disponíveis (simulada)
const AVAILABLE_INSTITUTIONS = [
  {
    id: 'banco-do-brasil',
    name: 'Banco do Brasil',
    type: 'BANK',
    logoUrl: '/logos/bb.svg',
    status: 'active',
    supportedServices: ['accounts', 'transactions', 'credit-cards'],
    description: 'Banco do Brasil S.A.',
  },
  {
    id: 'itau',
    name: 'Itaú Unibanco',
    type: 'BANK',
    logoUrl: '/logos/itau.svg',
    status: 'active',
    supportedServices: [
      'accounts',
      'transactions',
      'credit-cards',
      'investments',
    ],
    description: 'Itaú Unibanco S.A.',
  },
  {
    id: 'bradesco',
    name: 'Bradesco',
    type: 'BANK',
    logoUrl: '/logos/bradesco.svg',
    status: 'active',
    supportedServices: ['accounts', 'transactions', 'credit-cards'],
    description: 'Banco Bradesco S.A.',
  },
  {
    id: 'santander',
    name: 'Santander',
    type: 'BANK',
    logoUrl: '/logos/santander.svg',
    status: 'active',
    supportedServices: ['accounts', 'transactions', 'credit-cards'],
    description: 'Banco Santander Brasil S.A.',
  },
  {
    id: 'caixa',
    name: 'Caixa Econômica Federal',
    type: 'BANK',
    logoUrl: '/logos/caixa.svg',
    status: 'active',
    supportedServices: ['accounts', 'transactions'],
    description: 'Caixa Econômica Federal',
  },
  {
    id: 'nubank',
    name: 'Nubank',
    type: 'BANK',
    logoUrl: '/logos/nubank.svg',
    status: 'active',
    supportedServices: ['accounts', 'transactions', 'credit-cards'],
    description: 'Nu Pagamentos S.A.',
  },
  {
    id: 'inter',
    name: 'Banco Inter',
    type: 'BANK',
    logoUrl: '/logos/inter.svg',
    status: 'active',
    supportedServices: [
      'accounts',
      'transactions',
      'credit-cards',
      'investments',
    ],
    description: 'Banco Inter S.A.',
  },
  {
    id: 'c6-bank',
    name: 'C6 Bank',
    type: 'BANK',
    logoUrl: '/logos/c6.svg',
    status: 'active',
    supportedServices: ['accounts', 'transactions', 'credit-cards'],
    description: 'Banco C6 S.A.',
  },
  {
    id: 'btg-pactual-001',
    name: 'BTG Pactual',
    type: 'BANK',
    logoUrl: '/logos/btg.svg', // Adapte o caminho do logo se necessário
    status: 'active',
    supportedServices: ['accounts', 'investments', 'transactions'], // Apenas receitas e investimentos
    description: 'Banco BTG Pactual.',
  },
];

/**
 * GET /api/open-finance/institutions
 * Lista todas as instituições financeiras disponíveis para conexão
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    // Filtros opcionais via query params
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // BANK, INVESTMENT, CREDIT_CARD
    const service = searchParams.get('service'); // accounts, transactions, etc.
    const search = searchParams.get('search'); // busca por nome

    let institutions = [...AVAILABLE_INSTITUTIONS];

    // Aplicar filtros
    if (type) {
      institutions = institutions.filter(
        inst => inst.type === type.toUpperCase()
      );
    }

    if (service) {
      institutions = institutions.filter(inst =>
        inst.supportedServices.includes(service.toLowerCase())
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      institutions = institutions.filter(
        inst =>
          inst.name.toLowerCase().includes(searchLower) ||
          inst.description.toLowerCase().includes(searchLower)
      );
    }

    // Ordenar por nome
    institutions.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({
      institutions,
      total: institutions.length,
      filters: {
        type: type || null,
        service: service || null,
        search: search || null,
      },
    });
  } catch (error) {
    console.error('Error fetching institutions:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
