import { useState } from 'react'; import { useRouter } from 'next/navigation'; import { Search, SlidersHorizontal, Eye, MoreVertical } from 'lucide-react'; import { Card } from '@rentflo/ui';
import { Badge } from '@rentflo/ui';
import { Button } from '@rentflo/ui';

export function AdminPGsList() {
  const router = useRouter();
  const [filter, setFilter] = useState('All');

  const pgs = [
    { id: 'SUNPG', name: 'Sunrise PG', owner: 'Rajan S.', city: 'Bengaluru', rooms: 12, tenants: 11, plan: 'PG Plan', status: 'Active', joined: '12 Jan 2025' },
    { id: 'ZOLPG', name: 'Zolo Stay Koramangala', owner: 'Amit Kumar', city: 'Bengaluru', rooms: 24, tenants: 22, plan: 'Pro Plan', status: 'Active', joined: '15 Feb 2025' },
    { id: 'SEAPG', name: 'Sea Breeze Stay', owner: 'Priya N.', city: 'Chennai', rooms: 18, tenants: 15, plan: 'PG Plan', status: 'Active', joined: '20 Mar 2025' },
    { id: 'ROYPG', name: 'Royal Residency', owner: 'Vikram Singh', city: 'Delhi', rooms: 30, tenants: 10, plan: 'Trial', status: 'Trial', joined: '01 May 2026' },
    { id: 'GRNPG', name: 'Green Meadows PG', owner: 'Ananya Rao', city: 'Hyderabad', rooms: 15, tenants: 0, plan: 'Free', status: 'Inactive', joined: '28 May 2026' },
  ];

  const filteredPgs = pgs.filter(pg => {
    if (filter === 'All') return true;
    return pg.status === filter;
  });

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Registered PGs</h1>
          <p className="text-slate-500 mt-1">Manage and audit all registered properties on the Rentflo network</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search PG name, owner, or city..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#993C1D] bg-white text-sm"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {['All', 'Active', 'Inactive', 'Trial'].map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all"
              style={{
                background: filter === type ? '#FAECE7' : '#FFFFFF',
                color: filter === type ? '#993C1D' : '#6B7280',
                border: `1px solid ${filter === type ? '#FAECE7' : '#E5E7EB'}`
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* PGs Table */}
      <Card className="overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">PG Info</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Owner</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">City</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Rooms/Tenants</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Plan</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredPgs.map((pg) => (
              <tr
                key={pg.id}
                onClick={() => router.push(`/admin/pgs/${pg.id}`)}
                className="hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4">
                  <div>
                    <span className="font-semibold text-slate-900 block">{pg.name}</span>
                    <span className="text-xs text-slate-400 uppercase tracking-wider">{pg.id}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-700">{pg.owner}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{pg.city}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">{pg.tenants}</span>
                    <span className="text-xs text-slate-400">/ {pg.rooms} rooms</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="outline" className="font-medium">
                    {pg.plan}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{
                    background: pg.status === 'Active' ? '#E1F5EE' : pg.status === 'Trial' ? '#FAEEDA' : '#FCEBEB',
                    color: pg.status === 'Active' ? '#085041' : pg.status === 'Trial' ? '#633806' : '#791F1F'
                  }}>
                    {pg.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{pg.joined}</td>
                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(`/admin/pgs/${pg.id}`)}
                    >
                      <Eye className="w-4 h-4 text-slate-500" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4 text-slate-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
