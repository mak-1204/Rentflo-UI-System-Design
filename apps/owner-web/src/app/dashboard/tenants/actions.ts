'use server';

import { revalidatePath } from 'next/cache';
import { getAuthUser } from '@/utils/supabase/server';
import type { Tenant } from './types';

const TABLE = 'tenants';
const PAGE  = '/dashboard/tenants';

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function fetchTenants(query?: string): Promise<Tenant[]> {
  const { supabase } = await getAuthUser();

  let dbQuery = supabase
    .from(TABLE)
    // Join pg_properties to get the PG name alongside each tenant
    .select(`
      id,
      name,
      room,
      floor,
      rent,
      phone,
      email,
      status,
      "moveIn",
      "activeMonths",
      pg_id,
      pg_properties ( name )
    `)
    .order('created_at', { ascending: false });

  if (query) {
    dbQuery = dbQuery.or(`name.ilike.%${query}%,room.ilike.%${query}%`);
  }

  const { data, error } = await dbQuery;

  if (error) {
    console.error('[fetchTenants]', error.message);
    return [];
  }

  return (data ?? []).map((row: any) => ({
    id:           row.id,
    pg_id:        row.pg_id        ?? undefined,
    pg_name:      row.pg_properties?.name ?? undefined,
    name:         row.name         ?? 'Unknown',
    room:         row.room         ?? 'Room TBD',
    floor:        row.floor        ?? 'Ground Floor',
    rent:         row.rent         ?? 8500,
    phone:        row.phone        ?? '',
    email:        row.email        ?? '',
    status:       row.status === 'Overdue' ? 'Overdue' : 'Paid',
    moveIn:       row.moveIn       ?? 'Today',
    activeMonths: row.activeMonths ?? 0,
  }));
}

// ─── Create ───────────────────────────────────────────────────────────────────

export async function addTenant(
  tenant: Omit<Tenant, 'id' | 'pg_name'>,
  pgId?: string
): Promise<{ success: boolean; error?: string }> {
  const { supabase } = await getAuthUser();
  const { error } = await supabase.from(TABLE).insert([{
    pg_id:        pgId ?? tenant.pg_id ?? null,
    name:         tenant.name,
    room:         tenant.room,
    floor:        tenant.floor,
    rent:         tenant.rent,
    phone:        tenant.phone,
    email:        tenant.email         || null,
    status:       tenant.status,
    moveIn:       tenant.moveIn,
    activeMonths: tenant.activeMonths,
  }]);

  if (error) {
    console.error('[addTenant]', error.message);
    return { success: false, error: error.message };
  }

  revalidatePath(PAGE);
  return { success: true };
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function updateTenant(
  id: string,
  updates: Partial<Omit<Tenant, 'id' | 'pg_name'>>
): Promise<{ success: boolean; error?: string }> {
  const { supabase } = await getAuthUser();
  const { error } = await supabase
    .from(TABLE)
    .update({
      pg_id:        updates.pg_id      ?? undefined,
      name:         updates.name,
      room:         updates.room,
      floor:        updates.floor,
      rent:         updates.rent,
      phone:        updates.phone,
      email:        updates.email      || null,
      status:       updates.status,
      moveIn:       updates.moveIn,
      activeMonths: updates.activeMonths,
    })
    .eq('id', id);

  if (error) {
    console.error('[updateTenant]', error.message);
    return { success: false, error: error.message };
  }

  revalidatePath(PAGE);
  return { success: true };
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteTenant(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const { supabase } = await getAuthUser();
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[deleteTenant]', error.message);
    return { success: false, error: error.message };
  }

  revalidatePath(PAGE);
  return { success: true };
}

// ─── Fetch PG list (for dropdown in add-tenant form) ─────────────────────────

export async function fetchPGProperties(): Promise<{ id: string; name: string }[]> {
  const { supabase } = await getAuthUser();
  const { data, error } = await supabase
    .from('pg_properties')
    .select('id, name')
    .order('name');

  if (error) {
    console.error('[fetchPGProperties]', error.message);
    return [];
  }

  return data ?? [];
}
