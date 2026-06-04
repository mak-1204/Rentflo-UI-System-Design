import { supabase } from '@stayflo/utils';

export async function getPortfolioData(slug: string) {
  // Hardcoded for now. In a real app, query by slug.
  const PROPERTY_ID = '11111111-1111-1111-1111-111111111111';

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

export async function getLeadData(inviteCode: string) {
  if (!inviteCode) return null;

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('invite_code', inviteCode)
    .single();

  if (error) {
    console.error('Error fetching lead data:', error);
    return null;
  }

  return data;
}
