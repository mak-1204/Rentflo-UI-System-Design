import type { Metadata } from 'next';
import { PGsListClient } from '@/components/modules/PGsListClient';

export const metadata: Metadata = {
  title: 'Registered PGs | Stayflo Admin',
};

export default function PGsListPage() {
  return <PGsListClient />;
}
