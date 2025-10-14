import { AuthGuard } from '@/components/auth/auth-guard';
import { LoginForm } from './login-form';
import { getPageTitle } from '@/lib/page-titles';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: getPageTitle('signin'),
};

export default function SignInPage() {
  return (
    <AuthGuard requireAuth={false}>
      <LoginForm />
    </AuthGuard>
  );
}
