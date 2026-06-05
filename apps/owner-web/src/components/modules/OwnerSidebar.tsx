'use client';

/**
 * src/components/modules/OwnerSidebar.tsx
 *
 * Converted from: apps/owner-web/app/layouts/OwnerWebLayout.tsx
 *
 * Key Next.js adaptations:
 *  - `useLocation()` → `usePathname()` from 'next/navigation'
 *  - `useNavigate()` → `useRouter()` from 'next/navigation'
 *  - React Router `<Link to={...}>` → Next.js `<Link href={...}>`
 *  - `<Outlet />` removed — handled by the RSC layout shell
 *  - localStorage state for PG selection is preserved (purely client UI state)
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Users,
  IndianRupee,
  UtensilsCrossed,
  Globe,
  UserCheck,
  Wrench,
  Menu,
  X,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@stayflo/ui';
import logoImg from '../../../logo.png';
import { fetchOwnerProperties } from '@/app/dashboard/actions';

// ─── Constants ─────────────────────────────────────────────────────────────────

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard',                 label: 'Dashboard',        icon: Home,             exact: true },
  { href: '/dashboard/tenants',         label: 'Tenants',          icon: Users },
  { href: '/dashboard/rent-collection', label: 'Rent Collection',  icon: IndianRupee },
  { href: '/dashboard/food',            label: 'Food Management',  icon: UtensilsCrossed },
  { href: '/dashboard/operations',      label: 'Operations',       icon: Wrench },
  { href: '/dashboard/website-builder', label: 'PG Website',       icon: Globe },
  { href: '/dashboard/leads',           label: 'Leads',            icon: UserCheck },
];

// ─── Component ─────────────────────────────────────────────────────────────────

export function OwnerSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPgDropdownOpen, setIsPgDropdownOpen] = useState(false);
  const [allProperties, setAllProperties] = useState<string[]>(['Sunrise PG', 'Starlight Co-Living', 'Elite Mansion']);

  // Fetch properties from database dynamically on mount
  useEffect(() => {
    async function loadProperties() {
      const pgs = await fetchOwnerProperties();
      if (pgs && pgs.length > 0) {
        setAllProperties(pgs);
      }
    }
    loadProperties();
  }, []);

  // ── PG multi-select state (persisted in localStorage) ───────────────────────
  const [selectedPgs, setSelectedPgs] = useState<string[]>(() => {
    const fallback = 'Sunrise PG';
    if (typeof window === 'undefined') return [fallback];
    const saved = localStorage.getItem('stayflo_selected_pgs');
    if (saved) {
      try {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed as string[];
      } catch {
        // fall through to default
      }
    }
    return [localStorage.getItem('stayflo_selected_pg') ?? fallback];
  });

  const handlePgsChange = (nextPgs: string[]) => {
    setSelectedPgs(nextPgs);
    localStorage.setItem('stayflo_selected_pgs', JSON.stringify(nextPgs));

    const primaryPg = nextPgs[0] ?? (allProperties[0] || 'Sunrise PG');
    localStorage.setItem('stayflo_selected_pg', primaryPg);

    // Sync PG name to builder state if it exists
    const saved = localStorage.getItem('stayflo_builder_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Record<string, unknown>;
        parsed.pgName = primaryPg;
        localStorage.setItem('stayflo_builder_state', JSON.stringify(parsed));
      } catch {
        // ignore
      }
    }

    window.dispatchEvent(new Event('stayflo_website_update'));
  };

  const togglePg = (pg: string) => {
    if (selectedPgs.includes(pg)) {
      if (selectedPgs.length === 1) return; // prevent empty selection
      handlePgsChange(selectedPgs.filter((p) => p !== pg));
    } else {
      handlePgsChange([...selectedPgs, pg]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedPgs.length === allProperties.length) {
      handlePgsChange([allProperties[0] || 'Sunrise PG']);
    } else {
      handlePgsChange([...allProperties]);
    }
  };

  // Sync from external events (e.g., builder updates PG name)
  useEffect(() => {
    const handleUpdate = () => {
      const saved = localStorage.getItem('stayflo_selected_pgs');
      if (saved) {
        try {
          const parsed: unknown = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSelectedPgs(parsed as string[]);
            return;
          }
        } catch {
          // ignore
        }
      }
      setSelectedPgs([localStorage.getItem('stayflo_selected_pg') ?? (allProperties[0] || 'Sunrise PG')]);
    };
    window.addEventListener('stayflo_website_update', handleUpdate);
    return () => window.removeEventListener('stayflo_website_update', handleUpdate);
  }, [allProperties]);

  // Close drawer on navigation
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // ── Derived helpers ──────────────────────────────────────────────────────────
  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const portfolioUrl =
    selectedPgs.length > 0
      ? `${process.env.NEXT_PUBLIC_PORTFOLIO_URL ?? 'http://localhost:5175'}/portfolio/${selectedPgs[0].toLowerCase().replace(/\s+/g, '-')}`
      : '#';

  return (
    <>
      {/* ── Mobile Top Header ──────────────────────────────────────────────── */}
      <header
        className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b flex items-center justify-between px-4 z-40"
        style={{ borderColor: '#E5E7EB' }}
        aria-label="Mobile navigation header"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 focus:outline-none"
            aria-label="Open sidebar menu"
            aria-expanded={isSidebarOpen}
          >
            <Menu className="w-6 h-6" />
          </button>
          <img src={logoImg.src} alt="stayfloww logo" className="h-8 w-auto object-contain" />
        </div>
        <span className="text-xs font-semibold px-2 py-1 rounded bg-[#f0fdfa] text-[#14b8a6] truncate max-w-[150px]">
          {selectedPgs.length === allProperties.length ? 'All PGs' : selectedPgs[0]}
        </span>
      </header>

      {/* ── Mobile Backdrop ────────────────────────────────────────────────── */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ────────────────────────────────────────────────────────── */}
      <aside
        className={[
          'w-60 bg-white border-r flex flex-col',
          'fixed md:relative inset-y-0 left-0 z-50 md:z-30',
          'transform transition-transform duration-300 ease-in-out md:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
        style={{ borderColor: '#E5E7EB' }}
        aria-label="Primary navigation"
      >
        {/* ── Sidebar Header ──────────────────────────────────────────────── */}
        <div className="p-6 border-b flex flex-col relative" style={{ borderColor: '#E5E7EB' }}>
          <div className="flex justify-between items-center">
            <img src={logoImg.src} alt="stayfloww logo" className="h-10 w-auto object-contain" />
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-1 rounded-md hover:bg-slate-100 text-slate-500"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ── Active PG Multi-select ─────────────────────────────────────── */}
          <div className="mt-4 relative z-30">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Active PG Properties
            </label>

            <button
              id="pg-filter-trigger"
              onClick={() => setIsPgDropdownOpen((v) => !v)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg p-2.5 flex items-center justify-between transition-all outline-none font-medium cursor-pointer"
              aria-haspopup="listbox"
              aria-expanded={isPgDropdownOpen}
            >
              <span className="truncate pr-1 text-left text-xs">
                {selectedPgs.length === allProperties.length
                  ? 'All Properties'
                  : selectedPgs.join(', ')}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${isPgDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isPgDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsPgDropdownOpen(false)}
                  aria-hidden="true"
                />
                <div
                  className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-2 z-20 space-y-1"
                  role="listbox"
                  aria-multiselectable="true"
                  aria-label="Select PG properties"
                >
                  {/* Select All */}
                  <label className="flex items-center gap-2.5 px-3.5 py-2 hover:bg-slate-50 cursor-pointer text-xs font-semibold border-b border-slate-100 pb-2">
                    <input
                      type="checkbox"
                      checked={selectedPgs.length === allProperties.length}
                      onChange={toggleSelectAll}
                      className="rounded border-slate-300 text-[#14b8a6] focus:ring-[#14b8a6] h-3.5 w-3.5"
                      aria-label="Select all properties"
                    />
                    <span style={{ color: '#111827' }}>Select All ({allProperties.length})</span>
                  </label>

                  {allProperties.map((pg) => (
                    <label
                      key={pg}
                      className="flex items-center gap-2.5 px-3.5 py-1.5 hover:bg-slate-50 cursor-pointer text-xs font-medium"
                      role="option"
                      aria-selected={selectedPgs.includes(pg)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedPgs.includes(pg)}
                        onChange={() => togglePg(pg)}
                        className="rounded border-slate-300 text-[#14b8a6] focus:ring-[#14b8a6] h-3.5 w-3.5"
                        aria-label={`Select ${pg}`}
                      />
                      <span style={{ color: '#374151' }}>{pg}</span>
                    </label>
                  ))}
                </div>
              </>
            )}

            <div className="mt-2.5 flex items-center justify-between">
              <a
                href={portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] hover:underline font-semibold flex items-center gap-1"
                style={{ color: '#14b8a6' }}
                aria-label="View live PG portfolio site"
              >
                View live site <ExternalLink className="w-3 h-3" />
              </a>
              <Link
                href="/dashboard/website-builder"
                className="text-[11px] hover:underline text-slate-400"
              >
                Edit details
              </Link>
            </div>
          </div>
        </div>

        {/* ── Navigation ────────────────────────────────────────────────────── */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto" aria-label="Dashboard navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
                style={{
                  background: active ? '#f0fdfa' : 'transparent',
                  color: active ? '#14b8a6' : '#6B7280',
                }}
                aria-current={active ? 'page' : undefined}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* ── Subscription Badge ────────────────────────────────────────────── */}
        <div className="p-4 border-t" style={{ borderColor: '#E5E7EB' }}>
          <div className="px-3 py-2 rounded-lg text-center" style={{ background: '#f0fdfa' }}>
            <p className="text-sm font-semibold" style={{ color: '#14b8a6' }}>PG Plan ✓</p>
            <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>Active</p>
          </div>
        </div>

        {/* ── Profile ───────────────────────────────────────────────────────── */}
        <div className="p-4 border-t" style={{ borderColor: '#E5E7EB' }}>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback style={{ background: '#14b8a6', color: '#FFFFFF' }}>RK</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: '#111827' }}>
                Rajan Kumar
              </p>
              <button
                onClick={() => router.push('/')}
                className="text-xs hover:underline"
                style={{ color: '#6B7280' }}
                aria-label="Logout"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
