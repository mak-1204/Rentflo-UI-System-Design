/**
 * src/app/api/tenants/route.ts — Tenants Proxy Route Handler
 *
 * Proxies tenant mutation requests (add/update/delete) from client components
 * to the backend, with Zod validation.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@rentflo/utils';

const TenantPaymentStatusSchema = z.enum(['Paid', 'Overdue']);

const CreateTenantSchema = z.object({
  name: z.string().min(2).max(100),
  room: z.string().min(1),
  floor: z.string().min(1),
  rent: z.number().positive(),
  phone: z.string().regex(/^\+?\d{10,13}$/, 'Invalid phone format'),
  email: z.string().email().optional(),
  status: TenantPaymentStatusSchema,
  moveIn: z.string().min(1),
  activeMonths: z.number().int().min(0),
});

// GET /api/tenants
export async function GET(): Promise<NextResponse> {
  try {
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('[GET /api/tenants] Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data || [], { status: 200 });
  } catch (err) {
    console.error('[GET /api/tenants] Unexpected error:', err);
    return NextResponse.json({ error: 'Backend unavailable.' }, { status: 503 });
  }
}

// POST /api/tenants
export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const result = CreateTenantSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: result.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  try {
    const { data, error } = await supabase
      .from('tenants')
      .insert([result.data])
      .select();

    if (error) {
      console.error('[POST /api/tenants] Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data?.[0] || {}, { status: 201 });
  } catch (err) {
    console.error('[POST /api/tenants] Unexpected error:', err);
    return NextResponse.json({ error: 'Backend unavailable.' }, { status: 503 });
  }
}
