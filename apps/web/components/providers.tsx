'use client';

import { SessionProvider } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
      <SessionHandler>{children}</SessionHandler>
    </SessionProvider>
  );
}

function SessionHandler({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  // Garantir que o componente só execute lógicas específicas do cliente após a montagem
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Log session changes for debugging (apenas no lado do cliente)
  useEffect(() => {
    if (isMounted) {
      console.log('Session status changed:', { status, session });
    }
  }, [isMounted, status, session]);

  // Handle session changes (apenas no lado do cliente)
  useEffect(() => {
    if (
      isMounted &&
      status === 'unauthenticated' &&
      !pathname.startsWith('/auth')
    ) {
      console.log('User not authenticated, redirecting to signin');
      router.push('/auth/signin');
    }
  }, [isMounted, status, pathname, router]);

  return <>{children}</>;
}
