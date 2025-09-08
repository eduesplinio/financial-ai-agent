import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './no-underline.css';
import { Providers } from '@/components/providers';
import { Sidebar } from '@/components/layout/sidebar';
import dynamic from 'next/dynamic';

// Importação dinâmica do ErrorBoundary para evitar erros de SSR
const ErrorBoundary = dynamic(() => import('@/components/error-boundary'), {
  ssr: false,
});

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Financial AI Agent',
  description: 'AI-powered financial advisor using RAG architecture',
  keywords: ['finance', 'AI', 'advisor', 'RAG', 'financial planning'],
  authors: [{ name: 'Financial AI Team' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4 lg:p-6 pt-20 lg:pt-6">
              <ErrorBoundary>{children}</ErrorBoundary>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
