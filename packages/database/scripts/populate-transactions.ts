import 'dotenv/config';
import { mongoConnection } from '../src/connection';
import { Transaction } from '../src/models';
import mongoose from 'mongoose';

async function populateTransactions() {
  await mongoConnection.connect();

  const transactions = [
    {
      userId: new mongoose.Types.ObjectId(),
      accountId: new mongoose.Types.ObjectId(),
      amount: 100.0,
      currency: 'BRL',
      date: new Date('2025-09-10'),
      description: 'Pagamento de boleto bancário no Itaú',
      category: { primary: 'Pagamento', confidence: 0.9 },
      metadata: { source: 'manual', processed: false, tags: [] },
    },
    {
      userId: new mongoose.Types.ObjectId(),
      accountId: new mongoose.Types.ObjectId(),
      amount: 250.0,
      currency: 'BRL',
      date: new Date('2025-09-09'),
      description: 'Compra no supermercado Extra',
      category: { primary: 'Mercado', confidence: 0.8 },
      metadata: { source: 'manual', processed: false, tags: [] },
    },
    {
      userId: new mongoose.Types.ObjectId(),
      accountId: new mongoose.Types.ObjectId(),
      amount: 100.0,
      currency: 'BRL',
      date: new Date('2025-09-10'),
      description: 'PIX enviado para Maria',
      category: { primary: 'Transferência', confidence: 0.85 },
      metadata: { source: 'manual', processed: false, tags: [] },
    },
    {
      userId: new mongoose.Types.ObjectId(),
      accountId: new mongoose.Types.ObjectId(),
      amount: 5000.0,
      currency: 'BRL',
      date: new Date('2025-09-10'),
      description: 'Transferência recebida de João Silva',
      category: { primary: 'Recebimento', confidence: 0.95 },
      metadata: { source: 'manual', processed: false, tags: [] },
    },
  ];

  await Transaction.insertMany(transactions);
  console.log('✅ Transações populadas com sucesso!');
  await mongoConnection.disconnect();
}

if (require.main === module) {
  populateTransactions();
}
