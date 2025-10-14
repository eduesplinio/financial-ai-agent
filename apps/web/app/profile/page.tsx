import { AuthGuard } from '@/components/auth/auth-guard';
import { ProfileContent } from './profile-content';
import { getPageTitle } from '@/lib/page-titles';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: getPageTitle('profile'),
};

export default function ProfilePage() {
  return (
    <AuthGuard requireAuth={true}>
      <ProfileContent />
    </AuthGuard>
  );
}
