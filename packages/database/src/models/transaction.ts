import mongoose, { Schema, Document } from 'mongoose';

// Transaction interface
export interface ITransaction extends Document {
  userId: string;
  description: string;
  amount: number;
  date: Date;
  category: {
    primary: string;
    secondary?: string;
  };
  accountId: string;
  metadata: {
    source: 'manual' | 'import' | 'api' | 'sync';
    originalId?: string;
    importBatch?: string;
  };
  // Vector search fields
  embedding?: number[];
  embeddingVersion?: string;
  embeddingGeneratedAt?: Date;
  searchableContent?: string;
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Transaction schema
const TransactionSchema = new Schema<ITransaction>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    category: {
      primary: {
        type: String,
        required: true,
      },
      secondary: {
        type: String,
      },
    },
    accountId: {
      type: String,
      required: true,
      index: true,
    },
    metadata: {
      source: {
        type: String,
        enum: ['manual', 'import', 'api', 'sync'],
        required: true,
        default: 'manual',
      },
      originalId: String,
      importBatch: String,
    },
    // Vector search fields
    embedding: {
      type: [Number],
      default: null,
    },
    embeddingVersion: {
      type: String,
      default: null,
    },
    embeddingGeneratedAt: {
      type: Date,
      default: null,
    },
    searchableContent: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'transactions',
  }
);

// Indexes for performance
TransactionSchema.index({ userId: 1, date: -1 });
TransactionSchema.index({ userId: 1, 'category.primary': 1 });
TransactionSchema.index({ userId: 1, amount: 1 });
TransactionSchema.index({ embedding: 1 }, { sparse: true });

// Create and export the model
export const Transaction = mongoose.model<ITransaction>(
  'Transaction',
  TransactionSchema
);

export default Transaction;
