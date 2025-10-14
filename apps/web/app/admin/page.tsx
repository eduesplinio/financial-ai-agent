import { AuthGuard } from '@/components/auth/auth-guard';
import { AdminContent } from './admin-content';
import { getPageTitle } from '@/lib/page-titles';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: getPageTitle('admin'),
};

export default function AdminPage() {
  return (
    <AuthGuard requireAuth={true} requiredRole="admin">
      <AdminContent />
    </AuthGuard>
  );
}
