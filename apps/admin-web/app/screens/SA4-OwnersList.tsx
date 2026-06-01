import { useState } from 'react'; import { Search, Plus } from 'lucide-react'; import { Card } from '@rentflo/ui';
import { Badge } from '@rentflo/ui';
import { Button } from '@rentflo/ui';

export function AdminOwnersList() {
  const [search, setSearch] = useState('');

  const owners = [
    { name: 'Rajan Swamy', phone: '+91 98450 12345', pgs: 1, plan: 'PG Plan', mrr: 1500, status: 'Active', activeSince: '12 Jan 2025' },
    { name: 'Amit Kumar', phone: '+91 98765 43210', pgs: 2, plan: 'Pro Plan', mrr: 3000, status: 'Active', activeSince: '15 Feb 2025' },
    { name: 'Priya Narayanan', phone: '+91 91234 56789', pgs: 3, plan: 'PG Plan', mrr: 4500, status: 'Active', activeSince: '20 Mar 2025' },
    { name: 'Vikram Singh', phone: '+91 99000 88776', pgs: 1, plan: 'Trial', mrr: 0, status: 'Trial', activeSince: '01 May 2026' },
  ];

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">PG Owners</h1>
          <p className="text-slate-500 mt-1">Audit, edit, and support property owners on the platform</p>
        </div>
        <Button className="bg-[#993C1D] hover:bg-[#791F1F]">
          <Plus className="w-4 h-4 mr-2" /> Add Owner Profile
        </Button>
      </div>

      {/* Filter / Search bar */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search owners by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#993C1D] bg-white text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Owner Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Details</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">PGs Owned</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Active Plan</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">MRR Contribution</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {owners.map((owner, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                      {owner.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 block">{owner.name}</span>
                      <span className="text-xs text-slate-400">On Rentflo since {owner.activeSince}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{owner.phone}</td>
                <td className="px-6 py-4 text-sm text-slate-900 font-semibold">{owner.pgs} PG(s)</td>
                <td className="px-6 py-4">
                  <Badge variant="outline">{owner.plan}</Badge>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-900">₹{owner.mrr.toLocaleString()} / mo</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{
                    background: owner.status === 'Active' ? '#E1F5EE' : '#FAEEDA',
                    color: owner.status === 'Active' ? '#085041' : '#633806'
                  }}>
                    {owner.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-xs text-[#993C1D] font-semibold hover:underline">
                    Manage PGs
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
