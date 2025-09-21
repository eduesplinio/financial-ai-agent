import { AuthGuard } from '@/components/auth/auth-guard';
import { ProfileContent } from './profile-content-redesigned';

export default function ProfilePage() {
  return (
    <AuthGuard requireAuth={true}>
      <ProfileContent />
    </AuthGuard>
  );
}
