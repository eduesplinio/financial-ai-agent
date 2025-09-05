'use client';

import { useEffect, useState } from 'react';
import { useTheme as useNextTheme } from 'next-themes';

export function useTheme() {
  const { theme, setTheme, systemTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure we're showing the correct theme on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return {
    theme: mounted ? theme : 'light',
    systemTheme,
    resolvedTheme: mounted ? resolvedTheme : 'light',
    setTheme,
    toggleTheme,
    mounted,
  };
}
