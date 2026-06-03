import type { Metadata } from 'next';
import { TenantsClient } from '@/components/modules/TenantsClient';
import { ownerApiClient } from '@/services/api-client';
import React from 'react';

export const metadata: Metadata = {
  title: 'Tenants Directory',
  description: 'Manage tenant profiles, room assignments, and KYC documents.',
};

export const revalidate = 30;

export default async function TenantsPage() {
  let tenants: NonNullable<React.ComponentProps<typeof TenantsClient>>['initialTenants'] = [];
  try {
    const data = await ownerApiClient.getTenants();
    tenants = data as unknown as NonNullable<React.ComponentProps<typeof TenantsClient>>['initialTenants'];
  } catch (err) {
    console.warn('[TenantsPage] API fetch failed, client will use localStorage:', err);
  }
  return <TenantsClient initialTenants={tenants} />;
}
