import { z } from 'zod';

const serverEnvSchema = z.object({
  BACKEND_API_URL: z
    .string()
    .url({ message: 'BACKEND_API_URL must be a valid URL' })
    .default('http://localhost:3000/api'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url()
    .default('http://localhost:5176'),
});

const _serverEnv = serverEnvSchema.safeParse({
  BACKEND_API_URL: process.env.BACKEND_API_URL,
  NODE_ENV: process.env.NODE_ENV,
});

if (!_serverEnv.success) {
  console.error('❌ Invalid server environment variables:', _serverEnv.error.flatten().fieldErrors);
  throw new Error('Invalid server environment configuration.');
}

const _clientEnv = clientEnvSchema.safeParse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

if (!_clientEnv.success) {
  console.error('❌ Invalid client environment variables:', _clientEnv.error.flatten().fieldErrors);
  throw new Error('Invalid public environment configuration.');
}

export const env = {
  ..._serverEnv.data,
  ..._clientEnv.data,
} as const;
