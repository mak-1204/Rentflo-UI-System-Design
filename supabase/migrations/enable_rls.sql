-- Phase 4: Database Lockdown with RLS

-- 1. Add owner_id to pg_properties
ALTER TABLE pg_properties ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id);

-- Enable RLS on all tables
ALTER TABLE pg_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE rent_bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

-- 2. Policies for pg_properties
CREATE POLICY "Owners can view own properties" ON pg_properties
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Owners can insert own properties" ON pg_properties
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update own properties" ON pg_properties
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete own properties" ON pg_properties
  FOR DELETE USING (auth.uid() = owner_id);

-- 3. Policies for tenants (linked via pg_id)
CREATE POLICY "Owners can manage tenants of their properties" ON tenants
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM pg_properties
      WHERE id = tenants.pg_id AND owner_id = auth.uid()
    )
  );

-- 4. Policies for leads (uses owner_id directly)
CREATE POLICY "Owners can manage leads of their properties" ON leads
  FOR ALL
  USING (auth.uid() = owner_id);

-- 5. Policies for rent_bills (linked via tenant_id)
CREATE POLICY "Owners can manage rent_bills of their tenants" ON rent_bills
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM tenants
      JOIN pg_properties ON pg_properties.id = tenants.pg_id
      WHERE tenants.id = rent_bills.tenant_id AND pg_properties.owner_id = auth.uid()
    )
  );

-- 6. Policies for food_bookings (linked via tenant_id)
CREATE POLICY "Owners can manage food_bookings of their tenants" ON food_bookings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM tenants
      JOIN pg_properties ON pg_properties.id = tenants.pg_id
      WHERE tenants.id = food_bookings.tenant_id AND pg_properties.owner_id = auth.uid()
    )
  );

-- 7. Policies for complaints (linked via tenantId)
CREATE POLICY "Owners can manage complaints of their tenants" ON complaints
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM tenants
      JOIN pg_properties ON pg_properties.id = tenants.pg_id
      WHERE tenants.id = complaints."tenantId" AND pg_properties.owner_id = auth.uid()
    )
  );
