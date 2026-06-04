import type { Metadata } from 'next';
import { PortfolioClient } from '@/components/modules/PortfolioClient';

export const metadata: Metadata = {
  title: 'Sunrise PG — Interactive Tour',
  description: 'View layout canvas, check room pricing, and secure your booking.',
};

export default function ExplorePage() {
  return <PortfolioClient />;
}
