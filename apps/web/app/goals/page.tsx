import { AuthGuard } from '@/components/auth/auth-guard';
import { GoalsContent } from './goals-content';

export default function GoalsPage() {
  return (
    <AuthGuard requireAuth={true}>
      <GoalsContent />
    </AuthGuard>
  );
}
