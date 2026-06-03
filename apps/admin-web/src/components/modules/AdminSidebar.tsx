'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Building, Users, CreditCard, IndianRupee, UserCheck, MessageSquareText } from 'lucide-react';
import { RentfloLogo } from '@rentflo/ui';
import { Avatar, AvatarFallback } from '@rentflo/ui';
import { Badge } from '@rentflo/ui';

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { path: '/admin', label: 'Overview', icon: Home, exact: true },
    { path: '/admin/pgs', label: 'PGs', icon: Building },
    { path: '/admin/owners', label: 'Owners', icon: Users },
    { path: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
    { path: '/admin/payments', label: 'Payments', icon: IndianRupee },
    { path: '/admin/leads', label: 'Leads', icon: UserCheck },
    { path: '/admin/support', label: 'Support Tickets', icon: MessageSquareText },
  ];

  return (
    <div className="w-60 bg-white border-r flex flex-col h-screen" style={{ borderColor: '#E5E7EB' }}>
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: '#E5E7EB' }}>
        <div className="flex items-center gap-2">
          <RentfloLogo className="text-2xl" />
          <Badge style={{ background: '#FAECE7', color: '#993C1D', fontSize: '11px', padding: '2px 8px' }}>
            Admin
          </Badge>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.path
            : pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              href={item.path}
              className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
              style={{
                background: isActive ? '#FAECE7' : 'transparent',
                color: isActive ? '#993C1D' : '#6B7280'
              }}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Profile */}
      <div className="p-4 border-t" style={{ borderColor: '#E5E7EB' }}>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback style={{ background: '#993C1D', color: '#FFFFFF' }}>SA</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: '#111827' }}>Super Admin</p>
            <button
              onClick={() => router.push('/')}
              className="text-xs hover:underline"
              style={{ color: '#6B7280' }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
