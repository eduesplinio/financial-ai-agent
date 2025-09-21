'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useIsMounted } from '@/hooks/use-client-side';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: string;
  fallbackUrl?: string;
}

export function AuthGuard({
  children,
  requireAuth = true,
  requiredRole,
  fallbackUrl = '/auth/signin',
}: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isMounted = useIsMounted();

  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    // Se não precisa de autenticação e está autenticado, redireciona para o dashboard
    if (!requireAuth && status === 'authenticated') {
      if (window.location.pathname !== '/dashboard') {
        router.replace('/dashboard');
      }
      return;
    }

    // Se precisa de autenticação e não está autenticado, redireciona para login
    if (requireAuth && status === 'unauthenticated') {
      if (!window.location.pathname.startsWith('/auth/signin')) {
        router.replace(fallbackUrl);
      }
      return;
    }

    // Se está autenticado, verifica role se necessário
    if (status === 'authenticated' && session) {
      // Marca que o usuário está autenticado para evitar mostrar o loading em futuros acessos
      if (isMounted) {
        localStorage.setItem('userAuthenticated', 'true');
      }

      if (requiredRole && session.user.role !== requiredRole) {
        router.push('/dashboard');
        return;
      }
    }
  }, [status, session, requireAuth, requiredRole, router, fallbackUrl]);

  // Usar useState e useEffect para verificar o localStorage de forma segura
  const [isUserAlreadyAuthenticated, setIsUserAlreadyAuthenticated] =
    useState(false);

  // Verificar localStorage apenas no cliente e após a montagem do componente
  useEffect(() => {
    if (isMounted) {
      const authStatus = localStorage.getItem('userAuthenticated') === 'true';
      setIsUserAlreadyAuthenticated(authStatus);
    }
  }, [isMounted]);

  // Renderiza sempre o mesmo componente base para evitar erros de hidratação
  return (
    <>
      {/* Tela de carregamento */}
      {status === 'loading' && !isUserAlreadyAuthenticated && (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-6 text-lg text-gray-600">
            Verificando autenticação...
          </p>
        </div>
      )}

      {/* Tela de acesso restrito - precisa de login */}
      {status === 'unauthenticated' && requireAuth && (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Acesso Restrito
            </h3>
            <p className="text-gray-600 mb-4">
              Você precisa estar logado para acessar esta página.
            </p>
            <button
              onClick={() => router.push('/auth/signin')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Fazer Login
            </button>
          </div>
        </div>
      )}

      {/* Tela de acesso negado - role incorreta */}
      {status === 'authenticated' &&
        requiredRole &&
        session?.user.role !== requiredRole && (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-yellow-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Acesso Negado
              </h3>
              <p className="text-gray-600 mb-4">
                Você não tem permissão para acessar esta página.
                <br />
                Permissão necessária:{' '}
                <span className="font-semibold">{requiredRole}</span>
                <br />
                Sua permissão atual:{' '}
                <span className="font-semibold">{session?.user.role}</span>
              </p>
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Voltar ao Dashboard
              </button>
            </div>
          </div>
        )}

      {/* Renderiza o conteúdo quando estiver tudo certo:
          1. Autenticado e com permissão correta OU
          2. Carregando mas sabemos que o usuário já foi autenticado anteriormente OU
          3. Não requer autenticação e não está autenticado */}
      {((status === 'authenticated' &&
        (!requiredRole || session?.user.role === requiredRole)) ||
        (status === 'loading' && isUserAlreadyAuthenticated && requireAuth) ||
        (!requireAuth && status === 'unauthenticated')) &&
        children}
    </>
  );
}
