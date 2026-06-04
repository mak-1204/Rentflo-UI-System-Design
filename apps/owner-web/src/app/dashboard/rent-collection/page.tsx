import type { Metadata } from 'next';
import { RentCollectionClient } from '@/components/modules/RentCollectionClient';

export const metadata: Metadata = {
  title: 'Rent & Utility Bills',
  description: 'Track monthly rent collections, calculate utility bills, and manage payment delays.',
};

export const revalidate = 30;

export default function RentCollectionPage() {
  // OW3-RentCollection is fully localStorage-driven; no server fetch needed.
  // When the backend gains a /invoices endpoint, add ownerApiClient.getInvoices() here.
  return <RentCollectionClient />;
}
