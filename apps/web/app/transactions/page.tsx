import { AuthGuard } from '@/components/auth/auth-guard';
import { TransactionsContent } from './transactions-content';
import { getPageTitle } from '@/lib/page-titles';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: getPageTitle('transactions'),
};

export default function TransactionsPage() {
  return (
    <AuthGuard requireAuth={true}>
      <TransactionsContent />
    </AuthGuard>
  );
}
