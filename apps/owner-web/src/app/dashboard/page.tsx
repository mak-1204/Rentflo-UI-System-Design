/**
 * src/app/(dashboard)/page.tsx — Dashboard (Server Component)
 *
 * Fetches initial tenants and complaints server-side, then hands data
 * to the interactive DashboardClient component.
 */

import type { Metadata } from 'next';
import { DashboardClient } from '@/components/modules/DashboardClient';
import { supabase } from '@stayflo/utils';
import React from 'react';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Overview of your PG properties, tenant activity, and rent status.',
};

// ISR: revalidate every 30 seconds so data stays fresh without full SSG
export const revalidate = 30;

export default async function DashboardPage() {
  // Fetch directly from Supabase in parallel
  let tenants: NonNullable<React.ComponentProps<typeof DashboardClient>>['initialTenants'] = [];
  let complaints: NonNullable<React.ComponentProps<typeof DashboardClient>>['initialComplaints'] = [];

  try {
    const [
      { data: tenantsData, error: tenantsError },
      { data: complaintsData, error: complaintsError }
    ] = await Promise.all([
      supabase.from('tenants').select('*').limit(50),
      supabase.from('complaints').select('*').limit(50)
    ]);

    if (tenantsError) console.log('[DashboardPage] Supabase tenants fetch offline (client fallback enabled)');
    if (complaintsError) console.log('[DashboardPage] Supabase complaints fetch offline (client fallback enabled)');

    if (tenantsData) tenants = tenantsData as unknown as NonNullable<React.ComponentProps<typeof DashboardClient>>['initialTenants'];
    if (complaintsData) complaints = complaintsData as unknown as NonNullable<React.ComponentProps<typeof DashboardClient>>['initialComplaints'];
  } catch (err) {
    console.log('[DashboardPage] Supabase database offline (client fallback enabled)');
  }

  return (
    <DashboardClient
      initialTenants={tenants}
      initialComplaints={complaints}
    />
  );
}
