'use server';

import { revalidatePath } from 'next/cache';
import { getAuthUser } from '@/utils/supabase/server';
import type { FoodBooking } from './types';

const TABLE = 'food_bookings';
const PAGE  = '/dashboard/food';

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function fetchFoodBookings(dateString: string): Promise<FoodBooking[]> {
  const { supabase } = await getAuthUser();
  // Query all active tenants and left-join their food bookings for this specific date
  const { data, error } = await supabase
    .from('tenants')
    .select(`
      id,
      name,
      room,
      phone,
      food_bookings (
        id,
        date,
        breakfast,
        lunch,
        dinner,
        breakfast_served,
        lunch_served,
        dinner_served,
        status
      )
    `);

  if (error) {
    console.error('[fetchFoodBookings]', error.message);
    return [];
  }

  return (data ?? []).map((row: any) => {
    // Find the specific booking for this date (if any)
    const bookingsForDate = (row.food_bookings ?? []).filter((fb: any) => fb.date === dateString);
    const fb = bookingsForDate[0];

    return {
      id:               fb?.id,
      tenant_id:        row.id,
      name:             row.name ?? 'Unknown',
      room:             row.room ?? 'Room TBD',
      phone:            row.phone ?? '',
      date:             dateString,
      breakfast:        fb?.breakfast ?? false,
      lunch:            fb?.lunch ?? false,
      dinner:           fb?.dinner ?? false,
      breakfast_served: fb?.breakfast_served ?? false,
      lunch_served:     fb?.lunch_served ?? false,
      dinner_served:    fb?.dinner_served ?? false,
      status:           fb?.status ?? 'Not Booked',
    };
  });
}

// ─── Save / Update Booking ───────────────────────────────────────────────────

export async function saveFoodBooking(
  booking: Omit<FoodBooking, 'name' | 'room' | 'phone'>
): Promise<{ success: boolean; error?: string }> {
  const { supabase } = await getAuthUser();
  const payload = {
    tenant_id:        booking.tenant_id,
    date:             booking.date,
    breakfast:        booking.breakfast,
    lunch:            booking.lunch,
    dinner:           booking.dinner,
    breakfast_served: booking.breakfast_served,
    lunch_served:     booking.lunch_served,
    dinner_served:    booking.dinner_served,
    status:           booking.status,
  };

  const { error } = await supabase
    .from(TABLE)
    .upsert(payload, { onConflict: 'tenant_id,date' });

  if (error) {
    console.error('[saveFoodBooking]', error.message);
    return { success: false, error: error.message };
  }

  revalidatePath(PAGE);
  return { success: true };
}

// ─── Mark Meal as Served ──────────────────────────────────────────────────────

export async function markMealServed(
  tenantId: string,
  dateString: string,
  mealType: 'breakfast' | 'lunch' | 'dinner'
): Promise<{ success: boolean; error?: string }> {
  const { supabase } = await getAuthUser();
  const servedCol = `${mealType}_served`;

  // Check if booking already exists
  const { data, error: selectError } = await supabase
    .from(TABLE)
    .select('id')
    .eq('tenant_id', tenantId)
    .eq('date', dateString)
    .single();

  if (selectError && selectError.code !== 'PGRST116') { // PGRST116: no rows returned
    console.error('[markMealServed SELECT]', selectError.message);
    return { success: false, error: selectError.message };
  }

  if (data) {
    // Update existing booking record
    const { error: updateError } = await supabase
      .from(TABLE)
      .update({ [servedCol]: true })
      .eq('id', data.id);

    if (updateError) {
      console.error('[markMealServed UPDATE]', updateError.message);
      return { success: false, error: updateError.message };
    }
  } else {
    // Create new booking record and mark this meal as booked & served
    const { error: insertError } = await supabase
      .from(TABLE)
      .insert({
        tenant_id:        tenantId,
        date:             dateString,
        [mealType]:       true,
        [servedCol]:      true,
        status:           'Booked',
      });

    if (insertError) {
      console.error('[markMealServed INSERT]', insertError.message);
      return { success: false, error: insertError.message };
    }
  }

  revalidatePath(PAGE);
  return { success: true };
}
