'use client';

import { useState, useTransition, useCallback } from 'react';
import { Check, AlertCircle, Loader2 } from 'lucide-react';
import { TenantsHeader } from './_components/TenantsHeader';
import { TenantsList } from './_components/TenantsList';
import { TenantDetailPanel } from './_components/TenantDetailPanel';
import { addTenant, updateTenant, deleteTenant } from './actions';
import { DEFAULT_TENANTS, type Tenant } from './types';

interface TenantsPageClientProps {
  initialTenants: Tenant[];
  pgProperties: { id: string; name: string }[];
}

type ToastType = 'success' | 'error' | 'loading';
interface Toast { message: string; type: ToastType }

export function TenantsPageClient({ initialTenants, pgProperties }: TenantsPageClientProps) {
  // Use Supabase data if available; fall back to defaults
  const [tenants, setTenants] = useState<Tenant[]>(
    initialTenants.length > 0 ? initialTenants : DEFAULT_TENANTS
  );
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [isPending, startTransition] = useTransition();

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    setToast({ message, type });
    if (type !== 'loading') setTimeout(() => setToast(null), 3500);
  }, []);

  // ── Add ──────────────────────────────────────────────────────────────────
  const handleAddTenant = () => {
    const draft: Tenant = {
      name: 'New Resident',
      room: 'Room TBD',
      floor: 'Ground Floor',
      rent: 8500,
      phone: '',
      email: '',
      status: 'Paid',
      moveIn: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      activeMonths: 0,
      pg_id: pgProperties[0]?.id,
      pg_name: pgProperties[0]?.name,
    };
    setTenants((prev) => {
      const next = [...prev, draft];
      setSelectedIndex(next.length - 1);
      return next;
    });
    showToast('Draft tenant added — save to persist to Supabase.', 'success');
  };

  // ── Save (create or update) ───────────────────────────────────────────────
  const handleSaveTenant = (updated: Tenant) => {
    if (selectedIndex === null) return;

    // Optimistic update in local state
    setTenants((prev) => prev.map((t, i) => (i === selectedIndex ? updated : t)));

    startTransition(async () => {
      showToast('Saving…', 'loading');
      let result: { success: boolean; error?: string };

      if (updated.id) {
        result = await updateTenant(updated.id, updated);
      } else {
        // New tenant without an id → INSERT into Supabase
        const { id: _id, ...rest } = updated; // strip undefined id
        result = await addTenant(rest);
      }

      if (result.success) {
        showToast('Tenant saved to Supabase ✓', 'success');
      } else {
        showToast(`Save failed: ${result.error}`, 'error');
      }
    });
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDeleteTenant = () => {
    if (selectedIndex === null) return;
    const tenant = tenants[selectedIndex];
    if (!window.confirm(`Delete ${tenant.name} from the directory?`)) return;

    // Optimistic removal
    setTenants((prev) => prev.filter((_, i) => i !== selectedIndex));
    setSelectedIndex(null);

    if (tenant.id) {
      startTransition(async () => {
        showToast('Deleting…', 'loading');
        const result = await deleteTenant(tenant.id!);
        if (result.success) {
          showToast(`${tenant.name} removed from Supabase ✓`, 'success');
        } else {
          showToast(`Delete failed: ${result.error}`, 'error');
        }
      });
    } else {
      showToast(`${tenant.name} removed.`, 'success');
    }
  };

  const selectedTenant = selectedIndex !== null ? tenants[selectedIndex] : null;

  return (
    <div
      className="p-8 space-y-8 max-w-7xl mx-auto relative min-h-screen text-left"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold z-50 transition-all ${
            toast.type === 'error'
              ? 'bg-red-600 text-white'
              : 'bg-slate-900 text-white'
          }`}
        >
          {toast.type === 'loading' && <Loader2 className="w-4 h-4 text-teal-400 animate-spin" />}
          {toast.type === 'success' && <Check className="w-4 h-4 text-teal-400" />}
          {toast.type === 'error'   && <AlertCircle className="w-4 h-4 text-white" />}
          {toast.message}
        </div>
      )}

      {/* Global pending overlay indicator */}
      {isPending && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-lg text-xs text-slate-600 font-semibold">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-500" /> Syncing with Supabase…
        </div>
      )}

      <TenantsHeader onAddTenant={handleAddTenant} />

      <TenantsList
        tenants={tenants}
        search={search}
        onSearchChange={setSearch}
        selectedIndex={selectedIndex}
        onSelectTenant={setSelectedIndex}
      />

      {selectedTenant && (
        <TenantDetailPanel
          key={selectedIndex}
          tenant={selectedTenant}
          pgProperties={pgProperties}
          onClose={() => setSelectedIndex(null)}
          onSave={handleSaveTenant}
          onDelete={handleDeleteTenant}
        />
      )}
    </div>
  );
}
