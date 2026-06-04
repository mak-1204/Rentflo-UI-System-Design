'use client';

import { Check, X } from 'lucide-react';
import { Card, Badge } from '@stayflo/ui';
import type { FoodBooking } from '../types';

interface BookingsLogProps {
  bookings: FoodBooking[];
  selectedDay: string;
}

export function BookingsLog({ bookings, selectedDay }: BookingsLogProps) {
  return (
    <Card className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
        <h3 className="font-bold text-slate-900 text-sm" style={{ fontFamily: 'var(--font-heading)' }}>
          Meal Bookings Log ({selectedDay})
        </h3>
        <span className="bg-rose-50 text-rose-700 border border-rose-100/50 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-none whitespace-nowrap">
          Cutoff Passed
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              <th className="px-6 py-4">Resident</th>
              <th className="px-6 py-4">Room</th>
              <th className="px-6 py-4 text-center">Breakfast</th>
              <th className="px-6 py-4 text-center">Lunch</th>
              <th className="px-6 py-4 text-center">Dinner</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 bg-white text-sm">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-xs text-slate-400 font-medium">
                  No residents found in database.
                </td>
              </tr>
            ) : (
              bookings.map((b, i) => (
                <tr key={b.tenant_id || i} className="hover:bg-slate-50/40 transition-colors duration-200">
                  <td className="px-6 py-4 font-bold text-slate-900">{b.name}</td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-600">{b.room}</td>
                  <td className="px-6 py-4 text-center">
                    {b.breakfast ? (
                      b.breakfast_served ? (
                        <Badge className="bg-slate-100 text-slate-500 border-none text-[10px] font-bold rounded-md px-2 py-0.5">
                          Served ✓
                        </Badge>
                      ) : (
                        <span
                          className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal-50 text-[#14b8a6]"
                          title="Booked but not served"
                        >
                          <Check className="w-4 h-4" />
                        </span>
                      )
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-50 text-slate-300">
                        <X className="w-4 h-4" />
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {b.lunch ? (
                      b.lunch_served ? (
                        <Badge className="bg-slate-100 text-slate-500 border-none text-[10px] font-bold rounded-md px-2 py-0.5">
                          Served ✓
                        </Badge>
                      ) : (
                        <span
                          className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal-50 text-[#14b8a6]"
                          title="Booked but not served"
                        >
                          <Check className="w-4 h-4" />
                        </span>
                      )
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-50 text-slate-300">
                        <X className="w-4 h-4" />
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {b.dinner ? (
                      b.dinner_served ? (
                        <Badge className="bg-slate-100 text-slate-500 border-none text-[10px] font-bold rounded-md px-2 py-0.5">
                          Served ✓
                        </Badge>
                      ) : (
                        <span
                          className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-teal-50 text-[#14b8a6]"
                          title="Booked but not served"
                        >
                          <Check className="w-4 h-4" />
                        </span>
                      )
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-50 text-slate-300">
                        <X className="w-4 h-4" />
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-transparent shadow-none"
                      style={{
                        background: b.status === 'Booked' ? '#f0fdfa' : '#FCEBEB',
                        color: b.status === 'Booked' ? '#0f766e' : '#791F1F',
                        borderColor: b.status === 'Booked' ? 'rgba(20,184,166,0.1)' : 'rgba(239,68,68,0.1)',
                      }}
                    >
                      {b.status}
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
