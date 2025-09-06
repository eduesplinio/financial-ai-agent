import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(request) {
    const { pathname } = request.nextUrl;
    const token = request.nextauth.token;

    // Lista de rotas públicas que não requerem autenticação
    const publicRoutes = [
      '/auth/signin',
      '/auth/signup',
      '/auth/error',
      '/',
      '/not-found',
      '/forbidden',
    ];

    // Verifica se é uma rota pública
    const isPublicRoute = publicRoutes.some(route =>
      pathname.startsWith(route)
    );

    // Se o usuário estiver autenticado e tentando acessar a página de login
    if (token && pathname.startsWith('/auth/signin')) {
      const url = new URL('/dashboard', request.url);
      return NextResponse.redirect(url);
    }

    // Para rotas inexistentes que não são públicas, redirecionar para not-found
    if (!token && !isPublicRoute) {
      // Se não houver token e não for rota pública, redireciona para login
      const signInUrl = new URL('/auth/signin', request.url);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token;
      },
    },
    pages: {
      signIn: '/auth/signin',
    },
  }
);

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
