'use client';

import { Search, Bell } from 'lucide-react';
import { Card } from '@stayflo/ui';
import type { RentRecord } from '../types';

interface DuesTableProps {
  rentData: RentRecord[];
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onApproveDelay: (tenantId: string) => void;
  onCollect: (record: RentRecord) => void;
  onSendReminder: (name: string, phone: string) => void;
  onSelectTenant?: (record: RentRecord) => void;
  selectedTenantId?: string | null;
}

function getStatusStyle(status: string): { background: string; color: string; border: string } {
  switch (status) {
    case 'Paid':
      return { background: '#f0fdfa', color: '#0f766e', border: 'rgba(20,184,166,0.15)' };
    case 'Overdue':
      return { background: '#FCEBEB', color: '#991b1b', border: 'rgba(239,68,68,0.15)' };
    case 'Delay Approved':
      return { background: '#FFF7ED', color: '#c2410c', border: 'rgba(249,115,22,0.15)' };
    case 'Delay Requested':
      return { background: '#FFF7ED', color: '#b45309', border: 'rgba(245,158,11,0.15)' };
    default:
      return { background: '#FAEEDA', color: '#633806', border: 'rgba(217,119,6,0.15)' };
  }
}

function getFloorFromRoom(roomStr: string): string {
  const numMatch = roomStr.match(/\d+/);
  if (!numMatch) return 'Floor 1';
  const num = parseInt(numMatch[0], 10);
  if (num < 10) return 'Ground Floor';
  if (num < 100) return `Floor ${Math.floor(num / 10)}`;
  return `Floor ${Math.floor(num / 100)}`;
}

export function DuesTable({
  rentData,
  searchTerm,
  onSearchChange,
  onApproveDelay,
  onCollect,
  onSendReminder,
  onSelectTenant,
  selectedTenantId,
}: DuesTableProps) {
  return (
    <Card className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden animate-in fade-in duration-500 flex flex-col h-full">
      
      {/* Seamless Search Bar Header */}
      <div className="p-3 border-b border-slate-100 bg-white">
        <div className="flex items-center" style={{ gap: '0.75rem', padding: '0.6rem 1rem', background: '#f8fafc', borderRadius: '0.75rem', border: '1px solid #f1f5f9' }}>
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search resident or room number..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-transparent border-none focus:outline-none text-[13px] text-slate-800 font-medium placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              <th className="px-5 py-3.5 text-left">Resident</th>
              <th className="px-5 py-3.5 text-left">Room</th>
              <th className="px-5 py-3.5 text-left">Total Due</th>
              <th className="px-5 py-3.5 text-left">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 bg-white text-sm">
            {rentData.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-xs text-slate-400 font-medium">
                  No billing records found for this search.
                </td>
              </tr>
            ) : (
              rentData.map((row) => {
                const isSelected = row.tenant_id === selectedTenantId;
                const statusStyle = getStatusStyle(row.status);
                return (
                  <tr
                    key={row.tenant_id}
                    onClick={() => onSelectTenant && onSelectTenant(row)}
                    className={`transition-colors duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50/[0.4] border-l-[3px] border-l-[#14b8a6]'
                        : 'hover:bg-slate-50/60 border-l-[3px] border-l-transparent'
                    }`}
                  >
                    {/* Resident */}
                    <td className="px-5 py-4">
                      <span className="font-semibold text-slate-900">{row.name}</span>
                      {row.paymentMethod && row.status === 'Paid' && (
                        <span className="block text-[10px] font-medium text-slate-400 mt-0.5">
                          via {row.paymentMethod}{row.paymentDate ? ` on ${row.paymentDate}` : ''}
                        </span>
                      )}
                    </td>

                    {/* Room */}
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-700 font-semibold">
                        {row.room.toLowerCase().startsWith('room') ? row.room : `Room ${row.room}`}
                      </span>
                      <span className="block text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wider">
                        {getFloorFromRoom(row.room)}
                      </span>
                    </td>

                    {/* Total Due */}
                    <td className="px-5 py-4 text-sm font-bold text-slate-900">
                      ₹{(row.rent + row.utilities + row.lateFee).toLocaleString('en-IN')}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className="px-2.5 py-1 text-[10px] font-bold rounded-md border"
                        style={{
                          background: statusStyle.background,
                          color: statusStyle.color,
                          borderColor: statusStyle.border,
                        }}
                      >
                        {row.status === 'Delay Requested' ? 'Delay Request' : row.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {row.status === 'Delay Requested' && (
                          <button 
                            className="bg-amber-100 text-amber-700 hover:bg-amber-200 px-2 py-1.5 rounded-lg text-[10px] font-bold transition-colors"
                            onClick={() => onApproveDelay(row.tenant_id)}
                          >
                            Approve Delay
                          </button>
                        )}
                        {row.status !== 'Paid' && (
                          <>
                            <button 
                              className="bg-teal-50 text-teal-600 hover:bg-teal-100 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors"
                              onClick={() => onCollect(row)}
                            >
                              Collect
                            </button>
                            <button 
                              className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
                              onClick={() => onSendReminder(row.name, '919876543210')}
                            >
                              <Bell className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
