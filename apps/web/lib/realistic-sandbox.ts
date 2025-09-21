/**
 * Sandbox Realista do Open Finance Brasil
 * Simula comportamento real de APIs bancárias com dados autênticos brasileiros
 */

import { OPEN_FINANCE_INSTITUTIONS } from './open-finance-config';

// Dados realistas de clientes brasileiros
const REALISTIC_CUSTOMERS = [
  {
    id: 'customer_001',
    name: 'João Silva Santos',
    document: '12345678901',
    documentType: 'CPF',
    email: 'joao.silva@email.com',
    phone: '+5511999887766',
    address: {
      street: 'Rua das Flores, 123',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01000-000',
    },
    occupation: 'Engenheiro de Software',
    monthlyIncome: 8500.0,
    riskProfile: 'MODERATE',
  },
  {
    id: 'customer_002',
    name: 'Maria Oliveira Costa',
    document: '98765432100',
    documentType: 'CPF',
    email: 'maria.oliveira@email.com',
    phone: '+5511888776655',
    address: {
      street: 'Av. Paulista, 1000',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
    },
    occupation: 'Médica',
    monthlyIncome: 15000.0,
    riskProfile: 'LOW',
  },
  {
    id: 'customer_003',
    name: 'Carlos Eduardo Ferreira',
    document: '11122233344',
    documentType: 'CPF',
    email: 'carlos.ferreira@email.com',
    phone: '+5511777665544',
    address: {
      street: 'Rua da Consolação, 500',
      neighborhood: 'Consolação',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01302-000',
    },
    occupation: 'Advogado',
    monthlyIncome: 12000.0,
    riskProfile: 'MODERATE',
  },
];

// Dados realistas de estabelecimentos comerciais brasileiros
const REALISTIC_MERCHANTS = [
  {
    name: 'Supermercado Extra',
    category: 'GROCERY',
    mcc: '5411',
    location: { city: 'São Paulo', state: 'SP' },
    commonTransactions: ['Compra no débito', 'Compra no crédito'],
  },
  {
    name: 'Farmácia Pague Menos',
    category: 'PHARMACY',
    mcc: '5912',
    location: { city: 'São Paulo', state: 'SP' },
    commonTransactions: ['Compra no débito', 'Compra no crédito'],
  },
  {
    name: 'Posto Shell',
    category: 'GAS_STATION',
    mcc: '5541',
    location: { city: 'São Paulo', state: 'SP' },
    commonTransactions: ['Abastecimento', 'Compra no débito'],
  },
  {
    name: 'Restaurante Spoleto',
    category: 'RESTAURANT',
    mcc: '5812',
    location: { city: 'São Paulo', state: 'SP' },
    commonTransactions: ['Almoço', 'Jantar'],
  },
  {
    name: 'Uber',
    category: 'TRANSPORTATION',
    mcc: '4121',
    location: { city: 'São Paulo', state: 'SP' },
    commonTransactions: ['Corrida Uber', 'Uber Eats'],
  },
  {
    name: 'Netflix',
    category: 'ENTERTAINMENT',
    mcc: '7832',
    location: { city: 'São Paulo', state: 'SP' },
    commonTransactions: ['Assinatura Netflix'],
  },
  {
    name: 'Spotify',
    category: 'ENTERTAINMENT',
    mcc: '7832',
    location: { city: 'São Paulo', state: 'SP' },
    commonTransactions: ['Assinatura Spotify'],
  },
  {
    name: 'Amazon',
    category: 'ONLINE_RETAIL',
    mcc: '5942',
    location: { city: 'São Paulo', state: 'SP' },
    commonTransactions: ['Compra online', 'Amazon Prime'],
  },
  {
    name: 'Mercado Livre',
    category: 'ONLINE_RETAIL',
    mcc: '5942',
    location: { city: 'São Paulo', state: 'SP' },
    commonTransactions: ['Compra online', 'Mercado Pago'],
  },
  {
    name: 'Magazine Luiza',
    category: 'RETAIL',
    mcc: '5310',
    location: { city: 'São Paulo', state: 'SP' },
    commonTransactions: ['Compra no débito', 'Compra no crédito'],
  },
  {
    name: 'Casas Bahia',
    category: 'RETAIL',
    mcc: '5310',
    location: { city: 'São Paulo', state: 'SP' },
    commonTransactions: ['Compra no débito', 'Compra no crédito'],
  },
  {
    name: 'Americanas',
    category: 'RETAIL',
    mcc: '5310',
    location: { city: 'São Paulo', state: 'SP' },
    commonTransactions: ['Compra no débito', 'Compra no crédito'],
  },
];

// Padrões de transações realistas por tipo
const TRANSACTION_PATTERNS = {
  SALARY: {
    amount: { min: 3000, max: 25000 },
    frequency: 'MONTHLY',
    dayOfMonth: [5, 10, 15, 20, 25, 30],
    description: 'Salário',
    counterparty: 'Empresa',
  },
  PIX_TRANSFER: {
    amount: { min: 10, max: 5000 },
    frequency: 'DAILY',
    description: 'Transferência PIX',
    counterparty: 'Pessoa Física',
  },
  TED_TRANSFER: {
    amount: { min: 100, max: 10000 },
    frequency: 'WEEKLY',
    description: 'TED',
    counterparty: 'Pessoa Física',
  },
  BILL_PAYMENT: {
    amount: { min: 50, max: 2000 },
    frequency: 'MONTHLY',
    description: 'Pagamento de conta',
    counterparty: 'Empresa',
  },
  CREDIT_CARD_PAYMENT: {
    amount: { min: 200, max: 8000 },
    frequency: 'MONTHLY',
    description: 'Pagamento cartão de crédito',
    counterparty: 'Banco',
  },
  INVESTMENT: {
    amount: { min: 500, max: 10000 },
    frequency: 'MONTHLY',
    description: 'Aplicação financeira',
    counterparty: 'Corretora',
  },
  GROCERY: {
    amount: { min: 50, max: 800 },
    frequency: 'WEEKLY',
    description: 'Supermercado',
    counterparty: 'Estabelecimento',
  },
  TRANSPORT: {
    amount: { min: 5, max: 200 },
    frequency: 'DAILY',
    description: 'Transporte',
    counterparty: 'Uber/Taxi',
  },
  ENTERTAINMENT: {
    amount: { min: 20, max: 500 },
    frequency: 'WEEKLY',
    description: 'Entretenimento',
    counterparty: 'Streaming/Cinema',
  },
};

export interface RealisticAccount {
  accountId: string;
  accountType: 'CHECKING' | 'SAVINGS' | 'CREDIT_CARD' | 'INVESTMENT';
  accountSubType: 'STANDARD' | 'PREMIUM' | 'BASIC' | 'BLACK' | 'GOLD';
  currency: 'BRL';
  nickname: string;
  name: string;
  balance: number;
  available: number;
  blocked?: number;
  overdraftLimit?: number;
  openingDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED' | 'PENDING';
  branch: string;
  number: string;
  institution: {
    id: string;
    name: string;
    compeCode: string;
    ispb: string;
  };
  customer: (typeof REALISTIC_CUSTOMERS)[0];
  updatedAt: string;
  lastTransactionDate?: string;
  monthlyAverageBalance: number;
  transactionCount: number;
}

export interface RealisticTransaction {
  transactionId: string;
  accountId: string;
  type:
    | 'TRANSFER'
    | 'PAYMENT'
    | 'DEPOSIT'
    | 'PURCHASE'
    | 'WITHDRAWAL'
    | 'INVESTMENT';
  creditDebitType: 'CREDIT' | 'DEBIT';
  transactionAmount: number;
  currency: 'BRL';
  transactionDate: string;
  valueDate: string;
  description: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'CANCELLED';
  category: string;
  subcategory?: string;
  counterparty: {
    name: string;
    documentNumber: string;
    documentType: 'CPF' | 'CNPJ';
    accountInfo?: {
      accountType: string;
      branch: string;
      number: string;
      ispb: string;
      bankName: string;
    };
  };
  correlationId: string;
  details: {
    pixKey?: string;
    pixKeyType?: 'EMAIL' | 'PHONE' | 'CPF' | 'RANDOM';
    location?: {
      city: string;
      state: string;
      country: string;
    };
    merchant?: {
      name: string;
      category: string;
      mcc: string;
    };
    installmentInfo?: {
      installmentNumber: number;
      totalInstallments: number;
      installmentValue: number;
    };
  };
  tags: string[];
  isRecurring: boolean;
  recurringPattern?: 'MONTHLY' | 'WEEKLY' | 'DAILY';
}

export interface RealisticCreditCard {
  cardId: string;
  cardType: 'CREDIT' | 'DEBIT' | 'PREPAID';
  cardName: string;
  cardNumber: string;
  maskedNumber: string;
  status: 'ACTIVE' | 'BLOCKED' | 'CANCELLED' | 'EXPIRED';
  limit: number;
  availableLimit: number;
  currentBill: number;
  dueDate: string;
  closingDate: string;
  institution: {
    id: string;
    name: string;
    compeCode: string;
  };
  customer: (typeof REALISTIC_CUSTOMERS)[0];
  lastTransactionDate?: string;
  monthlySpending: number;
  averageTicket: number;
  installmentPurchases: number;
}

export class RealisticSandboxService {
  private static instance: RealisticSandboxService;
  private customerData: Map<string, any> = new Map();
  private accountData: Map<string, RealisticAccount[]> = new Map();
  private transactionData: Map<string, RealisticTransaction[]> = new Map();
  private creditCardData: Map<string, RealisticCreditCard[]> = new Map();
  private rateLimitData: Map<string, { count: number; resetTime: number }> =
    new Map();

  static getInstance(): RealisticSandboxService {
    if (!RealisticSandboxService.instance) {
      RealisticSandboxService.instance = new RealisticSandboxService();
    }
    return RealisticSandboxService.instance;
  }

  /**
   * Simula autenticação OAuth2 realista com delays e validações
   */
  async simulateRealisticOAuthFlow(
    institutionId: string,
    userId: string
  ): Promise<{
    accessToken: string;
    tokenType: string;
    expiresIn: number;
    scope: string;
    refreshToken: string;
    consentId: string;
  }> {
    // Simular delay de rede realista (1-3 segundos)
    await this.delay(1000 + Math.random() * 2000);

    const institution = OPEN_FINANCE_INSTITUTIONS.find(
      inst => inst.id === institutionId
    );
    if (!institution) {
      throw new Error('Institution not found');
    }

    // Simular falha ocasional (5% de chance)
    if (Math.random() < 0.05) {
      throw new Error('AUTH_ERROR: Token de acesso inválido ou expirado');
    }

    // Simular rate limiting (10% de chance)
    if (Math.random() < 0.1) {
      await this.delay(2000);
      throw new Error('RATE_LIMIT: Limite de requisições excedido');
    }

    const consentId = `consent_${institutionId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      accessToken: `realistic_token_${institutionId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tokenType: 'Bearer',
      expiresIn: 3600, // 1 hora
      scope: institution.scopes.join(' '),
      refreshToken: `refresh_${institutionId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      consentId,
    };
  }

  /**
   * Gera contas bancárias realistas com dados brasileiros autênticos
   */
  async getRealisticAccounts(
    institutionId: string,
    accessToken: string
  ): Promise<RealisticAccount[]> {
    // Verificar rate limiting
    await this.checkRateLimit(institutionId);

    // Simular delay de API realista
    await this.delay(800 + Math.random() * 1200);

    const institution = OPEN_FINANCE_INSTITUTIONS.find(
      inst => inst.id === institutionId
    );
    if (!institution) {
      throw new Error('Institution not found');
    }

    // Verificar se já temos dados para esta instituição
    if (this.accountData.has(institutionId)) {
      return this.accountData.get(institutionId)!;
    }

    // Gerar dados realistas
    const customer = this.getRandomCustomer();
    const accounts: RealisticAccount[] = [];

    // Conta corrente principal
    const checkingAccount = this.generateRealisticCheckingAccount(
      institution,
      customer
    );
    accounts.push(checkingAccount);

    // Conta poupança (se disponível)
    if (institution.scopes.includes('accounts')) {
      const savingsAccount = this.generateRealisticSavingsAccount(
        institution,
        customer
      );
      accounts.push(savingsAccount);
    }

    // Conta de investimentos (se disponível)
    if (institution.scopes.includes('investments')) {
      const investmentAccount = this.generateRealisticInvestmentAccount(
        institution,
        customer
      );
      accounts.push(investmentAccount);
    }

    // Armazenar dados
    this.accountData.set(institutionId, accounts);
    this.customerData.set(institutionId, customer);

    return accounts;
  }

  /**
   * Gera transações realistas com padrões brasileiros
   */
  async getRealisticTransactions(
    institutionId: string,
    accountId: string,
    accessToken: string,
    fromDate?: Date,
    toDate?: Date
  ): Promise<RealisticTransaction[]> {
    // Verificar rate limiting
    await this.checkRateLimit(institutionId);

    // Simular delay de API realista
    await this.delay(1000 + Math.random() * 1500);

    const cacheKey = `${institutionId}_${accountId}`;

    // Verificar se já temos dados para esta conta
    if (this.transactionData.has(cacheKey)) {
      const transactions = this.transactionData.get(cacheKey)!;
      return this.filterTransactionsByDate(transactions, fromDate, toDate);
    }

    // Gerar transações realistas
    const transactions = this.generateRealisticTransactions(
      institutionId,
      accountId
    );

    // Armazenar dados
    this.transactionData.set(cacheKey, transactions);

    return this.filterTransactionsByDate(transactions, fromDate, toDate);
  }

  /**
   * Gera cartões de crédito realistas
   */
  async getRealisticCreditCards(
    institutionId: string,
    accessToken: string
  ): Promise<RealisticCreditCard[]> {
    // Verificar rate limiting
    await this.checkRateLimit(institutionId);

    // Simular delay de API realista
    await this.delay(600 + Math.random() * 1000);

    const institution = OPEN_FINANCE_INSTITUTIONS.find(
      inst => inst.id === institutionId
    );
    if (!institution) {
      throw new Error('Institution not found');
    }

    // Verificar se já temos dados para esta instituição
    if (this.creditCardData.has(institutionId)) {
      return this.creditCardData.get(institutionId)!;
    }

    const customer =
      this.customerData.get(institutionId) || this.getRandomCustomer();
    const cards: RealisticCreditCard[] = [];

    if (institution.scopes.includes('credit-cards-accounts')) {
      const creditCard = this.generateRealisticCreditCard(
        institution,
        customer
      );
      cards.push(creditCard);
    }

    // Armazenar dados
    this.creditCardData.set(institutionId, cards);

    return cards;
  }

  /**
   * Simula webhook de notificação em tempo real
   */
  async simulateWebhookNotification(
    institutionId: string,
    eventType:
      | 'TRANSACTION'
      | 'BALANCE_CHANGE'
      | 'CARD_BLOCKED'
      | 'PAYMENT_DUE',
    data: any
  ): Promise<void> {
    // Simular delay de webhook
    await this.delay(500 + Math.random() * 1000);

    console.log(`Webhook received from ${institutionId}:`, {
      eventType,
      timestamp: new Date().toISOString(),
      data,
    });
  }

  /**
   * Simula erro realista de API
   */
  async simulateRealisticError(
    errorType:
      | 'NETWORK'
      | 'AUTH'
      | 'RATE_LIMIT'
      | 'INVALID_DATA'
      | 'INSTITUTION_DOWN'
      | 'TIMEOUT'
  ): Promise<never> {
    await this.delay(1000 + Math.random() * 2000);

    const errors = {
      NETWORK: {
        code: 'NETWORK_ERROR',
        message: 'Falha na conexão com a instituição financeira',
        details: 'Tente novamente em alguns minutos',
      },
      AUTH: {
        code: 'AUTH_ERROR',
        message: 'Token de acesso inválido ou expirado',
        details: 'Renovação de token necessária',
      },
      RATE_LIMIT: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Limite de requisições excedido',
        details: 'Tente novamente em 1 minuto',
      },
      INVALID_DATA: {
        code: 'INVALID_REQUEST_DATA',
        message: 'Dados da requisição inválidos',
        details: 'Verifique os parâmetros enviados',
      },
      INSTITUTION_DOWN: {
        code: 'INSTITUTION_UNAVAILABLE',
        message: 'Instituição financeira temporariamente indisponível',
        details: 'Serviço em manutenção',
      },
      TIMEOUT: {
        code: 'REQUEST_TIMEOUT',
        message: 'Timeout na requisição',
        details: 'Tente novamente',
      },
    };

    throw new Error(JSON.stringify(errors[errorType]));
  }

  // Métodos auxiliares privados

  private getRandomCustomer() {
    return REALISTIC_CUSTOMERS[
      Math.floor(Math.random() * REALISTIC_CUSTOMERS.length)
    ];
  }

  private generateRealisticCheckingAccount(
    institution: any,
    customer: any
  ): RealisticAccount {
    const balance = this.generateRealisticBalance(customer.monthlyIncome);
    const monthlyAverageBalance = balance * (0.8 + Math.random() * 0.4); // 80-120% do saldo atual

    return {
      accountId: `acc_${institution.id}_001`,
      accountType: 'CHECKING',
      accountSubType: customer.monthlyIncome > 10000 ? 'PREMIUM' : 'STANDARD',
      currency: 'BRL',
      nickname: `Conta Corrente ${institution.name}`,
      name: 'Conta Corrente',
      balance,
      available: balance * (0.95 + Math.random() * 0.05), // 95-100% disponível
      blocked: balance * (0.02 + Math.random() * 0.03), // 2-5% bloqueado
      overdraftLimit: customer.monthlyIncome * 0.5, // Limite de 50% da renda
      openingDate: this.generateOpeningDate(),
      status: 'ACTIVE',
      branch: this.generateBranchCode(),
      number: this.generateAccountNumber(),
      institution: {
        id: institution.id,
        name: institution.name,
        compeCode: institution.compeCode || '',
        ispb: institution.ispb || '',
      },
      customer,
      updatedAt: new Date().toISOString(),
      lastTransactionDate: this.generateRecentDate(),
      monthlyAverageBalance,
      transactionCount: Math.floor(Math.random() * 50) + 20, // 20-70 transações
    };
  }

  private generateRealisticSavingsAccount(
    institution: any,
    customer: any
  ): RealisticAccount {
    const balance = this.generateRealisticBalance(customer.monthlyIncome * 0.3); // 30% da renda

    return {
      accountId: `acc_${institution.id}_002`,
      accountType: 'SAVINGS',
      accountSubType: 'STANDARD',
      currency: 'BRL',
      nickname: `Poupança ${institution.name}`,
      name: 'Conta Poupança',
      balance,
      available: balance,
      openingDate: this.generateOpeningDate(),
      status: 'ACTIVE',
      branch: this.generateBranchCode(),
      number: this.generateAccountNumber(),
      institution: {
        id: institution.id,
        name: institution.name,
        compeCode: institution.compeCode || '',
        ispb: institution.ispb || '',
      },
      customer,
      updatedAt: new Date().toISOString(),
      lastTransactionDate: this.generateRecentDate(),
      monthlyAverageBalance: balance,
      transactionCount: Math.floor(Math.random() * 10) + 5, // 5-15 transações
    };
  }

  private generateRealisticInvestmentAccount(
    institution: any,
    customer: any
  ): RealisticAccount {
    const balance = this.generateRealisticBalance(customer.monthlyIncome * 0.5); // 50% da renda

    return {
      accountId: `acc_${institution.id}_003`,
      accountType: 'INVESTMENT',
      accountSubType: 'STANDARD',
      currency: 'BRL',
      nickname: `Investimentos ${institution.name}`,
      name: 'Conta de Investimentos',
      balance,
      available: balance,
      openingDate: this.generateOpeningDate(),
      status: 'ACTIVE',
      branch: '0000',
      number: this.generateAccountNumber(),
      institution: {
        id: institution.id,
        name: institution.name,
        compeCode: institution.compeCode || '',
        ispb: institution.ispb || '',
      },
      customer,
      updatedAt: new Date().toISOString(),
      lastTransactionDate: this.generateRecentDate(),
      monthlyAverageBalance: balance,
      transactionCount: Math.floor(Math.random() * 20) + 10, // 10-30 transações
    };
  }

  private generateRealisticCreditCard(
    institution: any,
    customer: any
  ): RealisticCreditCard {
    const limit = customer.monthlyIncome * (1.5 + Math.random() * 1.5); // 1.5-3x a renda
    const currentBill = limit * (0.2 + Math.random() * 0.6); // 20-80% do limite usado

    return {
      cardId: `card_${institution.id}_001`,
      cardType: 'CREDIT',
      cardName: `Cartão ${institution.name}`,
      cardNumber: this.generateCardNumber(),
      maskedNumber: `**** **** **** ${Math.floor(Math.random() * 9000) + 1000}`,
      status: 'ACTIVE',
      limit,
      availableLimit: limit - currentBill,
      currentBill,
      dueDate: this.generateDueDate(),
      closingDate: this.generateClosingDate(),
      institution: {
        id: institution.id,
        name: institution.name,
        compeCode: institution.compeCode || '',
      },
      customer,
      lastTransactionDate: this.generateRecentDate(),
      monthlySpending: currentBill,
      averageTicket: currentBill / (Math.floor(Math.random() * 20) + 10),
      installmentPurchases: Math.floor(Math.random() * 5),
    };
  }

  private generateRealisticTransactions(
    institutionId: string,
    accountId: string
  ): RealisticTransaction[] {
    const transactions: RealisticTransaction[] = [];
    const daysBack = 90;
    const transactionCount = 30 + Math.floor(Math.random() * 40); // 30-70 transações

    for (let i = 0; i < transactionCount; i++) {
      const daysAgo = Math.floor(Math.random() * daysBack);
      const transactionDate = new Date();
      transactionDate.setDate(transactionDate.getDate() - daysAgo);

      const transaction = this.generateRealisticTransaction(
        accountId,
        transactionDate
      );
      transactions.push(transaction);
    }

    // Ordenar por data (mais recente primeiro)
    transactions.sort(
      (a, b) =>
        new Date(b.transactionDate).getTime() -
        new Date(a.transactionDate).getTime()
    );

    return transactions;
  }

  private generateRealisticTransaction(
    accountId: string,
    date: Date
  ): RealisticTransaction {
    const transactionTypes = [
      'TRANSFER',
      'PAYMENT',
      'DEPOSIT',
      'PURCHASE',
      'WITHDRAWAL',
      'INVESTMENT',
    ];
    const type =
      transactionTypes[Math.floor(Math.random() * transactionTypes.length)];

    const isCredit = type === 'DEPOSIT' || type === 'INVESTMENT';
    const amount = this.generateRealisticAmount(type);

    const merchant = this.getRandomMerchant();
    const description = this.generateRealisticDescription(type, merchant);

    return {
      transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      accountId,
      type: type as any,
      creditDebitType: isCredit ? 'CREDIT' : 'DEBIT',
      transactionAmount: isCredit ? amount : -amount,
      currency: 'BRL',
      transactionDate: date.toISOString(),
      valueDate: date.toISOString(),
      description,
      status: 'COMPLETED',
      category: this.getCategoryFromType(type),
      subcategory: this.getSubcategoryFromType(type),
      counterparty: this.generateCounterparty(type, merchant),
      correlationId: `corr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      details: this.generateTransactionDetails(type, merchant),
      tags: this.generateTags(type),
      isRecurring: this.isRecurringTransaction(type),
      recurringPattern: this.getRecurringPattern(type),
    };
  }

  private generateRealisticBalance(monthlyIncome: number): number {
    // Saldo realista baseado na renda mensal
    const baseBalance = monthlyIncome * (0.5 + Math.random() * 1.5); // 50-200% da renda
    return Math.floor(baseBalance * 100) / 100; // Arredondar para 2 casas decimais
  }

  private generateRealisticAmount(type: string): number {
    const patterns =
      TRANSACTION_PATTERNS[type as keyof typeof TRANSACTION_PATTERNS];
    if (patterns) {
      return (
        Math.floor(
          (patterns.amount.min +
            Math.random() * (patterns.amount.max - patterns.amount.min)) *
            100
        ) / 100
      );
    }
    return Math.floor((Math.random() * 2000 + 10) * 100) / 100;
  }

  private generateRealisticDescription(type: string, merchant: any): string {
    const patterns =
      TRANSACTION_PATTERNS[type as keyof typeof TRANSACTION_PATTERNS];
    if (patterns && patterns.description) {
      return patterns.description;
    }

    const descriptions = {
      TRANSFER: [
        'Transferência PIX',
        'TED',
        'DOC',
        'Transferência entre contas',
      ],
      PAYMENT: [
        'Pagamento de conta',
        'Boleto bancário',
        'PIX recebido',
        'Pagamento automático',
      ],
      DEPOSIT: [
        'Depósito em dinheiro',
        'Depósito via PIX',
        'Transferência recebida',
      ],
      PURCHASE: [
        `Compra - ${merchant.name}`,
        'Compra no débito',
        'Compra online',
      ],
      WITHDRAWAL: ['Saque no caixa', 'Saque no terminal'],
      INVESTMENT: ['Aplicação financeira', 'Resgate de investimento'],
    };

    const typeDescriptions = descriptions[
      type as keyof typeof descriptions
    ] || ['Transação'];
    return typeDescriptions[
      Math.floor(Math.random() * typeDescriptions.length)
    ];
  }

  private getRandomMerchant() {
    return REALISTIC_MERCHANTS[
      Math.floor(Math.random() * REALISTIC_MERCHANTS.length)
    ];
  }

  private getCategoryFromType(type: string): string {
    const categories = {
      TRANSFER: 'TRANSFER',
      PAYMENT: 'PAYMENT',
      DEPOSIT: 'DEPOSIT',
      PURCHASE: 'PURCHASE',
      WITHDRAWAL: 'WITHDRAWAL',
      INVESTMENT: 'INVESTMENT',
    };
    return categories[type as keyof typeof categories] || 'OTHER';
  }

  private getSubcategoryFromType(type: string): string {
    const subcategories = {
      TRANSFER: 'PIX',
      PAYMENT: 'BILL_PAYMENT',
      DEPOSIT: 'SALARY',
      PURCHASE: 'RETAIL',
      WITHDRAWAL: 'ATM',
      INVESTMENT: 'STOCK',
    };
    return subcategories[type as keyof typeof subcategories] || 'OTHER';
  }

  private generateCounterparty(type: string, merchant: any) {
    if (type === 'PURCHASE' && merchant) {
      return {
        name: merchant.name,
        documentNumber: '12345678000195',
        documentType: 'CNPJ' as const,
      };
    }

    if (type === 'TRANSFER') {
      return {
        name: 'Pessoa Física',
        documentNumber: '12345678901',
        documentType: 'CPF' as const,
        accountInfo: {
          accountType: 'CHECKING',
          branch: '1234',
          number: '56789-0',
          ispb: '00000000',
          bankName: 'Banco do Brasil',
        },
      };
    }

    return {
      name: 'Contraparte',
      documentNumber: '12345678000195',
      documentType: 'CNPJ' as const,
    };
  }

  private generateTransactionDetails(type: string, merchant: any) {
    const details: any = {};

    if (type === 'TRANSFER') {
      details.pixKey = 'pessoa@email.com';
      details.pixKeyType = 'EMAIL';
    }

    if (type === 'PURCHASE' && merchant) {
      details.location = {
        city: merchant.location.city,
        state: merchant.location.state,
        country: 'Brasil',
      };
      details.merchant = {
        name: merchant.name,
        category: merchant.category,
        mcc: merchant.mcc,
      };
    }

    return details;
  }

  private generateTags(type: string): string[] {
    const tags = {
      TRANSFER: ['pix', 'transferencia'],
      PAYMENT: ['conta', 'pagamento'],
      DEPOSIT: ['salario', 'deposito'],
      PURCHASE: ['compra', 'debito'],
      WITHDRAWAL: ['saque', 'dinheiro'],
      INVESTMENT: ['investimento', 'aplicacao'],
    };
    return tags[type as keyof typeof tags] || ['transacao'];
  }

  private isRecurringTransaction(type: string): boolean {
    const recurringTypes = ['PAYMENT', 'DEPOSIT', 'INVESTMENT'];
    return recurringTypes.includes(type);
  }

  private getRecurringPattern(
    type: string
  ): 'MONTHLY' | 'WEEKLY' | 'DAILY' | undefined {
    const patterns = {
      PAYMENT: 'MONTHLY',
      DEPOSIT: 'MONTHLY',
      INVESTMENT: 'MONTHLY',
    };
    return patterns[type as keyof typeof patterns];
  }

  private generateOpeningDate(): string {
    const daysAgo = Math.floor(Math.random() * 365 * 3); // Últimos 3 anos
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString();
  }

  private generateRecentDate(): string {
    const daysAgo = Math.floor(Math.random() * 7); // Últimos 7 dias
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString();
  }

  private generateBranchCode(): string {
    return Math.floor(Math.random() * 9000) + 1000 + '';
  }

  private generateAccountNumber(): string {
    return Math.floor(Math.random() * 90000000) + 10000000 + '';
  }

  private generateCardNumber(): string {
    return Math.floor(Math.random() * 9000000000000000) + 1000000000000000 + '';
  }

  private generateDueDate(): string {
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * 30) + 1);
    return date.toISOString();
  }

  private generateClosingDate(): string {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 15));
    return date.toISOString();
  }

  private async checkRateLimit(institutionId: string): Promise<void> {
    const now = Date.now();
    const rateLimitKey = institutionId;
    const rateLimitData = this.rateLimitData.get(rateLimitKey);

    if (rateLimitData) {
      if (now < rateLimitData.resetTime) {
        if (rateLimitData.count >= 100) {
          // 100 requests per minute
          throw new Error('RATE_LIMIT: Limite de requisições excedido');
        }
        rateLimitData.count++;
      } else {
        this.rateLimitData.set(rateLimitKey, {
          count: 1,
          resetTime: now + 60000,
        });
      }
    } else {
      this.rateLimitData.set(rateLimitKey, {
        count: 1,
        resetTime: now + 60000,
      });
    }
  }

  private filterTransactionsByDate(
    transactions: RealisticTransaction[],
    fromDate?: Date,
    toDate?: Date
  ): RealisticTransaction[] {
    if (!fromDate && !toDate) return transactions;

    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.transactionDate);

      if (fromDate && transactionDate < fromDate) return false;
      if (toDate && transactionDate > toDate) return false;

      return true;
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Exportar instância singleton
export const realisticSandboxService = RealisticSandboxService.getInstance();
