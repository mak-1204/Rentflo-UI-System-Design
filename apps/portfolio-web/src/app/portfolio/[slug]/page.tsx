import type { Metadata } from 'next';
import { PortfolioClient } from '@/components/modules/PortfolioClient';
import { getPortfolioData, getLeadData } from './actions';
import { computeLayoutStats } from '@/lib/layoutStats';

export const metadata: Metadata = {
  title: 'Explore Sunrise PG',
  description: 'Enter your details to explore interactive rooms, blueprint plans, and pricing.',
};

export default async function LeadCapturePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const inviteCode = resolvedSearchParams.invite as string | undefined;
  
  const layoutData = await getPortfolioData(resolvedParams.slug);
  const leadData = inviteCode ? await getLeadData(inviteCode) : null;
  const stats = computeLayoutStats(layoutData);

  return <PortfolioClient layoutData={layoutData} leadData={leadData} stats={stats} />;
}
