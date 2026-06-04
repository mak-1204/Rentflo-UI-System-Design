'use client';

import { useState, useTransition } from 'react';
import { Calendar, ShieldAlert, Check, Loader2, Settings } from 'lucide-react';
import { Card, Button } from '@stayflo/ui';

interface SettingsCardProps {
  initialSettings: { due_day: number; late_fee: number };
  onSave: (dueDay: number, lateFee: number) => Promise<boolean>;
}

export function SettingsCard({ initialSettings, onSave }: SettingsCardProps) {
  const [dueDay, setDueDay] = useState(initialSettings.due_day);
  const [lateFee, setLateFee] = useState(initialSettings.late_fee);
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSave = () => {
    if (dueDay < 1 || dueDay > 31) {
      setSaveStatus('error');
      return;
    }
    if (lateFee < 0) {
      setSaveStatus('error');
      return;
    }

    setSaveStatus('idle');
    startTransition(async () => {
      const ok = await onSave(dueDay, lateFee);
      if (ok) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        setSaveStatus('error');
      }
    });
  };

  return (
    <Card className="relative overflow-hidden bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all duration-300 hover:shadow-md hover:border-slate-300">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-transparent rounded-bl-full pointer-events-none" />

      <div className="space-y-1.5 text-left max-w-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-50 text-teal-650 rounded-xl flex-shrink-0">
            <Settings className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-800 tracking-tight animate-in fade-in" style={{ fontFamily: 'var(--font-heading)' }}>
              Billing & Late Fee Rules
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Configure the monthly rent collection due date and late penalty. Changes dynamically apply to all unpaid/overdue records.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
        {/* Due Day Selector */}
        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            Due Date (Day of Month)
          </label>
          <div className="relative">
            <select
              value={dueDay}
              onChange={(e) => setDueDay(Number(e.target.value))}
              disabled={isPending}
              className="w-full sm:w-36 bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-teal-500 transition-colors cursor-pointer appearance-none pr-8"
            >
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  {d}
                  {d === 1 || d === 21 || d === 31 ? 'st' : d === 2 || d === 22 ? 'nd' : d === 3 || d === 23 ? 'rd' : 'th'} of Month
                </option>
              ))}
            </select>
            <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Penalty Amount Input */}
        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            Late Fee Penalty Amount
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-slate-450 text-xs font-bold">₹</span>
            <input
              type="number"
              value={lateFee}
              onChange={(e) => setLateFee(Math.max(0, Number(e.target.value)))}
              disabled={isPending}
              placeholder="250"
              className="w-full sm:w-36 bg-white border border-slate-200 hover:border-slate-300 rounded-xl pl-6 pr-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-teal-500 transition-colors"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-5 w-full sm:w-auto">
          <Button
            onClick={handleSave}
            disabled={isPending}
            className={`w-full sm:w-auto font-bold text-xs px-4 h-9 flex items-center justify-center gap-1.5 rounded-xl transition-all cursor-pointer select-none active:scale-95 shadow-sm border border-transparent ${
              saveStatus === 'success'
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/10'
                : saveStatus === 'error'
                ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-500/10'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            {isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : saveStatus === 'success' ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved!</span>
              </>
            ) : saveStatus === 'error' ? (
              <>
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Invalid Inputs</span>
              </>
            ) : (
              <span>Save Rules</span>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
