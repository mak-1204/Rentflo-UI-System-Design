'use client';

import { Plus } from 'lucide-react';
import { Button } from '@stayflo/ui';

interface TenantsHeaderProps {
  onAddTenant: () => void;
}

export function TenantsHeader({ onAddTenant }: TenantsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1
          className="text-3xl font-extrabold tracking-tight text-slate-900"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Tenants Directory
        </h1>
        <p className="text-xs text-slate-400 mt-1.5 font-medium">
          Manage tenant profiles, stay details, room rents, and KYC documents
        </p>
      </div>
      <Button
        style={{ background: '#14b8a6', color: '#FFFFFF' }}
        className="hover:opacity-95 active:scale-98 whitespace-nowrap rounded-xl text-xs font-bold h-10 px-4 transition-all shadow-md shadow-teal-500/10 border-none cursor-pointer"
        onClick={onAddTenant}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Tenant
      </Button>
    </div>
  );
}
