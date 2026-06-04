import type { Metadata } from 'next';
import { RentCollectionPageClient } from './RentCollectionPageClient';
import { fetchRentRecords } from './actions';

export const metadata: Metadata = {
  title: 'Rent & Utility Bills',
  description: 'Track monthly rent collections, calculate utility bills, and manage payment delays.',
};

export const revalidate = 30;

export default async function RentCollectionPage() {
  const defaultMonth = '2026-06';
  const rentData = await fetchRentRecords(defaultMonth);

  return <RentCollectionPageClient initialRentData={rentData} initialMonth={defaultMonth} />;
}
