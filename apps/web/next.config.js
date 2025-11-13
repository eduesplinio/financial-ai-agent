/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  images: {
    domains: ['localhost'],
  },
  // Environment variables are handled by .env files
  // Enable strict mode for better development experience
  reactStrictMode: true,
  // Optimize bundle size
  swcMinify: true,
  // Disable ESLint during build (run separately)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Enable experimental features
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
  // Exclude packages from transpilation
  transpilePackages: [],
  // Exclude ai package from build
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('@financial-ai/ai');
    }
    return config;
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

// Configuração para garantir que o middleware não interfira nas rotas de autenticação
const withAuthRoutes = {
  ...nextConfig,
  async headers() {
    return [
      {
        source: '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = withAuthRoutes;
