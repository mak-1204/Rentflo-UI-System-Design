const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hwughxyobkusujdxxlkg.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3dWdoeHlvYmt1c3VqZHh4bGtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0MTc5NTYsImV4cCI6MjA5NTk5Mzk1Nn0.jUAxA_QIpoYrcI3ICu3Io8C3kWXbR181lxRC6ETl8cw';

// We use the anon key. This perfectly simulates a malicious user trying to access the API directly without logging in.
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runTests() {
  console.log('--- SECURITY TEST: LEADS TABLE ---\n');

  // TEST 1: Unauthenticated Read
  console.log('Test 1: Fetching leads without authentication...');
  const { data: unauthData, error: unauthError } = await supabase.from('leads').select('*');
  if (unauthError) console.error('  -> Error:', unauthError.message);
  console.log('  -> Result:', unauthData);
  console.log('  -> PASSED: Should be [] (0 rows returned due to RLS).\n');

  // TEST 2: Unauthenticated Insert
  console.log('Test 2: Inserting a lead without authentication...');
  const { data: unauthInsertData, error: unauthInsertError } = await supabase.from('leads').insert([{
    name: 'Hacker Lead',
    phone_number: '1234567890',
    owner_id: '00000000-0000-0000-0000-000000000000'
  }]).select();
  if (unauthInsertError) {
    console.log('  -> Blocked by RLS! Error:', unauthInsertError.message);
    console.log('  -> PASSED: Insert was blocked.\n');
  } else {
    console.error('  -> FAILED: Insert succeeded!', unauthInsertData);
  }

  // TEST 3: Authenticated Operations
  console.log('Test 3: Signing up a new test owner...');
  const testEmail = `testowner_${Date.now()}@example.com`;
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: testEmail,
    password: 'securepassword123'
  });

  if (authError) {
    console.error('  -> Failed to sign up:', authError.message);
    return;
  }

  const user = authData.user;
  console.log(`  -> Successfully signed up as ${testEmail} (ID: ${user.id})`);

  console.log('\nTest 4: Inserting a lead as the authenticated owner...');
  const { data: authInsertData, error: authInsertError } = await supabase.from('leads').insert([{
    name: 'Valid Prospect',
    phone_number: '9876543210',
    owner_id: user.id
  }]).select();

  if (authInsertError) {
    console.error('  -> FAILED: Insert failed!', authInsertError.message);
  } else {
    console.log('  -> PASSED: Lead successfully inserted!', authInsertData);
  }

  console.log('\nTest 5: Fetching leads as the authenticated owner...');
  const { data: authFetchData, error: authFetchError } = await supabase.from('leads').select('*');
  if (authFetchError) {
    console.error('  -> Error:', authFetchError.message);
  } else {
    console.log(`  -> PASSED: Retrieved ${authFetchData.length} lead(s). They are isolated to this owner.`);
    console.log('  -> Result:', authFetchData);
  }
}

runTests();
