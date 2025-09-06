'use client';

import { useEffect, useState } from 'react';
import { useTheme as useNextTheme } from 'next-themes';

export function useTheme() {
  const {
    theme,
    setTheme: nextSetTheme,
    systemTheme,
    resolvedTheme,
  } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure we're showing the correct theme on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  const setTheme = (value: string) => {
    // Temporarily disable transitions on the body to prevent animation on theme change
    document.documentElement.classList.add('disable-transitions');
    nextSetTheme(value);

    // Re-enable transitions after the theme has been applied
    setTimeout(() => {
      document.documentElement.classList.remove('disable-transitions');
    }, 10);
  };

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
