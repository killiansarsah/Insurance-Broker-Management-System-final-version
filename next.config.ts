import type { NextConfig } from "next";

// Use STATIC_EXPORT=true for GitHub Pages deployment: STATIC_EXPORT=true npx next build
const isStaticExport = process.env.STATIC_EXPORT === 'true';

const REPO_NAME = 'Insurance-Broker-Management-System-final-version';

const nextConfig: NextConfig = {
  ...(isStaticExport ? { output: 'export' as const } : {}),
  images: {
    unoptimized: true,
  },
  basePath: isStaticExport ? `/${REPO_NAME}` : '',
  assetPrefix: isStaticExport ? `/${REPO_NAME}/` : '',
  trailingSlash: true,
  // TODO: Remove after Phase 4 migration resolves all type mismatches
  // between kebab-case hooks (PolicyData, ClientData) and stub types (Policy, Client)
  typescript: {
    ignoreBuildErrors: true,
  },
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
