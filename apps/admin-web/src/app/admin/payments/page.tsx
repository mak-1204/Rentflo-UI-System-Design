import type { Metadata } from 'next';
import { PaymentsClient } from '@/components/modules/PaymentsClient';

export const metadata: Metadata = {
  title: 'Payments Ledger | Stayflo Admin',
};

export default function PaymentsPage() {
  return <PaymentsClient />;
}
