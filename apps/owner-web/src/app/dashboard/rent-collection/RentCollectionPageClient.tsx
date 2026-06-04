'use client';

import { useState, useTransition, useCallback } from 'react';
import { Download, Check, Loader2 } from 'lucide-react';
import { Button, Card } from '@stayflo/ui';

import { DuesTable } from './_components/DuesTable';
import { BillCalculator } from './_components/BillCalculator';
import { PaymentModal } from './_components/PaymentModal';
import {
  fetchRentRecords,
  approveDelayRequest,
  saveRentBill,
  collectRentPayment,
} from './actions';
import type { RentRecord } from './types';

interface RentCollectionPageClientProps {
  initialRentData: RentRecord[];
  initialMonth: string;
}

const MONTHS = [
  { label: 'May 2026', value: '2026-05' },
  { label: 'Jun 2026', value: '2026-06' },
  { label: 'Jul 2026', value: '2026-07' },
];

export function RentCollectionPageClient({
  initialRentData,
  initialMonth,
}: RentCollectionPageClientProps) {
  const [rentData, setRentData] = useState<RentRecord[]>(initialRentData);
  const [selectedMonth, setSelectedMonth] = useState<string>(initialMonth);
  const [activeCollectTenant, setActiveCollectTenant] = useState<RentRecord | null>(null);
  const [notif, setNotif] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const triggerToast = useCallback((msg: string) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 3000);
  }, []);

  const totalDues = (r: RentRecord) => r.rent + r.utilities + r.lateFee;

  // ── Month Toggle ──────────────────────────────────────────────────────────
  const handleMonthChange = (monthStr: string) => {
    setSelectedMonth(monthStr);
    startTransition(async () => {
      const data = await fetchRentRecords(monthStr);
      setRentData(data);
    });
  };

  // ── Apply Utility Charges ──────────────────────────────────────────────────
  const handleApplyUtilities = async (tenantId: string, charges: number) => {
    const record = rentData.find((r) => r.tenant_id === tenantId);
    if (!record) return;

    const newUtilities = record.utilities + charges;

    startTransition(async () => {
      const result = await saveRentBill({
        tenant_id: tenantId,
        month: selectedMonth,
        rent: record.rent,
        utilities: newUtilities,
        lateFee: record.lateFee,
        status: record.status,
      });

      if (result.success) {
        setRentData((prev) =>
          prev.map((item) =>
            item.tenant_id === tenantId ? { ...item, utilities: newUtilities } : item
          )
        );
        triggerToast(`Added ₹${charges} utility charges for ${record.name}!`);
      } else {
        triggerToast(`Error applying utilities: ${result.error}`);
      }
    });
  };

  // ── Approve Late Fee Delay ─────────────────────────────────────────────────
  const handleApproveDelay = async (tenantId: string) => {
    startTransition(async () => {
      const result = await approveDelayRequest(tenantId, selectedMonth);
      if (result.success) {
        setRentData((prev) =>
          prev.map((item) =>
            item.tenant_id === tenantId ? { ...item, status: 'Delay Approved', lateFee: 0 } : item
          )
        );
        triggerToast(`Delay request approved and late fees waived.`);
      } else {
        triggerToast(`Error approving delay: ${result.error}`);
      }
    });
  };

  // ── Collect Rent Payment ───────────────────────────────────────────────────
  const handleConfirmPayment = async (
    tenantId: string,
    rent: number,
    utilities: number,
    lateFee: number,
    method: string
  ) => {
    const record = rentData.find((r) => r.tenant_id === tenantId);
    if (!record) return;

    const formattedToday = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const result = await collectRentPayment(tenantId, selectedMonth, rent, utilities, lateFee, method);
    
    if (result.success) {
      setRentData((prev) =>
        prev.map((item) =>
          item.tenant_id === tenantId
            ? {
                ...item,
                status: 'Paid',
                paymentDate: formattedToday,
                paymentMethod: method,
              }
            : item
        )
      );
      setActiveCollectTenant(null);
      triggerToast(`Payment processed successfully for ${record.name}!`);
    } else {
      triggerToast(`Error processing payment: ${result.error}`);
    }
  };

  // ── Send WhatsApp Reminder ─────────────────────────────────────────────────
  const handleSendReminder = (name: string, phone: string) => {
    const formattedPhone = phone.replace(/\D/g, '') || '919876543210';
    const msg = `Hi ${name}, this is a gentle reminder that your PG rent & utilities due for ${
      MONTHS.find((m) => m.value === selectedMonth)?.label
    } is pending. Please pay inside the Stayflo app. Thanks!`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, '_blank');
    triggerToast(`Sent WhatsApp Rent reminder to ${name}!`);
  };

  // ── Metrics Computations ───────────────────────────────────────────────────
  const collectedDues = rentData
    .filter((r) => r.status === 'Paid')
    .reduce((acc, r) => acc + totalDues(r), 0);

  const pendingDues = rentData
    .filter((r) => r.status !== 'Paid')
    .reduce((acc, r) => acc + totalDues(r), 0);

  const totalLateFees = rentData.reduce((acc, r) => acc + r.lateFee, 0);

  const clearedCount = rentData.filter((r) => r.status === 'Paid').length;
  const pendingCount = rentData.filter((r) => r.status !== 'Paid').length;

  return (
    <div
      className="p-8 space-y-8 max-w-7xl mx-auto relative text-left min-h-screen"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      {/* Toast Notification */}
      {notif && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold z-50 animate-in fade-in duration-300">
          <Check className="w-4 h-4 text-[#14b8a6]" /> {notif}
        </div>
      )}

      {/* Syncing Overlay */}
      {isPending && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-lg text-xs text-slate-600 font-semibold">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-500" /> Updating ledger records...
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1
            className="text-3xl font-extrabold tracking-tight text-slate-900"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Rent & Utility Bills
          </h1>
          <p className="text-xs text-slate-400 mt-1.5 font-medium">
            Track monthly rent collections, calculate utility bills, and authorize payment delay waivers
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2 whitespace-nowrap rounded-xl text-xs font-bold border-slate-200 hover:bg-slate-50 text-slate-750 h-10 px-4 transition-all shadow-sm cursor-pointer"
            onClick={() => triggerToast('CSV exported!')}
          >
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Month Filter */}
      <div className="flex gap-2">
        {MONTHS.map((m) => (
          <button
            key={m.value}
            onClick={() => handleMonthChange(m.value)}
            className="px-4 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer"
            style={{
              background: selectedMonth === m.value ? '#f0fdfa' : '#FFFFFF',
              color: selectedMonth === m.value ? '#14b8a6' : '#6B7280',
              borderColor: selectedMonth === m.value ? 'rgba(20,184,166,0.2)' : '#E5E7EB',
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
            Collected Dues
          </p>
          <p
            className="text-2xl font-extrabold text-teal-600 mt-1"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            ₹{collectedDues.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-slate-400 font-semibold block mt-1">
            {clearedCount} tenants cleared
          </span>
        </Card>

        <Card className="p-6 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
            Pending Dues
          </p>
          <p
            className="text-2xl font-extrabold text-amber-600 mt-1"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            ₹{pendingDues.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-slate-400 font-semibold block mt-1">
            {pendingCount} pending collection
          </span>
        </Card>

        <Card className="p-6 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
            Accumulated Late Fees
          </p>
          <p
            className="text-2xl font-extrabold text-rose-600 mt-1"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            ₹{totalLateFees.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-slate-400 font-semibold block mt-1">
            ₹250 default applied past due date
          </span>
        </Card>
      </div>

      {/* Main Grid: Dues List + Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <DuesTable
            rentData={rentData}
            onApproveDelay={handleApproveDelay}
            onCollect={setActiveCollectTenant}
            onSendReminder={handleSendReminder}
          />
        </div>
        <div>
          <BillCalculator rentData={rentData} onApplyUtilities={handleApplyUtilities} />
        </div>
      </div>

      {/* Counter Collect Modal */}
      {activeCollectTenant && (
        <PaymentModal
          tenant={activeCollectTenant}
          onClose={() => setActiveCollectTenant(null)}
          onConfirmPayment={handleConfirmPayment}
        />
      )}
    </div>
  );
}
