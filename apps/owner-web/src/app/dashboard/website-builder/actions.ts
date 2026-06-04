'use server';

import { supabase } from '@stayflo/utils';
import { revalidatePath } from 'next/cache';

const PROPERTY_ID = '11111111-1111-1111-1111-111111111111'; // Hardcoded for now until auth is added

export async function getWebsiteData() {
  const { data, error } = await supabase
    .from('pg_properties')
    .select('layout_data')
    .eq('id', PROPERTY_ID)
    .single();

  if (error) {
    console.error('Error fetching layout data:', error);
    return null;
  }

  return data.layout_data;
}

export async function saveWebsiteData(layoutData: any) {
  const { error } = await supabase
    .from('pg_properties')
    .update({ layout_data: layoutData })
    .eq('id', PROPERTY_ID);

  if (error) {
    console.error('Error saving layout data:', error);
    return { error: error.message };
  }

  revalidatePath('/dashboard/website-builder');
  return { success: true };
}
