'use client';

import { useSession } from 'next-auth/react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { Sidebar } from '@/components/layout/sidebar';
import { ChatWidget } from '@/components/chat/ChatWidget';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const ErrorBoundary = dynamic(() => import('@/components/error-boundary'), {
  ssr: false,
});

const publicRoutes = [
  '/auth/signin',
  '/auth/signup',
  '/privacy',
  '/not-found',
  '/forbidden',
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated' && session?.user;
  const [currentPath, setCurrentPath] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  if (currentPath === null) {
    // Prevent hydration mismatch by rendering nothing until path is available
    return (
      <div className="flex h-screen items-center justify-center">
        <span>Carregando...</span>
      </div>
    );
  }

  const isPublic = publicRoutes.some(route => currentPath.startsWith(route));

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 min-h-0 overflow-y-auto p-0 lg:p-0">
        {isPublic ? (
          <ErrorBoundary>{children}</ErrorBoundary>
        ) : (
          <AuthGuard requireAuth={true}>
            <ErrorBoundary>{children}</ErrorBoundary>
          </AuthGuard>
        )}
      </main>
      {isAuthenticated && <ChatWidget />}
    </div>
  );
}
