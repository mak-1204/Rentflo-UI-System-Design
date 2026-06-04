import type { Metadata } from 'next';
import { AdminSidebar } from '@/components/modules/AdminSidebar';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Stayflo',
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: '#F8F9FA' }}>
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
