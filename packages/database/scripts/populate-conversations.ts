import 'dotenv/config';
import mongoose from 'mongoose';
import { EmbeddingUtils } from '../src/vector-search';

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/financial_ai';

const conversationSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  messages: [
    {
      role: String,
      content: String,
      timestamp: Date,
      embedding: [Number],
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Conversation =
  mongoose.models.Conversation ||
  mongoose.model('Conversation', conversationSchema);

const sampleConversations = [
  {
    sessionId: new mongoose.Types.ObjectId(),
    userId: new mongoose.Types.ObjectId(),
    messages: [
      {
        id: new mongoose.Types.ObjectId(),
        role: 'user',
        content: 'Como posso investir melhor meu dinheiro?',
        timestamp: new Date(),
        embedding: EmbeddingUtils.generateRandomEmbedding(),
      },
      {
        id: new mongoose.Types.ObjectId(),
        role: 'assistant',
        content:
          'Você pode diversificar seus investimentos em renda fixa e variável.',
        timestamp: new Date(),
        embedding: EmbeddingUtils.generateRandomEmbedding(),
      },
    ],
  },
  {
    sessionId: new mongoose.Types.ObjectId(),
    userId: new mongoose.Types.ObjectId(),
    messages: [
      {
        id: new mongoose.Types.ObjectId(),
        role: 'user',
        content: 'Quais são os riscos de investir em criptomoedas?',
        timestamp: new Date(),
        embedding: EmbeddingUtils.generateRandomEmbedding(),
      },
      {
        id: new mongoose.Types.ObjectId(),
        role: 'assistant',
        content: 'Criptomoedas são voláteis e não possuem garantia do FGC.',
        timestamp: new Date(),
        embedding: EmbeddingUtils.generateRandomEmbedding(),
      },
    ],
  },
];

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB:', MONGODB_URI);

  for (const conv of sampleConversations) {
    // Mensagens já possuem embedding
    await new Conversation(conv).save();
    console.log('Conversation populated:', conv);
  }

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}

main().catch(err => {
  console.error('Error populating conversations:', err);
  process.exit(1);
});
