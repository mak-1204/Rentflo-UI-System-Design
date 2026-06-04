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

  // Fetch PG settings for due_day and late_fee
  const { data: pgData, error: pgError } = await supabase
    .from('pg_properties')
    .select('due_day, late_fee')
    .eq('id', '11111111-1111-1111-1111-111111111111')
    .single();

  const due_day = pgData?.due_day ?? 5;
  const late_fee = pgData?.late_fee ?? 250;

  const [queryYear, queryMonth] = monthString.split('-').map(Number);
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();

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

    // Dynamic Late Fee logic
    let calculatedLateFee = bill?.lateFee ?? 0;
    if (bill?.status === 'Delay Approved') {
      calculatedLateFee = 0;
    } else if (bill?.status === 'Paid') {
      calculatedLateFee = bill?.lateFee ?? 0;
    } else {
      // Unpaid or Delay Requested or Overdue (or not created yet)
      let isPastDue = false;
      if (todayYear > queryYear) {
        isPastDue = true;
      } else if (todayYear === queryYear) {
        if (todayMonth > queryMonth) {
          isPastDue = true;
        } else if (todayMonth === queryMonth) {
          if (todayDay > due_day) {
            isPastDue = true;
          }
        }
      }
      calculatedLateFee = isPastDue ? late_fee : 0;
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
      lateFee:       calculatedLateFee,
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

// ─── Property Settings ────────────────────────────────────────────────────────

export async function fetchPGSettings(): Promise<{ due_day: number; late_fee: number }> {
  const { data, error } = await supabase
    .from('pg_properties')
    .select('due_day, late_fee')
    .eq('id', '11111111-1111-1111-1111-111111111111')
    .single();

  if (error) {
    console.error('[fetchPGSettings]', error.message);
    return { due_day: 5, late_fee: 250 };
  }

  return {
    due_day: data.due_day ?? 5,
    late_fee: data.late_fee ?? 250,
  };
}

export async function updatePGSettings(
  dueDay: number,
  lateFee: number
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('pg_properties')
    .update({ due_day: dueDay, late_fee: lateFee })
    .eq('id', '11111111-1111-1111-1111-111111111111');

  if (error) {
    console.error('[updatePGSettings]', error.message);
    return { success: false, error: error.message };
  }

  revalidatePath(PAGE);
  return { success: true };
}

