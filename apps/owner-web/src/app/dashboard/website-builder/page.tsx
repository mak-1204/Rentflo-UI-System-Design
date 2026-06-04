import type { Metadata } from 'next';
import { BuilderCanvas } from './_components/BuilderCanvas';
import { getWebsiteData } from './actions';

export const metadata: Metadata = {
  title: 'PG Website Builder',
  description: 'Design your PG property layout, manage amenities, and customize your portfolio website.',
};

export default async function WebsiteBuilderPage() {
  const initialData = await getWebsiteData() || {};
  return <BuilderCanvas initialData={initialData} />;
}
