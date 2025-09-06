'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useIsMounted } from '@/hooks/use-client-side';

interface LogoutButtonProps {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function LogoutButton({
  variant = 'outline',
  size = 'default',
  className,
}: LogoutButtonProps) {
  const isMounted = useIsMounted();

  const handleLogout = async () => {
    // Limpa a informação de autenticação do localStorage
    if (isMounted) {
      localStorage.removeItem('userAuthenticated');
    }

    await signOut({
      callbackUrl: '/',
      redirect: true,
    });
  };

  return (
    <Button
      onClick={handleLogout}
      variant={variant}
      size={size}
      className={className}
    >
      <LogOut className="w-4 h-4 mr-2" />
      Sair
    </Button>
  );
}
