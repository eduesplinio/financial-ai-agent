import { AuthGuard } from '@/components/auth/auth-guard';
import { TransactionsContent } from './transactions-content';

export default function TransactionsPage() {
  return (
    <AuthGuard requireAuth={true}>
      <TransactionsContent />
    </AuthGuard>
  );
}
