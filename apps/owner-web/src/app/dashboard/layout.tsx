/**
 * src/app/(dashboard)/layout.tsx — Dashboard Shell (React Server Component)
 *
 * Route group `(dashboard)` groups all authenticated dashboard routes under a
 * shared layout WITHOUT affecting the URL path (no "/dashboard" segment added
 * by the folder name).
 *
 * Responsibilities:
 *  - Renders the fixed sidebar navigation (OwnerSidebar — "use client")
 *  - Renders the main scrollable content area
 *  - The <Outlet /> pattern from React Router is replaced by Next.js {children}
 */

import type { Metadata } from 'next';
import { OwnerSidebar } from '@/components/modules/OwnerSidebar';

export const metadata: Metadata = {
  title: 'Owner Dashboard',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-slate-50 to-[#14b8a6]/[0.03]">
      {/* Sidebar — client component (handles usePathname, localStorage, dropdowns) */}
      <OwnerSidebar />

      {/* Main scrollable content area
          mt-16 offsets the fixed mobile top header (visible only on mobile) */}
      <main className="flex-1 overflow-y-auto mt-16 md:mt-0 relative" id="main-content">
        {children}
      </main>
    </div>
  );
}
