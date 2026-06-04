'use client';

import { useState } from 'react';
import { X, CheckCircle, CreditCard, DollarSign, RefreshCw } from 'lucide-react';
import { Card, Button } from '@stayflo/ui';
import type { RentRecord } from '../types';

interface PaymentModalProps {
  tenant: RentRecord;
  onClose: () => void;
  onConfirmPayment: (
    tenantId: string,
    rent: number,
    utilities: number,
    lateFee: number,
    method: string
  ) => Promise<void>;
}

export function PaymentModal({ tenant, onClose, onConfirmPayment }: PaymentModalProps) {
  const [collectMethod, setCollectMethod] = useState<'upi' | 'card' | 'cash'>('upi');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const totalDues = tenant.rent + tenant.utilities + tenant.lateFee;

  const handleConfirm = async () => {
    setIsProcessingPayment(true);
    const methodText =
      collectMethod === 'upi'
        ? 'Razorpay UPI'
        : collectMethod === 'card'
        ? 'Stripe Card'
        : 'Cash Counter';

    await onConfirmPayment(tenant.tenant_id, tenant.rent, tenant.utilities, tenant.lateFee, methodText);
    setIsProcessingPayment(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-[420px] p-6 space-y-4 bg-white relative rounded-2xl border border-slate-100 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1 text-left">
          <h3 className="text-base font-bold text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>
            Collect Dues Simulation
          </h3>
          <p className="text-xs text-slate-500">
            Log transactions or request Razorpay/UPI payments for {tenant.name}
          </p>
        </div>

        <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 text-xs space-y-2.5 font-medium text-left">
          <div className="flex justify-between text-slate-600">
            <span>Room Number</span>
            <span className="font-bold text-slate-900">{tenant.room}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Monthly Rent</span>
            <span className="font-bold text-slate-900">₹{tenant.rent.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Utilities Dues</span>
            <span className="font-bold text-slate-900">₹{tenant.utilities.toLocaleString()}</span>
          </div>
          {tenant.lateFee > 0 && (
            <div className="flex justify-between text-rose-600 font-bold">
              <span>Late Fee Applied</span>
              <span>₹{tenant.lateFee.toLocaleString()}</span>
            </div>
          )}
          <hr className="border-slate-100" />
          <div className="flex justify-between text-sm font-extrabold text-slate-900">
            <span>Total Charge Amount:</span>
            <span className="text-[#14b8a6]">₹{totalDues.toLocaleString()}</span>
          </div>
        </div>

        <div className="space-y-2.5 text-left">
          <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            Select Sourcing Gateway
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setCollectMethod('upi')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-[10px] transition-all cursor-pointer ${
                collectMethod === 'upi'
                  ? 'border-[#14b8a6] bg-teal-50/50 text-[#14b8a6] font-bold'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              <CheckCircle
                className={`w-4 h-4 ${collectMethod === 'upi' ? 'text-[#14b8a6]' : 'text-slate-300'}`}
              />
              <span>Razorpay UPI</span>
            </button>
            <button
              onClick={() => setCollectMethod('card')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-[10px] transition-all cursor-pointer ${
                collectMethod === 'card'
                  ? 'border-[#14b8a6] bg-teal-50/50 text-[#14b8a6] font-bold'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              <CreditCard
                className={`w-4 h-4 ${collectMethod === 'card' ? 'text-[#14b8a6]' : 'text-slate-300'}`}
              />
              <span>Stripe Card</span>
            </button>
            <button
              onClick={() => setCollectMethod('cash')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-[10px] transition-all cursor-pointer ${
                collectMethod === 'cash'
                  ? 'border-[#14b8a6] bg-teal-50/50 text-[#14b8a6] font-bold'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              <DollarSign
                className={`w-4 h-4 ${collectMethod === 'cash' ? 'text-[#14b8a6]' : 'text-slate-300'}`}
              />
              <span>Cash Payment</span>
            </button>
          </div>
        </div>

        {collectMethod === 'upi' && (
          <div className="p-3.5 bg-slate-900 text-white rounded-xl flex items-center justify-center gap-3.5">
            <div className="w-16 h-16 bg-white rounded-lg border flex items-center justify-center text-[10px] text-slate-800 font-bold select-none p-1 flex-shrink-0">
              <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100">
                <rect width="25" height="25" fill="currentColor" />
                <rect x="75" width="25" height="25" fill="currentColor" />
                <rect y="75" width="25" height="25" fill="currentColor" />
                <rect x="35" y="35" width="30" height="30" fill="currentColor" />
              </svg>
            </div>
            <div className="text-left text-xs space-y-0.5">
              <p className="font-bold text-slate-100">Scan to pay UPI</p>
              <p className="text-slate-400 mt-0.5 text-[10px]">Merchant: stayflo.sunrise@razorpay</p>
            </div>
          </div>
        )}

        <Button
          style={{ background: '#14b8a6', color: '#FFFFFF' }}
          className="w-full font-bold uppercase tracking-wider text-xs h-11 flex items-center justify-center gap-2 hover:opacity-95 rounded-xl border-none shadow-md shadow-teal-500/10 cursor-pointer"
          onClick={handleConfirm}
          disabled={isProcessingPayment}
        >
          {isProcessingPayment ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Processing Transaction...
            </>
          ) : (
            <span>Confirm Payment Receipt</span>
          )}
        </Button>
      </Card>
    </div>
  );
}
