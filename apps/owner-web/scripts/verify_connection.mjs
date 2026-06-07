import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://hwughxyobkusujdxxlkg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3dWdoeHlvYmt1c3VqZHh4bGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0MTc5NTYsImV4cCI6MjA5NTk5Mzk1Nn0.jUAxA_QIpoYrcI3ICu3Io8C3kWXbR181lxRC6ETl8cw'
);

async function main() {
  const { data, error } = await supabase
    .from('pg_properties')
    .select('id, name, layout_data')
    .eq('name', 'Sunrise PG')
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Connection failed:', error);
  } else if (!data) {
    console.log('Connection successful, but no PG Properties with layout_data found. User needs to click "Publish Changes" in the Website Builder first.');
  } else {
    console.log('Connection successful! Found Property:', data.name);
    console.log('Has Video URL:', !!data.layout_data.videoUrl);
    console.log('Has Rooms Data:', !!data.layout_data.roomsData);
    console.log('Has Amenities:', !!data.layout_data.amenities);
  }
}

main();
