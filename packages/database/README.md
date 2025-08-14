# Database Package

This package provides MongoDB connection management, data models, and vector search capabilities for the Financial AI Agent.

## Features

- **MongoDB Connection**: Robust connection management with retry logic, connection pooling, and health checks
- **Data Models**: Comprehensive Mongoose models with Zod validation for Users, Transactions, Knowledge Documents, and Conversations
- **Vector Search**: MongoDB Atlas Vector Search integration for RAG (Retrieval-Augmented Generation) system
- **Soft Delete**: Built-in soft delete functionality for all models
- **CRUD Operations**: Type-safe CRUD operations with validation
- **Testing**: Comprehensive test suite with Jest

## Installation

```bash
npm install
```

## Environment Setup

Create a `.env.local` file in the project root with the following variables:

```bash
# For local development
MONGODB_URI=mongodb://dev:dev123@localhost:27017/financial_ai?authSource=admin

# For MongoDB Atlas (production)
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/financial_ai?retryWrites=true&w=majority

NODE_ENV=development
```

## Quick Start

### 1. Initialize Database Connection

```typescript
import { initializeDatabase } from '@financial-ai/database';

// Initialize connection and create indexes
await initializeDatabase();
```

### 2. Use Models and Services

```typescript
import { UserService, TransactionService } from '@financial-ai/database';

// Create a user
const user = await UserService.create({
  email: 'user@example.com',
  profile: {
    riskTolerance: 'moderate',
    financialGoals: [],
    incomeRange: '5k-10k',
    ageGroup: '26-35',
    financialKnowledgeLevel: 'intermediate',
  },
});

// Create a transaction
const transaction = await TransactionService.create({
  userId: user._id.toString(),
  accountId: 'acc-123',
  amount: -50.00,
  currency: 'BRL',
  date: new Date(),
  description: 'Grocery shopping',
  metadata: {
    source: 'open_finance',
    processed: true,
  },
});
```

### 3. Vector Search (RAG System)

```typescript
import { VectorSearchService, EmbeddingUtils } from '@financial-ai/database';

// Setup vector search index (run once)
await VectorSearchService.createVectorSearchIndex();

// Perform semantic search
const queryVector = await generateEmbedding('investment strategies'); // Your embedding function
const results = await VectorSearchService.semanticSearch({
  queryVector,
  limit: 10,
  filter: {
    category: 'investment',
    language: 'pt-BR',
  },
});

// Hybrid search (text + vector)
const hybridResults = await VectorSearchService.hybridSearch({
  textQuery: 'investment strategies',
  queryVector,
  textWeight: 0.3,
  vectorWeight: 0.7,
  limit: 10,
});
```

## Scripts

```bash
# Build the package
npm run build

# Run tests
npm run test
npm run test:watch
npm run test:coverage

# Setup vector search index (MongoDB Atlas required)
npm run setup:vector-search

# Type checking
npm run type-check

# Linting
npm run lint
```

## Data Models

### User Model

```typescript
interface IUser {
  email: string;
  profile: {
    riskTolerance: 'conservative' | 'moderate' | 'aggressive';
    financialGoals: FinancialGoal[];
    incomeRange: string;
    ageGroup: string;
    financialKnowledgeLevel: 'beginner' | 'intermediate' | 'advanced';
  };
  preferences: UserPreferences;
  connectedAccounts: ConnectedAccount[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
```

### Transaction Model

```typescript
interface ITransaction {
  userId: ObjectId;
  accountId: string;
  amount: number;
  currency: string;
  date: Date;
  description: string;
  category?: {
    primary: string;
    secondary?: string;
    confidence: number;
  };
  merchant?: {
    name: string;
    category: string;
  };
  location?: Location;
  metadata: {
    source: 'open_finance' | 'manual' | 'csv_import';
    processed: boolean;
    anomalyScore?: number;
    tags: string[];
  };
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
```

### Knowledge Document Model

```typescript
interface IKnowledgeDocument {
  title: string;
  content: string;
  source: string;
  category: 'investment' | 'budgeting' | 'taxes' | /* ... */;
  embedding?: number[]; // 1536-dimensional vector for OpenAI embeddings
  metadata: {
    lastUpdated: Date;
    relevanceScore: number;
    tags: string[];
    author?: string;
    language: string;
  };
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
```

### Conversation Model

```typescript
interface IConversation {
  userId: ObjectId;
  sessionId: string;
  messages: Message[];
  context: {
    currentTopic?: string;
    userIntent?: 'information' | 'analysis' | 'recommendation' | /* ... */;
    relevantTransactions: string[];
    relevantGoals: string[];
    sessionData: Record<string, any>;
  };
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
```

## CRUD Services

Each model has a corresponding service class with type-safe CRUD operations:

- `UserService`: User management operations
- `TransactionService`: Transaction operations with financial analytics
- `KnowledgeDocumentService`: Knowledge base management
- `ConversationService`: Conversation and message management

### Example Usage

```typescript
// Find user transactions by date range
const transactions = await TransactionService.findByDateRange(
  userId,
  new Date('2024-01-01'),
  new Date('2024-01-31')
);

// Get spending analysis by category
const spending = await TransactionService.getSpendingByCategory(
  userId,
  startDate,
  endDate
);

// Search knowledge documents
const documents = await KnowledgeDocumentService.searchByText('investment');

// Add message to conversation
await ConversationService.addMessage(sessionId, {
  id: 'msg-123',
  content: 'How can I save more money?',
  role: 'user',
  timestamp: new Date(),
});
```

## Vector Search

The package includes comprehensive vector search capabilities for the RAG system:

### Features

- **Semantic Search**: Find documents using vector similarity
- **Hybrid Search**: Combine text and vector search with weighted scoring
- **Similarity Search**: Find documents similar to a given document
- **Batch Operations**: Efficient batch updates for embeddings
- **Statistics**: Monitor vector search performance and coverage

### MongoDB Atlas Setup

1. Create a MongoDB Atlas cluster
2. Enable Vector Search in your cluster
3. Run the setup script: `npm run setup:vector-search`
4. Wait for the index to be built (may take a few minutes)

### Vector Search Index Configuration

```javascript
{
  "name": "knowledge_vector_index",
  "type": "vectorSearch",
  "definition": {
    "fields": [
      {
        "type": "vector",
        "path": "embedding",
        "numDimensions": 1536,
        "similarity": "cosine"
      },
      {
        "type": "filter",
        "path": "category"
      },
      {
        "type": "filter",
        "path": "metadata.language"
      },
      {
        "type": "filter",
        "path": "metadata.tags"
      }
    ]
  }
}
```

## Soft Delete

All models support soft delete functionality:

```typescript
// Soft delete a user
await UserService.softDelete(userId);

// Soft deleted documents are automatically excluded from queries
const users = await User.find(); // Won't include soft deleted users

// Find soft deleted documents explicitly
const deletedUsers = await User.find({ deletedAt: { $exists: true } });

// Restore a soft deleted document
const user = await User.findOne({ _id: userId, deletedAt: { $exists: true } });
await user.restore();
```

## Health Checks

The connection manager includes built-in health checks:

```typescript
import { dbHealthCheck, isDBConnected } from '@financial-ai/database';

// Check if database is connected
if (isDBConnected()) {
  console.log('Database is connected');
}

// Perform detailed health check
const health = await dbHealthCheck();
console.log('Health status:', health.status);
console.log('Latency:', health.latency, 'ms');
```

## Error Handling

The package includes comprehensive error handling:

- **Connection Errors**: Automatic retry with exponential backoff
- **Validation Errors**: Zod schema validation with detailed error messages
- **Database Errors**: Proper error propagation and logging
- **Vector Search Errors**: Graceful fallbacks and error reporting

## Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

The test suite includes:

- Unit tests for all models and services
- Integration tests for database operations
- Vector search functionality tests
- Connection management tests
- Error handling tests

## Performance Considerations

### Indexes

The package automatically creates optimized indexes for:

- User queries (email, profile fields)
- Transaction queries (userId, date, category, amount)
- Knowledge document searches (category, text search, metadata)
- Conversation queries (userId, sessionId, timestamps)

### Connection Pooling

MongoDB connection pooling is configured for optimal performance:

- **Production**: Max 10 connections, Min 1 connection
- **Development**: Max 5 connections, Min 1 connection
- **Connection timeout**: 45 seconds
- **Server selection timeout**: 5 seconds

### Vector Search Optimization

- Embeddings are normalized for optimal cosine similarity
- Batch operations for efficient embedding updates
- Configurable search parameters (numCandidates, limit)
- Hybrid search with weighted scoring

## Contributing

1. Follow the existing code style and patterns
2. Add tests for new functionality
3. Update documentation for API changes
4. Ensure all tests pass before submitting

## License

This package is part of the Financial AI Agent project and follows the same license terms.