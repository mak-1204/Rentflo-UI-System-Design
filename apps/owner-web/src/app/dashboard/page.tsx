import type { Metadata } from 'next';
import { DashboardPageClient } from './DashboardPageClient';
import { fetchDashboardData } from './actions';

export const metadata: Metadata = {
  title: 'Owner Dashboard',
  description: 'Overview of your PG properties, tenant activity, and rent status.',
};

// ISR: revalidate every 30 seconds
export const revalidate = 30;

function getRelativeDateString(offsetDays: number) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export default async function DashboardPage() {
  const selectedMonth = '2026-06';
  const todayStr = getRelativeDateString(0); 

  const data = await fetchDashboardData(selectedMonth, todayStr);

  return (
    <DashboardPageClient
      initialTenants={data.tenants}
      initialBills={data.bills}
      initialExpenses={data.expenses}
      initialBookings={data.bookings}
      selectedMonth={selectedMonth}
      selectedDate={todayStr}
    />
  );
}
