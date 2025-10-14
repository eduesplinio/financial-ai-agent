import { AuthGuard } from '@/components/auth/auth-guard';
import { GoalsContent } from './goals-content';
import { getPageTitle } from '@/lib/page-titles';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: getPageTitle('goals'),
};

export default function GoalsPage() {
  return (
    <AuthGuard requireAuth={true}>
      <GoalsContent />
    </AuthGuard>
  );
}
