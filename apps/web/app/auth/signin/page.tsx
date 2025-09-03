import { AuthGuard } from '@/components/auth/auth-guard';
import { LoginForm } from './login-form';

export default function SignInPage() {
  return (
    <AuthGuard requireAuth={false}>
      <LoginForm />
    </AuthGuard>
  );
}
