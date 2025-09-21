'use client';

interface NubankLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function NubankLogo({ className = '', size = 'md' }: NubankLogoProps) {
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-7 w-7',
    lg: 'h-9 w-9',
  };

  return (
    <img
      src="/nubank-logo.svg"
      alt="Nubank Logo"
      className={`${sizeClasses[size]} object-contain ${className}`}
    />
  );
}
