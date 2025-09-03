import { AuthGuard } from '@/components/auth/auth-guard';
import { auth } from '@/lib/auth';

async function TestAuthContent() {
  let session;
  let error = null;

  try {
    session = await auth();
  } catch (e) {
    error = e;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Teste de Autenticação</h1>

      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold">Status da Sessão:</h2>
          <p>{session ? '✅ Sessão encontrada' : '❌ Nenhuma sessão'}</p>
        </div>

        {error && (
          <div className="p-4 border border-red-300 rounded bg-red-50">
            <h2 className="font-semibold text-red-600">Erro:</h2>
            <pre className="text-sm">{JSON.stringify(error, null, 2)}</pre>
          </div>
        )}

        {session && (
          <div className="p-4 border border-green-300 rounded bg-green-50">
            <h2 className="font-semibold text-green-600">Dados da Sessão:</h2>
            <pre className="text-sm">{JSON.stringify(session, null, 2)}</pre>
          </div>
        )}

        <div className="p-4 border rounded">
          <h2 className="font-semibold">Variáveis de Ambiente:</h2>
          <p>NEXTAUTH_URL: {process.env.NEXTAUTH_URL || 'Não definida'}</p>
          <p>
            NEXTAUTH_SECRET:{' '}
            {process.env.NEXTAUTH_SECRET ? 'Definida' : 'Não definida'}
          </p>
          <p>
            MONGODB_URI: {process.env.MONGODB_URI ? 'Definida' : 'Não definida'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TestAuthPage() {
  return (
    <AuthGuard requiredRole="user">
      <TestAuthContent />
    </AuthGuard>
  );
}
