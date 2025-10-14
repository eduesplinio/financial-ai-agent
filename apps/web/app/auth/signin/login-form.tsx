'use client';

import { useState, useEffect, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { BRAND } from '@/lib/branding';

export function LoginForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Pequeno delay para Safari processar a renderização
    const timer = setTimeout(() => {
      if (isSignUp && nameInputRef.current) {
        nameInputRef.current.focus();
      } else if (!isSignUp && emailInputRef.current) {
        emailInputRef.current.focus();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isSignUp]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        // Criar nova conta
        if (password.length < 6) {
          setError('Senha deve ter pelo menos 6 caracteres');
          setLoading(false);
          return;
        }

        const registerResponse = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email: email.trim(), password }),
        });

        const registerData = await registerResponse.json();

        if (!registerResponse.ok) {
          setError(registerData.message || 'Erro ao criar conta');
          setLoading(false);
          return;
        }

        // Auto login após cadastro
        const result = await signIn('credentials', {
          email: email.trim(),
          password,
          redirect: false,
          callbackUrl: '/dashboard',
        });

        if (result?.error) {
          setError(
            'Conta criada, mas erro ao fazer login. Tente entrar manualmente.'
          );
          setLoading(false);
          return;
        }

        setRedirecting(true);
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 800);
        return;
      } else {
        // Login normal
        await fetch('/api/auth/signout', {
          method: 'POST',
          credentials: 'same-origin',
        });

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
          setLoading(true);
          setRedirecting(true);

          setTimeout(() => {
            window.location.href = result?.url || '/dashboard';
          }, 800);
          return;
        } else {
          setLoading(true);
          setRedirecting(true);

          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 800);
          return;
        }
      }
    } catch (err) {
      console.error('Erro:', err);
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Arte de fundo - Formas geométricas abstratas representando finanças */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10"></div>

      {/* Círculos decorativos */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

      {/* Formas geométricas - representando gráficos e crescimento financeiro */}
      <div className="absolute top-1/4 left-10 w-32 h-32 border-2 border-primary/20 rounded-lg rotate-12 hidden md:block"></div>
      <div className="absolute bottom-1/3 right-16 w-24 h-24 border-2 border-primary/15 rounded-full hidden md:block"></div>
      <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-primary/10 rounded-lg -rotate-12 hidden lg:block"></div>

      {/* Linhas decorativas - representando conexões e dados */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-primary"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <div className="relative max-w-md w-full">
        {/* Título */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {BRAND.name}
          </h1>
          <p className="text-muted-foreground">{BRAND.tagline}</p>
        </div>

        {/* Card de Login */}
        <div className="bg-card/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-border">
          <h2 className="text-2xl font-semibold text-card-foreground mb-6 text-center">
            {isSignUp ? 'Criar sua conta' : 'Entrar na sua conta'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded-r">
                <p className="text-sm text-destructive font-medium">{error}</p>
              </div>
            )}

            {isSignUp && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Nome completo
                </label>
                <input
                  ref={nameInputRef}
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg transition-all"
                  placeholder="Seu nome"
                  disabled={loading}
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Email
              </label>
              <input
                ref={emailInputRef}
                id="email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg transition-all"
                placeholder="seu@email.com"
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg transition-all"
                placeholder={isSignUp ? 'Mínimo 6 caracteres' : '••••••••'}
                disabled={loading}
                minLength={isSignUp ? 6 : undefined}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-primary text-primary-foreground font-medium rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2"></div>
                  {isSignUp ? 'Criando conta...' : 'Entrando...'}
                </>
              ) : isSignUp ? (
                'Criar conta'
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          {/* Toggle entre Login e Cadastro */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setName('');
                setEmail('');
                setPassword('');
              }}
              className="text-sm text-primary hover:underline"
              disabled={loading}
            >
              {isSignUp
                ? 'Já tem uma conta? Entrar'
                : 'Não tem conta? Criar agora'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-sm text-muted-foreground">
          Protegido e seguro com criptografia de ponta a ponta
        </p>
      </div>
    </div>
  );
}
