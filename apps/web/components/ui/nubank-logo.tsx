'use client';

interface NubankLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function NubankLogo({ className = '', size = 'md' }: NubankLogoProps) {
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-7 w-7',
    lg: 'h-10 w-10',
  };

  return (
    <div
      className={`${sizeClasses[size]} flex items-center justify-center ${className}`}
    >
      <img
        src="/nubank-logo.svg"
        alt="Nubank Logo"
        className="w-full h-full object-contain drop-shadow-sm"
      />
    </div>
  );
}
