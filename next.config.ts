import type { NextConfig } from "next";

// Use STATIC_EXPORT=true for GitHub Pages deployment: STATIC_EXPORT=true npx next build
const isStaticExport = process.env.STATIC_EXPORT === 'true';

const REPO_NAME = 'Insurance-Broker-Management-System-final-version';

const nextConfig: NextConfig = {
  ...(isStaticExport ? { output: 'export' as const } : {}),
  images: {
    // Keep unoptimized only for static export builds.
    unoptimized: isStaticExport,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        pathname: '/uploads/**',
      },
    ],
  },
  turbopack: {
    root: __dirname,
  },
  basePath: isStaticExport ? `/${REPO_NAME}` : '',
  assetPrefix: isStaticExport ? `/${REPO_NAME}/` : '',
  trailingSlash: true,
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'recharts',
      'date-fns',
      'framer-motion',
    ],
  },
  compiler: {
    removeConsole: isStaticExport ? { exclude: ['error', 'warn'] } : false,
  },
};

export default nextConfig;
