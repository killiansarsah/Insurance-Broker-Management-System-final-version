import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const REPO_NAME = 'Insurance-Broker-Management-System-final-version';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: isProd ? `/${REPO_NAME}` : '',
  assetPrefix: isProd ? `/${REPO_NAME}/` : '',
  trailingSlash: true,
};

export default nextConfig;
