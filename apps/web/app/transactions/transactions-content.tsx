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

export function TransactionsContent() {
  const { data: session } = useSession();

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando transações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Transações</h1>
        <p className="text-muted-foreground">
          Gerencie e visualize suas transações financeiras
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Resumo Mensal</CardTitle>
            <CardDescription>Visão geral das transações do mês</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">R$ 0,00</p>
            <p className="text-sm text-muted-foreground">Saldo atual</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Receitas</CardTitle>
            <CardDescription>Total de entradas no mês</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">R$ 0,00</p>
            <p className="text-sm text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Despesas</CardTitle>
            <CardDescription>Total de saídas no mês</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">R$ 0,00</p>
            <p className="text-sm text-muted-foreground">Este mês</p>
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
              <li>Visualizar todas as suas transações</li>
              <li>Adicionar novas receitas e despesas</li>
              <li>Categorizar transações</li>
              <li>Gerar relatórios financeiros</li>
              <li>Exportar dados para Excel/PDF</li>
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
