'use client';

import { useState, useTransition, useCallback } from 'react';
import { Check, Loader2, IndianRupee } from 'lucide-react';
import { Button } from '@stayflo/ui';

import { DuesTable } from './_components/DuesTable';
import { BillCalculator } from './_components/BillCalculator';
import { PaymentModal } from './_components/PaymentModal';
import {
  fetchRentRecords,
  approveDelayRequest,
  saveRentBill,
  collectRentPayment,
  updatePGSettings,
} from './actions';
import type { RentRecord } from './types';

interface RentCollectionPageClientProps {
  initialRentData: RentRecord[];
  initialMonth: string;
  initialSettings: { due_day: number; late_fee: number };
}

const MONTHS = [
  { label: 'May 2026', value: '2026-05' },
  { label: 'Jun 2026', value: '2026-06' },
  { label: 'Jul 2026', value: '2026-07' },
];

export function RentCollectionPageClient({
  initialRentData,
  initialMonth,
  initialSettings,
}: RentCollectionPageClientProps) {
  const [rentData, setRentData] = useState<RentRecord[]>(initialRentData);
  const [selectedMonth, setSelectedMonth] = useState<string>(initialMonth);
  const [activeCollectTenant, setActiveCollectTenant] = useState<RentRecord | null>(null);
  const [notif, setNotif] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [settings, setSettings] = useState(initialSettings);
  const [isEditingRules, setIsEditingRules] = useState(false);
  const [editDueDay, setEditDueDay] = useState(initialSettings.due_day);
  const [editLateFee, setEditLateFee] = useState(initialSettings.late_fee);

  const [activeTab, setActiveTab] = useState<'ledger' | 'utilities'>('ledger');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTenant, setSelectedTenant] = useState<RentRecord | null>(null);

  const triggerToast = useCallback((msg: string) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 3000);
  }, []);

  const totalDues = (r: RentRecord) => r.rent + r.utilities + r.lateFee;

  const handleMonthChange = (monthStr: string) => {
    setSelectedMonth(monthStr);
    startTransition(async () => {
      const data = await fetchRentRecords(monthStr);
      setRentData(data);
    });
  };

  const handleApplyUtilities = async (roomId: string, charges: number) => {
    const tenantsInRoom = rentData.filter((r) => r.room === roomId);
    if (tenantsInRoom.length === 0) return;
    const splitCharge = Math.round(charges / tenantsInRoom.length);

    startTransition(async () => {
      const updatedTenants: RentRecord[] = [];
      let successCount = 0;
      let errorMsg = '';

      for (const record of tenantsInRoom) {
        const newUtilities = record.utilities + splitCharge;
        const result = await saveRentBill({
          tenant_id: record.tenant_id,
          month: selectedMonth,
          rent: record.rent,
          utilities: newUtilities,
          lateFee: record.lateFee,
          status: record.status,
        });
        if (result.success) {
          successCount++;
          updatedTenants.push({ ...record, utilities: newUtilities });
        } else {
          errorMsg = result.error || 'Unknown error';
        }
      }

      if (successCount > 0) {
        setRentData((prev) =>
          prev.map((item) => {
            const updated = updatedTenants.find((u) => u.tenant_id === item.tenant_id);
            return updated ?? item;
          })
        );
        triggerToast(`Applied ₹${splitCharge} to ${successCount} resident(s) in Room ${roomId}!`);
      }
      if (errorMsg) triggerToast(`Error: ${errorMsg}`);
    });
  };

  const handleApproveDelay = async (tenantId: string) => {
    startTransition(async () => {
      const result = await approveDelayRequest(tenantId, selectedMonth);
      if (result.success) {
        setRentData((prev) =>
          prev.map((item) =>
            item.tenant_id === tenantId ? { ...item, status: 'Delay Approved', lateFee: 0 } : item
          )
        );
        triggerToast('Delay request approved and late fees waived.');
      } else {
        triggerToast(`Error approving delay: ${result.error}`);
      }
    });
  };

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
      day: '2-digit', month: 'short', year: 'numeric',
    });
    const result = await collectRentPayment(tenantId, selectedMonth, rent, utilities, lateFee, method);
    if (result.success) {
      setRentData((prev) =>
        prev.map((item) =>
          item.tenant_id === tenantId
            ? { ...item, status: 'Paid', paymentDate: formattedToday, paymentMethod: method }
            : item
        )
      );
      setActiveCollectTenant(null);
      triggerToast(`Payment processed for ${record.name}!`);
    } else {
      triggerToast(`Error: ${result.error}`);
    }
  };

  const handleSendReminder = (name: string, phone: string) => {
    const formattedPhone = phone.replace(/\D/g, '') || '919876543210';
    const msg = `Hi ${name}, your PG rent & utilities for ${MONTHS.find((m) => m.value === selectedMonth)?.label} is pending. Please pay in the Stayflo app. Thanks!`;
    window.open(`https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(msg)}`, '_blank');
    triggerToast(`WhatsApp reminder sent to ${name}!`);
  };

  const handleSaveSettings = () => {
    startTransition(async () => {
      const res = await updatePGSettings(editDueDay, editLateFee);
      if (res.success) {
        setSettings({ due_day: editDueDay, late_fee: editLateFee });
        setIsEditingRules(false);
        triggerToast('Billing rules updated successfully!');
        const data = await fetchRentRecords(selectedMonth);
        setRentData(data);
      } else {
        triggerToast(`Error: ${res.error}`);
      }
    });
  };

  // ── Metrics ────────────────────────────────────────────────────────────────
  const collectedDues = rentData.filter((r) => r.status === 'Paid').reduce((acc, r) => acc + totalDues(r), 0);
  const pendingDues = rentData.filter((r) => r.status !== 'Paid').reduce((acc, r) => acc + totalDues(r), 0);
  const totalLateFees = rentData.reduce((acc, r) => acc + r.lateFee, 0);

  const totalDuesExpected = collectedDues + pendingDues;
  const progressPercent = totalDuesExpected > 0 ? Math.round((collectedDues / totalDuesExpected) * 100) : 0;

  const filteredRentData = rentData.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.room.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedMonthLabel = MONTHS.find((m) => m.value === selectedMonth)?.label || selectedMonth;

  return (
    <div
      className="p-8 max-w-[1400px] mx-auto relative min-h-screen text-left flex flex-col"
      style={{ fontFamily: 'var(--font-sans)', gap: '1.5rem' }}
    >
      {/* Toast */}
      {notif && (
        <div
          className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center text-xs font-semibold z-50 animate-in fade-in duration-300"
          style={{ gap: '0.5rem' }}
        >
          <Check className="w-4 h-4 text-teal-400" /> {notif}
        </div>
      )}
      {isPending && (
        <div
          className="fixed top-4 right-4 z-50 flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-lg text-xs text-slate-600 font-semibold"
          style={{ gap: '0.5rem' }}
        >
          <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-500" /> Syncing records...
        </div>
      )}

      {/* Page Header */}
      <div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2"
        style={{ gap: '1rem' }}
      >
        {/* Title */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>Rent & Utility Bills</h1>
          <p className="text-xs text-slate-400 mt-1.5 font-medium">Track monthly rent collections, calculate utility bills, and manage dues</p>
        </div>
        {/* Month Selector */}
        <div className="flex items-center" style={{ gap: '1rem' }}>
          <div>
            <select
              value={selectedMonth}
              onChange={(e) => handleMonthChange(e.target.value)}
              className="bg-white border border-slate-200 focus:border-teal-500 focus:outline-none text-sm font-medium text-slate-800 h-10 px-4 rounded-xl cursor-pointer transition-colors shadow-sm"
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── HEADER ROW: Metrics & Tabs ── */}
      <div
        className="flex flex-col lg:flex-row justify-between items-start lg:items-end pb-2"
        style={{ gap: '1.5rem' }}
      >
        {/* Main Tab Toggle */}
        <div className="flex flex-1 w-full max-w-[440px] bg-slate-100 rounded-full p-2 border border-slate-200 shadow-sm self-start lg:self-auto">
          <button
            onClick={() => { setActiveTab('ledger'); setSelectedTenant(null); }}
            className={`flex-1 py-3 text-[15px] font-bold rounded-full flex items-center justify-center transition-all ${
              activeTab === 'ledger'
                ? 'bg-white text-slate-900 shadow-md border border-slate-200/50 scale-[1.02]'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
            style={{ gap: '0.5rem' }}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${activeTab === 'ledger' ? 'bg-[#14b8a6]' : 'bg-slate-400'}`} />
            <span>Rent Ledger</span>
          </button>
          <button
            onClick={() => { setActiveTab('utilities'); setSelectedTenant(null); }}
            className={`flex-1 py-3 text-[15px] font-bold rounded-full flex items-center justify-center transition-all ${
              activeTab === 'utilities'
                ? 'bg-white text-slate-900 shadow-md border border-slate-200/50 scale-[1.02]'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
            style={{ gap: '0.5rem' }}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${activeTab === 'utilities' ? 'bg-[#14b8a6]' : 'bg-slate-400'}`} />
            <span>Utility Billing</span>
          </button>
        </div>

        {/* Right: Metrics Grid */}
        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-end">
          {/* Card 1: Collected Dues */}
          <div className="flex-1 min-w-[190px] lg:flex-none lg:w-[220px] p-5 rounded-2xl bg-[#ccfbf1] text-[#0f766e] flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-md border-none text-left">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider mb-1 opacity-85">Collected Dues</p>
                <p className="text-[9px] font-bold opacity-60 mb-1 uppercase tracking-wide">for {selectedMonthLabel}</p>
                <p className="text-3xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>₹{collectedDues.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-2 rounded-xl bg-white shadow-sm flex items-center justify-center">
                <IndianRupee className="w-4 h-4 text-[#0f766e]" />
              </div>
            </div>
            <div className="text-[10px] font-bold opacity-90 mt-3 flex items-center gap-1">
              <span>+12%</span>
            </div>
          </div>

          {/* Card 2: Pending Dues */}
          <div className="flex-1 min-w-[190px] lg:flex-none lg:w-[220px] p-5 rounded-2xl bg-[#ffedd5] text-[#c2410c] flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-md border-none text-left">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider mb-1 opacity-85">Pending Dues</p>
                <p className="text-[9px] font-bold opacity-60 mb-1 uppercase tracking-wide">for {selectedMonthLabel}</p>
                <p className="text-3xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>₹{pendingDues.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-2 rounded-xl bg-white shadow-sm flex items-center justify-center">
                <IndianRupee className="w-4 h-4 text-[#c2410c]" />
              </div>
            </div>
            <div className="text-[10px] font-bold opacity-90 mt-3 flex items-center gap-1">
              <span>-8%</span>
            </div>
          </div>

          {/* Card 3: Late Fees */}
          <div className="flex-1 min-w-[190px] lg:flex-none lg:w-[190px] p-5 rounded-2xl bg-[#fee2e2] text-[#991b1b] flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-md border-none text-left">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider mb-1 opacity-85">Late Fees</p>
                <p className="text-[9px] font-bold opacity-60 mb-1 uppercase tracking-wide">for {selectedMonthLabel}</p>
                <p className="text-3xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>₹{totalLateFees.toLocaleString('en-IN')}</p>
              </div>
              <div className="p-2 rounded-xl bg-white shadow-sm flex items-center justify-center">
                <IndianRupee className="w-4 h-4 text-[#991b1b]" />
              </div>
            </div>
            <div className="text-[10px] font-bold opacity-90 mt-3 flex items-center gap-1">
              <span>Accumulated</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── BILLING RULES SECTION ── */}
      <div
        className="flex flex-col sm:flex-row justify-between items-center bg-white border border-slate-200 rounded-2xl p-4 shadow-sm animate-in fade-in zoom-in-95 duration-500"
        style={{ gap: '1.25rem' }}
      >
        <div className="flex items-center flex-wrap sm:flex-nowrap" style={{ gap: '1.5rem' }}>
          <div className="flex items-center" style={{ gap: '0.75rem' }}>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rent Due Date</span>
            <span className="text-[14px] font-extrabold text-slate-800 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-100/80 shadow-sm">
              {settings.due_day}{settings.due_day === 1 ? 'st' : settings.due_day === 2 ? 'nd' : settings.due_day === 3 ? 'rd' : 'th'} of month
            </span>
          </div>
          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
          <div className="flex items-center" style={{ gap: '0.75rem' }}>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Late Fee</span>
            <span className="text-[14px] font-extrabold text-rose-600 bg-rose-50/60 px-3.5 py-1.5 rounded-xl border border-rose-100/80 shadow-sm">
              ₹{settings.late_fee} / month
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          className="text-slate-600 border-slate-200 hover:bg-slate-50 rounded-xl font-bold mt-4 sm:mt-0 transition-all shadow-sm"
          onClick={() => {
            setEditDueDay(settings.due_day);
            setEditLateFee(settings.late_fee);
            setIsEditingRules(true);
          }}
        >
          Edit Rules
        </Button>
      </div>

      {/* ── MAIN CONTENT AREA ── */}
      {activeTab === 'ledger' ? (
        <div className="flex items-start" style={{ gap: '1.5rem' }}>
          {/* LEFT: Search + Table */}
          <div className="flex flex-col min-w-0 transition-all duration-300" style={{ width: selectedTenant ? '60%' : '100%' }}>
            <DuesTable
              rentData={filteredRentData}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onApproveDelay={handleApproveDelay}
              onCollect={setActiveCollectTenant}
              onSendReminder={handleSendReminder}
              onSelectTenant={(t) =>
                setSelectedTenant(t?.tenant_id === selectedTenant?.tenant_id ? null : t)
              }
              selectedTenantId={selectedTenant?.tenant_id}
            />
          </div>

          {/* RIGHT: Detail Panel */}
          {selectedTenant && (
            <div
              className="flex flex-col min-w-0 animate-in fade-in duration-300"
              style={{ width: '40%', flexShrink: 0, gap: '1.25rem' }}
            >
              {/* Tenant Breakdown Card */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm p-5">
                {/* Header of Breakdown Card */}
                <div className="flex justify-between items-start pb-4 border-b border-slate-100 mb-4">
                  <div>
                    <h3 className="text-[15px] font-semibold text-slate-900 leading-tight mb-1">
                      {selectedTenant.name}
                    </h3>
                    <p className="text-[13px] font-medium text-slate-500">
                      Room {selectedTenant.room.replace(/^Room\s*/i, '')} Breakdown
                    </p>
                  </div>
                  <div className="flex items-center" style={{ gap: '0.75rem' }}>
                    <Button
                      variant="outline"
                      className="text-slate-600 border-slate-200 bg-white hover:bg-slate-50 px-3 rounded-lg font-medium text-[13px] h-8 shadow-sm transition-all"
                      onClick={() => triggerToast('Edit feature coming soon')}
                    >
                      Edit
                    </Button>
                    {selectedTenant.status !== 'Paid' && (
                      <Button
                        className="bg-[#14b8a6] hover:bg-teal-600 text-white border-none px-4 rounded-lg font-medium text-[13px] h-8 shadow-sm transition-all"
                        onClick={() => setActiveCollectTenant(selectedTenant)}
                      >
                        Collect
                      </Button>
                    )}
                  </div>
                </div>

                {/* Flex row of numbers */}
                <div className="flex items-start justify-between">
                  <div className="text-left">
                    <p className="text-[13px] font-medium text-slate-800 mb-1">Rent</p>
                    <p className="text-lg font-semibold text-teal-600">₹{selectedTenant.rent.toLocaleString()}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-[13px] font-medium text-slate-800 mb-1">Utilities</p>
                    <p className="text-lg font-semibold text-rose-500">₹{selectedTenant.utilities.toLocaleString()}</p>
                  </div>
                  <div className="text-left">
                    <p className="text-[13px] font-medium text-slate-800 mb-1">Late Fee</p>
                    <p className="text-lg font-semibold text-rose-500">₹{selectedTenant.lateFee.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-medium text-slate-800 mb-1">Total Due</p>
                    <p className="text-lg font-semibold text-slate-900">₹{totalDues(selectedTenant).toLocaleString()}</p>
                  </div>
                </div>

                {selectedTenant.status === 'Paid' && selectedTenant.paymentMethod && (
                  <p className="text-[11px] text-slate-500 font-medium mt-4 pt-4 border-t border-slate-100">
                    Paid via {selectedTenant.paymentMethod} {selectedTenant.paymentDate ? `on ${selectedTenant.paymentDate}` : ''}
                  </p>
                )}
              </div>

              {/* Utility Bill Calculator locked to this room */}
              <BillCalculator
                rentData={rentData}
                onApplyUtilities={handleApplyUtilities}
                lockedRoom={selectedTenant.room}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-lg mx-auto animate-in fade-in zoom-in-95 duration-300">
          <BillCalculator rentData={rentData} onApplyUtilities={handleApplyUtilities} />
        </div>
      )}

      {/* Payment Modal */}
      {activeCollectTenant && (
        <PaymentModal
          tenant={activeCollectTenant}
          onClose={() => setActiveCollectTenant(null)}
          onConfirmPayment={handleConfirmPayment}
        />
      )}

      {/* Settings Modal */}
      {isEditingRules && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 text-left">
              <h2 className="text-xl font-black text-slate-900">Edit Billing Rules</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">Updates will dynamically recalculate late fees for all pending dues.</p>
            </div>
            <div className="p-6 flex flex-col text-left" style={{ gap: '1.25rem' }}>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Due Date (Day of Month)</label>
                <div className="relative">
                  <input
                    type="number"
                    min={1} max={31}
                    value={editDueDay}
                    onChange={(e) => setEditDueDay(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-3 font-semibold text-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">th</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Flat Late Fee</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base">₹</span>
                  <input
                    type="number"
                    min={0}
                    value={editLateFee}
                    onChange={(e) => setEditLateFee(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-4 py-3 font-semibold text-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 pt-2 flex justify-end" style={{ gap: '0.75rem' }}>
              <Button variant="outline" className="rounded-xl font-bold" onClick={() => setIsEditingRules(false)}>Cancel</Button>
              <Button className="bg-[#14b8a6] hover:bg-teal-600 text-white border-none rounded-xl font-bold shadow-md shadow-teal-500/20" onClick={handleSaveSettings}>Save Rules</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
