import type { Metadata } from 'next';
import { PortfolioClient } from '@/components/modules/PortfolioClient';

export const metadata: Metadata = {
  title: 'Explore Sunrise PG',
  description: 'Enter your details to explore interactive rooms, blueprint plans, and pricing.',
};

export default function LeadCapturePage() {
  return <PortfolioClient />;
}
