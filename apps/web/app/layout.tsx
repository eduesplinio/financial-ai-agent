import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './no-underline.css';
import { Providers } from '@/components/providers';
import { AppShell } from '@/components/layout/app-shell';

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
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
