import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Ensure internal monorepo packages are transpiled by Next.js SWC
  transpilePackages: ['@stayflo/ui', '@stayflo/utils', '@stayflo/types'],

  images: {
    remotePatterns: [
      { hostname: 'images.unsplash.com' },
      { hostname: 'hwughxyobkusujdxxlkg.supabase.co' },
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
