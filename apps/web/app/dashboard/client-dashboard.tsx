'use client';

import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export function ClientDashboard() {
  const { data: session } = useSession();

  if (!session?.user) {
    return null; // Não renderiza nada se não tiver usuário
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao seu Agente Financeiro IA,{' '}
          {session.user.name || session.user.email}!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>
              Gerencie suas informações pessoais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/profile">
              <Button className="w-full">Ver Perfil</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transações</CardTitle>
            <CardDescription>
              Visualize e analise suas transações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>
              Em breve
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chat IA</CardTitle>
            <CardDescription>
              Converse com seu assistente financeiro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>
              Em breve
            </Button>
          </CardContent>
        </Card>

        {session.user.role === 'admin' && (
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Painel Admin</CardTitle>
              <CardDescription>
                Acesso exclusivo para administradores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin">
                <Button className="w-full" variant="destructive">
                  Acessar Admin
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {session.user.role === 'support' && (
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-600">Suporte</CardTitle>
              <CardDescription>
                Ferramentas de suporte ao usuário
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                Ferramentas de Suporte
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Informações da Sessão</CardTitle>
            <CardDescription>
              Detalhes da sua sessão atual e permissões RBAC
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>Nome:</strong> {session.user.name || 'Não informado'}
              </p>
              <p>
                <strong>Email:</strong> {session.user.email}
              </p>
              <p>
                <strong>Função:</strong>{' '}
                <span className="capitalize font-semibold text-blue-600">
                  {session.user.role || 'user'}
                </span>
              </p>
              <p>
                <strong>ID:</strong> {session.user.id}
              </p>

              <div className="mt-4 pt-4 border-t">
                <p className="font-semibold mb-2">
                  Permissões baseadas na função:
                </p>
                <div className="flex flex-wrap gap-2">
                  {session.user.role === 'admin' && (
                    <>
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                        Admin Total
                      </span>
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                        Gerenciar Usuários
                      </span>
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                        Logs do Sistema
                      </span>
                    </>
                  )}
                  {session.user.role === 'support' && (
                    <>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        Suporte
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        Ver Perfis
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        Assistir Usuários
                      </span>
                    </>
                  )}
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                    Perfil Próprio
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                    Transações
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                    Chat IA
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                    Metas
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
