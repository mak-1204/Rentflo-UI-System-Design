/**
 * src/app/api/leads/route.ts — Lead Creation Route Handler
 *
 * This server-side endpoint proxies lead creation requests from the portfolio-web
 * or owner-web clients to the backend, adding Zod validation as a security guard.
 *
 * Benefits over calling the backend directly from client code:
 *  - BACKEND_API_URL is never exposed to the browser
 *  - Zod validates and sanitizes input before it reaches the backend
 *  - Enables future rate-limiting, auth middleware, and CORS control
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { env } from '@/lib/env';

// ─── Zod Schema ───────────────────────────────────────────────────────────────

const CreateLeadSchema = z.object({
  pgId: z.string().min(1, 'pgId is required'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long'),
  phone: z
    .string()
    .regex(/^\d{10}$/, 'Phone must be exactly 10 digits'),
  email: z.string().email('Invalid email format').optional(),
  preferredSharing: z.number().int().min(1).max(4).optional(),
  moveInDate: z.string().optional(),
  source: z.string().default('owner-web'),
});

type CreateLeadInput = z.infer<typeof CreateLeadSchema>;

// ─── POST /api/leads ──────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Parse & validate input
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const result = CreateLeadSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: result.error.flatten().fieldErrors,
      },
      { status: 422 }
    );
  }

  const validated: CreateLeadInput = result.data;

  // 2. Forward to backend
  try {
    const res = await fetch(`${env.BACKEND_API_URL}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validated),
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('[POST /api/leads] Backend error:', err);
    return NextResponse.json(
      { error: 'Backend service unavailable. Please try again later.' },
      { status: 503 }
    );
  }
}

// ─── GET /api/leads ───────────────────────────────────────────────────────────

export async function GET(): Promise<NextResponse> {
  try {
    const res = await fetch(`${env.BACKEND_API_URL}/leads`, {
      next: { revalidate: 30 },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('[GET /api/leads] Backend error:', err);
    return NextResponse.json(
      { error: 'Backend service unavailable.' },
      { status: 503 }
    );
  }
}
