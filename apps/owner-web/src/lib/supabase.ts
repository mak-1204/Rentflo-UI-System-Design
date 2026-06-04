import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Singleton Supabase client.
 * Safe for both Server Components and Route Handlers (server-only module).
 * Never import this inside a 'use client' file.
 */
export const supabase = createClient(supabaseUrl, supabaseAnon);
