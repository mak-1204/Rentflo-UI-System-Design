/**
 * src/app/(dashboard)/page.tsx — Dashboard (Server Component)
 *
 * Fetches initial tenants and complaints server-side, then hands data
 * to the interactive DashboardClient component.
 */

import type { Metadata } from 'next';
import { DashboardClient } from '@/components/modules/DashboardClient';
import { ownerApiClient } from '@/services/api-client';
import React from 'react';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Overview of your PG properties, tenant activity, and rent status.',
};

// ISR: revalidate every 30 seconds so data stays fresh without full SSG
export const revalidate = 30;

export default async function DashboardPage() {
  // Fetch in parallel — if backend is offline, fall back gracefully
  let tenants: NonNullable<React.ComponentProps<typeof DashboardClient>>['initialTenants'] = [];
  let complaints: NonNullable<React.ComponentProps<typeof DashboardClient>>['initialComplaints'] = [];

  try {
    const [tenantsData, complaintsData] = await Promise.all([
      ownerApiClient.getTenants(),
      ownerApiClient.getComplaints(),
    ]);
    tenants = tenantsData as unknown as NonNullable<React.ComponentProps<typeof DashboardClient>>['initialTenants'];
    complaints = complaintsData as unknown as NonNullable<React.ComponentProps<typeof DashboardClient>>['initialComplaints'];
  } catch (err) {
    // Backend may not be running in dev; client falls back to localStorage
    console.warn('[DashboardPage] API fetch failed, using client fallback:', err);
  }

  return (
    <DashboardClient
      initialTenants={tenants}
      initialComplaints={complaints}
    />
  );
}
