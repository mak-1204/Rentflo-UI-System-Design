'use client';

import { Badge, Button, Card } from '@stayflo/ui';

interface OverdueTenant {
  name: string;
  room: string;
  rent: number;
  utilities: number;
  total: number;
  days: number;
}

interface DuesMonitoringProps {
  pendingDues: OverdueTenant[];
  onViewAllDues: () => void;
}

export function DuesMonitoring({ pendingDues, onViewAllDues }: DuesMonitoringProps) {
  return (
    <Card className="p-8 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            Dues Monitoring
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Tenants with unpaid rent and utility bill breakdowns
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="whitespace-nowrap rounded-xl text-xs font-bold border-slate-200 hover:bg-slate-50 text-slate-700 h-9 px-4 transition-all cursor-pointer"
          onClick={onViewAllDues}
        >
          View All Dues
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full text-left min-w-[600px] border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400 font-extrabold">
              <th className="text-left px-5 py-4">Name</th>
              <th className="text-center px-5 py-4">Room</th>
              <th className="text-right px-5 py-4">Rent</th>
              <th className="text-right px-5 py-4">Utilities Due</th>
              <th className="text-right px-5 py-4">Total Due</th>
              <th className="text-center px-5 py-4">Overdue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm">
            {pendingDues.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-xs text-slate-400 font-medium">
                  All clean! No overdue balances for this month. 🎉
                </td>
              </tr>
            ) : (
              pendingDues.map((tenant, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4 font-semibold text-slate-900">{tenant.name}</td>
                  <td className="px-5 py-4 text-center">
                    <Badge
                      variant="outline"
                      className="text-[10px] font-bold border-slate-200/80 text-slate-650 rounded-md bg-white px-2 py-0.5"
                    >
                      {tenant.room}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-right text-slate-600">₹{tenant.rent.toLocaleString()}</td>
                  <td className="px-5 py-4 text-right text-slate-600">₹{tenant.utilities.toLocaleString()}</td>
                  <td className="px-5 py-4 text-right font-extrabold text-[#14b8a6]">
                    ₹{tenant.total.toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="bg-rose-50 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-rose-100/50">
                      {tenant.days} days
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
