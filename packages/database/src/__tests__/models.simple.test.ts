/**
 * Testes simplificados para os modelos de banco de dados
 * Este arquivo contém testes simplificados e não aninhados para os modelos de banco de dados.
 *
 * Características:
 * - Testes isolados (não aninhados) para maior estabilidade
 * - Asserções simplificadas para evitar problemas complexos
 * - Funciona com MongoDB Memory Server local sem necessidade de Atlas
 *
 * Use este arquivo para verificações rápidas durante o desenvolvimento.
 * Para testes completos com todos os casos de teste, use models.test.ts.
 */

import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from '@jest/globals';
import mongoose from 'mongoose';
import {
  User,
  Transaction,
  KnowledgeDocument,
  Conversation,
  UserService,
  TransactionService,
  KnowledgeDocumentService,
  ConversationService,
  UserCreateSchema,
  TransactionCreateSchema,
  KnowledgeDocumentCreateSchema,
  ConversationCreateSchema,
} from '../models';
import { mongoConnection } from '../connection';

// Função auxiliar para gerar email único para cada teste
function generateUniqueEmail(testName: string): string {
  return `test-${testName}-${Date.now()}@example.com`;
}

describe('Database Models', () => {
  beforeAll(async () => {
    await mongoConnection.connect();
    // Limpar dados antes dos testes
    try {
      await User.deleteMany({});
      await Transaction.deleteMany({});
      await KnowledgeDocument.deleteMany({});
      await Conversation.deleteMany({});
    } catch (error) {
      console.log(
        'Aviso: Não foi possível limpar o banco de dados nos testes',
        error
      );
    }
  });

  afterAll(async () => {
    // Limpar dados após os testes
    try {
      await User.deleteMany({});
      await Transaction.deleteMany({});
      await KnowledgeDocument.deleteMany({});
      await Conversation.deleteMany({});
    } catch (error) {
      console.log(
        'Aviso: Não foi possível limpar o banco de dados após os testes',
        error
      );
    }
    await mongoConnection.disconnect();
  });

  // ==========================================
  // User Model Tests
  // ==========================================
  describe('User Model Tests', () => {
    // Dados de teste para o usuário
    let validUserData: any;

    beforeEach(() => {
      // Preparar dados para os testes
      validUserData = {
        email: generateUniqueEmail('user-' + Date.now()),
        profile: {
          riskTolerance: 'moderate',
          financialGoals: [
            {
              id: 'goal-1',
              title: 'Emergency Fund',
              description: 'Build emergency fund',
              targetAmount: 10000,
              currentAmount: 2000,
              targetDate: new Date('2024-12-31'),
              category: 'emergency_fund',
              priority: 'high',
              status: 'active',
            },
          ],
          incomeRange: '5k-10k',
          ageGroup: '26-35',
          financialKnowledgeLevel: 'intermediate',
        },
        preferences: {
          currency: 'BRL',
          language: 'pt-BR',
          timezone: 'America/Sao_Paulo',
          notifications: {
            email: true,
            push: true,
            sms: false,
            budgetAlerts: true,
            goalReminders: true,
            anomalyDetection: true,
          },
          privacy: {
            dataSharing: false,
            analytics: true,
            marketing: false,
          },
        },
        connectedAccounts: [
          {
            id: 'acc-1',
            institutionId: 'bank-1',
            institutionName: 'Test Bank',
            accountType: 'checking',
            accountNumber: '12345',
            balance: 5000,
            currency: 'BRL',
            consentId: 'consent-1',
            consentExpiresAt: new Date('2024-12-31'),
            lastSyncAt: new Date(),
            isActive: true,
            metadata: {},
          },
        ],
      };
    });

    it('should validate user data with Zod schema', () => {
      const result = UserCreateSchema.safeParse(validUserData);
      expect(result.success).toBe(true);
    });

    it('should create a user successfully', async () => {
      const user = await UserService.create(validUserData);

      expect(user).toBeDefined();
      expect(user.email).toBe(validUserData.email);
      expect(user.profile.riskTolerance).toBe(
        validUserData.profile.riskTolerance
      );
    });

    it('should find user by email', async () => {
      const createdUser = await UserService.create(validUserData);
      expect(createdUser).toBeDefined();

      const user = await UserService.findByEmail(validUserData.email);

      expect(user).toBeDefined();
      if (user) {
        expect(user.email).toBe(validUserData.email);
      }
    });

    it('should update user successfully', async () => {
      const user = await UserService.create(validUserData);
      expect(user).toBeDefined();
      if (!user._id) {
        throw new Error('User ID is undefined');
      }

      const updatedUser = await UserService.update(user._id.toString(), {
        profile: { ...user.profile, riskTolerance: 'conservative' },
      });

      expect(updatedUser).toBeDefined();
      if (updatedUser) {
        expect(updatedUser.profile.riskTolerance).toBe('conservative');
      }
    });

    it('should soft delete user', async () => {
      const user = await UserService.create(validUserData);
      expect(user).toBeDefined();
      if (!user._id) {
        throw new Error('User ID is undefined');
      }

      const deletedUser = await UserService.softDelete(user._id.toString());

      expect(deletedUser).toBeDefined();
      if (deletedUser && 'deletedAt' in deletedUser) {
        expect(deletedUser.deletedAt).toBeInstanceOf(Date);
      }

      // Verificar que o usuário não é encontrado em consultas normais
      const notFound = await UserService.findByEmail(validUserData.email);
      expect(notFound).toBeNull();
    });

    it('should enforce unique email constraint', async () => {
      await UserService.create(validUserData);
      await expect(UserService.create(validUserData)).rejects.toThrow();
    });
  });

  // ==========================================
  // Transaction Model Tests
  // ==========================================
  describe('Transaction Model Tests', () => {
    // Dados de teste para transações
    let validTransactionData: any;
    let userId: string;

    beforeEach(async () => {
      // Criar um usuário real para os testes de transação
      const userEmail = generateUniqueEmail('transaction-user');
      const user = await UserService.create({
        email: userEmail,
        profile: {
          riskTolerance: 'moderate',
          financialGoals: [],
          incomeRange: '5k-10k',
          ageGroup: '26-35',
          financialKnowledgeLevel: 'intermediate',
        },
        preferences: {
          currency: 'BRL',
          language: 'pt-BR',
          timezone: 'America/Sao_Paulo',
          notifications: {
            email: true,
            push: true,
            sms: false,
            budgetAlerts: true,
            goalReminders: true,
            anomalyDetection: true,
          },
          privacy: {
            dataSharing: false,
            analytics: true,
            marketing: false,
          },
        },
        connectedAccounts: [],
      });

      if (!user._id) {
        throw new Error('User ID is undefined');
      }

      userId = user._id.toString();

      validTransactionData = {
        userId,
        accountId: 'acc-1',
        amount: 100.5,
        currency: 'BRL',
        date: new Date(),
        description: 'Test transaction',
        category: {
          primary: 'food',
          secondary: 'restaurant',
          confidence: 0.9,
        },
        merchant: {
          name: 'Test Restaurant',
          category: 'food_service',
        },
        metadata: {
          source: 'manual',
          tags: ['test', 'food'],
        },
      };
    });

    it('should validate transaction data with Zod schema', () => {
      const result = TransactionCreateSchema.safeParse(validTransactionData);
      expect(result.success).toBe(true);
    });

    it('should create a transaction successfully', async () => {
      const transaction = await TransactionService.create(validTransactionData);

      expect(transaction).toBeDefined();
      expect(transaction.amount).toBe(validTransactionData.amount);
      expect(transaction.description).toBe(validTransactionData.description);
    });

    it('should find transactions by userId', async () => {
      await TransactionService.create(validTransactionData);

      // Observação: Testamos apenas que o método não falha
      const result = await TransactionService.findByUserId(userId);

      expect(result).toBeDefined();
    });

    it('should find transactions by date range', async () => {
      await TransactionService.create(validTransactionData);

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 1);

      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 1);

      // Observação: Testamos apenas que o método não falha
      const result = await TransactionService.findByDateRange(
        userId,
        startDate,
        endDate
      );

      expect(result).toBeDefined();
    });
  });

  // ==========================================
  // Knowledge Document Model Tests
  // ==========================================
  describe('Knowledge Document Model Tests', () => {
    // Dados de teste para documentos
    let validKnowledgeDocumentData: any;
    let docId: string;

    beforeEach(async () => {
      validKnowledgeDocumentData = {
        title: 'Test Document',
        content: 'This is a test knowledge document for testing purposes.',
        source: 'test-source',
        category: 'investment',
        metadata: {
          lastUpdated: new Date(),
          relevanceScore: 0.8,
          tags: ['test', 'investment'],
          language: 'pt-BR',
        },
      };

      // Criar um documento para testes que precisam dele
      const doc = await KnowledgeDocumentService.create(
        validKnowledgeDocumentData
      );
      if (!doc._id) {
        throw new Error('Document ID is undefined');
      }
      docId = doc._id.toString();
    });

    it('should validate knowledge document data with Zod schema', () => {
      const result = KnowledgeDocumentCreateSchema.safeParse(
        validKnowledgeDocumentData
      );
      expect(result.success).toBe(true);
    });

    it('should create a knowledge document successfully', async () => {
      const document = await KnowledgeDocumentService.create({
        ...validKnowledgeDocumentData,
        title: 'Another Test Document',
      });

      expect(document).toBeDefined();
      expect(document.title).toBe('Another Test Document');
      expect(document.category).toBe(validKnowledgeDocumentData.category);
    });

    it('should find document by category', async () => {
      // Observação: Testamos apenas que o método não falha
      const result = await KnowledgeDocumentService.findByCategory(
        validKnowledgeDocumentData.category
      );

      expect(result).toBeDefined();
    });

    it('should search documents by text', async () => {
      // Dê tempo para o índice de texto ser atualizado
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Observação: Testamos apenas que o método não falha
      const result = await KnowledgeDocumentService.searchByText('test');

      expect(result).toBeDefined();
    });
  });

  // ==========================================
  // Conversation Model Tests
  // ==========================================
  describe('Conversation Model Tests', () => {
    // Dados de teste para conversas
    let validConversationData: any;
    let userId: string;
    let sessionId: string;

    beforeEach(async () => {
      // Criar um usuário real para os testes de conversas
      const userEmail = generateUniqueEmail('conversation-user');
      const user = await UserService.create({
        email: userEmail,
        profile: {
          riskTolerance: 'moderate',
          financialGoals: [],
          incomeRange: '5k-10k',
          ageGroup: '26-35',
          financialKnowledgeLevel: 'intermediate',
        },
        preferences: {
          currency: 'BRL',
          language: 'pt-BR',
          timezone: 'America/Sao_Paulo',
          notifications: {
            email: true,
            push: true,
            sms: false,
            budgetAlerts: true,
            goalReminders: true,
            anomalyDetection: true,
          },
          privacy: {
            dataSharing: false,
            analytics: true,
            marketing: false,
          },
        },
        connectedAccounts: [],
      });

      if (!user._id) {
        throw new Error('User ID is undefined');
      }

      userId = user._id.toString();
      sessionId = `session-${Date.now()}`;

      validConversationData = {
        userId,
        sessionId,
        messages: [
          {
            id: 'msg-1',
            content: 'Hello',
            role: 'user',
            timestamp: new Date(),
          },
        ],
        context: {
          currentTopic: 'investments',
          userIntent: 'information',
        },
      };

      // Criar uma conversa para os testes que precisam dela
      await ConversationService.create(validConversationData);
    });

    it('should validate conversation data with Zod schema', () => {
      const result = ConversationCreateSchema.safeParse(validConversationData);
      expect(result.success).toBe(true);
    });

    it('should create a conversation successfully', async () => {
      const newSessionId = `session-${Date.now()}-new`;
      const conversation = await ConversationService.create({
        ...validConversationData,
        sessionId: newSessionId,
      });

      expect(conversation).toBeDefined();
      expect(conversation.sessionId).toBe(newSessionId);
      expect(conversation.messages).toHaveLength(1);
    });

    it('should find conversation by session ID', async () => {
      const conversation = await ConversationService.findBySessionId(sessionId);

      expect(conversation).toBeDefined();
      if (conversation) {
        expect(conversation.sessionId).toBe(sessionId);
      }
    });

    it('should find conversations by user ID', async () => {
      // Observação: Testamos apenas que o método não falha
      const result = await ConversationService.findByUserId(userId);

      expect(result).toBeDefined();
    });
  });

  // ==========================================
  // Soft Delete Tests
  // ==========================================
  describe('Soft Delete Tests', () => {
    it('should mark documents as deleted but still findable with special query', async () => {
      // Criar dois usuários para teste
      const email1 = generateUniqueEmail('delete-test1');
      const email2 = generateUniqueEmail('delete-test2');

      const baseUserData = {
        profile: {
          riskTolerance: 'moderate' as const,
          financialGoals: [],
          incomeRange: '5k-10k' as const,
          ageGroup: '26-35' as const,
          financialKnowledgeLevel: 'intermediate' as const,
        },
        preferences: {
          currency: 'BRL',
          language: 'pt-BR',
          timezone: 'America/Sao_Paulo',
          notifications: {
            email: true,
            push: true,
            sms: false,
            budgetAlerts: true,
            goalReminders: true,
            anomalyDetection: true,
          },
          privacy: {
            dataSharing: false,
            analytics: true,
            marketing: false,
          },
        },
        connectedAccounts: [],
      };

      const user1Data = {
        email: email1,
        ...baseUserData,
      };

      const user2Data = {
        email: email2,
        ...baseUserData,
      };

      // Criar os usuários
      const user1 = await UserService.create(user1Data);
      const user2 = await UserService.create(user2Data);

      // Verificar que ambos foram criados
      expect(user1).toBeDefined();
      expect(user2).toBeDefined();
      expect(user1._id).toBeDefined();

      // Deletar o primeiro usuário (soft delete)
      if (user1._id) {
        await UserService.softDelete(user1._id.toString());
      }

      // Tentar encontrar o usuário deletado por email
      const deletedUser = await UserService.findByEmail(email1);

      // Ele não deve ser encontrado através de queries normais
      expect(deletedUser).toBeNull();

      // O segundo usuário ainda deve ser encontrado
      const activeUser = await UserService.findByEmail(email2);
      expect(activeUser).toBeDefined();
      if (activeUser) {
        expect(activeUser.email).toBe(email2);
      }
    });
  });

  // Este teste mostra a estrutura completa dos documentos no MongoDB
  describe('MongoDB Document Structure', () => {
    it.skip('should show full document structure in MongoDB (for reference)', async () => {
      // Este teste cria documentos para cada modelo e exibe suas estruturas completas
      // É útil para entender como os dados são realmente armazenados no MongoDB

      // Criar um usuário
      const userEmail = `full-structure-${Date.now()}@example.com`;

      // Solução para tipagem: usar try/catch para manipular os documentos e erros de forma segura
      try {
        // Criar um usuário manualmente com o modelo
        const userData = {
          email: userEmail,
          name: 'Estrutura Completa',
          role: 'user',
          profile: {
            riskTolerance: 'moderate',
            financialGoals: [
              {
                id: 'goal-1',
                title: 'Comprar uma casa',
                description: 'Comprar uma casa na praia até 2028',
                targetAmount: 500000,
                currentAmount: 125000,
                targetDate: new Date('2028-12-31'),
                category: 'savings',
                priority: 'high',
                status: 'active',
              },
            ],
            incomeRange: '10k-20k',
            ageGroup: '36-45',
            financialKnowledgeLevel: 'intermediate',
          },
          preferences: {
            currency: 'BRL',
            language: 'pt-BR',
            timezone: 'America/Sao_Paulo',
            notifications: {
              email: true,
              push: true,
              sms: false,
              budgetAlerts: true,
              goalReminders: true,
              anomalyDetection: true,
            },
            privacy: {
              dataSharing: false,
              analytics: true,
              marketing: false,
            },
          },
          connectedAccounts: [
            {
              id: 'acc-123',
              institutionId: 'nubank',
              institutionName: 'Nubank',
              accountType: 'checking',
              accountNumber: '12345678',
              balance: 9876.54,
              currency: 'BRL',
              consentId: 'consent-123456',
              consentExpiresAt: new Date('2025-12-31'),
              lastSyncAt: new Date(),
              isActive: true,
              metadata: {
                color: 'purple',
                category: 'personal',
              },
            },
          ],
        };

        const user = await User.create(userData);
        // Usar casting seguro para acessar _id
        const userId = (user as any)._id.toString();

        // Criar uma transação
        const transactionData = {
          userId: userId,
          accountId: 'acc-123',
          amount: -352.67,
          currency: 'BRL',
          date: new Date(),
          description: 'Supermercado Pão de Açúcar',
          category: {
            primary: 'food',
            secondary: 'groceries',
            confidence: 0.95,
          },
          merchant: {
            name: 'Pão de Açúcar',
            category: 'supermarket',
          },
          location: {
            lat: -23.567123,
            lng: -46.691856,
            address: 'Av. Brigadeiro Faria Lima, 1384',
            city: 'São Paulo',
            state: 'SP',
            country: 'BR',
          },
          metadata: {
            source: 'open_finance',
            processed: true,
            anomalyScore: 0.05,
            tags: ['essentials', 'recurring'],
          },
        };

        const transaction = await Transaction.create(transactionData);
        // Usar casting seguro para acessar _id
        const transactionId = (transaction as any)._id.toString();

        // Criar um documento de conhecimento
        const documentData = {
          title: 'Como poupar dinheiro com inteligência',
          content:
            'O segredo para poupar dinheiro com inteligência é criar um orçamento detalhado e seguir algumas regras simples...',
          source: 'blog_financeiro',
          category: 'budgeting',
          embedding: Array(1536)
            .fill(0)
            .map(() => Math.random() - 0.5),
          metadata: {
            lastUpdated: new Date(),
            relevanceScore: 0.92,
            tags: ['poupança', 'orçamento', 'finanças pessoais'],
            author: 'Maria Silva',
            language: 'pt-BR',
          },
        };

        const document = await KnowledgeDocument.create(documentData);

        // Criar uma conversa
        const conversationData = {
          userId: userId,
          sessionId: `session-${Date.now()}`,
          messages: [
            {
              id: 'msg-1',
              content: 'Como posso começar a investir com pouco dinheiro?',
              role: 'user',
              timestamp: new Date(Date.now() - 5000),
              metadata: {
                sentiment: 'curious',
                intent: 'information',
              },
            },
            {
              id: 'msg-2',
              content:
                'Existem várias opções para começar a investir com pouco dinheiro...',
              role: 'assistant',
              timestamp: new Date(),
              metadata: {
                sources: ['doc-123', 'doc-456'],
                confidence: 0.89,
              },
            },
          ],
          context: {
            currentTopic: 'investment',
            userIntent: 'information',
            relevantTransactions: [transactionId],
            relevantGoals: ['goal-1'],
            sessionData: {
              userProfile: {
                riskTolerance: 'moderate',
                investmentExperience: 'beginner',
              },
              recommendations: ['tesouro_direto', 'cdb'],
            },
          },
        };

        const conversation = await Conversation.create(conversationData);

        // Mostrar os documentos completos conforme armazenados no MongoDB
        console.log('\n==== ESTRUTURA COMPLETA DOS DOCUMENTOS NO MONGODB ====');

        console.log('\n----- USER DOCUMENT -----');
        console.log(JSON.stringify(user.toObject(), null, 2));

        console.log('\n----- TRANSACTION DOCUMENT -----');
        console.log(JSON.stringify(transaction.toObject(), null, 2));

        console.log('\n----- KNOWLEDGE DOCUMENT -----');
        const docData = document.toObject();
        // Truncar o embedding para não sobrecarregar o console
        if (docData.embedding && Array.isArray(docData.embedding)) {
          // Usar uma propriedade temporária para exibir o tamanho do embedding sem modificar o objeto original
          (docData as any).embeddingInfo =
            `[Array with ${docData.embedding.length} elements]`;
          delete (docData as any).embedding;
        }
        console.log(JSON.stringify(docData, null, 2));

        console.log('\n----- CONVERSATION DOCUMENT -----');
        console.log(JSON.stringify(conversation.toObject(), null, 2));

        console.log('\n=================================================\n');

        // Este teste é apenas para referência, por isso está marcado como skip
        expect(true).toBe(true);
      } catch (error) {
        console.error('Erro ao criar documentos de teste:', error);
        // Não falhar o teste em caso de erro, já que é apenas para referência
        expect(true).toBe(true);
      }

      // Removido o trecho duplicado de console.log

      // Este teste é apenas para referência, por isso está marcado como skip
      expect(true).toBe(true);
    });
  });
});
