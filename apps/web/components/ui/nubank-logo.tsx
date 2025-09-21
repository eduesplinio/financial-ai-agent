'use client';

interface NubankLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function NubankLogo({ className = '', size = 'md' }: NubankLogoProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <img
      src="/nubank-logo.svg"
      alt="Nubank Logo"
      className={`${sizeClasses[size]} object-contain ${className}`}
    />
  );
}
