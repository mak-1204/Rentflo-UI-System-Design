'use client';

import { useState, useTransition, useCallback, useEffect } from 'react';
import { Check, AlertCircle, Loader2 } from 'lucide-react';
import { TenantsHeader } from './_components/TenantsHeader';
import { TenantsList } from './_components/TenantsList';
import { TenantDetailPanel } from './_components/TenantDetailPanel';
import { AddTenantModal } from './_components/AddTenantModal';
import { addTenant, updateTenant, deleteTenant, fetchTenants } from './actions';
import { DEFAULT_TENANTS, type Tenant } from './types';

interface TenantsPageClientProps {
  initialTenants: Tenant[];
  pgProperties: { id: string; name: string }[];
}

type ToastType = 'success' | 'error' | 'loading';
interface Toast { message: string; type: ToastType }

export function TenantsPageClient({ initialTenants, pgProperties }: TenantsPageClientProps) {
  const [tenants, setTenants] = useState<Tenant[]>(
    initialTenants.length > 0 ? initialTenants : DEFAULT_TENANTS
  );
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [isPending, startTransition] = useTransition();

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    setToast({ message, type });
    if (type !== 'loading') setTimeout(() => setToast(null), 3500);
  }, []);

  // Backend search debouncing
  useEffect(() => {
    startTransition(async () => {
      const results = await fetchTenants(search);
      setTenants(results);
    });
  }, [search]);

  // ── Onboard new tenant from modal ──────────────────────────────────────────
  const handleConfirmAddTenant = (newTenantData: Omit<Tenant, 'id' | 'pg_name'> & { pgId?: string }) => {
    setShowAddModal(false);

    // Find PG name for local UI update
    const pg = pgProperties.find(p => p.id === newTenantData.pg_id);
    const newTenant: Tenant = {
      ...newTenantData,
      pg_name: pg?.name,
    };

    // Optimistic addition
    setTenants((prev) => {
      const next = [newTenant, ...prev];
      setSelectedIndex(0);
      return next;
    });

    startTransition(async () => {
      showToast('Onboarding tenant…', 'loading');
      const result = await addTenant(newTenantData, newTenantData.pg_id);
      if (result.success) {
        showToast('Tenant onboarded successfully ✓', 'success');
        const refreshed = await fetchTenants(search);
        setTenants(refreshed);
      } else {
        showToast(`Onboarding failed: ${result.error}`, 'error');
      }
    });
  };

  // ── Save existing tenant profile edits ─────────────────────────────────────
  const handleSaveTenant = (updated: Tenant) => {
    if (selectedIndex === null) return;

    // Optimistic update
    setTenants((prev) => prev.map((t, i) => (i === selectedIndex ? updated : t)));

    startTransition(async () => {
      showToast('Saving profile updates…', 'loading');
      let result: { success: boolean; error?: string };

      if (updated.id) {
        result = await updateTenant(updated.id, updated);
      } else {
        const { id: _id, ...rest } = updated;
        result = await addTenant(rest, updated.pg_id);
      }

      if (result.success) {
        showToast('Tenant profile saved ✓', 'success');
        const refreshed = await fetchTenants(search);
        setTenants(refreshed);
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
          const refreshed = await fetchTenants(search);
          setTenants(refreshed);
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
      className="p-8 space-y-8 max-w-7xl mx-auto relative min-h-screen text-left animate-in fade-in duration-300"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      {/* Toast notifications */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold z-50 transition-all ${
            toast.type === 'error'
              ? 'bg-red-650 text-white'
              : 'bg-slate-900 text-white'
          }`}
        >
          {toast.type === 'loading' && <Loader2 className="w-4 h-4 text-teal-400 animate-spin" />}
          {toast.type === 'success' && <Check className="w-4 h-4 text-teal-400" />}
          {toast.type === 'error'   && <AlertCircle className="w-4 h-4 text-white" />}
          {toast.message}
        </div>
      )}

      {/* Syncing loader */}
      {isPending && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-lg text-xs text-slate-650 font-semibold">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-500" /> Syncing with Supabase…
        </div>
      )}

      {/* Header */}
      <TenantsHeader onAddTenant={() => setShowAddModal(true)} />

      {/* Side-by-side layout: Tenants list + Edit detail panel */}
      <div className="flex flex-col lg:flex-row gap-8 items-start relative">
        <div className={`transition-all duration-300 w-full ${selectedTenant ? 'lg:w-[calc(100%-440px)]' : 'w-full'}`}>
          <TenantsList
            tenants={tenants}
            search={search}
            onSearchChange={setSearch}
            selectedIndex={selectedIndex}
            onSelectTenant={setSelectedIndex}
          />
        </div>

        {selectedTenant && (
          <div className="w-full lg:w-[400px] shrink-0 border border-slate-200 rounded-2xl shadow-lg bg-white overflow-hidden sticky top-8 animate-in slide-in-from-right-4 duration-300">
            <TenantDetailPanel
              key={selectedIndex}
              tenant={selectedTenant}
              pgProperties={pgProperties}
              onClose={() => setSelectedIndex(null)}
              onSave={handleSaveTenant}
              onDelete={handleDeleteTenant}
            />
          </div>
        )}
      </div>

      {/* Add Tenant Modal */}
      {showAddModal && (
        <AddTenantModal
          pgProperties={pgProperties}
          onClose={() => setShowAddModal(false)}
          onSave={handleConfirmAddTenant}
        />
      )}
    </div>
  );
}
