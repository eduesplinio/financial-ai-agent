import { scoreSuspiciousTransactions } from './transaction-anomaly-detector';

export interface SuspiciousTransaction {
  id: string;
  score: number;
  reason: string[];
  userId: string;
}

/**
 * Send automatic alerts to users for suspicious transactions above a threshold.
 * Returns array of alerts (userId, transactionId, score, reason).
 */
export function sendSuspiciousTransactionAlerts(
  transactions: SuspiciousTransaction[],
  threshold: number = 0.7
) {
  return transactions
    .filter(t => t.score >= threshold)
    .map(t => ({
      userId: t.userId,
      transactionId: t.id,
      score: t.score,
      reason: t.reason,
      message: `Suspicious transaction detected (score: ${t.score}): ${t.reason.join(', ')}`,
    }));
}
