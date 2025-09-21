'use client';

import { useState } from 'react';

interface NubankLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function NubankLogo({ className = '', size = 'md' }: NubankLogoProps) {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  // SVG do logo do Nubank (roxo)
  const nubankSVG = (
    <svg
      viewBox="0 0 24 24"
      className={`${sizeClasses[size]} ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" fill="#8A05BE" />
      <path
        d="M8 12L10.5 9.5L16 15"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  // URLs para tentar
  const logoUrls = [
    'https://nubank.com.br/images/nu-logo.png',
    'https://assets.nubank.com.br/images/nu-logo.png',
    'https://cdn.nubank.com.br/images/nu-logo.png',
    'https://logos.bancos.com.br/nubank.png',
  ];

  if (hasError) {
    return nubankSVG;
  }

  return (
    <>
      {logoUrls.map((url, index) => (
        <img
          key={url}
          src={url}
          alt="Nubank Logo"
          className={`${sizeClasses[size]} object-contain ${className} ${
            index > 0 ? 'hidden' : ''
          }`}
          onError={() => {
            if (index === logoUrls.length - 1) {
              setHasError(true);
            }
          }}
          onLoad={() => setHasError(false)}
        />
      ))}
      {hasError && nubankSVG}
    </>
  );
}
