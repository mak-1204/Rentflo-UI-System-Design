'use client';

import { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { Card, Button, Input } from '@stayflo/ui';
import type { RentRecord } from '../types';

interface BillCalculatorProps {
  rentData: RentRecord[];
  onApplyUtilities: (tenantId: string, charges: number) => Promise<void>;
}

export function BillCalculator({ rentData, onApplyUtilities }: BillCalculatorProps) {
  const [calcRoom, setCalcRoom] = useState('');
  const [calcType, setCalcType] = useState<'electricity' | 'water'>('electricity');
  
  // Electricity states
  const [prevReading, setPrevReading] = useState(1240);
  const [currReading, setCurrReading] = useState(1325);
  const [unitRate, setUnitRate] = useState(8);

  // Water states
  const [waterLiters, setWaterLiters] = useState(100);
  const [waterRatePerLiter, setWaterRatePerLiter] = useState(2);

  const [calculatedCharges, setCalculatedCharges] = useState(0);

  // Set default calcRoom if data exists
  useEffect(() => {
    if (rentData.length > 0 && !calcRoom) {
      setCalcRoom(rentData[0].room);
    }
  }, [rentData, calcRoom]);

  // Recalculate charges dynamically
  useEffect(() => {
    if (calcType === 'electricity') {
      const units = Math.max(0, currReading - prevReading);
      setCalculatedCharges(units * unitRate);
    } else {
      setCalculatedCharges(waterLiters * waterRatePerLiter);
    }
  }, [prevReading, currReading, unitRate, waterLiters, waterRatePerLiter, calcType]);

  const handleApply = async () => {
    const target = rentData.find((r) => r.room === calcRoom);
    if (!target) return;
    await onApplyUtilities(target.tenant_id, calculatedCharges);
  };

  return (
    <Card className="p-8 space-y-5 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm">
      <h3
        className="text-base font-bold text-slate-900 flex items-center gap-2"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        <Zap className="w-5 h-5 text-amber-500" /> Utility Bill Calculator
      </h3>
      <p className="text-xs text-slate-400 leading-relaxed font-medium">
        Calculate electricity and water charges floor-wise and apply directly to resident ledgers
      </p>

      <div className="flex border border-slate-150 rounded-xl overflow-hidden p-0.5 bg-slate-50">
        <button
          onClick={() => setCalcType('electricity')}
          className={`flex-1 py-1.5 text-[11px] font-bold uppercase tracking-wide rounded-lg transition-all cursor-pointer ${
            calcType === 'electricity'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-100'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Electricity
        </button>
        <button
          onClick={() => setCalcType('water')}
          className={`flex-1 py-1.5 text-[11px] font-bold uppercase tracking-wide rounded-lg transition-all cursor-pointer ${
            calcType === 'water'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-100'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Water Bill
        </button>
      </div>

      <div className="space-y-4 text-xs">
        <div>
          <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">
            Target Resident Room
          </label>
          <select
            value={calcRoom}
            onChange={(e) => setCalcRoom(e.target.value)}
            className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner cursor-pointer"
          >
            {rentData.map((r) => (
              <option key={r.room} value={r.room}>
                {r.room} - {r.name}
              </option>
            ))}
          </select>
        </div>

        {calcType === 'electricity' ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Previous Unit
                </label>
                <Input
                  type="number"
                  value={prevReading}
                  onChange={(e) => setPrevReading(+e.target.value)}
                  className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Current Unit
                </label>
                <Input
                  type="number"
                  value={currReading}
                  onChange={(e) => setCurrReading(+e.target.value)}
                  className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">
                Unit Rate (BESCOM ₹)
              </label>
              <Input
                type="number"
                value={unitRate}
                onChange={(e) => setUnitRate(+e.target.value)}
                className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner"
              />
            </div>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">
                Water Consumed (Liters)
              </label>
              <Input
                type="number"
                value={waterLiters}
                onChange={(e) => setWaterLiters(+e.target.value)}
                className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner"
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">
                Rate per Liter (₹)
              </label>
              <Input
                type="number"
                value={waterRatePerLiter}
                onChange={(e) => setWaterRatePerLiter(+e.target.value)}
                className="w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-xs text-slate-800 font-semibold h-11 px-4 rounded-xl transition-all shadow-inner"
              />
            </div>
          </div>
        )}

        <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 text-left">
          <div className="flex justify-between font-bold text-slate-800 text-sm">
            <span>Calculated Due:</span>
            <span className="text-[#14b8a6] text-base">₹{calculatedCharges.toLocaleString('en-IN')}</span>
          </div>
          {calcType === 'electricity' ? (
            <p className="text-[10px] text-slate-400 mt-1.5 font-medium">
              ({currReading - prevReading} units consumed at ₹{unitRate}/unit)
            </p>
          ) : (
            <p className="text-[10px] text-slate-400 mt-1.5 font-medium">
              ({waterLiters} Liters consumed at ₹{waterRatePerLiter}/Liter)
            </p>
          )}
        </div>

        <Button
          style={{ background: '#14b8a6', color: '#FFFFFF' }}
          className="w-full font-bold uppercase tracking-wider text-xs h-11 hover:opacity-95 rounded-xl border-none shadow-md shadow-teal-500/10 cursor-pointer"
          onClick={handleApply}
        >
          Apply Utility Charges
        </Button>
      </div>
    </Card>
  );
}
