// Shared types for Rent Collection module

export interface RentRecord {
  id?: string;               // UUID of the rent bill record (optional if not in DB yet)
  tenant_id: string;         // UUID of the tenant
  name: string;              // Tenant name
  room: string;              // Tenant room
  phone: string;             // Tenant phone
  month: string;             // YYYY-MM format
  rent: number;              // Monthly base rent amount
  utilities: number;         // Utilities charges (electricity + water)
  lateFee: number;           // Pending late fee amount
  status: 'Paid' | 'Overdue' | 'Delay Approved' | 'Delay Requested';
  paymentDate?: string;      // Optional date when payment was cleared
  paymentMethod?: string;    // Optional method used (e.g. Razorpay, Stripe, Cash)
}
