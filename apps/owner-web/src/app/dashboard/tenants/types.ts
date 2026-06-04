// Shared Tenant type for the tenants section
export interface Tenant {
  id?: string;           // Supabase UUID
  pg_id?: string;        // FK → pg_properties.id
  pg_name?: string;      // Joined from pg_properties (read-only display)
  name: string;
  room: string;
  floor: string;
  rent: number;
  phone: string;
  email: string;
  status: 'Paid' | 'Overdue';
  moveIn: string;
  activeMonths: number;
}

export const DEFAULT_TENANTS: Tenant[] = [
  { name: 'Amit Kumar',       room: 'Room 4', floor: '1st Floor',    rent: 8500, phone: '+91 98765 43210', email: 'amit.k@gmail.com',     status: 'Overdue', moveIn: '15 Oct 2025', activeMonths: 8  },
  { name: 'Sanjay Ramaswamy', room: 'Room 2', floor: 'Ground Floor', rent: 8500, phone: '+91 99000 88776', email: 'sanjay.r@outlook.com', status: 'Paid',    moveIn: '01 Nov 2025', activeMonths: 7  },
  { name: 'Vijay Nair',       room: 'Room 8', floor: '2nd Floor',    rent: 9200, phone: '+91 91234 56789', email: 'vijay.nair@yahoo.com', status: 'Paid',    moveIn: '10 Jan 2026', activeMonths: 5  },
];
