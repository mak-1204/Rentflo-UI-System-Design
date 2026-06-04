import { env } from '@/lib/env';

async function serverFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${env.BACKEND_API_URL}${path}`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
  return res.json();
}

export const adminApiClient = {
  getOverviewMetrics: () => serverFetch<any>('/admin/metrics'),
};
