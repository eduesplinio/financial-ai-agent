import { AuthGuard } from '@/components/auth/auth-guard';
import { AdminContent } from './admin-content';

export default function AdminPage() {
  return (
    <AuthGuard requireAuth={true} requiredRole="admin">
      <AdminContent />
    </AuthGuard>
  );
}
