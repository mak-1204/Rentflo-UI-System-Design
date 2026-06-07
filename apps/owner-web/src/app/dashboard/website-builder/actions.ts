'use server';

import { getAuthUser, auditLog } from '@/utils/supabase/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';

const LayoutDataSchema = z.object({
  pgName: z.string().optional(),
  tagline: z.string().optional(),
  roomsData: z.record(z.any()).optional(),
  floors: z.array(z.string()).optional(),
}).passthrough(); // Allow other fields for now to avoid breaking existing canvas state

export async function getWebsiteData() {
  const { supabase, user } = await getAuthUser();
  const { data, error } = await supabase
    .from('pg_properties')
    .select('layout_data')
    .eq('owner_id', user.id)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching layout data:', error);
    return null;
  }

  return data?.layout_data || null;
}

export async function saveWebsiteData(layoutData: any) {
  const { supabase, user } = await getAuthUser();
  
  // Zod Validation to prevent malicious payloads
  const validated = LayoutDataSchema.safeParse(layoutData);
  if (!validated.success) {
    console.error('Invalid layout data payload:', validated.error);
    return { error: 'Invalid payload' };
  }
  
  const safeData = validated.data;

  const { data: existing } = await supabase
    .from('pg_properties')
    .select('id')
    .eq('owner_id', user.id)
    .maybeSingle();

  let error;
  if (existing) {
    const res = await supabase
      .from('pg_properties')
      .update({ layout_data: safeData })
      .eq('owner_id', user.id);
    error = res.error;
  } else {
    const res = await supabase
      .from('pg_properties')
      .insert([{ owner_id: user.id, name: 'Sunrise PG', layout_data: safeData, due_day: 5, late_fee: 250 }]);
    error = res.error;
  }

  if (error) {
    console.error('Error saving layout data:', error);
    return { error: error.message };
  }

  await auditLog('Update Website Layout', 'Property');

  revalidatePath('/dashboard/website-builder');
  // Clear the Edge cache for the portfolio website across the monorepo
  // @ts-expect-error Next.js 16 type mismatch
  revalidateTag(`pg-sunrise-pg`); // Hardcoded slug 'sunrise-pg' for MVP
  return { success: true };
}
