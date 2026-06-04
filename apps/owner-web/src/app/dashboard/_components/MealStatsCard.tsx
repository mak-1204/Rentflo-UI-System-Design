'use client';

import { Badge, Card } from '@stayflo/ui';

interface MealStatsCardProps {
  breakfast: number;
  lunch: number;
  dinner: number;
}

export function MealStatsCard({ breakfast, lunch, dinner }: MealStatsCardProps) {
  return (
    <Card className="p-8 bg-slate-950 border border-slate-900 rounded-2xl shadow-xl relative overflow-hidden text-left">
      <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <h3 className="font-extrabold text-lg text-white" style={{ fontFamily: 'var(--font-heading)' }}>
            Meal Bookings Count
          </h3>
          <p className="text-[10px] text-slate-400 mt-1 font-medium">Saves ~30% in food waste daily</p>
        </div>
        <Badge className="bg-[#14b8a6] text-white border-none font-bold text-[10px] px-2 py-0.5 rounded-md">
          ACTIVE
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center py-3 bg-slate-900/60 rounded-xl border border-slate-800/80 relative z-10 shadow-inner">
        <div>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Breakfast</p>
          <p className="text-xl font-extrabold text-white mt-1">{breakfast}</p>
        </div>
        <div className="border-x border-slate-800">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Lunch</p>
          <p className="text-xl font-extrabold text-white mt-1">{lunch}</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Dinner</p>
          <p className="text-xl font-extrabold text-white mt-1">{dinner}</p>
        </div>
      </div>
    </Card>
  );
}
