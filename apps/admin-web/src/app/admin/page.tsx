import type { Metadata } from 'next';
import { OverviewClient } from '@/components/modules/OverviewClient';

export const metadata: Metadata = {
  title: 'Overview | Stayflo Admin',
};

export default function OverviewPage() {
  return <OverviewClient />;
}
