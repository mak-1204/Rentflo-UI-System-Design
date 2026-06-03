import { z } from 'zod';

const envSchema = z.object({
  BACKEND_API_URL: z.string().url().default('http://localhost:3000/api'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:5175'),
});

export const env = envSchema.parse({
  BACKEND_API_URL: process.env.BACKEND_API_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});
