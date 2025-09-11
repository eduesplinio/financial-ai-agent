import { findDuplicateTransactions } from '../src/transaction-duplicate-detector';

const transactions = [
  {
    id: 't1',
    amount: 100,
    date: new Date('2025-09-10'),
    description: 'Pagamento de boleto',
    userId: 'u1',
  },
  {
    id: 't2',
    amount: 100,
    date: new Date('2025-09-10'),
    description: 'Pagamento de boleto',
    userId: 'u1',
  },
  {
    id: 't3',
    amount: 250,
    date: new Date('2025-09-09'),
    description: 'Compra no mercado',
    userId: 'u2',
  },
  {
    id: 't4',
    amount: 5000,
    date: new Date('2025-09-10'),
    description: 'Transferência',
    userId: 'u1',
  },
  {
    id: 't5',
    amount: 100,
    date: new Date('2025-09-10'),
    description: 'Pagamento de boleto',
    userId: 'u1',
  },
];

const duplicates = findDuplicateTransactions(transactions);
console.log('Duplicate pairs:', duplicates);
