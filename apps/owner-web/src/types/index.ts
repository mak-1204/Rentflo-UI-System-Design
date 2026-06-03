/**
 * src/types/index.ts
 *
 * Application-level strict type definitions for owner-web.
 * Re-exports shared types from @rentflo/types and adds UI-specific view models.
 * No use of `any` — use `unknown` and narrow explicitly where needed.
 */

// ─── Re-export shared domain types ───────────────────────────────────────────
export type {
  User,
  UserRole,
  Owner,
  PGProperty,
  Room,
  Bed,
  BedStatus,
  Tenant,
  Invoice,
  InvoiceStatus,
  Payment,
  PaymentMethod,
  PaymentStatus,
  MeterReading,
  MealMenu,
  MealBooking,
  MealType,
  Complaint,
  ComplaintCategory,
  ComplaintPriority,
  ComplaintStatus,
  Lead,
  LeadStatus,
  Subscription,
  OwnerSubscription,
  OwnerSubscriptionStatus,
} from '@rentflo/types';

// ─── UI View Models ───────────────────────────────────────────────────────────

export type RentStatus = 'Paid' | 'Overdue' | 'Delay Approved' | 'Delay Requested';
export type TenantPaymentStatus = 'Paid' | 'Overdue';

/** Display-optimized tenant row used in the Tenants screen table */
export interface TenantViewRow {
  name: string;
  room: string;
  floor: string;
  rent: number;
  phone: string;
  email: string;
  status: TenantPaymentStatus;
  moveIn: string;
  activeMonths: number;
}

/** Rent record used in the Rent Collection screen */
export interface RentRecord {
  name: string;
  room: string;
  rent: number;
  utilities: number;
  lateFee: number;
  status: RentStatus;
  date: string;
  method: string;
}

/** Dashboard metric card */
export interface DashboardMetric {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  delta: string;
  icon: string;
}

/** Meal booking for dashboard QR scanner */
export interface MealBookingEntry {
  name: string;
  room: string;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  servedMeals: Partial<Record<'breakfast' | 'lunch' | 'dinner', boolean>>;
}

/** Scanned QR result shape */
export interface QrScanResult {
  name: string;
  room: string;
  date: string;
  meals: { breakfast: boolean; lunch: boolean; dinner: boolean };
  servedMeals: Partial<Record<'breakfast' | 'lunch' | 'dinner', boolean>>;
}

/** Navigation item for the sidebar */
export interface NavItem {
  path: string;
  label: string;
  exact?: boolean;
}

/** API error shape */
export interface ApiError {
  message: string;
  statusCode: number;
  details?: unknown;
}
