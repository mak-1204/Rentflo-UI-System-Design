import type { Metadata } from 'next';
import { OperationsClient } from '@/components/modules/OperationsClient';
import { fetchComplaints } from './actions';
import React from 'react';

export const metadata: Metadata = {
  title: 'Operations',
  description: 'Manage maintenance requests, complaints, and facility operations.',
};

export default async function OperationsPage() {
  let complaints: any[] = [];
  try {
    complaints = await fetchComplaints();
  } catch (err) {
    console.error('[OperationsPage] Error fetching complaints:', err);
  }
  return <OperationsClient initialComplaints={complaints} />;
}
