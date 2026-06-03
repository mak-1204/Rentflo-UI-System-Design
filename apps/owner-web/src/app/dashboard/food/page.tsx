import type { Metadata } from 'next';
import { FoodClient } from '@/components/modules/FoodClient';

export const metadata: Metadata = {
  title: 'Food Management',
  description: 'Manage meal menus, track tenant food bookings, and scan QR codes for meal service.',
};

export const revalidate = 60;

export default function FoodPage() {
  return <FoodClient />;
}
