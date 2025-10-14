import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'symbol' | 'text';
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className, variant = 'full', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  if (variant === 'symbol') {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-lg bg-green-600 text-white',
          sizeClasses[size],
          'aspect-square',
          className
        )}
      >
        <span className={cn(textSizeClasses[size], 'font-bold')}>L</span>
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <span
        className={cn(
          'font-bold text-green-600',
          textSizeClasses[size],
          className
        )}
      >
        Linio
      </span>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-lg bg-green-600 text-white',
          sizeClasses[size],
          'aspect-square'
        )}
      >
        <span className={cn(textSizeClasses[size], 'font-bold')}>L</span>
      </div>
      <span className={cn('font-bold text-green-600', textSizeClasses[size])}>
        Linio
      </span>
    </div>
  );
}
