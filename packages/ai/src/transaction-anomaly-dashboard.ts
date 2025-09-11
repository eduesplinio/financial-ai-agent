import { SuspiciousTransaction } from './transaction-alerts';

export interface DashboardAnomaly {
  transactionId: string;
  score: number;
  reason: string[];
  date: Date;
  amount: number;
}

/**
 * Prepare dashboard data for anomaly monitoring.
 * Returns array of dashboard entries sorted by score descending.
 */
export function prepareAnomalyDashboard(transactions: DashboardAnomaly[]) {
  return transactions
    .sort((a, b) => b.score - a.score)
    .map(t => ({
      transactionId: t.transactionId,
      score: t.score,
      reason: t.reason,
      date: t.date,
      amount: t.amount,
    }));
}
