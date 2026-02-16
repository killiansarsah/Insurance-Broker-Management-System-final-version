import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // If deploying to a subdirectory (e.g. project site), uncomment and set repo name:
  // basePath: '/Insurance-Broker-Management-System-final-version',
  // assetPrefix: '/Insurance-Broker-Management-System-final-version/',
};

export default nextConfig;
