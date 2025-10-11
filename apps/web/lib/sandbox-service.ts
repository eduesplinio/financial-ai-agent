/**
 * Serviço de Sandbox do Open Finance Brasil
 * Simula respostas realistas das APIs das instituições financeiras
 *
 * @deprecated Use realisticSandboxService instead for more realistic data
 */

import { OPEN_FINANCE_INSTITUTIONS } from './open-finance-config';
import { realisticSandboxService } from './realistic-sandbox';

export interface SandboxAccount {
  accountId: string;
  accountType: 'CHECKING' | 'SAVINGS' | 'CREDIT_CARD' | 'INVESTMENT';
  accountSubType: 'STANDARD' | 'PREMIUM' | 'BASIC';
  currency: 'BRL';
  nickname: string;
  name: string;
  balance: number;
  available: number;
  blocked?: number;
  overdraftLimit?: number;
  openingDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED';
  branch: string;
  number: string;
  institution: {
    id: string;
    name: string;
    compeCode: string;
    ispb: string;
  };
  updatedAt: string;
}

export interface SandboxTransaction {
  transactionId: string;
  accountId: string;
  type: 'TRANSFER' | 'PAYMENT' | 'DEPOSIT' | 'PURCHASE' | 'WITHDRAWAL';
  creditDebitType: 'CREDIT' | 'DEBIT';
  transactionAmount: number;
  currency: 'BRL';
  transactionDate: string;
  description: string;
  category: string;
  merchantName?: string;
  merchantCategory?: string;
  location?: {
    city: string;
    state: string;
    country: string;
  };
}

export interface SandboxCreditCard {
  cardId: string;
  cardType: 'CREDIT' | 'DEBIT' | 'PREPAID';
  cardName: string;
  cardNumber: string; // Mascarado
  status: 'ACTIVE' | 'BLOCKED' | 'CANCELLED';
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
}

/**
 * Gerador de dados simulados realistas para sandbox
 */
export class SandboxService {
  private static instance: SandboxService;
  private institutionData: Map<string, any> = new Map();

  static getInstance(): SandboxService {
    if (!SandboxService.instance) {
      SandboxService.instance = new SandboxService();
    }
    return SandboxService.instance;
  }

  /**
   * Simula autenticação OAuth2 com instituição
   */
  async simulateOAuthFlow(
    institutionId: string,
    userId: string
  ): Promise<{
    accessToken: string;
    tokenType: string;
    expiresIn: number;
    scope: string;
    refreshToken: string;
  }> {
    // Simular delay de rede
    await this.delay(1000 + Math.random() * 2000);

    const institution = OPEN_FINANCE_INSTITUTIONS.find(
      inst => inst.id === institutionId
    );
    if (!institution) {
      throw new Error('Institution not found');
    }

    return {
      accessToken: `sandbox_token_${institutionId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tokenType: 'Bearer',
      expiresIn: 3600, // 1 hora
      scope: institution.scopes.join(' '),
      refreshToken: `refresh_${institutionId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  /**
   * Simula consulta de contas bancárias
   */
  async getAccounts(
    institutionId: string,
    accessToken: string
  ): Promise<SandboxAccount[]> {
    await this.delay(500 + Math.random() * 1000);

    const institution = OPEN_FINANCE_INSTITUTIONS.find(
      inst => inst.id === institutionId
    );
    if (!institution) {
      throw new Error('Institution not found');
    }

    // Gerar dados baseados no tipo de instituição
    const accounts: SandboxAccount[] = [];

    // Conta corrente principal
    accounts.push({
      accountId: `acc_${institutionId}_001`,
      accountType: 'CHECKING',
      accountSubType: 'STANDARD',
      currency: 'BRL',
      nickname: `Conta Corrente ${institution.name}`,
      name: 'Conta Corrente',
      balance: this.generateRealisticBalance(),
      available: this.generateRealisticBalance() * 0.95,
      blocked: this.generateRealisticBalance() * 0.05,
      overdraftLimit: 2000,
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
      updatedAt: new Date().toISOString(),
    });

    // Conta poupança (se disponível)
    if (institution.scopes.includes('accounts')) {
      accounts.push({
        accountId: `acc_${institutionId}_002`,
        accountType: 'SAVINGS',
        accountSubType: 'STANDARD',
        currency: 'BRL',
        nickname: `Poupança ${institution.name}`,
        name: 'Conta Poupança',
        balance: this.generateRealisticBalance() * 0.7,
        available: this.generateRealisticBalance() * 0.7,
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
        updatedAt: new Date().toISOString(),
      });
    }

    // Cartão de crédito (se disponível)
    if (institution.scopes.includes('credit-cards-accounts')) {
      accounts.push({
        accountId: `acc_${institutionId}_003`,
        accountType: 'CREDIT_CARD',
        accountSubType: 'STANDARD',
        currency: 'BRL',
        nickname: `Cartão ${institution.name}`,
        name: 'Cartão de Crédito',
        balance: -this.generateRealisticBalance() * 0.3, // Saldo negativo = limite usado
        available: this.generateRealisticBalance() * 0.7, // Limite disponível
        openingDate: this.generateOpeningDate(),
        status: 'ACTIVE',
        branch: '0000',
        number: this.generateCardNumber(),
        institution: {
          id: institution.id,
          name: institution.name,
          compeCode: institution.compeCode || '',
          ispb: institution.ispb || '',
        },
        updatedAt: new Date().toISOString(),
      });
    }

    return accounts;
  }

  /**
   * Simula consulta de transações
   */
  async getTransactions(
    institutionId: string,
    accountId: string,
    accessToken: string,
    fromDate?: Date,
    toDate?: Date
  ): Promise<SandboxTransaction[]> {
    await this.delay(800 + Math.random() * 1200);

    const transactions: SandboxTransaction[] = [];
    const daysBack = 90; // Últimos 90 dias
    const transactionCount = 15 + Math.floor(Math.random() * 25); // 15-40 transações

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

  /**
   * Simula consulta de cartões de crédito
   */
  async getCreditCards(
    institutionId: string,
    accessToken: string
  ): Promise<SandboxCreditCard[]> {
    await this.delay(600 + Math.random() * 800);

    const institution = OPEN_FINANCE_INSTITUTIONS.find(
      inst => inst.id === institutionId
    );
    if (!institution) {
      throw new Error('Institution not found');
    }

    const cards: SandboxCreditCard[] = [];

    if (institution.scopes.includes('credit-cards-accounts')) {
      cards.push({
        cardId: `card_${institutionId}_001`,
        cardType: 'CREDIT',
        cardName: `Cartão ${institution.name}`,
        cardNumber: `**** **** **** ${Math.floor(Math.random() * 9000) + 1000}`,
        status: 'ACTIVE',
        limit: this.generateRealisticBalance() * 2,
        availableLimit: this.generateRealisticBalance() * 1.4,
        currentBill: this.generateRealisticBalance() * 0.6,
        dueDate: this.generateDueDate(),
        closingDate: this.generateClosingDate(),
        institution: {
          id: institution.id,
          name: institution.name,
          compeCode: institution.compeCode || '',
        },
      });
    }

    return cards;
  }

  /**
   * Simula erro de API (para testar tratamento de erros)
   */
  async simulateError(
    errorType: 'NETWORK' | 'AUTH' | 'RATE_LIMIT' | 'INVALID_DATA'
  ): Promise<never> {
    await this.delay(1000);

    const errors = {
      NETWORK: {
        code: 'NETWORK_ERROR',
        message: 'Falha na conexão com a instituição',
      },
      AUTH: {
        code: 'AUTH_ERROR',
        message: 'Token de acesso inválido ou expirado',
      },
      RATE_LIMIT: {
        code: 'RATE_LIMIT',
        message: 'Limite de requisições excedido',
      },
      INVALID_DATA: {
        code: 'INVALID_DATA',
        message: 'Dados inválidos fornecidos',
      },
    };

    throw new Error(JSON.stringify(errors[errorType]));
  }

  // Métodos auxiliares para gerar dados realistas

  private generateRealisticBalance(): number {
    // Saldos realistas entre R$ 100 e R$ 50.000
    return Math.floor(Math.random() * 50000) + 100;
  }

  private generateOpeningDate(): string {
    const daysAgo = Math.floor(Math.random() * 365 * 3); // Últimos 3 anos
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

  private generateRealisticTransaction(
    accountId: string,
    date: Date
  ): SandboxTransaction {
    const transactionTypes = [
      'TRANSFER',
      'PAYMENT',
      'DEPOSIT',
      'PURCHASE',
      'WITHDRAWAL',
    ];
    const type =
      transactionTypes[Math.floor(Math.random() * transactionTypes.length)];

    const isCredit = type === 'DEPOSIT' || type === 'TRANSFER';
    const amount = Math.floor(Math.random() * 2000) + 10; // R$ 10 a R$ 2.000

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
      PURCHASE: ['Compra no débito', 'Saque no caixa', 'Compra online'],
      WITHDRAWAL: ['Saque no caixa', 'Saque no terminal'],
    };

    const categories = {
      TRANSFER: 'TRANSFER',
      PAYMENT: 'PAYMENT',
      DEPOSIT: 'DEPOSIT',
      PURCHASE: 'PURCHASE',
      WITHDRAWAL: 'WITHDRAWAL',
    };

    const merchants = [
      'Supermercado Extra',
      'Farmácia Pague Menos',
      'Posto Shell',
      'Restaurante Spoleto',
      'Uber',
      'Netflix',
      'Spotify',
      'Amazon',
      'Mercado Livre',
      'Magazine Luiza',
    ];

    return {
      transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      accountId,
      type: type as any,
      creditDebitType: isCredit ? 'CREDIT' : 'DEBIT',
      transactionAmount: isCredit ? amount : -amount,
      currency: 'BRL',
      transactionDate: date.toISOString(),
      description:
        descriptions[type][
          Math.floor(Math.random() * descriptions[type].length)
        ],
      category: categories[type],
      merchantName:
        type === 'PURCHASE'
          ? merchants[Math.floor(Math.random() * merchants.length)]
          : undefined,
      merchantCategory: type === 'PURCHASE' ? 'RETAIL' : undefined,
      location:
        type === 'PURCHASE'
          ? {
              city: 'São Paulo',
              state: 'SP',
              country: 'Brasil',
            }
          : undefined,
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Exportar instância singleton
export const sandboxService = SandboxService.getInstance();
