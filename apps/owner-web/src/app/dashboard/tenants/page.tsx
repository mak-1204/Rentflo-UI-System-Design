import type { Metadata } from 'next';
import { fetchTenants, fetchPGProperties } from './actions';
import { TenantsPageClient } from './TenantsPageClient';

export const metadata: Metadata = {
  title: 'Tenants Directory',
  description: 'Manage tenant profiles, room assignments, and KYC documents.',
};

// ISR: re-fetch from Supabase every 30 seconds
export const revalidate = 30;

export default async function TenantsPage() {
  const [tenants, pgProperties] = await Promise.all([
    fetchTenants(),
    fetchPGProperties()
  ]);
  return <TenantsPageClient initialTenants={tenants} pgProperties={pgProperties} />;
}
