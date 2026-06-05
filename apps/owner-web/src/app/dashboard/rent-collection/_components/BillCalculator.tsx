'use client';

import { useState, useEffect } from 'react';
import { Card, Button } from '@stayflo/ui';
import type { RentRecord } from '../types';

interface BillCalculatorProps {
  rentData: RentRecord[];
  onApplyUtilities: (roomId: string, charges: number) => Promise<void>;
  lockedRoom?: string;
}

export function BillCalculator({ rentData, onApplyUtilities, lockedRoom }: BillCalculatorProps) {
  const [calcRoom, setCalcRoom] = useState(lockedRoom || '');
  const [calcType, setCalcType] = useState<'electricity' | 'water'>('electricity');

  // Electricity
  const [prevReading, setPrevReading] = useState(1240);
  const [currReading, setCurrReading] = useState(1325);
  const [unitRate, setUnitRate] = useState(8);

  // Water
  const [waterLiters, setWaterLiters] = useState(100);
  const [waterRatePerLiter, setWaterRatePerLiter] = useState(2);

  const [calculatedCharges, setCalculatedCharges] = useState(0);

  const uniqueRooms = Array.from(new Set(rentData.map((r) => r.room))).sort();

  useEffect(() => {
    if (lockedRoom) {
      setCalcRoom(lockedRoom);
    } else if (rentData.length > 0 && !calcRoom) {
      setCalcRoom(rentData[0].room);
    }
  }, [rentData, calcRoom, lockedRoom]);

  useEffect(() => {
    if (calcType === 'electricity') {
      setCalculatedCharges(Math.max(0, currReading - prevReading) * unitRate);
    } else {
      setCalculatedCharges(waterLiters * waterRatePerLiter);
    }
  }, [prevReading, currReading, unitRate, waterLiters, waterRatePerLiter, calcType]);

  const tenantsInRoom = rentData.filter((r) => r.room === calcRoom);
  const splitPerTenant = tenantsInRoom.length > 0
    ? Math.round(calculatedCharges / tenantsInRoom.length)
    : calculatedCharges;

  const handleApply = async () => {
    if (!calcRoom) return;
    await onApplyUtilities(calcRoom, calculatedCharges);
  };

  const inputClass = "w-full bg-[#f8fafc] border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none text-sm text-slate-800 font-semibold h-10 px-3 rounded-xl transition-all shadow-inner";

  return (
    <Card className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 space-y-4">
        <h3 className="text-base font-bold text-slate-900">Utility Bill Calculator</h3>

        {/* Electricity / Water toggle */}
        <div className="flex border border-slate-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setCalcType('electricity')}
            className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              calcType === 'electricity'
                ? 'bg-slate-800 text-white'
                : 'bg-white text-slate-500 hover:bg-slate-50'
            }`}
          >
            Electricity
          </button>
          <button
            onClick={() => setCalcType('water')}
            className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              calcType === 'water'
                ? 'bg-slate-800 text-white'
                : 'bg-white text-slate-500 hover:bg-slate-50'
            }`}
          >
            Water Bill
          </button>
        </div>

        {/* Target Room */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5">
            Target Room
          </label>
          <select
            value={calcRoom}
            onChange={(e) => setCalcRoom(e.target.value)}
            disabled={!!lockedRoom}
            className={`${inputClass} cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {uniqueRooms.map((room) => {
              const tenants = rentData.filter((r) => r.room === room).map((r) => r.name).join(', ');
              return (
                <option key={room} value={room}>
                  {room} - {tenants || 'Empty'}
                </option>
              );
            })}
          </select>
          {calcRoom && (
            <p className="text-[10px] text-slate-400 font-medium mt-1.5">
              Shared Room Indicator: {calcRoom} — {tenantsInRoom.length} Tenant(s)
            </p>
          )}
        </div>

        {/* Inputs */}
        {calcType === 'electricity' ? (
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                Previous Unit
              </label>
              <input
                type="number"
                value={prevReading}
                onChange={(e) => setPrevReading(+e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                Current Unit
              </label>
              <input
                type="number"
                value={currReading}
                onChange={(e) => setCurrReading(+e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                Unit Rate
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">₹</span>
                <input
                  type="number"
                  value={unitRate}
                  onChange={(e) => setUnitRate(+e.target.value)}
                  className={`${inputClass} pl-7`}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                Water Consumed (Liters)
              </label>
              <input
                type="number"
                value={waterLiters}
                onChange={(e) => setWaterLiters(+e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                Rate per Liter
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">₹</span>
                <input
                  type="number"
                  value={waterRatePerLiter}
                  onChange={(e) => setWaterRatePerLiter(+e.target.value)}
                  className={`${inputClass} pl-7`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Calculated Due */}
        <div className="pt-1">
          <p className="text-sm font-bold text-slate-900">
            Calculated Due: ₹{calculatedCharges.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">
            {tenantsInRoom.length > 1
              ? `₹${splitPerTenant.toLocaleString()} per tenant · split between ${tenantsInRoom.length} residents`
              : `Total Bill will be applied to 1 tenant`}
          </p>
        </div>

        {/* Apply button */}
        <Button
          className="w-full bg-[#14b8a6] hover:bg-teal-600 text-white border-none font-bold text-xs h-10 rounded-xl cursor-pointer shadow-sm shadow-teal-500/20 transition-all"
          onClick={handleApply}
        >
          Apply Utility Charges
        </Button>
      </div>
    </Card>
  );
}
