import { preprocessDescription } from './preprocess';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: Date;
  // ...other fields
}

/**
 * Detects duplicate transactions based on description similarity and amount/date proximity.
 * Returns pairs of transaction IDs considered duplicates.
 */
export function detectDuplicates(
  transactions: Transaction[],
  options?: { threshold?: number }
): Array<[string, string]> {
  const threshold = options?.threshold ?? 0.85;
  const duplicates: Array<[string, string]> = [];
  for (let i = 0; i < transactions.length; i++) {
    for (let j = i + 1; j < transactions.length; j++) {
      const t1 = transactions[i]!;
      const t2 = transactions[j]!;
      // Simple similarity: Jaccard index on tokens
      const tokens1 = new Set(preprocessDescription(t1.description));
      const tokens2 = new Set(preprocessDescription(t2.description));
      const intersection = new Set(
        Array.from(tokens1).filter(x => tokens2.has(x))
      );
      const union = new Set([...Array.from(tokens1), ...Array.from(tokens2)]);
      const similarity = intersection.size / union.size;
      // Amount and date proximity (within 1 day and 1 real)
      const amountClose = Math.abs(t1.amount - t2.amount) < 1;
      const dateClose =
        Math.abs(t1.date.getTime() - t2.date.getTime()) < 1000 * 60 * 60 * 24;
      if (similarity >= threshold && amountClose && dateClose) {
        duplicates.push([t1.id, t2.id]);
      }
    }
  }
  return duplicates;
}

export const findDuplicateTransactions = detectDuplicates;
