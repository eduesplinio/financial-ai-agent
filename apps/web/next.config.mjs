/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
    serverComponentsExternalPackages: ['mongoose'],
  },
  images: {
    domains: ['localhost'],
  },
  // Enable strict mode for better development experience
  reactStrictMode: true,
  // Optimize bundle size
  swcMinify: true,
  // Configure SWC to handle modern JavaScript features
  compiler: {
    // Enable modern JavaScript features
    target: 'es2022',
  },
  // Webpack configuration to handle undici and other Node.js modules
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        undici: false,
        cheerio: false,
      };
    }
    
    // Exclude undici and cheerio from client bundle
    config.externals = config.externals || [];
    if (!isServer) {
      config.externals.push('undici', 'cheerio');
    }
    
    // Handle module resolution for undici and cheerio
    config.resolve.alias = {
      ...config.resolve.alias,
      undici: false,
      cheerio: false,
    };
    
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
            key: 'X-XSS-Protection',
            value: '1; mode=block',
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

export default nextConfig;
