import { detectDuplicates } from '../src/transaction-duplicate-detector';
import {
  detectAnomalies,
  scoreSuspiciousTransactions,
} from '../src/transaction-anomaly-detector';
import { sendSuspiciousTransactionAlerts } from '../src/transaction-alerts';
import { prepareAnomalyDashboard } from '../src/transaction-anomaly-dashboard';

const transactions = [
  {
    id: 't1',
    description: 'Pagamento de boleto bancário',
    amount: 100,
    date: new Date('2025-09-10'),
    userId: 'u1',
  },
  {
    id: 't2',
    description: 'Pagamento de boleto bancário',
    amount: 100,
    date: new Date('2025-09-10'),
    userId: 'u1',
  },
  {
    id: 't3',
    description: 'Compra no supermercado',
    amount: 250,
    date: new Date('2025-09-09'),
    userId: 'u2',
  },
  // Move to: /Users/eduesplinio/Documents/financial-ai-agent/packages/ai/src/tests/test-transaction-anomaly.ts
  {
    id: 't5',
    description: 'PIX enviado para Maria',
    amount: 100,
    date: new Date('2025-09-10'),
    userId: 'u1',
  },
];

// Test duplicate detection
const duplicatePairs = detectDuplicates(transactions);
console.log('Duplicate pairs:', duplicatePairs);

// Test anomaly detection
const anomalyIds = detectAnomalies(transactions);
console.log('Anomaly IDs:', anomalyIds);

// Simulate anomaly scores (for scoring)
const anomalyScores = transactions.map(t =>
  anomalyIds.includes(t.id) ? 0.8 : 0.2
);
const duplicateIds = new Set(duplicatePairs.flat());
const suspicious = scoreSuspiciousTransactions(
  transactions,
  anomalyScores,
  duplicateIds
).map(t => ({
  ...t,
  userId: transactions.find(tx => tx.id === t.id)?.userId ?? '',
}));
console.log('Suspicious transactions:', suspicious);

// Test alerts
const alerts = sendSuspiciousTransactionAlerts(suspicious, 0.7);
console.log('Alerts:', alerts);

// Test dashboard
const dashboard = prepareAnomalyDashboard(
  suspicious.map(t => ({
    transactionId: t.id,
    score: t.score,
    reason: t.reason,
    date: transactions.find(tx => tx.id === t.id)?.date ?? new Date(),
    amount: transactions.find(tx => tx.id === t.id)?.amount ?? 0,
  }))
);
console.log('Dashboard:', dashboard);
