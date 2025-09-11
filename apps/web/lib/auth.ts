import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

// Função para conectar ao MongoDB
async function connectDB() {
  console.log('DEBUG MONGODB_URI:', process.env.MONGODB_URI);
  const client = new MongoClient(process.env.MONGODB_URI!);
  await client.connect();
  return { client, db: client.db('financial_ai') };
}

// Configuração de cookies
const useSecureCookies =
  process.env.NEXTAUTH_URL?.startsWith('https://') ?? false;

// Configuração do NextAuth
export const authOptions: NextAuthOptions = {
  // Opções de sessão
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
    updateAge: 24 * 60 * 60, // Atualiza a sessão a cada 24 horas
  },

  // Configuração dos providers
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          console.log('🔐 Tentando autenticar:', credentials.email);
          const { client, db } = await connectDB();

          const user = await db.collection('users').findOne({
            email: (credentials.email as string).toLowerCase(),
          });

          if (!user || !user.password) {
            console.log('❌ Usuário não encontrado ou sem senha');
            await client.close();
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password as string
          );

          if (!isValid) {
            console.log('❌ Senha inválida');
            await client.close();
            return null;
          }

          console.log('✅ Autenticação bem-sucedida para:', user.email);
          await client.close();

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role || 'user',
          };
        } catch (error) {
          console.error('❌ Erro na autenticação:', error);
          return null;
        }
      },
    }),
  ],

  // Callbacks
  callbacks: {
    async jwt({ token, user, account }) {
      // Passa as informações do usuário para o token
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },

    async session({ session, token }) {
      // Passa as informações do token para a sessão
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Se a URL for uma rota de autenticação, redireciona para o dashboard
      if (url.startsWith('/auth')) {
        return `${baseUrl}/dashboard`;
      }

      // Se for a URL base, redireciona para o dashboard
      if (url === baseUrl || url === '/') {
        return `${baseUrl}/dashboard`;
      }

      // Se for uma URL relativa, adiciona a base
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }

      // Se for uma URL completa da mesma origem, retorna a URL
      try {
        const urlObj = new URL(url);
        if (urlObj.origin === baseUrl) {
          return url;
        }
      } catch (e) {
        console.error('Erro ao analisar URL:', e);
      }

      // Redirecionamento padrão para o dashboard
      return `${baseUrl}/dashboard`;
    },
  },

  // Páginas personalizadas
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },

  // Configuração de cookies
  cookies: {
    sessionToken: {
      name: `${useSecureCookies ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: useSecureCookies,
      },
    },
  },

  // Debug em desenvolvimento
  debug: process.env.NODE_ENV === 'development',

  // Logger
  logger: {
    error(code, metadata) {
      console.error('Auth error:', code, metadata);
    },
    warn(code) {
      console.warn('Auth warning:', code);
    },
    debug(code, metadata) {
      if (metadata) {
        console.debug('Auth debug:', code, metadata);
      } else {
        console.debug('Auth debug:', code);
      }
    },
  },

  // Chave secreta
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key',
};

// Inicializa o NextAuth
const handler = NextAuth(authOptions);

// Exporta os métodos necessários
export const { auth, signIn, signOut } = handler;

// Tipagem estendida para o módulo next-auth
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  }

  interface User {
    role?: string;
  }
}

export default handler;
