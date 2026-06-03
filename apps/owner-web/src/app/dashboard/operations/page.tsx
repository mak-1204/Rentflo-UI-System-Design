import type { Metadata } from 'next';
import { OperationsClient } from '@/components/modules/OperationsClient';
import { ownerApiClient } from '@/services/api-client';
import React from 'react';

export const metadata: Metadata = {
  title: 'Operations',
  description: 'Manage maintenance requests, complaints, and facility operations.',
};

export const revalidate = 30;

export default async function OperationsPage() {
  let complaints: NonNullable<React.ComponentProps<typeof OperationsClient>>['initialComplaints'] = [];
  try {
    const data = await ownerApiClient.getComplaints();
    complaints = data as unknown as NonNullable<React.ComponentProps<typeof OperationsClient>>['initialComplaints'];
  } catch (err) {
    console.warn('[OperationsPage] API fetch failed:', err);
  }
  return <OperationsClient initialComplaints={complaints} />;
}
