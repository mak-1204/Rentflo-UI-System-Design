import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://hwughxyobkusujdxxlkg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3dWdoeHlvYmt1c3VqZHh4bGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0MTc5NTYsImV4cCI6MjA5NTk5Mzk1Nn0.jUAxA_QIpoYrcI3ICu3Io8C3kWXbR181lxRC6ETl8cw'
);

async function main() {
  const { data, error } = await supabase.storage.listBuckets();
  console.log('Buckets:', data);
  console.log('Error:', error);
}

main();
