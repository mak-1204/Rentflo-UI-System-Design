-- Phase 4 Part 2: Database Lockdown for remaining tables

-- Enable RLS
ALTER TABLE pg_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE operational_expenses ENABLE ROW LEVEL SECURITY;

-- 1. Policies for pg_owners
CREATE POLICY "Owners can view own profile" ON pg_owners
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Owners can update own profile" ON pg_owners
  FOR UPDATE USING (auth.uid() = id);

-- 2. Policies for operational_expenses (linked via pg_id)
CREATE POLICY "Owners can manage operational expenses of their properties" ON operational_expenses
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM pg_properties
      WHERE id = operational_expenses.pg_id AND owner_id = auth.uid()
    )
  );
