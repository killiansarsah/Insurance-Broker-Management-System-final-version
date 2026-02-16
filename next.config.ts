import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/Insurance-Broker-Management-System-final-version',
  assetPrefix: '/Insurance-Broker-Management-System-final-version/',
};

export default nextConfig;
