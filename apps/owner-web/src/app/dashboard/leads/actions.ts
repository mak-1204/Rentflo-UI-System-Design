'use server';

import { supabase } from '@stayflo/utils';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export async function updateLeadStatus(leadId: string, newStatus: string) {
  // In a real app, add auth check here:
  // const session = await auth(); if (!session) throw new Error('Unauthorized');
  
  const { error } = await supabase
    .from('leads')
    .update({ status: newStatus })
    .eq('id', leadId);

  if (error) {
    console.error('[updateLeadStatus] Supabase error:', error);
    return { error: error.message };
  }

  revalidatePath('/dashboard/leads');
  return { success: true };
}

const CreateLeadSchema = z.object({
  name: z.string().optional(),
  phone: z.string().min(10, 'Phone must be at least 10 characters'),
  room: z.string().min(1),
  landmark: z.string().optional(),
});

export async function createLeadAction(formData: FormData) {
  const rawData = {
    name: formData.get('name') as string,
    phone: formData.get('phone') as string,
    room: formData.get('room') as string,
    landmark: formData.get('landmark') as string,
  };

  const validated = CreateLeadSchema.safeParse(rawData);
  if (!validated.success) {
    return { error: 'Validation failed' };
  }

  const phoneWithPrefix = validated.data.phone.startsWith('+') 
    ? validated.data.phone 
    : `+91 ${validated.data.phone}`;

  let sharingType = 'other';
  if (validated.data.room.includes('Single')) sharingType = 'single';
  else if (validated.data.room.includes('Double')) sharingType = 'double';
  else if (validated.data.room.includes('Triple')) sharingType = 'triple';

  const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

  const { error } = await supabase.from('leads').insert([{
    owner_id: '00000000-0000-0000-0000-000000000001', // Dummy owner until Auth is implemented
    name: validated.data.name || 'Unnamed Prospect',
    phone_number: phoneWithPrefix,
    pg_type: 'co-living',
    sharing_type: sharingType,
    status: 'contacted',
    invite_code: inviteCode
  }]);

  if (error) {
    console.error('[createLeadAction] Supabase error:', error);
    return { error: error.message };
  }

  revalidatePath('/dashboard/leads');
  return { success: true, inviteCode };
}
