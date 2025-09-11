'use client';

import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { routeExists } from '@/lib/route-utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  User,
  LogOut,
  Settings,
  Shield,
  LayoutDashboard,
  Receipt,
  MessageSquare,
  Target,
  LifeBuoy,
  Menu,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);

  if (!session) {
    return null;
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' });
  };

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: 'Transações',
      href: '/transactions',
      icon: <Receipt className="h-5 w-5" />,
    },
    {
      name: 'Chat IA',
      href: '/chat',
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      name: 'Metas',
      href: '/goals',
      icon: <Target className="h-5 w-5" />,
    },
    {
      name: 'Integrações',
      href: '/integracoes',
      icon: <LifeBuoy className="h-5 w-5" />,
    },
  ];

  // Add conditional menu items based on user role
  if (session.user.role === 'admin') {
    navItems.push({
      name: 'Admin',
      href: '/admin',
      icon: <Shield className="h-5 w-5" />,
    });
  }

  if (session.user.role === 'support') {
    navItems.push({
      name: 'Suporte',
      href: '/support',
      icon: <LifeBuoy className="h-5 w-5" />,
    });
  }

  return (
    <div
      className={cn(
        'flex flex-col h-screen bg-background border-r transition-all duration-300',
        expanded ? 'w-64' : 'w-20',
        className
      )}
    >
      {/* Logo and Toggle */}
      <div className="flex items-center justify-between p-4 border-b">
        {expanded ? (
          <Link href="/dashboard" className="text-xl font-bold">
            Agente Financeiro IA
          </Link>
        ) : (
          <Link href="/dashboard" className="text-xl font-bold mx-auto">
            AI
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="ml-2"
        >
          {expanded ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center py-3 px-3 rounded-lg transition-colors',
              pathname === item.href
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              !expanded && 'justify-center'
            )}
          >
            {item.icon}
            {expanded && <span className="ml-3">{item.name}</span>}
          </Link>
        ))}
      </div>

      {/* User Profile Section */}
      <div
        className={cn(
          'border-t p-3',
          expanded
            ? 'flex items-center justify-between'
            : 'flex flex-col items-center'
        )}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                'flex items-center w-full px-2 rounded-lg',
                !expanded && 'justify-center'
              )}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {session.user.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              {expanded && (
                <div className="ml-3 text-left overflow-hidden">
                  <p className="text-sm font-medium truncate">
                    {session.user.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {session.user.email}
                  </p>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {session.user.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session.user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </Link>
            </DropdownMenuItem>
            {session.user.role === 'admin' && (
              <DropdownMenuItem asChild>
                <Link href="/admin">
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Painel Admin</span>
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
