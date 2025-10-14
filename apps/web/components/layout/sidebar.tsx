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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
  Landmark,
  X,
} from 'lucide-react';
import { Logo } from '@/components/ui/logo';

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
  const [expanded, setExpanded] = useState(false);
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
      name: 'Integrações',
      href: '/integracoes',
      icon: <Landmark className="h-5 w-5" />,
    },
    {
      name: 'Transações',
      href: '/transactions',
      icon: <Receipt className="h-5 w-5" />,
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
          'flex-1 py-6 space-y-1.5 overflow-y-auto overflow-x-hidden transition-[padding] duration-500 ease-in-out',
          expanded || mobile ? 'px-3' : 'px-0',
          mobile && 'mt-10'
        )}
      >
        {navItems.map(item => (
          <div
            key={item.href}
            className={cn(
              'flex',
              expanded || mobile
                ? 'px-0 justify-start w-full'
                : 'px-0 justify-center'
            )}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  onClick={mobile ? () => setMobileOpen(false) : undefined}
                  className={cn(
                    'py-3 flex items-center rounded-lg transition-colors duration-200 no-underline',
                    pathname === item.href
                      ? 'bg-primary/10 !text-primary dark:bg-[#023430] dark:!text-emerald-400'
                      : 'text-muted-foreground hover:bg-primary/5 hover:text-primary dark:text-gray-300 dark:hover:bg-[#1C2D38] dark:hover:text-white',
                    expanded || mobile
                      ? 'justify-start px-0 w-full'
                      : 'justify-center min-w-[48px]'
                  )}
                  style={{ textDecoration: 'none' }}
                >
                  <div className="flex items-center justify-center min-w-[48px]">
                    {item.icon}
                  </div>
                  {(expanded || mobile) && (
                    <span className="whitespace-nowrap text-sm font-medium ml-0">
                      {item.name}
                    </span>
                  )}
                </Link>
              </TooltipTrigger>
              {!expanded && !mobile && (
                <TooltipContent
                  side="right"
                  className="bg-popover border border-border shadow-md"
                >
                  {item.name}
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        ))}
      </div>

      {/* Toggle Button right before User Profile - aligns with nav buttons when expanded, centered when collapsed */}
      {!mobile && (
        <div>
          <div
            className={cn(
              'flex py-3',
              expanded ? 'px-3 justify-start' : 'px-0 justify-center'
            )}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleSidebar}
                  className={cn(
                    'py-3 min-w-[48px] flex items-center rounded-lg transition-colors duration-200',
                    'text-muted-foreground hover:bg-primary/5 hover:text-primary',
                    'dark:text-gray-300 dark:hover:bg-[#1C2D38] dark:hover:text-white',
                    expanded ? 'justify-start px-0' : 'justify-center'
                  )}
                  aria-label={expanded ? 'Recolher' : 'Expandir'}
                  type="button"
                  style={expanded ? { marginLeft: 0 } : {}}
                >
                  <div className="flex items-center justify-center min-w-[48px]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2V5H6Zm4 0v14h8a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-8ZM3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent
                side={expanded ? 'left' : 'right'}
                className="bg-popover border border-border shadow-md"
              >
                {expanded ? 'Recolher' : 'Expandir'}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      )}

      {/* User Profile Section */}
      <div className="border-t border-gray-200 dark:border-gray-600/30">
        <div
          className={cn(
            'p-3 transition-all duration-500 ease-in-out',
            expanded || mobile
              ? 'flex items-center justify-between'
              : 'flex flex-col items-center'
          )}
        >
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      'flex items-center w-full rounded-lg transition-all duration-200 ease-in-out',
                      'hover:bg-primary/5 hover:text-primary dark:hover:bg-[#1C2D38] dark:hover:text-white',
                      !expanded && !mobile
                        ? 'justify-center px-0'
                        : 'justify-start px-2'
                    )}
                  >
                    <div className="flex items-center justify-center min-w-[48px]">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback className="dark:bg-[#023430] dark:text-emerald-400">
                          {session.user.name?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div
                      className={cn(
                        'text-left overflow-hidden transition-all duration-500 ease-in-out',
                        expanded || mobile
                          ? 'w-auto opacity-100 max-w-[200px] translate-x-0'
                          : 'w-0 opacity-0 max-w-0 -translate-x-4'
                      )}
                    >
                      <div className="transform transition-transform duration-500 ease-in-out">
                        <p className="text-sm font-medium truncate">
                          {session.user.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {session.user.email}
                        </p>
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent
                side={expanded ? 'left' : 'right'}
                className="bg-popover border border-border shadow-md"
              >
                {expanded
                  ? 'Configurações de perfil'
                  : 'Perfil e configurações'}
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent
              className="w-40 shadow-lg border border-border bg-white dark:bg-[#1C2D38] rounded-lg p-0.5"
              align={mobile ? 'center' : 'end'}
              side="top"
              sideOffset={5}
              forceMount
            >
              <div className="py-1 px-0.5 border-b border-gray-300 dark:border-border/40">
                <Link
                  href="/profile"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-green-400 hover:text-green-300 no-underline hover:no-underline focus:no-underline active:no-underline hover:bg-muted/70 transition-colors"
                >
                  <User className="h-4 w-4" />
                  <div>Perfil</div>
                </Link>

                <Link
                  href="/settings"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-green-400 hover:text-green-300 no-underline hover:no-underline focus:no-underline active:no-underline hover:bg-muted/70 transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  <div>Configurações</div>
                </Link>

                {session.user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-green-400 hover:text-green-300 no-underline hover:no-underline focus:no-underline active:no-underline hover:bg-muted/70 transition-colors"
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
                    className={`p-1.5 rounded-md ${
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
                    className={`p-1.5 rounded-md ${
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
                    className={`p-1.5 rounded-md ${
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
      </div>
    </>
  );

  // Mobile Menu (appears only on mobile)
  if (isMobile) {
    return (
      <TooltipProvider
        delayDuration={500}
        disableHoverableContent
        skipDelayDuration={0}
      >
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-background border-b border-gray-200 dark:border-gray-600/30 h-16 flex items-center justify-between px-4">
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
              className="h-6 w-6 text-primary dark:text-emerald-400"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <Logo variant="text" size="md" />
          </Link>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-56 p-0 overflow-x-hidden">
              <SheetHeader className="border-b border-gray-200 dark:border-gray-600/30 p-4">
                <SheetTitle className="text-left flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary dark:text-emerald-400 mr-2"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                  <Logo variant="text" size="sm" />
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
      </TooltipProvider>
    );
  }

  // Desktop Sidebar
  return (
    <TooltipProvider
      delayDuration={500}
      disableHoverableContent
      skipDelayDuration={0}
    >
      <div
        className={cn(
          'hidden lg:flex flex-col h-screen transition-[width] duration-500 ease-in-out overflow-x-hidden border-r border-gray-200 dark:border-gray-600/30',
          'bg-gray-50 dark:bg-[#102733]',
          expanded ? 'w-56' : 'w-16',
          className
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-center p-4 border-b border-gray-200 dark:border-gray-600/30 overflow-hidden">
          <Link
            href="/dashboard"
            className="no-underline hover:no-underline transition-all duration-500 ease-in-out"
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
                className="h-8 w-8 text-primary dark:text-emerald-400 transition-transform duration-500 ease-in-out"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              {expanded && (
                <div className="ml-2 transition-opacity duration-500 ease-in-out">
                  <Logo variant="text" size="md" />
                </div>
              )}
            </div>
          </Link>
        </div>

        {/* Only SidebarContent, toggle button is inside SidebarContent above profile */}
        <SidebarContent />
      </div>
    </TooltipProvider>
  );
}
