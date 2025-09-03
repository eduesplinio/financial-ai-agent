import { AuthGuard } from '@/components/auth/auth-guard';
import { ClientDashboard } from './client-dashboard';

export default function DashboardPage() {
  return (
    <AuthGuard requireAuth={true}>
      <ClientDashboard />
    </AuthGuard>
  );
}
