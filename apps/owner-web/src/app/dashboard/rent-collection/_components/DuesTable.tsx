'use client';

import { Check, Bell } from 'lucide-react';
import { Badge, Button, Card } from '@stayflo/ui';
import type { RentRecord } from '../types';

interface DuesTableProps {
  rentData: RentRecord[];
  onApproveDelay: (tenantId: string) => void;
  onCollect: (record: RentRecord) => void;
  onSendReminder: (name: string, phone: string) => void;
}

export function DuesTable({
  rentData,
  onApproveDelay,
  onCollect,
  onSendReminder,
}: DuesTableProps) {
  const totalDues = (r: RentRecord) => r.rent + r.utilities + r.lateFee;

  return (
    <Card className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px] lg:min-w-0">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              <th className="px-3 py-4 pl-4">Resident</th>
              <th className="px-2 py-4 text-center">Room</th>
              <th className="px-3 py-4">Rent</th>
              <th className="px-3 py-4">Utilities</th>
              <th className="px-3 py-4">Late Fee</th>
              <th className="px-3 py-4">Total Due</th>
              <th className="px-3 py-4">Status</th>
              <th className="px-3 py-4 pr-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 bg-white text-sm">
            {rentData.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-xs text-slate-400 font-medium">
                  No billing records found for this month.
                </td>
              </tr>
            ) : (
              rentData.map((row) => (
                <tr key={row.tenant_id} className="hover:bg-slate-50/40 transition-colors duration-200">
                  <td className="px-3 py-4 pl-4">
                    <span className="font-bold text-slate-900">{row.name}</span>
                    {row.status === 'Paid' && row.paymentMethod && (
                      <span className="block text-[10px] font-medium text-slate-400 mt-0.5">
                        via {row.paymentMethod} {row.paymentDate ? `on ${row.paymentDate}` : ''}
                      </span>
                    )}
                  </td>
                  <td className="px-2 py-4 text-center">
                    <Badge
                      variant="outline"
                      className="text-[10px] font-bold border-slate-200/80 text-slate-600 rounded-md bg-white px-2 py-0.5"
                    >
                      {row.room}
                    </Badge>
                  </td>
                  <td className="px-3 py-4 text-xs font-semibold text-slate-700">
                    ₹{row.rent.toLocaleString()}
                  </td>
                  <td className="px-3 py-4 text-xs font-semibold text-slate-700">
                    ₹{row.utilities.toLocaleString()}
                  </td>
                  <td className="px-3 py-4 text-rose-600 font-semibold text-xs">
                    ₹{row.lateFee.toLocaleString()}
                  </td>
                  <td className="px-3 py-4 font-bold text-slate-900">
                    ₹{totalDues(row).toLocaleString()}
                  </td>
                  <td className="px-3 py-4">
                    <Badge
                      style={{
                        background:
                          row.status === 'Paid'
                             ? '#f0fdfa'
                            : row.status === 'Overdue'
                            ? '#FCEBEB'
                            : row.status === 'Delay Approved'
                            ? '#E6F1FB'
                            : '#FAEEDA',
                        color:
                          row.status === 'Paid'
                            ? '#0f766e'
                            : row.status === 'Overdue'
                            ? '#791F1F'
                            : row.status === 'Delay Approved'
                            ? '#0c447c'
                            : '#633806',
                      }}
                      className="border-none font-bold text-[10px] px-2 py-0.5 rounded-md"
                    >
                      {row.status === 'Delay Requested' ? 'Delay Request ⚡' : row.status}
                    </Badge>
                  </td>
                  <td className="px-3 py-4 pr-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {row.status === 'Delay Requested' && (
                        <Button
                          size="sm"
                          style={{ background: '#14b8a6', color: '#FFFFFF' }}
                          className="text-xs font-bold rounded-lg h-8 px-3 border-none cursor-pointer"
                          onClick={() => onApproveDelay(row.tenant_id)}
                        >
                          Approve Delay
                        </Button>
                      )}
                      {row.status !== 'Paid' ? (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-teal-600 hover:bg-teal-50/50 text-xs font-bold rounded-xl transition-all px-3 h-8 border border-transparent hover:border-teal-100"
                            onClick={() => onCollect(row)}
                          >
                            Collect
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-slate-400 hover:text-slate-655 hover:bg-slate-50 text-xs font-bold rounded-xl transition-all px-2.5 h-8 border border-transparent hover:border-slate-100"
                            onClick={() => onSendReminder(row.name, row.phone)}
                          >
                            <Bell className="w-3.5 h-3.5" />
                          </Button>
                        </>
                      ) : (
                        <span className="text-xs text-teal-600 font-bold flex items-center gap-0.5">
                          <Check className="w-3.5 h-3.5" /> Cleared
                        </span>
                      )}
                    </div>
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
