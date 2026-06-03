import type { Metadata } from 'next';
import { OverviewClient } from '@/components/modules/OverviewClient';

export const metadata: Metadata = {
  title: 'Overview | Rentflo Admin',
};

export default function OverviewPage() {
  return <OverviewClient />;
}
