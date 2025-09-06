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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <p className="mt-6 text-lg text-muted-foreground">
            Redirecionando para o Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-8 bg-card rounded-lg shadow">
        <h2 className="text-center text-3xl font-bold text-card-foreground mb-8">
          Entrar
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 border-l-4 border-destructive p-4 dark:bg-destructive/20">
              <p className="text-sm text-destructive font-medium">{error}</p>
            </div>
          )}

          <div>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70 bg-background"
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
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/70 bg-background"
              placeholder="Senha"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center"
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
