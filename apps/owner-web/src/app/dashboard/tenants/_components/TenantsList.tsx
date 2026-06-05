'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Card } from '@stayflo/ui';
import type { Tenant } from '../types';

interface TenantsListProps {
  tenants: Tenant[];
  search: string;
  onSearchChange: (value: string) => void;
  selectedIndex: number | null;
  onSelectTenant: (index: number) => void;
}

export function TenantsList({
  tenants,
  search,
  onSearchChange,
  selectedIndex,
  onSelectTenant,
}: TenantsListProps) {
  const [localSearch, setLocalSearch] = useState(search);

  // Sync external search value changes
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Debounce input updates to parent search state
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(localSearch);
    }, 300);
    return () => clearTimeout(handler);
  }, [localSearch, onSearchChange]);

  const filtered = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.room.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by resident name or room number..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 rounded-xl bg-[#f8fafc] transition-all shadow-inner"
        />
      </div>

      {/* Table */}
      <Card className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Tenant</th>
                <th className="px-6 py-4">PG Property</th>
                <th className="px-6 py-4">Room Info</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Monthly Rent</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Move-In Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 bg-white">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-xs text-slate-400 font-medium">
                    No tenants match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => {
                  const originalIndex = tenants.findIndex((x) => x.phone === t.phone);
                  const isSelected = selectedIndex === originalIndex;
                  return (
                    <tr
                      key={t.phone}
                      onClick={() => onSelectTenant(originalIndex)}
                      className={`hover:bg-slate-50/40 transition-colors cursor-pointer duration-200 ${
                        isSelected ? 'bg-teal-50/[0.15] border-l-4 border-l-[#14b8a6]' : ''
                      }`}
                    >
                      {/* Avatar + Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-9 h-9 rounded-full bg-teal-50 text-[#14b8a6] flex items-center justify-center font-bold text-xs uppercase border border-teal-100/30 flex-shrink-0">
                            {t.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <span className="font-bold text-slate-900">{t.name}</span>
                        </div>
                      </td>
                      {/* PG Property */}
                      <td className="px-6 py-4">
                        {t.pg_name ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-teal-50 text-teal-700 text-[10px] font-bold rounded-md border border-teal-100 whitespace-nowrap">
                            🏠 {t.pg_name}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-medium">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-600">
                        {t.room} · {t.floor}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-slate-400 font-medium space-y-0.5">
                          <p>{t.phone}</p>
                          <p className="truncate max-w-[150px]">{t.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-800">
                        ₹{t.rent.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
                          style={{
                            background: t.status === 'Paid' ? '#f0fdfa' : '#FCEBEB',
                            color: t.status === 'Paid' ? '#0f766e' : '#791F1F',
                            borderColor:
                              t.status === 'Paid'
                                ? 'rgba(20,184,166,0.1)'
                                : 'rgba(239,68,68,0.1)',
                          }}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-400">
                        {t.moveIn}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
