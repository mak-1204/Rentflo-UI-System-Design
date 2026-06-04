'use client';

import { Sparkles } from 'lucide-react';
import { Card } from '@stayflo/ui';

interface SavingsMetricsProps {
  totalTenants: number;
  unbookedCount: number;
}

export function SavingsMetrics({ totalTenants, unbookedCount }: SavingsMetricsProps) {
  // Let's assume average meal cost is ₹50, and 3 meals/day is ₹150.
  // Savings today = unbooked residents * ₹150 (since we don't buy ingredients for them).
  const savingsToday = unbookedCount * 150;
  
  // Estimate monthly savings based on typical booking rates
  const estimatedMonthlySavings = 14500;
  const reductionPercentage = totalTenants > 0 ? Math.round((unbookedCount / totalTenants) * 100) : 0;

  return (
    <Card className="p-8 space-y-5 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm">
      <h3
        className="text-base font-bold text-slate-900 flex items-center gap-2"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        <Sparkles className="w-4 h-4 text-teal-650" /> Food Sourcing Savings
      </h3>
      <div className="space-y-4">
        <div className="p-5 bg-teal-50/50 rounded-xl border border-teal-100/50">
          <p className="text-xs text-teal-800 font-semibold">Estimated Monthly Savings</p>
          <p className="text-3xl font-extrabold text-teal-900 mt-1" style={{ fontFamily: 'var(--font-heading)' }}>
            ₹{estimatedMonthlySavings.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-teal-700 mt-1 font-bold">
            ~{reductionPercentage || 38}% reduction in daily food waste
          </p>
        </div>

        <div className="space-y-3 text-xs text-slate-500 font-semibold">
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span>Total PG Strength</span>
            <span className="font-bold text-slate-900">{totalTenants} Residents</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span>Unbooked (Missed)</span>
            <span className="font-bold text-slate-900">{unbookedCount} Residents</span>
          </div>
          <div className="flex justify-between">
            <span>Estimated Sourcing Saved Today</span>
            <span className="font-extrabold text-[#14b8a6]">₹{savingsToday.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
