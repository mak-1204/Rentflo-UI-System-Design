'use client';

import dynamic from 'next/dynamic';

export const WebsiteBuilderClient = dynamic(
  () => import('@screens/OW5-WebsiteBuilder').then((mod) => mod.OwnerWebsiteBuilder),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-screen bg-[#F8F9FA]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#14b8a6] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-500 font-medium">Loading Blueprint Editor…</p>
        </div>
      </div>
    ),
  }
);
