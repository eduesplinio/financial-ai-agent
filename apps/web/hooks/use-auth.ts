'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth(requireAuth = true) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Ainda carregando

    if (requireAuth && status === 'unauthenticated') {
      router.push('/auth/signin');
    }

    if (!requireAuth && status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, requireAuth, router]);

  return {
    session,
    status,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    user: session?.user,
  };
}
