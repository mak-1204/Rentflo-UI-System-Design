import type { Metadata } from 'next';
import { FoodPageClient } from './FoodPageClient';
import { fetchFoodBookings } from './actions';

export const metadata: Metadata = {
  title: 'Food Sourcing & Waste Management',
  description: 'Manage meal menus, track tenant food bookings, and scan QR codes for meal service.',
};

// Revalidate cache every 30 seconds
export const revalidate = 30;

function getRelativeDateString(offsetDays: number) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export default async function FoodPage() {
  // Fetch tomorrow's bookings by default (since Tomorrow is the default view tab in client)
  const tomorrowStr = getRelativeDateString(1);
  const bookings = await fetchFoodBookings(tomorrowStr);

  return <FoodPageClient initialBookings={bookings} />;
}
