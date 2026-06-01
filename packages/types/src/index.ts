export type UserRole = 'super_admin' | 'owner' | 'tenant' | 'staff';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Owner {
  id: string;
  userId: string;
  companyName: string;
  gstin?: string;
  billingAddress?: string;
}

export interface PGProperty {
  id: string;
  ownerId: string;
  name: string;
  address: string;
  rules?: string;
  websiteSlug: string;
  websiteSettings?: {
    theme?: string;
    bannerImages?: string[];
    description?: string;
    coordinates?: { lat: number; lng: number };
  };
}

export interface Room {
  id: string;
  pgId: string;
  roomNumber: string;
  floor: number;
  sharingType: number;
  pricePerBed: number;
  totalBeds: number;
  amenities: string[];
}

export type BedStatus = 'vacant' | 'occupied' | 'blocked';

export interface Bed {
  id: string;
  roomId: string;
  bedNumber: string;
  status: BedStatus;
  currentTenantId?: string;
}

export interface Tenant {
  id: string;
  userId: string;
  bedId?: string;
  pgId: string;
  joinCode?: string;
  securityDeposit: number;
  baseRent: number;
  checkInDate: string;
  checkOutDate?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
}

export type InvoiceStatus = 'unpaid' | 'paid' | 'partially_paid' | 'overdue';

export interface Invoice {
  id: string;
  tenantId: string;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  dueDate: string;
  rentAmount: number;
  electricityAmount: number;
  otherCharges: number;
  status: InvoiceStatus;
  notes?: string;
}

export type PaymentMethod = 'razorpay' | 'upi' | 'cash' | 'bank_transfer';
export type PaymentStatus = 'pending' | 'success' | 'failed';

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  gatewayTransactionId?: string;
  status: PaymentStatus;
  paidAt: string;
}

export interface MeterReading {
  id: string;
  roomId: string;
  readingDate: string;
  previousReading: number;
  currentReading: number;
  unitsConsumed: number;
  ratePerUnit: number;
  calculatedAmount: number;
  imageUrl?: string;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface MealMenu {
  id: string;
  pgId: string;
  date: string;
  mealType: MealType;
  menuItems: string[];
}

export interface MealBooking {
  id: string;
  tenantId: string;
  menuId: string;
  booked: boolean;
  attended: boolean;
  updatedAt: string;
}

export type ComplaintCategory = 'plumbing' | 'electrical' | 'food' | 'internet' | 'cleaning' | 'other';
export type ComplaintPriority = 'low' | 'medium' | 'high' | 'emergency';
export type ComplaintStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface Complaint {
  id: string;
  tenantId: string;
  pgId: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  imageUrls?: string[];
  assignedStaffId?: string;
  resolutionNotes?: string;
}

export type LeadStatus = 'new' | 'contacted' | 'visiting' | 'converted' | 'lost';

export interface Lead {
  id: string;
  pgId: string;
  name: string;
  phone: string;
  email?: string;
  preferredSharing?: number;
  moveInDate?: string;
  status: LeadStatus;
  source?: string;
}

export interface Subscription {
  id: string;
  name: string;
  priceMonthly: number;
  maxRooms: number;
  maxTenants: number;
}

export type OwnerSubscriptionStatus = 'active' | 'expired' | 'cancelled';

export interface OwnerSubscription {
  id: string;
  ownerId: string;
  subscriptionId: string;
  startDate: string;
  endDate: string;
  status: OwnerSubscriptionStatus;
}
