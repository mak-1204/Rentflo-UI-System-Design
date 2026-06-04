'use client';

import { useState } from 'react';
import { X, QrCode, Scan } from 'lucide-react';
import { Badge, Button } from '@stayflo/ui';
import type { FoodBooking } from '../types';

interface ScannerModalProps {
  bookings: FoodBooking[];
  onClose: () => void;
  onServeMeal: (tenantId: string, mealType: 'breakfast' | 'lunch' | 'dinner') => Promise<void>;
}

export function ScannerModal({ bookings, onClose, onServeMeal }: ScannerModalProps) {
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [scannedResult, setScannedResult] = useState<FoodBooking | null>(null);

  const handleSimulateScan = (tenantId: string) => {
    setScanStatus('scanning');
    setTimeout(() => {
      const resident = bookings.find((b) => b.tenant_id === tenantId);
      if (resident) {
        setScannedResult(resident);
        setScanStatus('success');
      } else {
        setScanStatus('error');
      }
    }, 1200);
  };

  const handleServe = async (mealType: 'breakfast' | 'lunch' | 'dinner') => {
    if (!scannedResult) return;
    
    // Call parent handler to update state and DB
    await onServeMeal(scannedResult.tenant_id, mealType);

    // Update locally nested status to show instantaneous UI update in modal
    setScannedResult((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [`${mealType}_served`]: true,
      };
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative z-10 border border-slate-100 shadow-2xl space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <h4
            className="text-base font-extrabold text-slate-800 flex items-center gap-1.5"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            <Scan className="w-5 h-5 text-[#14b8a6]" /> Scanner: Daily Food Pass
          </h4>
          <p className="text-xs text-slate-500">
            Simulate or scan active resident food passes for verification
          </p>
        </div>

        {scanStatus === 'idle' && (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-teal-50 text-[#14b8a6] flex items-center justify-center">
              <QrCode className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-800">Ready to Scan</p>
              <p className="text-xs text-slate-400">
                Click a resident below to simulate camera scanning their QR pass
              </p>
            </div>
            <div className="w-full space-y-1.5 pt-2 max-h-[200px] overflow-y-auto pr-1">
              {bookings.map((b) => (
                <button
                  key={b.tenant_id}
                  onClick={() => handleSimulateScan(b.tenant_id)}
                  className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
                >
                  Scan QR for {b.name} ({b.room})
                </button>
              ))}
            </div>
          </div>
        )}

        {scanStatus === 'scanning' && (
          <div className="bg-slate-900 rounded-xl p-12 flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden h-[240px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.15),transparent)] animate-pulse" />
            <div className="absolute left-0 right-0 h-1 bg-[#14b8a6] shadow-[0_0_10px_#14b8a6] top-0 animate-[bounce_2s_infinite]" />
            <div className="w-16 h-16 rounded-xl border-2 border-white/20 flex items-center justify-center text-white text-xl animate-pulse">
              📷
            </div>
            <p className="text-sm font-bold text-white relative z-10">Accessing Camera Viewport...</p>
            <p className="text-xs text-slate-400 relative z-10">Scanning QR pattern...</p>
          </div>
        )}

        {scanStatus === 'success' && scannedResult && (
          <div className="space-y-4">
            <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 flex items-center justify-between text-left">
              <div>
                <p className="text-sm font-bold text-slate-900">{scannedResult.name}</p>
                <p className="text-xs text-slate-500">{scannedResult.room} · Daily Food Pass</p>
              </div>
              <Badge className="bg-[#14b8a6] text-white font-bold border-none text-[10px] px-2.5 py-0.5 rounded-md">
                VALID PASS ✓
              </Badge>
            </div>

            <div className="border border-slate-100 rounded-xl divide-y divide-slate-100 text-xs text-slate-700 bg-slate-50/50">
              <div className="p-3.5 flex justify-between items-center text-left">
                <div>
                  <p className="font-bold text-slate-800">Breakfast Booking</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">8:00 AM - 9:00 AM</p>
                </div>
                <div>
                  {scannedResult.breakfast ? (
                    scannedResult.breakfast_served ? (
                      <Badge className="bg-slate-100 text-slate-500 border-none font-semibold text-[10px] px-2 py-0.5 rounded-md">
                        Served ✓
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        style={{ background: '#14b8a6', color: '#FFFFFF' }}
                        className="h-8 text-[10px] font-bold rounded-lg border-none px-3"
                        onClick={() => handleServe('breakfast')}
                      >
                        Mark Served
                      </Button>
                    )
                  ) : (
                    <Badge className="bg-rose-50 text-rose-700 border-none font-semibold text-[10px] px-2 py-0.5 rounded-md">
                      Not Registered ✗
                    </Badge>
                  )}
                </div>
              </div>

              <div className="p-3.5 flex justify-between items-center text-left">
                <div>
                  <p className="font-bold text-slate-800">Lunch Booking</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">12:00 PM - 1:00 PM</p>
                </div>
                <div>
                  {scannedResult.lunch ? (
                    scannedResult.lunch_served ? (
                      <Badge className="bg-slate-100 text-slate-500 border-none font-semibold text-[10px] px-2 py-0.5 rounded-md">
                        Served ✓
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        style={{ background: '#14b8a6', color: '#FFFFFF' }}
                        className="h-8 text-[10px] font-bold rounded-lg border-none px-3"
                        onClick={() => handleServe('lunch')}
                      >
                        Mark Served
                      </Button>
                    )
                  ) : (
                    <Badge className="bg-rose-50 text-rose-700 border-none font-semibold text-[10px] px-2 py-0.5 rounded-md">
                      Not Registered ✗
                    </Badge>
                  )}
                </div>
              </div>

              <div className="p-3.5 flex justify-between items-center text-left">
                <div>
                  <p className="font-bold text-slate-800">Dinner Booking</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">7:00 PM - 8:00 PM</p>
                </div>
                <div>
                  {scannedResult.dinner ? (
                    scannedResult.dinner_served ? (
                      <Badge className="bg-slate-100 text-slate-500 border-none font-semibold text-[10px] px-2 py-0.5 rounded-md">
                        Served ✓
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        style={{ background: '#14b8a6', color: '#FFFFFF' }}
                        className="h-8 text-[10px] font-bold rounded-lg border-none px-3"
                        onClick={() => handleServe('dinner')}
                      >
                        Mark Served
                      </Button>
                    )
                  ) : (
                    <Badge className="bg-rose-50 text-rose-700 border-none font-semibold text-[10px] px-2 py-0.5 rounded-md">
                      Not Registered ✗
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                className="flex-1 rounded-xl h-11 border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
                variant="outline"
                onClick={() => {
                  setScannedResult(null);
                  setScanStatus('idle');
                }}
              >
                Scan Another
              </Button>
              <Button
                className="flex-1 rounded-xl h-11 border-none font-bold text-white"
                style={{ background: '#14b8a6' }}
                onClick={onClose}
              >
                Done
              </Button>
            </div>
          </div>
        )}

        {scanStatus === 'error' && (
          <div className="text-center p-6 space-y-4">
            <p className="text-sm font-bold text-rose-600">Scan Failed</p>
            <p className="text-xs text-slate-500">The QR code scanned is invalid or not registered in the system.</p>
            <Button
              className="w-full h-11 border-slate-200 font-bold text-slate-700"
              variant="outline"
              onClick={() => setScanStatus('idle')}
            >
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
