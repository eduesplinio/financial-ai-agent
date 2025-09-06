'use client';

import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Laptop } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';

export function ThemeSwitcher() {
  const { theme, setTheme, mounted } = useTheme();
  const [showText, setShowText] = useState(false);

  // Aguarde o componente ser montado para evitar problemas de hidratação
  useEffect(() => {
    if (mounted) {
      // Em telas maiores, podemos mostrar o texto junto com o ícone
      const checkScreenSize = () => {
        setShowText(window.innerWidth >= 768); // md breakpoint
      };

      checkScreenSize();
      window.addEventListener('resize', checkScreenSize);

      return () => {
        window.removeEventListener('resize', checkScreenSize);
      };
    }
  }, [mounted]);

  // Não renderize nada até que o componente esteja montado para evitar erros de hidratação
  if (!mounted) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 px-2 md:px-3"
        >
          {theme === 'dark' ? (
            <Moon className="h-4 w-4" />
          ) : theme === 'system' ? (
            <Laptop className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
          {showText && (
            <span className="ml-1">
              {theme === 'dark'
                ? 'Escuro'
                : theme === 'system'
                  ? 'Sistema'
                  : 'Claro'}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className="cursor-pointer"
        >
          <Sun className="h-4 w-4 mr-2" />
          <span>Claro</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className="cursor-pointer"
        >
          <Moon className="h-4 w-4 mr-2" />
          <span>Escuro</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className="cursor-pointer"
        >
          <Laptop className="h-4 w-4 mr-2" />
          <span>Sistema</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
