import { useState, useEffect } from 'react';

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const breakpoints: Record<Breakpoint, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export function useMediaQuery(breakpoint: Breakpoint): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${breakpoints[breakpoint]}px)`);
    
    // Set initial value
    setMatches(mediaQuery.matches);
    
    // Create event listener
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };
    
    // Add event listener
    mediaQuery.addEventListener('change', listener);
    
    // Clean up
    return () => {
      mediaQuery.removeEventListener('change', listener);
    };
  }, [breakpoint]);

  return matches;
}

// Convenience hooks
export function useIsMobile() {
  return !useMediaQuery('md');
}

export function useIsTablet() {
  return useMediaQuery('md') && !useMediaQuery('lg');
}

export function useIsDesktop() {
  return useMediaQuery('lg');
}

export function useIsLargeDesktop() {
  return useMediaQuery('xl');
}

export function useIsExtraLargeDesktop() {
  return useMediaQuery('2xl');
}
