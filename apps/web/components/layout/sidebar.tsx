'use client';

import { useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  User,
  LogOut,
  Settings,
  Sun,
  Moon,
  Laptop,
  Shield,
  LayoutDashboard,
  Receipt,
  MessageSquare,
  Target,
  HelpCircle,
  Menu,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: JSX.Element;
  role?: string;
}

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // Check if we're on mobile when component mounts
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      // Default to collapsed sidebar on mobile
      if (window.innerWidth < 1024) {
        setExpanded(false);
      }
    };

    // Initial check
    checkIfMobile();

    // Set up the event listener
    window.addEventListener('resize', checkIfMobile);

    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  if (!session) {
    return null;
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' });
  };

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const navItems: NavItem[] = [
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
      href: '#',
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      name: 'Metas',
      href: '/goals',
      icon: <Target className="h-5 w-5" />,
    },
  ];

  // Add conditional menu items based on user role
  if (session.user.role === 'admin') {
    navItems.push({
      name: 'Admin',
      href: '/admin',
      icon: <Shield className="h-5 w-5" />,
      role: 'admin',
    });
  }

  if (session.user.role === 'support') {
    navItems.push({
      name: 'Suporte',
      href: '/support',
      icon: <HelpCircle className="h-5 w-5" />,
      role: 'support',
    });
  }

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {/* Navigation Links */}
      <div
        className={cn(
          'flex-1 py-6 px-3 space-y-1 overflow-y-auto overflow-x-hidden',
          mobile && 'mt-10'
        )}
      >
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            onClick={mobile ? () => setMobileOpen(false) : undefined}
            className={cn(
              'flex items-center py-3 px-3 rounded-lg transition-colors no-underline',
              pathname === item.href
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              !expanded && !mobile && 'justify-center'
            )}
            style={{ textDecoration: 'none' }}
          >
            {item.icon}
            {(expanded || mobile) && <span className="ml-3">{item.name}</span>}
          </Link>
        ))}
      </div>

      {/* Toggle Button right before User Profile */}
      {!mobile && (
        <div className="px-3 mb-3">
          <button
            onClick={toggleSidebar}
            className={cn(
              'flex items-center py-3 px-3 rounded-lg transition-colors w-full overflow-hidden',
              'text-muted-foreground hover:bg-muted hover:text-foreground',
              !expanded && 'justify-center'
            )}
            aria-label={expanded ? 'Recolher' : 'Expandir'}
            type="button"
          >
            {expanded ? (
              <>
                <ChevronLeft className="h-5 w-5 flex-shrink-0" />
                <span className="ml-3 truncate">Recolher</span>
              </>
            ) : (
              <ChevronRight className="h-5 w-5 flex-shrink-0" />
            )}
          </button>
        </div>
      )}

      {/* User Profile Section */}
      <div
        className={cn(
          'border-t p-3',
          expanded || mobile
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
                !expanded && !mobile && 'justify-center'
              )}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {session.user.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              {(expanded || mobile) && (
                <div className="ml-2 text-left overflow-hidden">
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
          <DropdownMenuContent
            className="w-56 shadow-lg border border-border/40 bg-popover rounded-lg p-0.5"
            align={mobile ? 'center' : 'end'}
            side="top"
            sideOffset={5}
            forceMount
            style={{
              backgroundColor: 'hsl(var(--popover))',
            }}
          >
            <div className="py-1 px-0.5">
              <Link
                href="/profile"
                className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium no-underline hover:no-underline focus:no-underline active:no-underline hover:bg-muted/70 transition-colors"
              >
                <User className="h-4 w-4" />
                <div>Perfil</div>
              </Link>

              <Link
                href="/settings"
                className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium no-underline hover:no-underline focus:no-underline active:no-underline hover:bg-muted/70 transition-colors"
              >
                <Settings className="h-4 w-4" />
                <div>Configurações</div>
              </Link>

              {session.user.role === 'admin' && (
                <Link
                  href="/admin"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium no-underline hover:no-underline focus:no-underline active:no-underline hover:bg-muted/70 transition-colors"
                >
                  <Shield className="h-4 w-4" />
                  <div>Admin</div>
                </Link>
              )}
            </div>
            <DropdownMenuSeparator className="my-1 opacity-70" />

            {/* Appearance Section */}
            <div className="px-3 py-2 flex items-center justify-center">
              <div className="flex items-center gap-3 bg-muted/40 rounded-md p-1">
                <button
                  onClick={() => setTheme('light')}
                  className={`p-1.5 rounded-md transition-colors ${
                    theme === 'light'
                      ? 'bg-background shadow-sm'
                      : 'hover:bg-muted/80'
                  }`}
                  aria-label="Tema Claro"
                  title="Claro"
                >
                  <Sun className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`p-1.5 rounded-md transition-colors ${
                    theme === 'dark'
                      ? 'bg-background shadow-sm'
                      : 'hover:bg-muted/80'
                  }`}
                  aria-label="Tema Escuro"
                  title="Escuro"
                >
                  <Moon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setTheme('system')}
                  className={`p-1.5 rounded-md transition-colors ${
                    theme === 'system'
                      ? 'bg-background shadow-sm'
                      : 'hover:bg-muted/80'
                  }`}
                  aria-label="Tema do Sistema"
                  title="Sistema"
                >
                  <Laptop className="h-4 w-4" />
                </button>
              </div>
            </div>
            <DropdownMenuSeparator className="my-1 opacity-70" />

            <div className="py-1 px-0.5">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-muted/70 transition-colors text-sm font-medium"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );

  // Mobile Menu (appears only on mobile)
  if (isMobile) {
    return (
      <>
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-background border-b h-16 flex items-center justify-between px-4">
          <Link
            href="/dashboard"
            className="no-underline hover:no-underline flex items-center"
            style={{ textDecoration: 'none' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <span className="ml-2 text-xl font-bold">FinanceAI</span>
          </Link>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 overflow-x-hidden">
              <SheetHeader className="border-b p-4">
                <SheetTitle className="text-left flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary mr-2"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                  FinanceAI
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col h-full overflow-x-hidden">
                <SidebarContent mobile />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Add padding to accommodate fixed header */}
        <div className="h-16" />
      </>
    );
  }

  // Desktop Sidebar
  return (
    <div
      className={cn(
        'hidden lg:flex flex-col h-screen bg-background border-r transition-all duration-300 overflow-x-hidden',
        expanded ? 'w-64' : 'w-20',
        className
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-center p-4 border-b">
        {expanded ? (
          <Link
            href="/dashboard"
            className="no-underline hover:no-underline"
            style={{ textDecoration: 'none' }}
          >
            <div className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-primary"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              <span className="ml-2 text-xl font-bold">FinanceAI</span>
            </div>
          </Link>
        ) : (
          <Link
            href="/dashboard"
            className="no-underline hover:no-underline"
            style={{ textDecoration: 'none' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-primary"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </Link>
        )}
      </div>

      <SidebarContent />
    </div>
  );
}
