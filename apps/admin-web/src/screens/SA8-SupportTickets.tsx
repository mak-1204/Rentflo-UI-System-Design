import { useState } from 'react'; import { Card } from '@stayflo/ui';
import { Badge } from '@stayflo/ui';
import { Button } from '@stayflo/ui';

export function AdminSupportTickets() {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  const tickets = [
    { id: 'TKT-1042', from: 'Owner Rajan S.', pg: 'Sunrise PG', title: 'Razorpay webhook payment failure', priority: 'High', date: '3 hrs ago', status: 'Open' },
    { id: 'TKT-1041', from: 'Tenant Amit K.', pg: 'Sunrise PG', title: 'Agreement signing OTP not received', priority: 'Medium', date: '5 hrs ago', status: 'In progress' },
    { id: 'TKT-1038', from: 'Owner Priya N.', pg: 'Sea Breeze Stay', title: 'Need to add custom food pricing tier', priority: 'Low', date: '1 day ago', status: 'Resolved' },
  ];

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Support Tickets Queue</h1>
          <p className="text-slate-500 mt-1">Platform support requests from owners and tenants</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {tickets.map((tkt) => (
            <Card
              key={tkt.id}
              onClick={() => setSelectedTicket(tkt.id)}
              className={`p-5 cursor-pointer transition-all hover:shadow-sm ${selectedTicket === tkt.id ? 'border-2 border-[#993C1D]' : ''}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-xs font-mono text-slate-400">{tkt.id}</span>
                  <h3 className="font-semibold text-slate-800 mt-0.5">{tkt.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">From: {tkt.from} · PG: {tkt.pg}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <Badge variant={tkt.priority === 'High' ? 'destructive' : tkt.priority === 'Medium' ? 'default' : 'secondary'}>
                    {tkt.priority} Priority
                  </Badge>
                  <span className="text-xs text-slate-400">{tkt.date}</span>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4 pt-3 border-t">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{
                  background: tkt.status === 'Open' ? '#FCEBEB' : tkt.status === 'In progress' ? '#FAEEDA' : '#E1F5EE',
                  color: tkt.status === 'Open' ? '#791F1F' : tkt.status === 'In progress' ? '#633806' : '#085041'
                }}>
                  {tkt.status}
                </span>
                <Button size="sm" variant="ghost">View Conversation Thread</Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Ticket Detail Side Panel */}
        <Card className="p-6 h-fit space-y-6">
          {selectedTicket ? (
            <>
              <div className="border-b pb-4">
                <span className="text-xs font-mono text-slate-400">{selectedTicket}</span>
                <h3 className="font-bold text-slate-800 mt-1">Razorpay webhook failure</h3>
                <p className="text-xs text-slate-500 mt-1">Status: Open · Assigned to: Support Team A</p>
              </div>
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="font-semibold text-slate-700">Rajan S. (Owner) <span className="text-[10px] text-slate-400 font-normal">10:45 AM</span></p>
                  <p className="text-slate-600 mt-1">My tenant Amit Kumar paid the June dues but his dashboard still shows overdue. In Razorpay it says payment was captured. Please fix this immediately.</p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <p className="font-semibold text-indigo-700">Stayflo Bot (Auto-Response) <span className="text-[10px] text-slate-400 font-normal">10:46 AM</span></p>
                  <p className="text-slate-600 mt-1">Ticket created. We are checking webhook status for SUNPG integration.</p>
                </div>
              </div>
              <div className="pt-4 border-t space-y-2">
                <textarea
                  placeholder="Type a response to owner/tenant..."
                  className="w-full p-2 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#993C1D]"
                  rows={3}
                />
                <Button size="sm" className="w-full bg-[#993C1D] hover:bg-[#791F1F]">
                  Send Message & Resolve
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <p className="font-medium">No Ticket Selected</p>
              <p className="text-xs">Select any support ticket on the left to see the message history.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
