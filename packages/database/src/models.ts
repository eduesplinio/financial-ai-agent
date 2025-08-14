import mongoose, { Schema, Document, Model } from 'mongoose';
import { z } from 'zod';

// =============================================================================
// ZOD VALIDATION SCHEMAS
// =============================================================================

// User schemas
export const UserProfileSchema = z.object({
  riskTolerance: z.enum(['conservative', 'moderate', 'aggressive']),
  financialGoals: z.array(z.object({
    id: z.string(),
    title: z.string().min(1).max(200),
    description: z.string().max(1000).optional(),
    targetAmount: z.number().positive(),
    currentAmount: z.number().min(0).default(0),
    targetDate: z.date(),
    category: z.enum(['savings', 'investment', 'debt_payment', 'purchase', 'emergency_fund']),
    priority: z.enum(['low', 'medium', 'high']),
    status: z.enum(['active', 'completed', 'paused', 'cancelled']).default('active'),
  })),
  incomeRange: z.enum(['0-2k', '2k-5k', '5k-10k', '10k-20k', '20k+']),
  ageGroup: z.enum(['18-25', '26-35', '36-45', '46-55', '56-65', '65+']),
  financialKnowledgeLevel: z.enum(['beginner', 'intermediate', 'advanced']),
});

export const UserPreferencesSchema = z.object({
  currency: z.string().default('BRL'),
  language: z.string().default('pt-BR'),
  timezone: z.string().default('America/Sao_Paulo'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(true),
    sms: z.boolean().default(false),
    budgetAlerts: z.boolean().default(true),
    goalReminders: z.boolean().default(true),
    anomalyDetection: z.boolean().default(true),
  }).default({}),
  privacy: z.object({
    dataSharing: z.boolean().default(false),
    analytics: z.boolean().default(true),
    marketing: z.boolean().default(false),
  }).default({}),
});

export const ConnectedAccountSchema = z.object({
  id: z.string(),
  institutionId: z.string(),
  institutionName: z.string(),
  accountType: z.enum(['checking', 'savings', 'credit_card', 'investment', 'loan']),
  accountNumber: z.string().optional(),
  balance: z.number().optional(),
  currency: z.string().default('BRL'),
  consentId: z.string(),
  consentExpiresAt: z.date(),
  lastSyncAt: z.date().optional(),
  isActive: z.boolean().default(true),
  metadata: z.record(z.any()).default({}),
});

export const UserCreateSchema = z.object({
  email: z.string().email(),
  profile: UserProfileSchema,
  preferences: UserPreferencesSchema.optional(),
  connectedAccounts: z.array(ConnectedAccountSchema).default([]),
});

export const UserUpdateSchema = UserCreateSchema.partial();

// Transaction schemas
export const TransactionCategorySchema = z.object({
  primary: z.string().min(1).max(100),
  secondary: z.string().max(100).optional(),
  confidence: z.number().min(0).max(1),
});

export const MerchantSchema = z.object({
  name: z.string().min(1).max(200),
  category: z.string().max(100).optional(),
  website: z.string().url().optional(),
});

export const LocationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  country: z.string().max(100).default('BR'),
});

export const TransactionMetadataSchema = z.object({
  source: z.enum(['open_finance', 'manual', 'csv_import']),
  processed: z.boolean().default(false),
  anomalyScore: z.number().min(0).max(1).optional(),
  duplicateOf: z.string().optional(),
  tags: z.array(z.string()).default([]),
  notes: z.string().max(1000).optional(),
});

export const TransactionCreateSchema = z.object({
  userId: z.string(),
  accountId: z.string(),
  amount: z.number(),
  currency: z.string().default('BRL'),
  date: z.date(),
  description: z.string().min(1).max(500),
  category: TransactionCategorySchema.optional(),
  merchant: MerchantSchema.optional(),
  location: LocationSchema.optional(),
  metadata: TransactionMetadataSchema.default({}),
});

export const TransactionUpdateSchema = TransactionCreateSchema.partial().omit({ userId: true });

// Knowledge Document schemas
export const KnowledgeDocumentMetadataSchema = z.object({
  lastUpdated: z.date(),
  relevanceScore: z.number().min(0).max(1).default(0.5),
  tags: z.array(z.string()).default([]),
  author: z.string().optional(),
  language: z.string().default('pt-BR'),
  wordCount: z.number().min(0).optional(),
  readingTime: z.number().min(0).optional(),
});

export const KnowledgeDocumentCreateSchema = z.object({
  title: z.string().min(1).max(300),
  content: z.string().min(1),
  source: z.string().url(),
  category: z.enum([
    'investment',
    'budgeting',
    'taxes',
    'insurance',
    'retirement',
    'debt_management',
    'financial_planning',
    'banking',
    'cryptocurrency',
    'real_estate',
    'general'
  ]),
  embedding: z.array(z.number()).optional(),
  metadata: KnowledgeDocumentMetadataSchema.default({}),
});

export const KnowledgeDocumentUpdateSchema = KnowledgeDocumentCreateSchema.partial();

// Conversation schemas
export const MessageSchema = z.object({
  id: z.string(),
  content: z.string().min(1),
  role: z.enum(['user', 'assistant', 'system']),
  timestamp: z.date(),
  sources: z.array(z.object({
    id: z.string(),
    title: z.string(),
    url: z.string().url().optional(),
    relevanceScore: z.number().min(0).max(1).optional(),
  })).optional(),
  metadata: z.record(z.any()).default({}),
});

export const ConversationContextSchema = z.object({
  currentTopic: z.string().optional(),
  userIntent: z.enum([
    'information',
    'analysis',
    'recommendation',
    'transaction_query',
    'goal_management',
    'budget_planning',
    'general'
  ]).optional(),
  relevantTransactions: z.array(z.string()).default([]),
  relevantGoals: z.array(z.string()).default([]),
  sessionData: z.record(z.any()).default({}),
});

export const ConversationCreateSchema = z.object({
  userId: z.string(),
  sessionId: z.string(),
  messages: z.array(MessageSchema).default([]),
  context: ConversationContextSchema.default({}),
});

export const ConversationUpdateSchema = ConversationCreateSchema.partial().omit({ userId: true });

// =============================================================================
// TYPESCRIPT INTERFACES
// =============================================================================

export interface IUser extends Document {
  email: string;
  profile: z.infer<typeof UserProfileSchema>;
  preferences: z.infer<typeof UserPreferencesSchema>;
  connectedAccounts: z.infer<typeof ConnectedAccountSchema>[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  accountId: string;
  amount: number;
  currency: string;
  date: Date;
  description: string;
  category?: z.infer<typeof TransactionCategorySchema>;
  merchant?: z.infer<typeof MerchantSchema>;
  location?: z.infer<typeof LocationSchema>;
  metadata: z.infer<typeof TransactionMetadataSchema>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface IKnowledgeDocument extends Document {
  title: string;
  content: string;
  source: string;
  category: z.infer<typeof KnowledgeDocumentCreateSchema>['category'];
  embedding?: number[];
  metadata: z.infer<typeof KnowledgeDocumentMetadataSchema>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface IConversation extends Document {
  userId: mongoose.Types.ObjectId;
  sessionId: string;
  messages: z.infer<typeof MessageSchema>[];
  context: z.infer<typeof ConversationContextSchema>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// =============================================================================
// MONGOOSE SCHEMAS
// =============================================================================

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: (email: string) => z.string().email().safeParse(email).success,
      message: 'Invalid email format'
    }
  },
  profile: {
    riskTolerance: {
      type: String,
      enum: ['conservative', 'moderate', 'aggressive'],
      required: true
    },
    financialGoals: [{
      id: { type: String, required: true },
      title: { type: String, required: true, maxlength: 200 },
      description: { type: String, maxlength: 1000 },
      targetAmount: { type: Number, required: true, min: 0 },
      currentAmount: { type: Number, default: 0, min: 0 },
      targetDate: { type: Date, required: true },
      category: {
        type: String,
        enum: ['savings', 'investment', 'debt_payment', 'purchase', 'emergency_fund'],
        required: true
      },
      priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        required: true
      },
      status: {
        type: String,
        enum: ['active', 'completed', 'paused', 'cancelled'],
        default: 'active'
      }
    }],
    incomeRange: {
      type: String,
      enum: ['0-2k', '2k-5k', '5k-10k', '10k-20k', '20k+'],
      required: true
    },
    ageGroup: {
      type: String,
      enum: ['18-25', '26-35', '36-45', '46-55', '56-65', '65+'],
      required: true
    },
    financialKnowledgeLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true
    }
  },
  preferences: {
    currency: { type: String, default: 'BRL' },
    language: { type: String, default: 'pt-BR' },
    timezone: { type: String, default: 'America/Sao_Paulo' },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      budgetAlerts: { type: Boolean, default: true },
      goalReminders: { type: Boolean, default: true },
      anomalyDetection: { type: Boolean, default: true }
    },
    privacy: {
      dataSharing: { type: Boolean, default: false },
      analytics: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false }
    }
  },
  connectedAccounts: [{
    id: { type: String, required: true },
    institutionId: { type: String, required: true },
    institutionName: { type: String, required: true },
    accountType: {
      type: String,
      enum: ['checking', 'savings', 'credit_card', 'investment', 'loan'],
      required: true
    },
    accountNumber: String,
    balance: Number,
    currency: { type: String, default: 'BRL' },
    consentId: { type: String, required: true },
    consentExpiresAt: { type: Date, required: true },
    lastSyncAt: Date,
    isActive: { type: Boolean, default: true },
    metadata: { type: Schema.Types.Mixed, default: {} }
  }],
  deletedAt: { type: Date, default: null }
}, {
  timestamps: true,
  collection: 'users'
});

const TransactionSchema = new Schema<ITransaction>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  accountId: {
    type: String,
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true,
    index: true
  },
  currency: {
    type: String,
    default: 'BRL'
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 500,
    trim: true
  },
  category: {
    primary: { type: String, maxlength: 100, index: true },
    secondary: { type: String, maxlength: 100 },
    confidence: { type: Number, min: 0, max: 1 }
  },
  merchant: {
    name: { type: String, maxlength: 200 },
    category: { type: String, maxlength: 100 },
    website: String
  },
  location: {
    lat: { type: Number, min: -90, max: 90 },
    lng: { type: Number, min: -180, max: 180 },
    address: { type: String, maxlength: 500 },
    city: { type: String, maxlength: 100 },
    state: { type: String, maxlength: 100 },
    country: { type: String, maxlength: 100, default: 'BR' }
  },
  metadata: {
    source: {
      type: String,
      enum: ['open_finance', 'manual', 'csv_import'],
      required: true
    },
    processed: { type: Boolean, default: false },
    anomalyScore: { type: Number, min: 0, max: 1 },
    duplicateOf: { type: String },
    tags: [String],
    notes: { type: String, maxlength: 1000 }
  },
  deletedAt: { type: Date, default: null }
}, {
  timestamps: true,
  collection: 'transactions'
});

const KnowledgeDocumentSchema = new Schema<IKnowledgeDocument>({
  title: {
    type: String,
    required: true,
    maxlength: 300,
    trim: true,
    index: 'text'
  },
  content: {
    type: String,
    required: true,
    index: 'text'
  },
  source: {
    type: String,
    required: true,
    validate: {
      validator: (url: string) => z.string().url().safeParse(url).success,
      message: 'Invalid source URL'
    }
  },
  category: {
    type: String,
    enum: [
      'investment',
      'budgeting',
      'taxes',
      'insurance',
      'retirement',
      'debt_management',
      'financial_planning',
      'banking',
      'cryptocurrency',
      'real_estate',
      'general'
    ],
    required: true,
    index: true
  },
  embedding: [Number],
  metadata: {
    lastUpdated: { type: Date, required: true },
    relevanceScore: { type: Number, min: 0, max: 1, default: 0.5 },
    tags: [String],
    author: String,
    language: { type: String, default: 'pt-BR' },
    wordCount: { type: Number, min: 0 },
    readingTime: { type: Number, min: 0 }
  },
  deletedAt: { type: Date, default: null }
}, {
  timestamps: true,
  collection: 'knowledgedocuments'
});

const ConversationSchema = new Schema<IConversation>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  messages: [{
    id: { type: String, required: true },
    content: { type: String, required: true },
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true
    },
    timestamp: { type: Date, required: true },
    sources: [{
      id: String,
      title: String,
      url: String,
      relevanceScore: { type: Number, min: 0, max: 1 }
    }],
    metadata: { type: Schema.Types.Mixed, default: {} }
  }],
  context: {
    currentTopic: String,
    userIntent: {
      type: String,
      enum: [
        'information',
        'analysis',
        'recommendation',
        'transaction_query',
        'goal_management',
        'budget_planning',
        'general'
      ]
    },
    relevantTransactions: [String],
    relevantGoals: [String],
    sessionData: { type: Schema.Types.Mixed, default: {} }
  },
  deletedAt: { type: Date, default: null }
}, {
  timestamps: true,
  collection: 'conversations'
});

// =============================================================================
// SOFT DELETE MIDDLEWARE
// =============================================================================

// Add soft delete functionality to all schemas
function addSoftDeleteMiddleware<T extends Document>(schema: Schema<T>) {
  // Modify find queries to exclude deleted documents
  schema.pre(/^find/, function() {
    if (!this.getQuery().deletedAt) {
      this.where({ deletedAt: { $exists: false } });
    }
  });

  // Add soft delete method
  schema.methods.softDelete = function() {
    this.deletedAt = new Date();
    return this.save();
  };

  // Add restore method
  schema.methods.restore = function() {
    this.deletedAt = undefined;
    return this.save();
  };
}

// Apply soft delete to all schemas
addSoftDeleteMiddleware(UserSchema);
addSoftDeleteMiddleware(TransactionSchema);
addSoftDeleteMiddleware(KnowledgeDocumentSchema);
addSoftDeleteMiddleware(ConversationSchema);

// =============================================================================
// MODELS
// =============================================================================

export const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);
export const Transaction: Model<ITransaction> = mongoose.model<ITransaction>('Transaction', TransactionSchema);
export const KnowledgeDocument: Model<IKnowledgeDocument> = mongoose.model<IKnowledgeDocument>('KnowledgeDocument', KnowledgeDocumentSchema);
export const Conversation: Model<IConversation> = mongoose.model<IConversation>('Conversation', ConversationSchema);

// =============================================================================
// CRUD OPERATIONS
// =============================================================================

// User CRUD operations
export class UserService {
  static async create(userData: z.infer<typeof UserCreateSchema>): Promise<IUser> {
    const validatedData = UserCreateSchema.parse(userData);
    const user = new User(validatedData);
    return await user.save();
  }

  static async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  static async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email: email.toLowerCase() });
  }

  static async update(id: string, updateData: z.infer<typeof UserUpdateSchema>): Promise<IUser | null> {
    const validatedData = UserUpdateSchema.parse(updateData);
    return await User.findByIdAndUpdate(id, validatedData, { new: true, runValidators: true });
  }

  static async softDelete(id: string): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
  }

  static async findAll(page = 1, limit = 10): Promise<{ users: IUser[], total: number }> {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find().skip(skip).limit(limit),
      User.countDocuments()
    ]);
    return { users, total };
  }
}

// Transaction CRUD operations
export class TransactionService {
  static async create(transactionData: z.infer<typeof TransactionCreateSchema>): Promise<ITransaction> {
    const validatedData = TransactionCreateSchema.parse(transactionData);
    const transaction = new Transaction(validatedData);
    return await transaction.save();
  }

  static async findById(id: string): Promise<ITransaction | null> {
    return await Transaction.findById(id).populate('userId', 'email profile.riskTolerance');
  }

  static async findByUserId(userId: string, page = 1, limit = 50): Promise<{ transactions: ITransaction[], total: number }> {
    const skip = (page - 1) * limit;
    const [transactions, total] = await Promise.all([
      Transaction.find({ userId }).sort({ date: -1 }).skip(skip).limit(limit),
      Transaction.countDocuments({ userId })
    ]);
    return { transactions, total };
  }

  static async findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<ITransaction[]> {
    return await Transaction.find({
      userId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 });
  }

  static async findByCategory(userId: string, category: string): Promise<ITransaction[]> {
    return await Transaction.find({
      userId,
      'category.primary': category
    }).sort({ date: -1 });
  }

  static async update(id: string, updateData: z.infer<typeof TransactionUpdateSchema>): Promise<ITransaction | null> {
    const validatedData = TransactionUpdateSchema.parse(updateData);
    return await Transaction.findByIdAndUpdate(id, validatedData, { new: true, runValidators: true });
  }

  static async softDelete(id: string): Promise<ITransaction | null> {
    return await Transaction.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
  }

  static async getSpendingByCategory(userId: string, startDate: Date, endDate: Date): Promise<any[]> {
    return await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: startDate, $lte: endDate },
          amount: { $lt: 0 }, // Only expenses
          deletedAt: { $exists: false }
        }
      },
      {
        $group: {
          _id: '$category.primary',
          totalAmount: { $sum: { $abs: '$amount' } },
          count: { $sum: 1 },
          avgAmount: { $avg: { $abs: '$amount' } }
        }
      },
      {
        $sort: { totalAmount: -1 }
      }
    ]);
  }
}

// Knowledge Document CRUD operations
export class KnowledgeDocumentService {
  static async create(docData: z.infer<typeof KnowledgeDocumentCreateSchema>): Promise<IKnowledgeDocument> {
    const validatedData = KnowledgeDocumentCreateSchema.parse(docData);
    const doc = new KnowledgeDocument(validatedData);
    return await doc.save();
  }

  static async findById(id: string): Promise<IKnowledgeDocument | null> {
    return await KnowledgeDocument.findById(id);
  }

  static async findByCategory(category: string, page = 1, limit = 20): Promise<{ documents: IKnowledgeDocument[], total: number }> {
    const skip = (page - 1) * limit;
    const [documents, total] = await Promise.all([
      KnowledgeDocument.find({ category }).skip(skip).limit(limit),
      KnowledgeDocument.countDocuments({ category })
    ]);
    return { documents, total };
  }

  static async searchByText(query: string, limit = 10): Promise<IKnowledgeDocument[]> {
    return await KnowledgeDocument.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } }).limit(limit);
  }

  static async update(id: string, updateData: z.infer<typeof KnowledgeDocumentUpdateSchema>): Promise<IKnowledgeDocument | null> {
    const validatedData = KnowledgeDocumentUpdateSchema.parse(updateData);
    return await KnowledgeDocument.findByIdAndUpdate(id, validatedData, { new: true, runValidators: true });
  }

  static async softDelete(id: string): Promise<IKnowledgeDocument | null> {
    return await KnowledgeDocument.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
  }

  static async findAll(page = 1, limit = 20): Promise<{ documents: IKnowledgeDocument[], total: number }> {
    const skip = (page - 1) * limit;
    const [documents, total] = await Promise.all([
      KnowledgeDocument.find().skip(skip).limit(limit),
      KnowledgeDocument.countDocuments()
    ]);
    return { documents, total };
  }
}

// Conversation CRUD operations
export class ConversationService {
  static async create(conversationData: z.infer<typeof ConversationCreateSchema>): Promise<IConversation> {
    const validatedData = ConversationCreateSchema.parse(conversationData);
    const conversation = new Conversation(validatedData);
    return await conversation.save();
  }

  static async findById(id: string): Promise<IConversation | null> {
    return await Conversation.findById(id).populate('userId', 'email profile');
  }

  static async findBySessionId(sessionId: string): Promise<IConversation | null> {
    return await Conversation.findOne({ sessionId }).populate('userId', 'email profile');
  }

  static async findByUserId(userId: string, page = 1, limit = 20): Promise<{ conversations: IConversation[], total: number }> {
    const skip = (page - 1) * limit;
    const [conversations, total] = await Promise.all([
      Conversation.find({ userId }).sort({ updatedAt: -1 }).skip(skip).limit(limit),
      Conversation.countDocuments({ userId })
    ]);
    return { conversations, total };
  }

  static async addMessage(sessionId: string, message: z.infer<typeof MessageSchema>): Promise<IConversation | null> {
    const validatedMessage = MessageSchema.parse(message);
    return await Conversation.findOneAndUpdate(
      { sessionId },
      { 
        $push: { messages: validatedMessage },
        $set: { updatedAt: new Date() }
      },
      { new: true, runValidators: true }
    );
  }

  static async updateContext(sessionId: string, context: z.infer<typeof ConversationContextSchema>): Promise<IConversation | null> {
    const validatedContext = ConversationContextSchema.parse(context);
    return await Conversation.findOneAndUpdate(
      { sessionId },
      { 
        $set: { 
          context: validatedContext,
          updatedAt: new Date()
        }
      },
      { new: true, runValidators: true }
    );
  }

  static async softDelete(id: string): Promise<IConversation | null> {
    return await Conversation.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
  }
}