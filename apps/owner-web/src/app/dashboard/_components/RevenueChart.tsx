'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '@stayflo/ui';

interface ChartDataItem {
  month: string;
  Rent: number;
  Utilities: number;
  LateFee: number;
}

interface RevenueChartProps {
  chartData: ChartDataItem[];
}

export function RevenueChart({ chartData }: RevenueChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Card className="p-8 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md flex flex-col justify-between text-left">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
            Revenue & Utility Tracking
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 font-medium">
            Monthly breakdown of Rent Collection vs Utilities & Late Fees
          </p>
        </div>
        <span className="bg-emerald-50 text-emerald-700 border border-emerald-100/50 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-none whitespace-nowrap">
          June projections look stable
        </span>
      </div>

      <div className="h-[350px] px-2 py-4">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: '#94A3B8' }}
                tickLine={false}
                axisLine={false}
                style={{ fontSize: '11px', fontFamily: 'var(--font-sans)' }}
              />
              <YAxis
                tick={{ fill: '#94A3B8' }}
                tickLine={false}
                axisLine={false}
                style={{ fontSize: '11px', fontFamily: 'var(--font-sans)' }}
              />
              <Tooltip
                contentStyle={{
                  background: '#0F172A',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#FFF',
                  fontSize: '11px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                }}
                itemStyle={{ color: '#94A3B8' }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: '11px', fontFamily: 'var(--font-sans)', paddingBottom: '10px' }}
              />
              <Line
                type="monotone"
                dataKey="Rent"
                name="Rent Collected"
                stroke="#14b8a6"
                strokeWidth={3}
                dot={{ r: 4, stroke: '#14b8a6', strokeWidth: 1, fill: '#fff' }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="Utilities"
                name="Utility Bills"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 4, stroke: '#6366f1', strokeWidth: 1, fill: '#fff' }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="LateFee"
                name="Late Fees"
                stroke="#f43f5e"
                strokeWidth={3}
                dot={{ r: 4, stroke: '#f43f5e', strokeWidth: 1, fill: '#fff' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full bg-slate-50 animate-pulse rounded-xl flex items-center justify-center text-xs text-slate-400 font-semibold">
            Loading analytics chart...
          </div>
        )}
      </div>
    </Card>
  );
}
