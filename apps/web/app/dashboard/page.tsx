import { AuthGuard } from '@/components/auth/auth-guard';
import { ClientDashboard } from './client-dashboard';
import { FinancialDashboard } from '@/components/dashboard/financial-dashboard';
import { ChatInterface } from '@/components/chat/chat-interface';

export default function DashboardPage() {
  return (
    <AuthGuard requireAuth={true}>
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Dashboard principal ocupa todo o espaço */}
          <div>
            <FinancialDashboard />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
