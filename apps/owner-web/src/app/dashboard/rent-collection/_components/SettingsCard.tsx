'use client';

import { useState, useTransition } from 'react';
import { Calendar, ShieldAlert, Check, Loader2, Settings, Edit2, X } from 'lucide-react';
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
  const [isEditing, setIsEditing] = useState(false);

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
        setTimeout(() => {
          setSaveStatus('idle');
          setIsEditing(false);
        }, 1500);
      } else {
        setSaveStatus('error');
      }
    });
  };

  const getDaySuffix = (d: number) => {
    if (d >= 11 && d <= 13) return 'th';
    const lastDigit = d % 10;
    if (lastDigit === 1) return 'st';
    if (lastDigit === 2) return 'nd';
    if (lastDigit === 3) return 'rd';
    return 'th';
  };

  return (
    <Card className="relative overflow-hidden bg-transparent border border-slate-200/50 dark:border-white/10 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all duration-300 hover:border-slate-300 dark:hover:border-white/20">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-transparent rounded-bl-full pointer-events-none" />

      <div className="space-y-1.5 text-left max-w-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-50 dark:bg-teal-500/10 text-teal-650 dark:text-teal-400 rounded-xl flex-shrink-0">
            <Settings className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100 tracking-tight animate-in fade-in" style={{ fontFamily: 'var(--font-heading)' }}>
              Billing & Late Fee Rules
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-400 font-medium mt-0.5">
              Configure the monthly rent collection due date and late penalty. Changes dynamically apply to all unpaid/overdue records.
            </p>
          </div>
        </div>
      </div>

      {isEditing ? (
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto animate-in fade-in zoom-in-95 duration-200">
          {/* Due Day Selector */}
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              Due Date
            </label>
            <div className="relative">
              <select
                value={dueDay}
                onChange={(e) => setDueDay(Number(e.target.value))}
                disabled={isPending}
                className="w-full sm:w-32 bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-teal-500 transition-colors cursor-pointer appearance-none pr-8"
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    {d}{getDaySuffix(d)}
                  </option>
                ))}
              </select>
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2 pointer-events-none" />
            </div>
          </div>

          {/* Penalty Amount Input */}
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              Late Fee
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-slate-450 text-xs font-bold">₹</span>
              <input
                type="number"
                value={lateFee}
                onChange={(e) => setLateFee(Math.max(0, Number(e.target.value)))}
                disabled={isPending}
                placeholder="250"
                className="w-full sm:w-28 bg-white border border-slate-200 hover:border-slate-300 rounded-xl pl-6 pr-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-teal-500 transition-colors"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-end gap-2 pt-4 sm:pt-0 w-full sm:w-auto">
            <Button
              onClick={handleSave}
              disabled={isPending}
              className={`flex-1 sm:flex-none font-bold text-xs px-3 h-8 flex items-center justify-center gap-1.5 rounded-xl transition-all cursor-pointer shadow-sm border border-transparent ${
                saveStatus === 'success'
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : saveStatus === 'error'
                  ? 'bg-rose-600 text-white hover:bg-rose-700'
                  : 'bg-teal-600 text-white hover:bg-teal-700'
              }`}
            >
              {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : saveStatus === 'success' ? <Check className="w-3.5 h-3.5" /> : 'Save'}
            </Button>
            <Button
              onClick={() => {
                setDueDay(initialSettings.due_day);
                setLateFee(initialSettings.late_fee);
                setIsEditing(false);
              }}
              disabled={isPending}
              variant="outline"
              className="px-2 h-8 border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 rounded-xl cursor-pointer"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-4 md:gap-6 w-full md:w-auto border border-slate-200 dark:border-white/10 rounded-full px-5 py-2 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-500" />
            <span className="text-xs font-medium text-slate-500 dark:text-slate-300">
              Due <strong className="text-slate-900 dark:text-white">{dueDay}{getDaySuffix(dueDay)}</strong> of Month
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-teal-600 dark:text-teal-500 font-bold text-sm leading-none">₹</span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-white">₹{lateFee.toLocaleString()}</strong> Late Fee
            </span>
          </div>
          
          <button
            onClick={() => setIsEditing(true)}
            className="ml-auto md:ml-2 text-xs font-medium text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </button>
        </div>
      )}
    </Card>
  );
}
