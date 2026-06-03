/**
 * src/lib/env.ts
 *
 * Zod-validated environment configuration.
 * - Server-only vars (no NEXT_PUBLIC_ prefix) are NEVER sent to the browser.
 * - This file is only safe to import in Server Components, Route Handlers,
 *   and server-side utilities. Do NOT import it in "use client" components.
 */
import { z } from 'zod';

const serverEnvSchema = z.object({
  /** Base URL of the Express backend container — server-side only */
  BACKEND_API_URL: z
    .string()
    .url({ message: 'BACKEND_API_URL must be a valid URL (e.g. http://localhost:3000/api)' })
    .default('http://localhost:3000/api'),

  /** Node environment */
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

const clientEnvSchema = z.object({
  /** Publicly exposed app URL — safe for client */
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url()
    .default('http://localhost:5174'),

  /** Publicly exposed portfolio web URL */
  NEXT_PUBLIC_PORTFOLIO_URL: z
    .string()
    .url()
    .default('http://localhost:5175'),
});

// Parse and throw at startup if required vars are missing or malformed
const _serverEnv = serverEnvSchema.safeParse({
  BACKEND_API_URL: process.env.BACKEND_API_URL,
  NODE_ENV: process.env.NODE_ENV,
});

if (!_serverEnv.success) {
  console.error('❌ Invalid server environment variables:', _serverEnv.error.flatten().fieldErrors);
  throw new Error('Invalid server environment configuration. Check .env.local.');
}

const _clientEnv = clientEnvSchema.safeParse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_PORTFOLIO_URL: process.env.NEXT_PUBLIC_PORTFOLIO_URL,
});

if (!_clientEnv.success) {
  console.error('❌ Invalid client environment variables:', _clientEnv.error.flatten().fieldErrors);
  throw new Error('Invalid public environment configuration.');
}

export const env = {
  ..._serverEnv.data,
  ..._clientEnv.data,
} as const;
