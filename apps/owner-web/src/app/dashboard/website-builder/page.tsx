import type { Metadata } from 'next';
import { WebsiteBuilderClient } from '@/components/modules/WebsiteBuilderClient';

export const metadata: Metadata = {
  title: 'PG Website Builder',
  description: 'Design your PG property layout, manage amenities, and customize your portfolio website.',
};

export default function WebsiteBuilderPage() {
  return <WebsiteBuilderClient />;
}
