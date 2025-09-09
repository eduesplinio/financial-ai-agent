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

describe('Database Models', () => {
  beforeAll(async () => {
    await mongoConnection.connect();
    // Limpar dados antes dos testes
    try {
      await Promise.allSettled([
        User.deleteMany({}),
        Transaction.deleteMany({}),
        KnowledgeDocument.deleteMany({}),
        Conversation.deleteMany({}),
      ]);
    } catch (error) {
      console.log(
        'Aviso: Não foi possível limpar o banco de dados nos testes',
        error
      );
    }
  });

  afterAll(async () => {
    // Clean up test data
    try {
      await Promise.allSettled([
        User.deleteMany({}),
        Transaction.deleteMany({}),
        KnowledgeDocument.deleteMany({}),
        Conversation.deleteMany({}),
      ]);
    } catch (error) {
      console.log(
        'Aviso: Não foi possível limpar o banco de dados nos testes',
        error
      );
    }
    await mongoConnection.disconnect();
  });

  beforeEach(async () => {
    // Verificar a conexão entre os testes
    if (!mongoConnection.isConnected()) {
      await mongoConnection.connect();
    }
    
    // Limpar dados antes de cada teste para evitar conflitos de chaves duplicadas
    try {
      await Promise.all([
        User.deleteMany({}),
        Transaction.deleteMany({}),
        KnowledgeDocument.deleteMany({}),
        Conversation.deleteMany({}),
      ]);
    } catch (error) {
      console.log('Aviso: Não foi possível limpar o banco de dados entre os testes', error);
    }
  });

  describe('User Model', () => {
    // Função auxiliar para gerar email único para cada teste
    const generateUniqueEmail = (testName: string) => `test-${testName}-${Date.now()}@example.com`;
    
    const validUserData = {
      email: generateUniqueEmail('validUser'),
      profile: {
        riskTolerance: 'moderate' as const,
        financialGoals: [
          {
            id: 'goal-1',
            title: 'Emergency Fund',
            description: 'Build emergency fund',
            targetAmount: 10000,
            currentAmount: 2000,
            targetDate: new Date('2024-12-31'),
            category: 'emergency_fund' as const,
            priority: 'high' as const,
            status: 'active' as const,
          },
        ],
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
      connectedAccounts: [
        {
          id: 'acc-1',
          institutionId: 'bank-1',
          institutionName: 'Test Bank',
          accountType: 'checking' as const,
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
      expect(user.profile.financialGoals).toHaveLength(1);
      expect(user.connectedAccounts).toHaveLength(1);
    });

    it('should find user by email', async () => {
      await UserService.create(validUserData);
      const user = await UserService.findByEmail(validUserData.email);

      expect(user).toBeDefined();
      expect(user?.email).toBe(validUserData.email);
    });

    it('should update user successfully', async () => {
      const user = await UserService.create(validUserData);
      const updatedUser = await UserService.update(user._id.toString(), {
        profile: {
          ...validUserData.profile,
          riskTolerance: 'aggressive',
        },
      });

      expect(updatedUser?.profile.riskTolerance).toBe('aggressive');
    });

    it('should soft delete user', async () => {
      const user = await UserService.create(validUserData);
      const deletedUser = await UserService.softDelete(user._id.toString());

      expect(deletedUser?.deletedAt).toBeDefined();

      // Should not find deleted user in normal queries
      const foundUser = await UserService.findById(user._id.toString());
      expect(foundUser).toBeNull();
    });

    it('should enforce unique email constraint', async () => {
      await UserService.create(validUserData);

      await expect(UserService.create(validUserData)).rejects.toThrow();
    });
  });

  describe('Transaction Model', () => {
    let userId: string;

    beforeEach(async () => {
      const user = await UserService.create({
        email: 'test@example.com',
        profile: {
          riskTolerance: 'moderate' as const,
          financialGoals: [],
          incomeRange: '5k-10k' as const,
          ageGroup: '26-35' as const,
          financialKnowledgeLevel: 'intermediate' as const,
        },
      });
      userId = user._id.toString();
    });

    const validTransactionData = {
      userId: '',
      accountId: 'acc-1',
      amount: -50.0,
      currency: 'BRL',
      date: new Date(),
      description: 'Grocery shopping',
      category: {
        primary: 'food',
        secondary: 'groceries',
        confidence: 0.95,
      },
      merchant: {
        name: 'Supermarket ABC',
        category: 'grocery',
      },
      location: {
        lat: -23.5505,
        lng: -46.6333,
        address: 'São Paulo, SP',
        city: 'São Paulo',
        state: 'SP',
        country: 'BR',
      },
      metadata: {
        source: 'open_finance' as const,
        processed: true,
        tags: ['grocery', 'food'],
      },
    };

    it('should validate transaction data with Zod schema', () => {
      const data = { ...validTransactionData, userId };
      const result = TransactionCreateSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should create a transaction successfully', async () => {
      const data = { ...validTransactionData, userId };
      const transaction = await TransactionService.create(data);

      expect(transaction).toBeDefined();
      expect(transaction.userId.toString()).toBe(userId);
      expect(transaction.amount).toBe(-50.0);
      expect(transaction.description).toBe('Grocery shopping');
      expect(transaction.category?.primary).toBe('food');
    });

    it('should find transactions by user ID', async () => {
      const data = { ...validTransactionData, userId };
      await TransactionService.create(data);
      await TransactionService.create({
        ...data,
        amount: -30.0,
        description: 'Coffee',
      });

      const result = await TransactionService.findByUserId(userId);

      expect(result.transactions).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it('should find transactions by date range', async () => {
      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

      const data = { ...validTransactionData, userId };
      await TransactionService.create({ ...data, date: yesterday });
      await TransactionService.create({ ...data, date: today });
      await TransactionService.create({ ...data, date: tomorrow });

      const transactions = await TransactionService.findByDateRange(
        userId,
        yesterday,
        today
      );

      expect(transactions).toHaveLength(2);
    });

    it('should get spending by category', async () => {
      const data = { ...validTransactionData, userId };
      await TransactionService.create({
        ...data,
        amount: -100,
        category: { primary: 'food', confidence: 0.9 },
      });
      await TransactionService.create({
        ...data,
        amount: -50,
        category: { primary: 'food', confidence: 0.9 },
      });
      await TransactionService.create({
        ...data,
        amount: -200,
        category: { primary: 'transport', confidence: 0.9 },
      });

      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = new Date();

      const spending = await TransactionService.getSpendingByCategory(
        userId,
        startDate,
        endDate
      );

      expect(spending).toHaveLength(2);
      expect(spending[0]._id).toBe('transport');
      expect(spending[0].totalAmount).toBe(200);
      expect(spending[1]._id).toBe('food');
      expect(spending[1].totalAmount).toBe(150);
    });
  });

  describe('Knowledge Document Model', () => {
    const validDocumentData = {
      title: 'Introduction to Investment',
      content: 'This is a comprehensive guide to investment basics...',
      source: 'https://example.com/investment-guide',
      category: 'investment' as const,
      metadata: {
        lastUpdated: new Date(),
        relevanceScore: 0.8,
        tags: ['investment', 'beginner', 'guide'],
        author: 'Financial Expert',
        language: 'pt-BR',
        wordCount: 1500,
        readingTime: 7,
      },
    };

    it('should validate document data with Zod schema', () => {
      const result = KnowledgeDocumentCreateSchema.safeParse(validDocumentData);
      expect(result.success).toBe(true);
    });

    it('should create a knowledge document successfully', async () => {
      const doc = await KnowledgeDocumentService.create(validDocumentData);

      expect(doc).toBeDefined();
      expect(doc.title).toBe(validDocumentData.title);
      expect(doc.category).toBe(validDocumentData.category);
      expect(doc.metadata.tags).toEqual(validDocumentData.metadata.tags);
    });

    it('should find documents by category', async () => {
      await KnowledgeDocumentService.create(validDocumentData);
      await KnowledgeDocumentService.create({
        ...validDocumentData,
        title: 'Budgeting Basics',
        category: 'budgeting',
      });

      const result =
        await KnowledgeDocumentService.findByCategory('investment');

      expect(result.documents).toHaveLength(1);
      expect(result.documents[0].category).toBe('investment');
    });

    it('should search documents by text', async () => {
      await KnowledgeDocumentService.create(validDocumentData);
      await KnowledgeDocumentService.create({
        ...validDocumentData,
        title: 'Advanced Trading Strategies',
        content: 'Advanced techniques for trading in financial markets...',
      });

      const documents =
        await KnowledgeDocumentService.searchByText('investment');

      expect(documents.length).toBeGreaterThan(0);
    });
  });

  describe('Conversation Model', () => {
    let userId: string;

    beforeEach(async () => {
      const user = await UserService.create({
        email: 'test@example.com',
        profile: {
          riskTolerance: 'moderate' as const,
          financialGoals: [],
          incomeRange: '5k-10k' as const,
          ageGroup: '26-35' as const,
          financialKnowledgeLevel: 'intermediate' as const,
        },
      });
      userId = user._id.toString();
    });

    const validConversationData = {
      userId: '',
      sessionId: 'session-123',
      messages: [
        {
          id: 'msg-1',
          content: 'How can I improve my savings?',
          role: 'user' as const,
          timestamp: new Date(),
          sources: [
            {
              id: 'doc-1',
              title: 'Savings Guide',
              url: 'https://example.com/savings',
              relevanceScore: 0.9,
            },
          ],
        },
      ],
      context: {
        currentTopic: 'savings',
        userIntent: 'information' as const,
        relevantTransactions: ['trans-1', 'trans-2'],
        relevantGoals: ['goal-1'],
        sessionData: { lastActivity: new Date() },
      },
    };

    it('should validate conversation data with Zod schema', () => {
      const data = { ...validConversationData, userId };
      const result = ConversationCreateSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('should create a conversation successfully', async () => {
      const data = { ...validConversationData, userId };
      const conversation = await ConversationService.create(data);

      expect(conversation).toBeDefined();
      expect(conversation.userId.toString()).toBe(userId);
      expect(conversation.sessionId).toBe('session-123');
      expect(conversation.messages).toHaveLength(1);
      expect(conversation.context.currentTopic).toBe('savings');
    });

    it('should find conversation by session ID', async () => {
      const data = { ...validConversationData, userId };
      await ConversationService.create(data);

      const conversation =
        await ConversationService.findBySessionId('session-123');

      expect(conversation).toBeDefined();
      expect(conversation?.sessionId).toBe('session-123');
    });

    it('should add message to conversation', async () => {
      const data = { ...validConversationData, userId };
      await ConversationService.create(data);

      const newMessage = {
        id: 'msg-2',
        content: 'Thank you for the advice!',
        role: 'user' as const,
        timestamp: new Date(),
      };

      const updatedConversation = await ConversationService.addMessage(
        'session-123',
        newMessage
      );

      expect(updatedConversation?.messages).toHaveLength(2);
      expect(updatedConversation?.messages[1].content).toBe(
        'Thank you for the advice!'
      );
    });

    it('should update conversation context', async () => {
      const data = { ...validConversationData, userId };
      await ConversationService.create(data);

      const newContext = {
        currentTopic: 'investment',
        userIntent: 'recommendation' as const,
        relevantTransactions: ['trans-3'],
        relevantGoals: ['goal-2'],
        sessionData: { preference: 'aggressive' },
      };

      const updatedConversation = await ConversationService.updateContext(
        'session-123',
        newContext
      );

      expect(updatedConversation?.context.currentTopic).toBe('investment');
      expect(updatedConversation?.context.userIntent).toBe('recommendation');
    });

    it('should find conversations by user ID', async () => {
      const data1 = {
        ...validConversationData,
        userId,
        sessionId: 'session-1',
      };
      const data2 = {
        ...validConversationData,
        userId,
        sessionId: 'session-2',
      };

      await ConversationService.create(data1);
      await ConversationService.create(data2);

      const result = await ConversationService.findByUserId(userId);

      expect(result.conversations).toHaveLength(2);
      expect(result.total).toBe(2);
    });
  });

  describe('Soft Delete Functionality', () => {
    it('should exclude soft deleted documents from queries', async () => {
      const user = await UserService.create({
        email: 'test@example.com',
        profile: {
          riskTolerance: 'moderate' as const,
          financialGoals: [],
          incomeRange: '5k-10k' as const,
          ageGroup: '26-35' as const,
          financialKnowledgeLevel: 'intermediate' as const,
        },
      });

      // Soft delete the user
      await UserService.softDelete(user._id.toString());

      // Should not find the user in normal queries
      const foundUser = await User.findById(user._id);
      expect(foundUser).toBeNull();

      // Should find the user when explicitly including deleted
      const deletedUser = await User.findOne({
        _id: user._id,
        deletedAt: { $exists: true },
      });
      expect(deletedUser).toBeDefined();
      expect(deletedUser?.deletedAt).toBeDefined();
    });
  });
});
