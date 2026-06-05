import { createClient } from '@supabase/supabase-js';

let client: any = null;

function getClient() {
  if (!client) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    client = createClient(
      supabaseUrl || 'https://placeholder.supabase.co',
      supabaseKey || 'dummy-anon-key-placeholder'
    );
  }
  return client;
}

export const supabase = new Proxy({} as any, {
  get(target, prop, receiver) {
    return Reflect.get(getClient(), prop, receiver);
  },
  set(target, prop, value, receiver) {
    return Reflect.set(getClient(), prop, value, receiver);
  }
});

