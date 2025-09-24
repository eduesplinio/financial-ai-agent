'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { routeExists } from '@/lib/route-utils';
import { ReactNode } from 'react';

interface SafeLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function SafeLink({
  href,
  children,
  className,
  onClick,
}: SafeLinkProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    // Verifica se é uma URL externa ou um link de ancoragem
    if (
      href.startsWith('http') ||
      href.startsWith('#') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:')
    ) {
      if (onClick) onClick();
      return; // Deixa o comportamento padrão para links externos
    }

    // Para links internos, verifica se a rota existe
    if (!routeExists(href)) {
      e.preventDefault();
      router.push('/not-found');
      return;
    }

    if (onClick) onClick();
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
