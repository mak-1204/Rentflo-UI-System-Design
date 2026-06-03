import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Ensure internal monorepo packages are transpiled by Next.js SWC
  transpilePackages: ['@rentflo/ui', '@rentflo/utils', '@rentflo/types'],

  images: {
    remotePatterns: [
      { hostname: 'images.unsplash.com' },
    ],
  },

  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
};

export default nextConfig;
