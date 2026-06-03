'use client';

import dynamic from 'next/dynamic';

export const PortfolioClient = dynamic(
  () => import('@screens/PW2-Hero').then((mod) => mod.PortfolioHero),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-screen bg-[#0D0D0D] text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#1D9E75] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-400 font-medium">Loading Interactive Tour…</p>
        </div>
      </div>
    ),
  }
);
