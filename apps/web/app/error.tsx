'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HomeIcon, ArrowLeftIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { data: session, status } = useSession();

  useEffect(() => {
    // Registra o erro no console para desenvolvimento
    console.error('Erro da aplicação:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-lg px-6">
        <div className="mb-6">
          <div className="inline-flex rounded-full bg-red-100 p-4">
            <div className="rounded-full bg-red-200 p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6 text-red-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
          </div>
        </div>
        <h1 className="mt-3 text-2xl font-semibold text-gray-800 md:text-3xl">
          Algo deu errado
        </h1>
        <p className="mt-4 text-gray-600">
          Ocorreu um erro ao tentar carregar esta página.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-red-50 rounded-md text-left">
            <p className="text-sm text-red-600 font-mono overflow-auto">
              {error.message || 'Erro desconhecido'}
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            onClick={() => reset()}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Tentar novamente
          </Button>

          <Link href={status === 'authenticated' ? '/dashboard' : '/'}>
            <Button className="flex items-center gap-2">
              <HomeIcon className="h-4 w-4" />
              {status === 'authenticated'
                ? 'Voltar ao Dashboard'
                : 'Página Inicial'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
