import { IsolationForest } from 'ml-isolation-forest';

export interface TransactionAnomaly {
  id: string;
  amount: number;
  date: Date;
  // ...other features
}

/**
 * Detect anomalies in transactions using simple statistical rule.
 * Returns array of transaction IDs considered anomalous.
 */
export function detectAnomalies(
  transactions: TransactionAnomaly[],
  options?: { contamination?: number }
): string[] {
  // Simple anomaly: flag transactions with amount > mean + 2*std
  const amounts = transactions.map((t: TransactionAnomaly) => t.amount);
  const mean =
    amounts.reduce((a: number, b: number) => a + b, 0) / amounts.length;
  const std = Math.sqrt(
    amounts
      .map((a: number) => Math.pow(a - mean, 2))
      .reduce((a: number, b: number) => a + b, 0) / amounts.length
  );
  return transactions
    .filter((t: TransactionAnomaly) => t.amount > mean + 2 * std)
    .map((t: TransactionAnomaly) => t.id);
}

/**
 * Score transactions for suspiciousness based on anomaly score and duplicate status.
 * Returns array of { id, score, reason } for each transaction.
 */
export function scoreSuspiciousTransactions(
  transactions: TransactionAnomaly[],
  anomalyScores: number[],
  duplicateIds: Set<string>
): Array<{ id: string; score: number; reason: string[] }> {
  return transactions.map((t, i) => {
    let score = 0;
    const reason: string[] = [];
    // Score anomaly
    const anomalyScore = anomalyScores[i] ?? 0;
    if (anomalyScore > 0.5) {
      score += anomalyScore;
      reason.push('anomaly');
    }
    // Score duplicate
    if (duplicateIds.has(t.id)) {
      score += 0.5;
      reason.push('duplicate');
    }
    return { id: t.id, score, reason };
  });
}
