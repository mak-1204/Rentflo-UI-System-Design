/**
 * src/services/api-client.ts
 *
 * Server-safe API client for owner-web.
 *
 * ARCHITECTURAL CONTRACT:
 * - This file runs ONLY on the server (Server Components, Route Handlers).
 * - Never import this file inside a "use client" component.
 * - Client-side mutations are routed through Next.js API Route Handlers
 *   (src/app/api/...) which call these functions server-side with Zod
 *   validation as a guard layer.
 *
 * All fetch() calls use Next.js extended fetch with `next: { revalidate }`
 * for Incremental Static Regeneration (ISR) where appropriate.
 */

import { env } from '@/lib/env';
import type {
  Tenant,
  PGProperty,
  Complaint,
  Lead,
  Invoice,
  MealMenu,
  MealBooking,
} from '@/types';

// ─── Core fetch primitive ─────────────────────────────────────────────────────

async function serverFetch<T>(
  path: string,
  options: RequestInit & { revalidate?: number | false } = {}
): Promise<T> {
  const { revalidate = 60, ...fetchOptions } = options;

  const res = await fetch(`${env.BACKEND_API_URL}${path}`, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
    // Next.js ISR revalidation — 0 = no cache, false = cache forever, n = n seconds
    next: revalidate !== false ? { revalidate } : { revalidate: false },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(
      `[API ${res.status}] ${path}: ${errorBody?.message ?? 'Unknown error'}`
    );
  }

  return res.json() as Promise<T>;
}

async function serverMutate<T>(
  path: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  body?: unknown
): Promise<T> {
  return serverFetch<T>(path, {
    method,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    // Mutations always bypass cache
    revalidate: 0,
  });
}

// ─── Resource methods ─────────────────────────────────────────────────────────

export const ownerApiClient = {
  // Tenants
  getTenants: (): Promise<Tenant[]> =>
    serverFetch<Tenant[]>('/tenants', { revalidate: 30 }),

  getTenant: (id: string): Promise<Tenant> =>
    serverFetch<Tenant>(`/tenants/${id}`, { revalidate: 30 }),

  // PG Properties
  getProperties: (): Promise<PGProperty[]> =>
    serverFetch<PGProperty[]>('/properties', { revalidate: 60 }),

  getProperty: (slug: string): Promise<PGProperty> =>
    serverFetch<PGProperty>(`/properties/${slug}`, { revalidate: 60 }),

  // Complaints / Operations
  getComplaints: (): Promise<Complaint[]> =>
    serverFetch<Complaint[]>('/complaints', { revalidate: 30 }),

  createComplaint: (data: Partial<Complaint>): Promise<Complaint> =>
    serverMutate<Complaint>('/complaints', 'POST', data),

  // Leads
  getLeads: (): Promise<Lead[]> =>
    serverFetch<Lead[]>('/leads', { revalidate: 30 }),

  createLead: (data: Partial<Lead>): Promise<Lead> =>
    serverMutate<Lead>('/leads', 'POST', data),

  // Invoices
  getInvoices: (): Promise<Invoice[]> =>
    serverFetch<Invoice[]>('/invoices', { revalidate: 30 }),

  // Food / Meal Menus
  getMealMenus: (): Promise<MealMenu[]> =>
    serverFetch<MealMenu[]>('/meal-menus', { revalidate: 60 }),

  getMealBookings: (): Promise<MealBooking[]> =>
    serverFetch<MealBooking[]>('/meal-bookings', { revalidate: 30 }),
} as const;
