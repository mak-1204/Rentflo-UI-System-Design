'use server';

import { getAuthUser } from '@/utils/supabase/server';

export interface DashboardData {
  tenants: any[];
  bills: any[];
  expenses: any[];
  bookings: any[];
}

export async function fetchDashboardData(monthStr: string, dateStr: string): Promise<DashboardData> {
  const { supabase } = await getAuthUser();
  const [
    { data: tenants, error: tenantsError },
    { data: bills, error: billsError },
    { data: expenses, error: expensesError },
    { data: bookings, error: bookingsError }
  ] = await Promise.all([
    supabase.from('tenants').select('id, name, room, phone, rent'),
    supabase.from('rent_bills').select('id, tenant_id, rent, utilities, lateFee, status, "paymentDate", "paymentMethod"').eq('month', monthStr),
    supabase.from('operational_expenses').select('id, name, amount, date, status'),
    supabase.from('food_bookings').select('id, tenant_id, breakfast, lunch, dinner, breakfast_served, lunch_served, dinner_served, status').eq('date', dateStr)
  ]);

  if (tenantsError) console.error('[fetchDashboardData] tenantsError:', tenantsError.message);
  if (billsError) console.error('[fetchDashboardData] billsError:', billsError.message);
  if (expensesError) console.error('[fetchDashboardData] expensesError:', expensesError.message);
  if (bookingsError) console.error('[fetchDashboardData] bookingsError:', bookingsError.message);

  return {
    tenants: tenants ?? [],
    bills: bills ?? [],
    expenses: expenses ?? [],
    bookings: bookings ?? [],
  };
}

export async function fetchOwnerProperties(): Promise<string[]> {
  const { supabase, user } = await getAuthUser();
  const { data, error } = await supabase
    .from('pg_properties')
    .select('name')
    .eq('owner_id', user.id)
    .order('name');

  if (error) {
    console.error('[fetchOwnerProperties] Error:', error.message);
    return [];
  }

  return (data ?? []).map((row: any) => row.name);
}

