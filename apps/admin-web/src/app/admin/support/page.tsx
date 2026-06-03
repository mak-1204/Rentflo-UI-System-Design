import type { Metadata } from 'next';
import { SupportClient } from '@/components/modules/SupportClient';

export const metadata: Metadata = {
  title: 'Support Tickets | Rentflo Admin',
};

export default function SupportPage() {
  return <SupportClient />;
}
