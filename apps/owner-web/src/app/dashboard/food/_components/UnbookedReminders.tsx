'use client';

import { Send } from 'lucide-react';
import { Card, Badge, Button } from '@stayflo/ui';

interface UnbookedTenant {
  name: string;
  room: string;
  phone: string;
}

interface UnbookedRemindersProps {
  unbookedTenants: UnbookedTenant[];
  onAlertIndividual: (name: string, phone: string) => void;
  onAlertAll: () => void;
}

export function UnbookedReminders({
  unbookedTenants,
  onAlertIndividual,
  onAlertAll,
}: UnbookedRemindersProps) {
  return (
    <Card className="p-8 space-y-5 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-bold text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>
          Unbooked Residents
        </h3>
        <Badge className="bg-rose-50 text-rose-700 border-none text-[10px] font-bold rounded-md px-2 py-0.5">
          {unbookedTenants.length} left
        </Badge>
      </div>

      {unbookedTenants.length > 0 ? (
        <div className="space-y-3">
          <div className="max-h-[280px] overflow-y-auto space-y-3 pr-1">
            {unbookedTenants.map((ub) => (
              <div
                key={ub.phone || ub.name}
                className="flex justify-between items-center text-xs p-3.5 rounded-xl border border-slate-100 bg-slate-50/50"
              >
                <div>
                  <p className="font-bold text-slate-800">{ub.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{ub.room}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-orange-600 hover:bg-orange-50 text-[10px] font-bold rounded-lg px-2.5 h-8 border border-slate-100 hover:border-orange-200"
                  onClick={() => onAlertIndividual(ub.name, ub.phone)}
                >
                  <Send className="w-3 h-3 mr-1" /> Alert
                </Button>
              </div>
            ))}
          </div>

          <Button
            onClick={onAlertAll}
            style={{ background: '#EF9F27', color: '#FFFFFF' }}
            className="w-full text-xs font-bold uppercase tracking-wider h-11 mt-2 hover:opacity-95 rounded-xl border-none shadow-md shadow-amber-500/10 cursor-pointer"
          >
            Alert All Unbooked
          </Button>
        </div>
      ) : (
        <p className="text-xs text-slate-400">
          All residents have booked tomorrow's meals! No food wastage projected. 🎉
        </p>
      )}
    </Card>
  );
}
