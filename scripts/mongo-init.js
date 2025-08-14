// MongoDB initialization script for development
db = db.getSiblingDB('financial_ai');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'profile', 'createdAt'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
        },
        profile: {
          bsonType: 'object',
          required: ['riskTolerance'],
          properties: {
            riskTolerance: {
              enum: ['conservative', 'moderate', 'aggressive']
            }
          }
        },
        createdAt: {
          bsonType: 'date'
        }
      }
    }
  }
});

db.createCollection('transactions', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'amount', 'currency', 'date', 'description'],
      properties: {
        userId: {
          bsonType: 'objectId'
        },
        amount: {
          bsonType: 'number'
        },
        currency: {
          bsonType: 'string',
          minLength: 3,
          maxLength: 3
        },
        date: {
          bsonType: 'date'
        }
      }
    }
  }
});

db.createCollection('knowledge_documents', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'content', 'source', 'category'],
      properties: {
        title: {
          bsonType: 'string',
          minLength: 1
        },
        content: {
          bsonType: 'string',
          minLength: 1
        },
        embedding: {
          bsonType: 'array',
          items: {
            bsonType: 'number'
          }
        }
      }
    }
  }
});

db.createCollection('conversations');

// Create indexes for performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ createdAt: 1 });

db.transactions.createIndex({ userId: 1, date: -1 });
db.transactions.createIndex({ userId: 1, 'category.primary': 1 });
db.transactions.createIndex({ date: -1 });

db.knowledge_documents.createIndex({ category: 1 });
db.knowledge_documents.createIndex({ source: 1 });

db.conversations.createIndex({ userId: 1, createdAt: -1 });
db.conversations.createIndex({ sessionId: 1 });

print('MongoDB initialization completed successfully!');