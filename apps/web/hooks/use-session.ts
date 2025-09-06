'use client';

import { useSession as useNextAuthSession } from 'next-auth/react';
import type { Session } from 'next-auth';

export function useSession() {
  const { data: session, status } = useNextAuthSession();
  
  return {
    session: session as (Session & {
      user: {
        id: string;
        email: string;
        name: string;
        role: string;
        image?: string;
      };
    }) | null,
    status,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
  };
}
