'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HomeIcon, ArrowLeftIcon, ShieldAlertIcon } from 'lucide-react';

export default function Forbidden() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-lg px-6">
        <div className="mb-6">
          <div className="inline-flex rounded-full bg-yellow-100 p-4">
            <div className="rounded-full bg-yellow-200 p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6 text-yellow-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
          </div>
        </div>
        <h1 className="mt-3 text-2xl font-semibold text-gray-800 md:text-3xl">
          Acesso Negado
        </h1>
        <p className="mt-4 text-gray-600">
          Você não tem permissão para acessar esta página.
          {session?.user?.role && (
            <span className="block mt-2">
              Seu nível de acesso: <strong>{session.user.role}</strong>
            </span>
          )}
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

          <Link href="/dashboard">
            <Button className="flex items-center gap-2">
              <HomeIcon className="h-4 w-4" />
              Ir para o Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
