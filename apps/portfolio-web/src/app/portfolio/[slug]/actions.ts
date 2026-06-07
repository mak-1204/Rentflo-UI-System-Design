import { supabase } from '@stayflo/utils';

import { unstable_cache } from 'next/cache';

export async function getPortfolioData(slug: string) {
  const fetchLayout = unstable_cache(
    async () => {
      // Convert slug back to title case, or just fetch 'Sunrise PG' for the MVP
      const pgNameQuery = slug === 'sunrise-pg' ? 'Sunrise PG' : 'Sunrise PG';
      
      const { data, error } = await supabase
        .from('pg_properties')
        .select('layout_data')
        .eq('name', pgNameQuery)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching layout data:', error);
        return null;
      }
      return data?.layout_data || null;
    },
    [`pg-${slug}`],
    { tags: [`pg-${slug}`], revalidate: 86400 } // Cache for 24 hours, purge manually
  );

  return fetchLayout();
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
