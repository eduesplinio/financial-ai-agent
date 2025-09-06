'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Limpar qualquer sessão existente primeiro
      await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'same-origin',
      });

      // Fazer login com as credenciais
      const result = await signIn('credentials', {
        email: email.trim(),
        password,
        redirect: false,
        callbackUrl: '/dashboard',
      });

      console.log('Resultado do login:', result);

      if (result?.error) {
        setError('Email ou senha incorretos');
        setLoading(false);
      } else if (result?.ok || result?.url) {
        // Mostrar estado de carregamento antes de redirecionar
        setLoading(true);
        setRedirecting(true);

        // Aguarda um momento para garantir que o estado de carregamento seja exibido
        setTimeout(() => {
          // Se o login for bem-sucedido, redireciona para o dashboard ou para a URL específica
          window.location.href = result?.url || '/dashboard';
        }, 800);
        return;
      } else {
        // Redirecionamento padrão em caso de sucesso sem URL específica
        setLoading(true);
        setRedirecting(true);

        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 800);
        return;
      }
    } catch (err) {
      console.error('Erro no login:', err);
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Se estiver redirecionando após um login bem-sucedido, mostrar tela de carregamento
  if (redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-6 text-lg text-gray-600">
            Redirecionando para o Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow">
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-8">
          Entrar
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <div>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email"
              disabled={loading}
            />
          </div>

          <div>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Senha"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Entrando...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
