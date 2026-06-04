import { useState } from 'react'; import { Card } from '@stayflo/ui';
import { Badge } from '@stayflo/ui';
import { Button } from '@stayflo/ui';

export function AdminLeads() {
  const [selectedLead, setSelectedLead] = useState<string | null>(null);

  const leads = [
    { id: '1', name: 'Rohan Sharma', phone: '+91 90123 45678', pgViewed: 'Sunrise PG', room: 'Single Occupancy', moveIn: '15 Jun 2026', received: '1 day ago', status: 'Scheduled visit' },
    { id: '2', name: 'Deepika K.', phone: '+91 98765 00112', pgViewed: 'Sunrise PG', room: 'Double Occupancy', moveIn: '01 Jul 2026', received: '2 days ago', status: 'Not interested' },
    { id: '3', name: 'Arun Prasath', phone: '+91 99887 76655', pgViewed: 'Zolo Stay Koramangala', room: 'Single Occupancy', moveIn: '10 Jun 2026', received: '3 days ago', status: 'Joined' },
  ];

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto relative">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Leads & Direct Conversions</h1>
          <p className="text-slate-500 mt-1">Platform-wide lead capture funnel from all PG custom portfolio pages</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-5">
          <p className="text-sm font-semibold text-slate-500">Total Leads Generated</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">1,480</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-semibold text-slate-500">Scheduled Visits</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">312</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-semibold text-slate-500">Joined Residents</p>
          <p className="text-2xl font-bold text-teal-600 mt-1">186</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-semibold text-slate-500">Conversion Rate</p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">12.5%</p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Lead</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">PG & Room Interest</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Move-In Target</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Received</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white text-sm">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <span className="font-semibold text-slate-800 block">{lead.name}</span>
                  <span className="text-xs text-slate-400">{lead.phone}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-slate-800 block">{lead.pgViewed}</span>
                  <span className="text-xs text-slate-400">{lead.room}</span>
                </td>
                <td className="px-6 py-4 text-slate-700">{lead.moveIn}</td>
                <td className="px-6 py-4 text-slate-500">{lead.received}</td>
                <td className="px-6 py-4">
                  <Badge variant={lead.status === 'Joined' ? 'default' : 'secondary'}>
                    {lead.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {lead.status === 'Not interested' && (
                      <Button
                        size="sm"
                        style={{ background: '#993C1D' }}
                        onClick={() => setSelectedLead(lead.name)}
                      >
                        Suggest Other PG
                      </Button>
                    )}
                    <Button variant="outline" size="sm">Call</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Suggest Other PG modal overlay */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <Card className="p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Suggest Nearby Stayflo PGs</h3>
            <p className="text-sm text-slate-500">
              Recommend sister PGs on Stayflo network to <strong>{selectedLead}</strong> via WhatsApp automation since they rejected this PG.
            </p>
            <div className="space-y-2 p-3 bg-teal-50 border border-teal-100 rounded-lg">
              <p className="text-xs font-semibold text-[#085041]">Matching nearby properties:</p>
              <div className="text-xs text-slate-700">
                <p>1. Zolo Stay Koramangala (200m away) - Pro Plan</p>
                <p className="mt-1">2. Green Meadows PG (1.2km away) - Free Plan</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setSelectedLead(null)}>Cancel</Button>
              <Button style={{ background: '#1D9E75' }} onClick={() => setSelectedLead(null)}>
                Send Recommendations
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
