import type { Metadata } from 'next';
import { SubscriptionsClient } from '@/components/modules/SubscriptionsClient';

export const metadata: Metadata = {
  title: 'Subscriptions Plan Management | Stayflo Admin',
};

export default function SubscriptionsPage() {
  return <SubscriptionsClient />;
}
