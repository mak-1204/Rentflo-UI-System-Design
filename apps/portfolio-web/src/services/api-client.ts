import { env } from '@/lib/env';
import type { PGProperty } from '@/types';

async function serverFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${env.BACKEND_API_URL}${path}`, {
    next: { revalidate: 30 }, // 30 seconds revalidation
  });
  if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
  return res.json();
}

export const portfolioApiClient = {
  getProperty: (slug: string) => serverFetch<PGProperty>(`/properties/${slug}`),
};
