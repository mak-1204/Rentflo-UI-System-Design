import type { Metadata } from 'next';
import { LeadsClient } from '@/components/modules/LeadsClient';
import { ownerApiClient } from '@/services/api-client';
import React from 'react';

export const metadata: Metadata = {
  title: 'Leads',
  description: 'Track and manage prospective tenant leads and enquiries.',
};

export const revalidate = 30;

export default async function LeadsPage() {
  let leads: NonNullable<React.ComponentProps<typeof LeadsClient>>['initialLeads'] = [];
  try {
    const data = await ownerApiClient.getLeads();
    leads = data as unknown as NonNullable<React.ComponentProps<typeof LeadsClient>>['initialLeads'];
  } catch (err) {
    console.warn('[LeadsPage] API fetch failed:', err);
  }
  return <LeadsClient initialLeads={leads} />;
}
