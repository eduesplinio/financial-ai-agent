'use client';

interface NubankLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function NubankLogo({ className = '', size = 'md' }: NubankLogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  return (
    <img
      src="/nubank-logo.svg"
      alt="Nubank Logo"
      className={`${sizeClasses[size]} object-contain ${className}`}
    />
  );
}
