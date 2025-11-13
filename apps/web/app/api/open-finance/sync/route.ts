import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';

// Função para gerar transações simuladas realistas
function generateMockTransaction(
  userId: string,
  accountId: string,
  institutionId: string
) {
  // BTG Pactual: só receitas e investimentos
  if (institutionId === 'btg-pactual-001') {
    const receitas = ['Salário', 'Renda-extra', 'Recebidos de PIX'];
    const investimentos = [
      'Tesouro Direto',
      'Bitcoin',
      'Ações',
      'Fundos Imobiliários',
      'ETFs',
      'Ativos Internacionais',
    ];
    const isReceita = Math.random() < 0.5;
    const category = isReceita
      ? receitas[Math.floor(Math.random() * receitas.length)]
      : investimentos[Math.floor(Math.random() * investimentos.length)];
    const amount = isReceita
      ? Math.round((Math.random() * 4999 + 100) * 100) / 100
      : Math.round((Math.random() * 9999 + 500) * 100) / 100;
    const daysAgo = Math.floor(Math.random() * 90);
    const transactionDate = new Date();
    transactionDate.setDate(transactionDate.getDate() - daysAgo);
    return {
      userId,
      accountId,
      institutionId,
      amount,
      currency: 'BRL',
      date: transactionDate,
      description: isReceita
        ? `Receita: ${category}`
        : `Investimento: ${category}`,
      category: {
        primary: isReceita ? 'Receita' : 'Investimento',
        detail: category,
        confidence: 1,
      },
      merchant: {
        name: category,
        category: isReceita ? 'Receita' : 'Investimento',
      },
      type: 'CREDIT',
      status: 'COMPLETED',
      metadata: {
        source: 'open_finance',
        processed: true,
        tags: [
          isReceita ? 'receita' : 'investimento',
          category.toLowerCase().replace(/\s/g, '-'),
        ],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  // Bancos comuns: lógica antiga
  const categories = [
    {
      name: 'Alimentação',
      merchants: [
        'Supermercado Extra',
        'Padaria São José',
        'Restaurante Bella Vista',
        "McDonald's",
        'Subway',
      ],
    },
    {
      name: 'Transporte',
      merchants: [
        'Uber',
        '99',
        'Posto Shell',
        'Estacionamento Shopping',
        'Pedágio CCR',
      ],
    },
    {
      name: 'Saúde',
      merchants: [
        'Farmácia Droga Raia',
        'Clínica São Lucas',
        'Laboratório Fleury',
        'Hospital Albert Einstein',
      ],
    },
    {
      name: 'Educação',
      merchants: [
        'Livraria Cultura',
        'Curso Udemy',
        'Universidade Anhembi',
        'Escola de Idiomas',
      ],
    },
    {
      name: 'Lazer',
      merchants: [
        'Cinema Cinemark',
        'Netflix',
        'Spotify',
        'Academia Smart Fit',
        'Shopping Iguatemi',
      ],
    },
    {
      name: 'Casa',
      merchants: [
        'Casas Bahia',
        'Leroy Merlin',
        'Magazine Luiza',
        'Mercado Livre',
      ],
    },
    {
      name: 'Vestuário',
      merchants: ['Zara', 'C&A', 'Renner', 'Nike Store', 'Adidas'],
    },
  ];

  const randomCategory =
    categories[Math.floor(Math.random() * categories.length)];
  const randomMerchant =
    randomCategory.merchants[
      Math.floor(Math.random() * randomCategory.merchants.length)
    ];

  // Gerar valor baseado na categoria
  let amount;
  switch (randomCategory.name) {
    case 'Alimentação':
      amount = -(Math.random() * 200 + 20); // R$ 20-220
      break;
    case 'Transporte':
      amount = -(Math.random() * 100 + 10); // R$ 10-110
      break;
    case 'Saúde':
      amount = -(Math.random() * 500 + 50); // R$ 50-550
      break;
    case 'Casa':
      amount = -(Math.random() * 1000 + 100); // R$ 100-1100
      break;
    default:
      amount = -(Math.random() * 300 + 30); // R$ 30-330
  }

  // Algumas transações são receitas (salário, transferências)
  if (Math.random() < 0.1) {
    // 10% chance de ser receita
    amount = Math.abs(amount) * (Math.random() * 5 + 1); // Receitas maiores
    randomCategory.name = 'Receita';
  }

  const daysAgo = Math.floor(Math.random() * 90); // Últimos 90 dias
  const transactionDate = new Date();
  transactionDate.setDate(transactionDate.getDate() - daysAgo);

  return {
    userId,
    accountId,
    institutionId,
    amount: Math.round(amount * 100) / 100, // Arredondar para 2 casas decimais
    currency: 'BRL',
    date: transactionDate,
    description: randomMerchant,
    category: {
      primary: randomCategory.name,
      confidence: Math.random() * 0.3 + 0.7, // 70-100% de confiança
    },
    merchant: {
      name: randomMerchant,
      category: randomCategory.name,
    },
    type: amount > 0 ? 'CREDIT' : 'DEBIT',
    status: 'COMPLETED',
    metadata: {
      source: 'open_finance',
      processed: true,
      tags: [randomCategory.name.toLowerCase()],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * POST /api/open-finance/sync
 * Inicia sincronização manual de dados de uma conta específica
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { accountId, syncType = 'full' } = body; // full, accounts-only, transactions-only

    if (!accountId) {
      return NextResponse.json(
        { message: 'ID da conta é obrigatório' },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(accountId)) {
      return NextResponse.json(
        { message: 'ID da conta inválido' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const connectedAccounts = db.collection('connected_accounts');

    // Verificar se a conta existe e pertence ao usuário
    const account = await connectedAccounts.findOne({
      _id: new ObjectId(accountId),
      userId: userId,
      deletedAt: { $exists: false },
    });

    if (!account) {
      return NextResponse.json(
        { message: 'Conta não encontrada' },
        { status: 404 }
      );
    }

    // Verificar se não há sincronização em andamento
    const syncHistory = db.collection('sync_history');
    const ongoingSync = await syncHistory.findOne({
      userId: userId,
      accountId: account.accountId,
      institutionId: account.institutionId,
      status: 'IN_PROGRESS',
    });

    if (ongoingSync) {
      return NextResponse.json(
        { message: 'Já existe uma sincronização em andamento para esta conta' },
        { status: 409 }
      );
    }

    // Criar registro de sincronização
    const syncRecord = {
      userId: userId,
      accountId: account.accountId,
      institutionId: account.institutionId,
      institutionName: account.institutionName,
      syncType: syncType,
      status: 'IN_PROGRESS',
      startedAt: new Date(),
      timestamp: new Date(),
      recordsProcessed: 0,
    };

    const syncResult = await syncHistory.insertOne(syncRecord);
    const syncId = syncResult.insertedId.toString();

    // Simular processo de sincronização e armazenar dados reais
    try {
      // Sem delay - processamento imediato

      // Gerar e armazenar transações simuladas
      const transactionsToCreate =
        syncType === 'full' || syncType === 'transactions-only'
          ? Math.floor(Math.random() * 30) + 5
          : 0; // 5-35 transações

      const transactions = [];
      const transactionsCollection = db.collection('transactions');

      // Gerar transações simuladas realistas
      for (let i = 0; i < transactionsToCreate; i++) {
        const transaction = generateMockTransaction(
          userId,
          account.accountId,
          account.institutionId
        );
        transactions.push(transaction);
      }

      // Inserir transações no banco COM embeddings
      let insertedTransactions = 0;
      if (transactions.length > 0) {
        // Gerar embeddings usando OpenAI diretamente
        try {
          const OpenAI = (await import('openai')).default;
          const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

          for (const transaction of transactions) {
            const content = [
              transaction.description,
              transaction.category?.primary
                ? `Categoria: ${transaction.category.primary}`
                : '',
              transaction.merchant?.name
                ? `Estabelecimento: ${transaction.merchant.name}`
                : '',
              transaction.amount < 0 ? 'Despesa' : 'Receita',
            ]
              .filter(Boolean)
              .join(' - ');

            const response = await openai.embeddings.create({
              model: 'text-embedding-3-small',
              input: content,
            });
            transaction.embedding = response.data[0].embedding;
          }
          console.log(
            `✅ Generated embeddings for ${transactions.length} transactions`
          );
        } catch (error) {
          console.error('❌ Error generating embeddings:', error);
        }

        const insertResult =
          await transactionsCollection.insertMany(transactions);
        insertedTransactions = insertResult.insertedCount;
        console.log(
          `✅ Inserted ${insertedTransactions} transactions with embeddings`
        );
      }

      const mockSyncResults = {
        accounts: syncType === 'full' || syncType === 'accounts-only' ? 1 : 0,
        transactions: insertedTransactions,
        creditCards:
          syncType === 'full' && account.permissions.includes('credit-cards')
            ? Math.floor(Math.random() * 3)
            : 0,
      };

      const totalRecords =
        mockSyncResults.accounts +
        mockSyncResults.transactions +
        mockSyncResults.creditCards;

      // Atualizar registro de sincronização como concluído
      await syncHistory.updateOne(
        { _id: syncResult.insertedId },
        {
          $set: {
            status: 'COMPLETED',
            completedAt: new Date(),
            recordsProcessed: totalRecords,
            results: mockSyncResults,
            updatedAt: new Date(),
          },
        }
      );

      // Atualizar último sync da conta e ativar se for a primeira sincronização
      const updateData: any = {
        lastSync: new Date(),
        updatedAt: new Date(),
      };

      // Se a conta estava inativa, ativar após primeira sincronização bem-sucedida
      if (account.status === 'INACTIVE') {
        updateData.status = 'ACTIVE';
      }

      await connectedAccounts.updateOne(
        { _id: new ObjectId(accountId) },
        { $set: updateData }
      );

      return NextResponse.json({
        message: 'Sincronização concluída com sucesso',
        syncId: syncId,
        results: {
          status: 'COMPLETED',
          recordsProcessed: totalRecords,
          breakdown: mockSyncResults,
          transactionsStored: insertedTransactions,
          duration: '1s',
        },
      });
    } catch (syncError) {
      // Marcar sincronização como falha
      await syncHistory.updateOne(
        { _id: syncResult.insertedId },
        {
          $set: {
            status: 'FAILED',
            completedAt: new Date(),
            error:
              syncError instanceof Error
                ? syncError.message
                : 'Erro desconhecido',
            updatedAt: new Date(),
          },
        }
      );

      return NextResponse.json(
        {
          message: 'Falha na sincronização',
          syncId: syncId,
          error:
            syncError instanceof Error
              ? syncError.message
              : 'Erro desconhecido',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error starting sync:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/open-finance/sync
 * Lista histórico de sincronizações do usuário
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const db = await getDatabase();
    const syncHistory = db.collection('sync_history');

    // Construir filtro
    const filter: any = { userId: userId };
    if (accountId) {
      filter.accountId = accountId;
    }

    // Buscar histórico com paginação
    const syncs = await syncHistory
      .find(filter)
      .sort({ timestamp: -1 })
      .skip(offset)
      .limit(limit)
      .toArray();

    // Contar total
    const total = await syncHistory.countDocuments(filter);

    return NextResponse.json({
      syncs: syncs.map(sync => ({
        id: sync._id.toString(),
        accountId: sync.accountId,
        institutionId: sync.institutionId,
        institutionName: sync.institutionName,
        syncType: sync.syncType,
        status: sync.status,
        recordsProcessed: sync.recordsProcessed || 0,
        results: sync.results || null,
        startedAt: sync.startedAt,
        completedAt: sync.completedAt || null,
        error: sync.error || null,
        duration:
          sync.completedAt && sync.startedAt
            ? `${Math.round((new Date(sync.completedAt).getTime() - new Date(sync.startedAt).getTime()) / 1000)}s`
            : null,
      })),
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('Error fetching sync history:', error);
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
