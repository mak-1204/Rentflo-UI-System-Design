'use server';

import { getAuthUser } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Complaint } from '@/types';

const TABLE = 'complaints';
const PAGE  = '/dashboard/operations';

export async function fetchComplaints(): Promise<Complaint[]> {
  const { supabase, user } = await getAuthUser();

  const { data, error } = await supabase
    .from(TABLE)
    .select(`
      *,
      tenants (
        id,
        name,
        room,
        pg_properties (
          owner_id
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[fetchComplaints]', error.message);
    return [];
  }

  // Filter out any complaints not belonging to this owner just in case RLS misses anything (though it shouldn't)
  const filtered = (data || []).filter((c: any) => 
    c.tenants?.pg_properties?.owner_id === user.id
  );

  return filtered.map((c: any) => ({
    id: c.id,
    tenant_id: c.tenantId || c.tenant_id,
    tenant_name: c.tenants?.name || 'Unknown',
    tenant_room: c.tenants?.room || 'Unknown',
    title: c.title,
    description: c.description,
    status: c.status,
    priority: c.priority,
    created_at: c.created_at,
  }));
}

export async function updateComplaintStatus(
  id: string,
  newStatus: string
): Promise<{ success: boolean; error?: string }> {
  const { supabase } = await getAuthUser();
  const { error } = await supabase
    .from(TABLE)
    .update({ status: newStatus })
    .eq('id', id);

  if (error) {
    console.error('[updateComplaintStatus]', error.message);
    return { success: false, error: error.message };
  }

  revalidatePath(PAGE);
  return { success: true };
}
