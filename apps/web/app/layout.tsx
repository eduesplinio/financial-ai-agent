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
  title: 'Linio - Assistente de IA Financeira',
  description:
    'Transforme sua vida financeira com inteligência artificial. Linio oferece orientação personalizada, análise de gastos e planejamento financeiro inteligente.',
  keywords: [
    'IA financeira',
    'assistente financeiro',
    'planejamento financeiro',
    'análise de gastos',
    'investimentos',
    'Linio',
  ],
  authors: [{ name: 'Linio Team' }],
  openGraph: {
    title: 'Linio - Assistente de IA Financeira',
    description: 'Transforme sua vida financeira com inteligência artificial',
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Linio - Assistente de IA Financeira',
    description: 'Transforme sua vida financeira com inteligência artificial',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg?v=2" />
        <link rel="shortcut icon" href="/favicon.svg?v=2" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
