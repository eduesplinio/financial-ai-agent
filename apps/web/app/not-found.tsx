'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HomeIcon, ArrowLeftIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useIsMounted } from '@/hooks/use-client-side';

export default function NotFound() {
  const { data: session, status } = useSession();
  const isMounted = useIsMounted();
  const [isClientSide, setIsClientSide] = useState(false);

  useEffect(() => {
    setIsClientSide(true);
  }, []);

  // Define a página de retorno com base no estado de autenticação do usuário
  const getReturnPage = () => {
    if (status === 'authenticated') {
      return '/dashboard';
    } else {
      return '/';
    }
  };

  // Mostra um loading até que saibamos que estamos no cliente
  if (!isClientSide) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-lg px-6">
        <div className="mb-6">
          <div className="inline-flex rounded-full bg-blue-100 p-4">
            <div className="rounded-full bg-blue-200 p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6 text-blue-600"
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
          Página não encontrada
        </h1>
        <p className="mt-4 text-gray-600">
          A página que você está procurando não existe ou foi movida.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Voltar
          </Button>

          <Link href={getReturnPage()}>
            <Button className="flex items-center gap-2">
              <HomeIcon className="h-4 w-4" />
              {status === 'authenticated'
                ? 'Ir para o Dashboard'
                : 'Ir para a Página Inicial'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
