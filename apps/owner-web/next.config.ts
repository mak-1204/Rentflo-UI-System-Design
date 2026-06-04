import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Ensure internal monorepo packages are transpiled by Next.js SWC
  transpilePackages: ['@stayflo/ui', '@stayflo/utils', '@stayflo/types'],

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
    ],
  },

  // Strict mode catches potential RSC/client boundary issues early
  reactStrictMode: true,

  // Next.js 15: fetch() is no longer cached by default (changed from Next.js 14).
  // We control caching explicitly via `next: { revalidate }` in api-client.ts,
  // so no global override needed here.
  // staleTimes configures the client-side Router Cache (prefetch TTL).
  experimental: {
    staleTimes: {
      dynamic: 30,   // dynamic pages cached client-side for 30s
      static: 180,   // static pages cached client-side for 3min
    },
  },
};

export default nextConfig;
