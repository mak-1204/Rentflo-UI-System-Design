'use client';

import { IndianRupee, Zap, Droplets } from 'lucide-react';
import { Card } from '@stayflo/ui';

interface MetricsGridProps {
  rentCollected: number;
  pendingDues: number;
  electricityCharges: number;
  waterCharges: number;
  selectedMonthLabel: string;
}

export function MetricsGrid({
  rentCollected,
  pendingDues,
  electricityCharges,
  waterCharges,
  selectedMonthLabel,
}: MetricsGridProps) {
  const metrics = [
    {
      label: 'Rent Collected',
      value: `₹${rentCollected.toLocaleString('en-IN')}`,
      change: '+12%',
      color: '#f0fdfa',
      textColor: '#0f766e',
      icon: IndianRupee,
    },
    {
      label: 'Pending Dues',
      value: `₹${pendingDues.toLocaleString('en-IN')}`,
      change: '-8%',
      color: '#fff7ed',
      textColor: '#c2410c',
      icon: IndianRupee,
    },
    {
      label: 'Electricity Charges',
      value: `₹${electricityCharges.toLocaleString('en-IN')}`,
      change: `${Math.round(electricityCharges / 10)} units`,
      color: '#eff6ff',
      textColor: '#1d4ed8',
      icon: Zap,
    },
    {
      label: 'Water Tanker Fees',
      value: `₹${waterCharges.toLocaleString('en-IN')}`,
      change: `${Math.round(waterCharges / 700)} Tankers`,
      color: '#f0fdfa',
      textColor: '#0f766e',
      icon: Droplets,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {metrics.map((metric, i) => {
        const Icon = metric.icon;
        return (
          <Card
            key={i}
            style={{ backgroundColor: metric.color }}
            className="p-6 border-none rounded-2xl relative overflow-hidden transition-all duration-300 hover:shadow-md text-left animate-in fade-in duration-300"
          >
            <div className="flex justify-between items-start">
              <div>
                <p
                  style={{ color: metric.textColor }}
                  className="text-[10px] mb-1.5 font-extrabold uppercase tracking-wider opacity-85"
                >
                  {metric.label}
                </p>
                <p
                  style={{ color: metric.textColor }}
                  className="text-[9px] font-bold opacity-60 mb-0.5 uppercase tracking-wide"
                >
                  for {selectedMonthLabel}
                </p>
                <p
                  style={{ fontFamily: 'var(--font-heading)', color: metric.textColor }}
                  className="text-3xl font-extrabold mb-1 tracking-tight"
                >
                  {metric.value}
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-white shadow-sm flex items-center justify-center">
                <Icon className="w-5 h-5" style={{ color: metric.textColor }} />
              </div>
            </div>
            <div
              style={{ color: metric.textColor }}
              className="flex items-center gap-1.5 text-xs mt-3 font-bold opacity-90"
            >
              <span>{metric.change}</span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
