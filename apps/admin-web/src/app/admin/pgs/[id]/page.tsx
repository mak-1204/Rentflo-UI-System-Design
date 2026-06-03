import type { Metadata } from 'next';
import { PGDetailClient } from '@/components/modules/PGDetailClient';

export const metadata: Metadata = {
  title: 'PG Details | Rentflo Admin',
};

export default function PGDetailPage() {
  return <PGDetailClient />;
}
