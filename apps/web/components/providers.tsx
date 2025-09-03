'use client';

import { SessionProvider } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider 
      refetchInterval={5 * 60} // Refetch session every 5 minutes
      refetchOnWindowFocus={true}
    >
      <SessionHandler>
        {children}
      </SessionHandler>
    </SessionProvider>
  );
}

function SessionHandler({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Log session changes for debugging
  useEffect(() => {
    console.log('Session status changed:', { status, session });
  }, [status, session]);

  // Handle session changes
  useEffect(() => {
    if (status === 'unauthenticated' && !pathname.startsWith('/auth')) {
      console.log('User not authenticated, redirecting to signin');
      router.push('/auth/signin');
    }
  }, [status, pathname, router]);

  return <>{children}</>;
}
