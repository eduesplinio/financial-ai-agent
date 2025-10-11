'use client';

import { useState } from 'react';
import { CreditCard, Building2, Wallet } from 'lucide-react';

interface BankLogoProps {
  logoUrl?: string;
  logoUrls?: string[];
  institutionName: string;
  institutionType?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function BankLogo({
  logoUrl,
  logoUrls = [],
  institutionName,
  institutionType,
  className = '',
  size = 'md',
}: BankLogoProps) {
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Tamanhos baseados no prop size
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  // URLs para tentar (logoUrl primeiro, depois logoUrls)
  const urlsToTry = [...(logoUrl ? [logoUrl] : []), ...logoUrls];

  const currentUrl = urlsToTry[currentUrlIndex];

  const handleError = () => {
    console.log(`Logo failed to load: ${currentUrl}`);
    if (currentUrlIndex < urlsToTry.length - 1) {
      // Tentar próxima URL
      setCurrentUrlIndex(currentUrlIndex + 1);
      setIsLoading(true);
    } else {
      // Todas as URLs falharam
      setHasError(true);
      setIsLoading(false);
    }
  };

  const handleLoad = () => {
    console.log(`Logo loaded successfully: ${currentUrl}`);
    setIsLoading(false);
    setHasError(false);
  };

  const getInstitutionIcon = () => {
    switch (institutionType?.toLowerCase()) {
      case 'bank':
        return <Building2 className={`${sizeClasses[size]} text-purple-600`} />;
      case 'fintech':
        return (
          <CreditCard className={`${sizeClasses[size]} text-purple-600`} />
        );
      default:
        return <Wallet className={`${sizeClasses[size]} text-purple-600`} />;
    }
  };

  // Se não há URLs ou todas falharam, mostrar ícone
  if (!urlsToTry.length || hasError) {
    return (
      <div className={`${sizeClasses[size]} ${className}`}>
        {getInstitutionIcon()}
      </div>
    );
  }

  return (
    <img
      src={currentUrl}
      alt={`Logo ${institutionName}`}
      className={`${sizeClasses[size]} object-contain ${className}`}
      onError={handleError}
      onLoad={handleLoad}
    />
  );
}
