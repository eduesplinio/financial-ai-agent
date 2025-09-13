'use client';

import { useSession } from 'next-auth/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function GoalsContent() {
  const { data: session } = useSession();

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando metas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-semibold">Metas Financeiras</h1>
        <p className="text-muted-foreground">
          Defina e acompanhe seus objetivos financeiros
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Reserva de Emergência</CardTitle>
            <CardDescription>Meta: R$ 10.000,00</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso</span>
                <span>0%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: '0%' }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground">
                R$ 0,00 de R$ 10.000,00
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Viagem</CardTitle>
            <CardDescription>Meta: R$ 5.000,00</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso</span>
                <span>0%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: '0%' }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground">
                R$ 0,00 de R$ 5.000,00
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Investimentos</CardTitle>
            <CardDescription>Meta: R$ 20.000,00</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso</span>
                <span>0%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: '0%' }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground">
                R$ 0,00 de R$ 20.000,00
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Funcionalidade em Desenvolvimento</CardTitle>
            <CardDescription>
              Esta página está sendo desenvolvida
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">Em breve você poderá:</p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Criar metas financeiras personalizadas</li>
              <li>Acompanhar progresso em tempo real</li>
              <li>Receber notificações de marcos</li>
              <li>Definir prazos para suas metas</li>
              <li>Visualizar histórico de conquistas</li>
            </ul>
            <Link href="/dashboard">
              <Button variant="outline">Voltar ao Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
