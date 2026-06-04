'use server';

import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';
import type { RentRecord } from './types';

const TABLE = 'rent_bills';
const PAGE  = '/dashboard/rent-collection';

// ─── Read ─────────────────────────────────────────────────────────────────────

// Helper to parse different move-in date string formats safely
function parseMoveInDate(moveInStr: string): Date | null {
  if (!moveInStr) return null;
  if (moveInStr.toLowerCase() === 'today') {
    return new Date();
  }
  const parsed = Date.parse(moveInStr);
  if (!isNaN(parsed)) {
    return new Date(parsed);
  }
  // Try parsing custom format like "01 Jun 2026"
  const parts = moveInStr.trim().split(/\s+/);
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const month = monthNames.indexOf(parts[1].toLowerCase().substring(0, 3));
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && month !== -1 && !isNaN(year)) {
      return new Date(year, month, day);
    }
  }
  return null;
}

export async function fetchRentRecords(monthString: string): Promise<RentRecord[]> {
  // Query all active tenants and left-join their monthly rent bills
  const { data: tenants, error: tenantsError } = await supabase
    .from('tenants')
    .select(`
      id,
      name,
      room,
      phone,
      rent,
      moveIn,
      rent_bills (
        id,
        month,
        rent,
        utilities,
        lateFee,
        status,
        paymentDate,
        paymentMethod
      )
    `);

  if (tenantsError) {
    console.error('[fetchRentRecords]', tenantsError.message);
    return [];
  }

  const [queryYear, queryMonth] = monthString.split('-').map(Number);

  return (tenants ?? []).map((row: any) => {
    // Find the bill record for this specific month (if any)
    const billsForMonth = (row.rent_bills ?? []).filter((b: any) => b.month === monthString);
    const bill = billsForMonth[0];

    // Base rent configuration
    const baseRent = row.rent ?? 8500;
    let calculatedRent = baseRent;

    // Proration Logic:
    // If the query month is the month immediately following the move-in month,
    // deduct the days they missed in the first month (since they pre-paid in full).
    const moveInDate = parseMoveInDate(row.moveIn);
    if (moveInDate) {
      const moveInYear = moveInDate.getFullYear();
      const moveInMonth = moveInDate.getMonth() + 1; // 1-indexed month
      const moveInDay = moveInDate.getDate();

      // Calculate months difference
      const monthsDiff = (queryYear - moveInYear) * 12 + (queryMonth - moveInMonth);

      if (monthsDiff === 1 && moveInDay > 1) {
        // Find total number of days in the move-in month
        const daysInMoveInMonth = new Date(moveInYear, moveInMonth, 0).getDate();
        const missedDays = moveInDay - 1;
        const deduction = Math.round((baseRent / daysInMoveInMonth) * missedDays);
        calculatedRent = Math.max(0, baseRent - deduction);
      }
    }

    return {
      id:            bill?.id,
      tenant_id:     row.id,
      name:          row.name ?? 'Unknown',
      room:          row.room ?? 'Room TBD',
      phone:         row.phone ?? '',
      month:         monthString,
      rent:          bill?.rent      ?? calculatedRent,
      utilities:     bill?.utilities ?? 0,
      lateFee:       bill?.lateFee   ?? 0,
      status:        bill?.status    ?? 'Overdue',
      paymentDate:   bill?.paymentDate   ?? undefined,
      paymentMethod: bill?.paymentMethod ?? undefined,
    };
  });
}

// ─── Save / Upsert Bill ──────────────────────────────────────────────────────

export async function saveRentBill(
  bill: Omit<RentRecord, 'name' | 'room' | 'phone'>
): Promise<{ success: boolean; error?: string }> {
  const payload = {
    tenant_id:     bill.tenant_id,
    month:         bill.month,
    rent:          bill.rent,
    utilities:     bill.utilities,
    lateFee:       bill.lateFee,
    status:        bill.status,
    paymentDate:   bill.paymentDate   || null,
    paymentMethod: bill.paymentMethod || null,
  };

  const { error } = await supabase
    .from(TABLE)
    .upsert(payload, { onConflict: 'tenant_id,month' });

  if (error) {
    console.error('[saveRentBill]', error.message);
    return { success: false, error: error.message };
  }

  revalidatePath(PAGE);
  return { success: true };
}

// ─── Approve Delay Request ────────────────────────────────────────────────────

export async function approveDelayRequest(
  tenantId: string,
  monthStr: string
): Promise<{ success: boolean; error?: string }> {
  // Check if bill exists
  const { data: bill, error: selectError } = await supabase
    .from(TABLE)
    .select('id, rent')
    .eq('tenant_id', tenantId)
    .eq('month', monthStr)
    .single();

  if (selectError && selectError.code !== 'PGRST116') { // PGRST116: no rows returned
    console.error('[approveDelayRequest SELECT]', selectError.message);
    return { success: false, error: selectError.message };
  }

  const rentAmount = bill?.rent ?? 8500;

  const payload = {
    tenant_id:   tenantId,
    month:       monthStr,
    rent:        rentAmount,
    lateFee:     0, // Waive late fees
    status:      'Delay Approved',
  };

  const { error } = await supabase
    .from(TABLE)
    .upsert(payload, { onConflict: 'tenant_id,month' });

  if (error) {
    console.error('[approveDelayRequest UPSERT]', error.message);
    return { success: false, error: error.message };
  }

  revalidatePath(PAGE);
  return { success: true };
}

// ─── Collect Counter Payment ──────────────────────────────────────────────────

export async function collectRentPayment(
  tenantId: string,
  monthStr: string,
  rentAmount: number,
  utilityAmount: number,
  lateFeeAmount: number,
  method: string
): Promise<{ success: boolean; error?: string }> {
  const formattedToday = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const payload = {
    tenant_id:     tenantId,
    month:         monthStr,
    rent:          rentAmount,
    utilities:     utilityAmount,
    lateFee:       lateFeeAmount,
    status:        'Paid',
    paymentDate:   formattedToday,
    paymentMethod: method,
  };

  const { error } = await supabase
    .from(TABLE)
    .upsert(payload, { onConflict: 'tenant_id,month' });

  if (error) {
    console.error('[collectRentPayment]', error.message);
    return { success: false, error: error.message };
  }

  revalidatePath(PAGE);
  return { success: true };
}
