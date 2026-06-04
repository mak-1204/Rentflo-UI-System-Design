// Shared types for Food Waste Reduction Dashboard

export interface FoodBooking {
  id?: string;               // UUID of the booking record
  tenant_id: string;         // UUID of the tenant
  name: string;              // Joined tenant name
  room: string;              // Joined tenant room
  phone: string;             // Joined tenant phone number
  date: string;              // YYYY-MM-DD format
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  breakfast_served: boolean;
  lunch_served: boolean;
  dinner_served: boolean;
  status: 'Booked' | 'Not Booked' | 'Missed Cutoff';
}
