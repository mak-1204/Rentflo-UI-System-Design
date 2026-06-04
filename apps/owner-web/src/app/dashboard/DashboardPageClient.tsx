'use client';

import { useState, useCallback, useTransition } from 'react';
import { Bell, Check, QrCode, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, Button, Card } from '@stayflo/ui';

import { MetricsGrid } from './_components/MetricsGrid';
import { RevenueChart } from './_components/RevenueChart';
import { DuesMonitoring } from './_components/DuesMonitoring';
import { ExpensesList } from './_components/ExpensesList';
import { MealStatsCard } from './_components/MealStatsCard';
import { ScannerModal } from './food/_components/ScannerModal';
import { markMealServed } from './food/actions';

import { fetchDashboardData } from './actions';

interface DashboardPageClientProps {
  initialTenants: any[];
  initialBills: any[];
  initialExpenses: any[];
  initialBookings: any[];
  selectedMonth: string;
  selectedDate: string;
}

const MONTHS = [
  { label: 'May 2026', value: '2026-05' },
  { label: 'Jun 2026', value: '2026-06' },
  { label: 'Jul 2026', value: '2026-07' },
];

export function DashboardPageClient({
  initialTenants,
  initialBills,
  initialExpenses,
  initialBookings,
  selectedMonth,
  selectedDate,
}: DashboardPageClientProps) {
  const [notif, setNotif] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [bookings, setBookings] = useState<any[]>(initialBookings);
  const [currentMonth, setCurrentMonth] = useState<string>(selectedMonth);
  const [bills, setBills] = useState<any[]>(initialBills);
  const [isPending, startTransition] = useTransition();

  const handleMonthChange = (monthStr: string) => {
    setCurrentMonth(monthStr);
    startTransition(async () => {
      const data = await fetchDashboardData(monthStr, selectedDate);
      setBills(data.bills);
    });
  };

  const triggerToast = useCallback((msg: string) => {
    setNotif(msg);
    setTimeout(() => setNotif(null), 3000);
  }, []);

  // Compute proration, billing metrics, and invoices list dynamically
  const rentRecords = initialTenants.map((tenant) => {
    const bill = bills.find((b) => b.tenant_id === tenant.id);
    return {
      tenant_id: tenant.id,
      name: tenant.name ?? 'Unknown',
      room: tenant.room ?? 'Room TBD',
      phone: tenant.phone ?? '',
      rent: bill?.rent ?? tenant.rent ?? 8500,
      utilities: bill?.utilities ?? 0,
      lateFee: bill?.lateFee ?? 0,
      status: bill?.status ?? 'Overdue',
      paymentDate: bill?.paymentDate,
      paymentMethod: bill?.paymentMethod,
    };
  });

  const totalDues = (r: typeof rentRecords[0]) => r.rent + r.utilities + r.lateFee;

  // Rent Collected (Paid dues)
  const rentCollected = rentRecords
    .filter((r) => r.status === 'Paid')
    .reduce((sum, r) => sum + totalDues(r), 0);

  // Pending Dues (Unpaid dues)
  const pendingDues = rentRecords
    .filter((r) => r.status !== 'Paid')
    .reduce((sum, r) => sum + totalDues(r), 0);

  const lateFeeTotal = rentRecords.reduce((sum, r) => sum + r.lateFee, 0);

  // Utilities values from operational expenses
  const electricityCharges = initialExpenses
    .filter((e) => e.name.toLowerCase().includes('electricity'))
    .reduce((sum, e) => sum + e.amount, 0);

  const waterCharges = initialExpenses
    .filter((e) => e.name.toLowerCase().includes('water'))
    .reduce((sum, e) => sum + e.amount, 0);

  const cateringCharges = initialExpenses
    .filter((e) => e.name.toLowerCase().includes('catering') || e.name.toLowerCase().includes('cook'))
    .reduce((sum, e) => sum + e.amount, 0);

  const foodVal = Math.max(0, cateringCharges - 8700);

  // Overdue tenants tracking list
  const pendingDuesList = rentRecords
    .filter((r) => r.status !== 'Paid')
    .map((r) => ({
      name: r.name,
      room: r.room,
      rent: r.rent,
      utilities: r.utilities,
      total: totalDues(r),
      days: r.status === 'Overdue' ? 8 : r.status === 'Delay Requested' ? 12 : 3,
    }));

  // Recharts monthly values
  const chartData = [
    { month: 'Jan', Rent: 96000, Utilities: 8900, LateFee: 1250 },
    { month: 'Feb', Rent: 94500, Utilities: 9200, LateFee: 750 },
    { month: 'Mar', Rent: 102000, Utilities: 9800, LateFee: 1500 },
    { month: 'Apr', Rent: 99500, Utilities: 10500, LateFee: 1000 },
    { month: 'May', Rent: 101000, Utilities: 11800, LateFee: 1750 },
    { month: 'Jun', Rent: rentCollected || 48200, Utilities: (electricityCharges + waterCharges) || 12650, LateFee: lateFeeTotal || 500 },
  ];

  // Meal Bookings count for today
  const mealCounts = {
    breakfast: bookings.filter((b) => b.breakfast).length,
    lunch: bookings.filter((b) => b.lunch).length,
    dinner: bookings.filter((b) => b.dinner).length,
  };

  const handleServeMeal = async (tenantId: string, mealType: 'breakfast' | 'lunch' | 'dinner') => {
    const result = await markMealServed(tenantId, selectedDate, mealType);
    if (result.success) {
      setBookings((prev) =>
        prev.map((b) =>
          b.tenant_id === tenantId
            ? { ...b, [`${mealType}_served`]: true, [`${mealType}`]: true, status: 'Booked' }
            : b
        )
      );
      triggerToast(`Marked ${mealType} as served!`);
    } else {
      triggerToast(`Failed to serve: ${result.error}`);
    }
  };

  // Convert bookings for scanner simulator (maps properties to fit ScannerModal schema)
  const scannerBookings = rentRecords.map((r) => {
    const activeBooking = bookings.find((b) => b.tenant_id === r.tenant_id);
    return {
      tenant_id:        r.tenant_id,
      name:             r.name,
      room:             r.room,
      phone:            r.phone,
      date:             selectedDate,
      breakfast:        activeBooking?.breakfast ?? false,
      lunch:            activeBooking?.lunch ?? false,
      dinner:           activeBooking?.dinner ?? false,
      breakfast_served: activeBooking?.breakfast_served ?? false,
      lunch_served:     activeBooking?.lunch_served ?? false,
      dinner_served:    activeBooking?.dinner_served ?? false,
      status:           activeBooking?.status ?? 'Not Booked',
    };
  });

  const activities = [
    { text: 'Priya Sharma paid rent ₹8,500 + Electricity', time: '2 hours ago' },
    { text: 'Amit Kumar uploaded electricity meter photo for Room 4', time: '3 hours ago' },
    { text: 'Water tanker of 2000L delivered & logged', time: '5 hours ago' },
    { text: 'Rahul Verma requested payment delay (Approve in bills)', time: '1 day ago' },
  ];

  return (
    <div
      className="h-full overflow-y-auto text-left bg-gradient-to-br from-slate-50 via-slate-50 to-[#14b8a6]/[0.03] pb-12 relative"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      {/* Toast Notification */}
      {notif && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Check className="w-4 h-4 text-[#14b8a6]" /> {notif}
        </div>
      )}

      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b px-8 py-5 flex items-center justify-between border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>
            Owner Dashboard
          </h1>
          <p className="text-xs mt-1 text-slate-450 font-medium">
            Sunrise PG · Koramangala · {MONTHS.find((m) => m.value === currentMonth)?.label ?? currentMonth}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowScanner(true)}
            style={{ background: '#14b8a6', color: '#FFFFFF' }}
            className="hover:opacity-95 active:scale-98 flex items-center gap-2 h-10 px-4 text-xs font-bold uppercase tracking-wider rounded-xl shadow-md shadow-teal-500/10 transition-all cursor-pointer border-none"
          >
            <QrCode className="w-4 h-4" /> Scan Food Pass
          </Button>
          <button
            className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
            onClick={() => triggerToast('No new notifications!')}
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500"></div>
          </button>
          <Avatar>
            <AvatarFallback style={{ background: '#14b8a6', color: '#FFFFFF' }}>RK</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* QR Scanner simulator */}
      {showScanner && (
        <ScannerModal
          bookings={scannerBookings}
          onClose={() => {
            setShowScanner(false);
            // Refresh counts based on potential updates
          }}
          onServeMeal={handleServeMeal}
        />
      )}

      <div className="p-8 space-y-8">
        {/* Month Filter */}
        <div className="flex flex-wrap justify-between items-center gap-4 bg-white/50 border border-slate-200/60 p-4 rounded-2xl">
          <div className="flex gap-2">
            {MONTHS.map((m) => (
              <button
                key={m.value}
                onClick={() => handleMonthChange(m.value)}
                disabled={isPending}
                className="px-4 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer disabled:opacity-50"
                style={{
                  background: currentMonth === m.value ? '#f0fdfa' : '#FFFFFF',
                  color: currentMonth === m.value ? '#14b8a6' : '#6B7280',
                  borderColor: currentMonth === m.value ? 'rgba(20,184,166,0.2)' : '#E5E7EB',
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
          <div className="text-xs font-bold text-slate-400 flex items-center gap-2">
            {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#14b8a6]" />}
            <span>Showing insights for: <span className="text-[#14b8a6]">{MONTHS.find((m) => m.value === currentMonth)?.label}</span></span>
          </div>
        </div>

        {/* Metrics Grid */}
        <MetricsGrid
          rentCollected={rentCollected}
          pendingDues={pendingDues}
          electricityCharges={electricityCharges}
          waterCharges={waterCharges}
          selectedMonthLabel={MONTHS.find((m) => m.value === currentMonth)?.label ?? currentMonth}
        />

        {/* Dashboard Panels Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <RevenueChart chartData={chartData} />
            <DuesMonitoring
              pendingDues={pendingDuesList}
              onViewAllDues={() => triggerToast('Navigating to Rent Collection tab...')}
            />
          </div>
          <div className="space-y-8">
            <ExpensesList expenses={initialExpenses} />
            <MealStatsCard
              breakfast={mealCounts.breakfast}
              lunch={mealCounts.lunch}
              dinner={mealCounts.dinner}
            />
            {/* Recent Activity Log */}
            <Card className="p-8 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md">
              <h3 className="text-xl font-bold mb-6 text-slate-900 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                Recent Activity Log
              </h3>
              <div className="space-y-5">
                {activities.map((activity, i) => (
                  <div key={i} className="pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                    <p className="text-xs text-slate-650 leading-relaxed font-semibold">{activity.text}</p>
                    <p className="text-[10px] mt-1.5 text-slate-400 font-medium">{activity.time}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
