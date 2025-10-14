import { AuthGuard } from '@/components/auth/auth-guard';
import { SettingsContent } from './settings-content';
import { getPageTitle } from '@/lib/page-titles';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: getPageTitle('settings'),
};

export default function SettingsPage() {
  return (
    <AuthGuard requireAuth={true}>
      <SettingsContent />
    </AuthGuard>
  );
}
