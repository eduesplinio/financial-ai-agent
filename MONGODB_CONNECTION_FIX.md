# MongoDB Connection Timeout Fix

## Problem

When the application starts, the first chat query fails with:

```
❌ Semantic search failed: MongooseError: Operation `knowledgedocuments.aggregate()` buffering timed out after 10000ms
```

This happens because:

1. The database connection isn't established when the first request arrives
2. `bufferCommands: false` was set, preventing Mongoose from queuing operations
3. The query times out waiting for a connection that hasn't been established yet

## Solution

### 1. Enable Command Buffering (packages/database/src/connection.ts)

Changed `bufferCommands: false` to `bufferCommands: true`:

```typescript
const baseOptions: mongoose.ConnectOptions = {
  // ... other options
  bufferCommands: true, // Enable buffering to queue operations until connected
  // ...
};
```

This allows Mongoose to queue operations until the connection is ready, preventing timeout errors.

### 2. Add Connection Checks (packages/database/src/vector-search.ts)

Added `ensureConnection()` helper method:

```typescript
private static async ensureConnection(): Promise<void> {
  const { mongoConnection } = await import('./connection');

  if (!mongoConnection.isConnected()) {
    console.log('⚠️ Database not connected, connecting now...');
    await mongoConnection.connect();
  }
}
```

Called before semantic search operations:

```typescript
static async semanticSearch(query: VectorSearchQuery): Promise<SimilaritySearchResult[]> {
  try {
    await this.ensureConnection(); // Ensure connection before querying
    // ... rest of the method
  }
}
```

### 3. Add Connection Checks (packages/database/src/transaction-vector-search.ts)

Applied the same pattern to transaction searches:

```typescript
private static async ensureConnection(): Promise<void> {
  const { mongoConnection } = await import('./connection');

  if (!mongoConnection.isConnected()) {
    console.log('⚠️ Database not connected, connecting now...');
    await mongoConnection.connect();
  }
}

static async searchTransactionsWithEmbedding(...): Promise<TransactionSearchResult[]> {
  try {
    await this.ensureConnection(); // Ensure connection before querying
    // ... rest of the method
  }
}
```

## Benefits

1. **No more timeout errors**: Operations wait for connection instead of failing
2. **Automatic connection**: Database connects on-demand if not already connected
3. **Better user experience**: First query works just like subsequent queries
4. **Graceful handling**: Clear logging when connection needs to be established

## Testing

After these changes, the first chat query should work without timeout errors. You should see:

- No more "buffering timed out" errors
- Successful semantic search on first request
- Proper results returned for both concept and personal data questions

If the database isn't connected when a query arrives, you'll see:

```
⚠️ Database not connected, connecting now...
✅ MongoDB connected successfully
```

Then the query will proceed normally.
