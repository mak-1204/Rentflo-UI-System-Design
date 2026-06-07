import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  console.log('Checking buckets...');
  const { data: buckets, error: bucketsErr } = await supabase.storage.listBuckets();
  if (bucketsErr) {
    console.error('Error fetching buckets:', bucketsErr);
    return;
  }
  
  const exists = buckets.find(b => b.name === 'property-media');
  if (exists) {
    console.log('Bucket property-media already exists.');
  } else {
    console.log('Creating bucket property-media...');
    const { error: createErr } = await supabase.storage.createBucket('property-media', {
      public: true,
      fileSizeLimit: 52428800, // 50MB
    });
    if (createErr) {
      console.error('Error creating bucket:', createErr);
    } else {
      console.log('Bucket property-media created successfully!');
    }
  }
}

main();
