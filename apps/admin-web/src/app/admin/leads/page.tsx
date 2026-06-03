import type { Metadata } from 'next';
import { LeadsClient } from '@/components/modules/LeadsClient';

export const metadata: Metadata = {
  title: 'Platform Leads | Rentflo Admin',
};

export default function LeadsPage() {
  return <LeadsClient />;
}
