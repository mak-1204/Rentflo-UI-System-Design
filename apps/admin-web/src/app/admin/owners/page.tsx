import type { Metadata } from 'next';
import { OwnersClient } from '@/components/modules/OwnersClient';

export const metadata: Metadata = {
  title: 'Registered Owners | Stayflo Admin',
};

export default function OwnersListPage() {
  return <OwnersClient />;
}
