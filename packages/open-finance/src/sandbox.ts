/**
 * Configurações e utilitários para ambiente sandbox do Open Finance
 */
import axios from 'axios';
import { OpenFinanceClient } from './client';
import { OpenFinanceAuth } from './auth';
import { SandboxConfig, SandboxInstitution } from './types';

/**
 * Cliente para ambiente sandbox do Open Finance Brasil
 */
export class OpenFinanceSandbox {
  private config: SandboxConfig;
  private client: OpenFinanceClient;
  private auth: OpenFinanceAuth;

  /**
   * Lista de instituições financeiras disponíveis no ambiente sandbox
   */
  private institutions: SandboxInstitution[] = [
    {
      id: 'mock-bank-001',
      name: 'Banco Sandbox Mock',
      type: 'BANK',
      apiBaseUrl: 'https://api.sandbox.mockbank.com.br',
      authUrl: 'https://auth.sandbox.mockbank.com.br',
      clientId: 'sandbox-client-id',
      clientSecret: 'sandbox-client-secret',
      apiVersion: 'v2',
      scopes: [
        'openid',
        'accounts',
        'credit-cards-accounts',
        'customers',
        'consent',
      ],
      certificateRequired: false,
    },
    {
      id: 'mock-investment-001',
      name: 'Investimentos Sandbox',
      type: 'INVESTMENT',
      apiBaseUrl: 'https://api.sandbox.mockinvest.com.br',
      authUrl: 'https://auth.sandbox.mockinvest.com.br',
      clientId: 'sandbox-invest-id',
      clientSecret: 'sandbox-invest-secret',
      apiVersion: 'v1',
      scopes: ['openid', 'investments', 'consent'],
      certificateRequired: false,
    },
    {
      id: 'btg-pactual-001',
      name: 'BTG Pactual',
      type: 'BANK',
      apiBaseUrl: 'https://api.sandbox.btgpactual.com.br',
      authUrl: 'https://auth.sandbox.btgpactual.com.br',
      clientId: 'sandbox-btg-id',
      clientSecret: 'sandbox-btg-secret',
      apiVersion: 'v1',
      scopes: ['openid', 'accounts', 'investments', 'consent'],
      certificateRequired: false,
      // Este banco só registra receitas e investimentos, não despesas
      // Categorias exemplo:
      // Receitas: Renda-extra, Salário, Recebidos de PIX
      // Investimentos: Tesouro direto, Bitcoin, Ações, Fundos, ETFs
    },
  ];

  constructor(config: SandboxConfig = {}) {
    this.config = {
      useRealUrls: false,
      mockResponses: true,
      logRequests: true,
      delayResponseMs: 500,
      ...config,
    };

    this.client = new OpenFinanceClient({
      baseUrl: 'https://api.sandbox.openfinancebrasil.com.br',
      clientId: 'sandbox-client-id',
      clientSecret: 'sandbox-client-secret',
      useAuth: true,
      timeout: 10000,
      maxRetries: 3,
    });

    this.auth = new OpenFinanceAuth({
      baseUrl: 'https://auth.sandbox.openfinancebrasil.com.br',
      clientId: 'sandbox-client-id',
      clientSecret: 'sandbox-client-secret',
    });
  }

  /**
   * Lista as instituições disponíveis no ambiente sandbox
   */
  public listInstitutions(): SandboxInstitution[] {
    return this.institutions;
  }

  /**
   * Obtém uma instituição pelo ID
   */
  public getInstitution(id: string): SandboxInstitution | undefined {
    return this.institutions.find(inst => inst.id === id);
  }

  /**
   * Gera dados de conta bancária simulados para testes
   */
  public generateMockAccounts(
    userId: string,
    institutionId: string,
    count: number = 2
  ) {
    const institution = this.getInstitution(institutionId);
    if (!institution) {
      throw new Error(`Instituição não encontrada: ${institutionId}`);
    }

    const accounts = [];
    const accountTypes = ['CACC', 'SVGS', 'TRAN'];

    for (let i = 0; i < count; i++) {
      const accountType = accountTypes[i % accountTypes.length];
      const accountId = `mock-${userId.substring(0, 5)}-${institutionId}-${i}`;

      accounts.push({
        accountId,
        accountType,
        accountSubType: accountType === 'CACC' ? 'CONC' : 'SLRY',
        currency: 'BRL',
        nickname: `Conta ${i + 1}`,
        name: accountType === 'CACC' ? 'Conta Corrente' : 'Conta Poupança',
        balance: 1000 * (i + 1),
        available: 950 * (i + 1),
        overdraftLimit: accountType === 'CACC' ? 500 : 0,
        openingDate: new Date(Date.now() - i * 90 * 86400000)
          .toISOString()
          .split('T')[0],
        status: 'AVAILABLE',
        branch: '0001',
        number: `${10000 + i}`,
        institution: {
          name: institution.name,
          compeCode: '999',
          ispb: '99999999',
        },
      });
    }

    return accounts;
  }

  /**
   * Gera dados de transações bancárias simuladas para testes
   */
  public generateMockTransactions(accountId: string, count: number = 20) {
    const transactions = [];
    // Extrair institutionId do padrão do accountId: mock-<userId>-<institutionId>-<i>
    const parts = accountId.split('-');
    const institutionId = parts.length >= 4 ? parts[2] : '';
    const isBTG =
      institutionId === 'btg-pactual-001' || accountId.includes('btg-pactual');
    console.log(
      '[sandbox] Gerando transações para conta:',
      accountId,
      'InstitutionId:',
      institutionId,
      'É BTG?',
      isBTG
    );
    const today = new Date();

    if (isBTG) {
      console.log(
        '[sandbox] Gerando apenas receitas e investimentos para BTG Pactual'
      );
      // Categorias de receitas e investimentos
      const receitas = ['Salário', 'Renda-extra', 'Recebidos de PIX'];
      const investimentos = [
        'Tesouro Direto',
        'Bitcoin',
        'Ações',
        'Fundos Imobiliários',
        'ETFs',
        'Ativos Internacionais',
      ];
      for (let i = 0; i < count; i++) {
        const daysAgo = Math.floor(Math.random() * 60);
        const transactionDate = new Date(today);
        transactionDate.setDate(today.getDate() - daysAgo);
        // Alterna entre receita e investimento
        const isReceita = i % 2 === 0;
        let category = isReceita
          ? receitas[Math.floor(Math.random() * receitas.length)]
          : investimentos[Math.floor(Math.random() * investimentos.length)];
        const type = isReceita ? 'CREDIT' : 'INVESTMENT';
        const creditDebitType = 'CREDIT';
        const amount = Math.round((Math.random() * 4999 + 100) * 100) / 100;
        let description = category;
        if (category === 'Recebidos de PIX') {
          const nomesPix = [
            'Fulano',
            'Beltrano',
            'Ciclano',
            'Maria',
            'João',
            'Ana',
            'Carlos',
            'Fernanda',
          ];
          const nome = nomesPix[Math.floor(Math.random() * nomesPix.length)];
          description = `Transferência PIX recebida de ${nome}`;
        }
        console.log(
          `[sandbox] BTG: ${isReceita ? 'Receita' : 'Investimento'} - Categoria: ${category}`
        );
        transactions.push({
          transactionId: `tx-${accountId}-${i}`,
          accountId,
          type,
          creditDebitType,
          transactionAmount: amount,
          currency: 'BRL',
          transactionDate: transactionDate.toISOString(),
          valueDate: transactionDate.toISOString(),
          description,
          status: 'COMPLETED',
          merchant: {
            name: category,
            documentNumber: '12345678901234',
            documentType: 'CNPJ',
          },
        });
      }
    } else {
      console.log(
        '[sandbox] Gerando transações padrão (inclui despesas) para banco não-BTG'
      );
      // ...existing code...
      const transactionTypes = ['PIX', 'TED', 'PAYMENT', 'DEBIT', 'CREDIT'];
      const creditDebitTypes = ['CREDIT', 'DEBIT'];
      const parties = [
        'Mercado Livre',
        'Netflix',
        'Amazon',
        'Uber',
        'iFood',
        'Salário',
        'Transferência',
      ];
      for (let i = 0; i < count; i++) {
        const daysAgo = Math.floor(Math.random() * 60);
        const transactionDate = new Date(today);
        transactionDate.setDate(today.getDate() - daysAgo);
        const type =
          transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
        const creditDebitType =
          creditDebitTypes[Math.floor(Math.random() * creditDebitTypes.length)];
        const partyName = parties[Math.floor(Math.random() * parties.length)];
        const amount = Math.round((Math.random() * 999 + 1) * 100) / 100;
        transactions.push({
          transactionId: `tx-${accountId}-${i}`,
          accountId,
          type,
          creditDebitType,
          transactionAmount: amount,
          currency: 'BRL',
          transactionDate: transactionDate.toISOString(),
          valueDate: transactionDate.toISOString(),
          description: `${type} ${partyName}`,
          status: 'COMPLETED',
          merchant: {
            name: partyName,
            documentNumber: '12345678901234',
            documentType: 'CNPJ',
          },
        });
      }
    }

    // Ordenar por data, mais recente primeiro
    return transactions.sort(
      (a, b) =>
        new Date(b.transactionDate).getTime() -
        new Date(a.transactionDate).getTime()
    );
  }

  /**
   * Cria um consentimento simulado no ambiente sandbox
   */
  public async createMockConsent(userId: string, institutionId: string) {
    const institution = this.getInstitution(institutionId);

    if (!institution) {
      throw new Error(`Instituição não encontrada: ${institutionId}`);
    }

    // Calcular data de expiração (90 dias a partir de hoje)
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 90);

    // Data atual formatada
    const now = new Date().toISOString();

    // Se estamos usando respostas simuladas
    if (this.config.mockResponses) {
      // Simular delay de rede se configurado
      if (this.config.delayResponseMs) {
        await new Promise(resolve =>
          setTimeout(resolve, this.config.delayResponseMs)
        );
      }

      return {
        data: {
          consentId: `consent-${userId}-${institutionId}-${Date.now()}`,
          creationDateTime: now,
          expirationDateTime: expirationDate.toISOString(),
          statusUpdateDateTime: now,
          status: 'AWAITING_AUTHORIZATION',
          permissions: [
            'ACCOUNTS_READ',
            'ACCOUNTS_BALANCES_READ',
            'RESOURCES_READ',
          ],
          links: {
            self: `${institution.apiBaseUrl}/consents/v1/consents`,
          },
          meta: {
            totalRecords: 1,
            totalPages: 1,
            requestDateTime: now,
          },
        },
      };
    }

    // Caso contrário, fazer uma chamada real para o ambiente sandbox
    // Isso dependeria da implementação específica do sandbox da instituição
    const oauthConfig = {
      institutionId: institution.id,
      clientId: institution.clientId,
      clientSecret: institution.clientSecret,
      redirectUri:
        this.config.redirectUri || 'https://app.example.com/callback',
      authorizationEndpoint: `${institution.authUrl}/oauth/authorize`,
      tokenEndpoint: `${institution.authUrl}/oauth/token`,
      apiBaseUrl: institution.apiBaseUrl,
      scopes: institution.scopes,
    };

    const consentRequest = {
      data: {
        loggedUser: {
          document: {
            identification: userId,
            rel: 'CPF',
          },
        },
        permissions: [
          'ACCOUNTS_READ',
          'ACCOUNTS_BALANCES_READ',
          'RESOURCES_READ',
        ],
        expirationDateTime: expirationDate.toISOString(),
      },
    };

    return this.auth.createConsent(oauthConfig, consentRequest);
  }

  /**
   * Configura interceptors de log para debug do ambiente sandbox
   */
  public enableDebugLogging() {
    if (this.config.logRequests) {
      // Setup axios request logger
      axios.interceptors.request.use(request => {
        console.log('Sandbox API Request:', {
          method: request.method?.toUpperCase(),
          url: request.url,
          headers: request.headers,
          data: request.data,
        });
        return request;
      });

      // Setup axios response logger
      axios.interceptors.response.use(
        response => {
          console.log('Sandbox API Response:', {
            status: response.status,
            statusText: response.statusText,
            data: response.data,
            headers: response.headers,
          });
          return response;
        },
        error => {
          console.error('Sandbox API Error:', {
            message: error.message,
            response: error.response?.data,
          });
          return Promise.reject(error);
        }
      );
    }
  }
}

/**
 * Cria uma instância pré-configurada do cliente sandbox
 *
 * @param config Configuração opcional do ambiente sandbox
 * @returns Cliente sandbox configurado
 */
export function createSandboxClient(
  config?: SandboxConfig
): OpenFinanceSandbox {
  return new OpenFinanceSandbox(config);
}
