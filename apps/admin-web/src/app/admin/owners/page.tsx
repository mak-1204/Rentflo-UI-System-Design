import type { Metadata } from 'next';
import { OwnersClient } from '@/components/modules/OwnersClient';

export const metadata: Metadata = {
  title: 'Registered Owners | Rentflo Admin',
};

export default function OwnersListPage() {
  return <OwnersClient />;
}
