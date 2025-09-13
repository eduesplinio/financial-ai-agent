import { AuthGuard } from '@/components/auth/auth-guard';
import { ClientDashboard } from './client-dashboard';
import { FinancialDashboard } from '@/components/dashboard/financial-dashboard';
import { ChatInterface } from '@/components/chat/chat-interface';

export default function DashboardPage() {
  return (
    <AuthGuard requireAuth={true}>
      <div className="w-full px-4 lg:px-8 py-6">
        <FinancialDashboard />
      </div>
    </AuthGuard>
  );
}
