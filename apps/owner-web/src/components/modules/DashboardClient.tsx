'use client';

/**
 * src/components/modules/DashboardClient.tsx
 *
 * Client boundary for the Owner Dashboard screen.
 * Receives server-fetched initial data as props; uses localStorage as fallback
 * and maintains interactive state (QR scanner, meal serving, toast notifications).
 *
 * Converted from: apps/owner-web/app/screens/OW1-Dashboard.tsx
 * Key changes: "use client" directive added; props interface added.
 */

// Re-export the existing screen component through the client boundary.
// Because this file has "use client", everything it imports is bundled as
// client code — OW1-Dashboard.tsx does NOT need its own "use client" directive.
export { OwnerWebDashboard as DashboardClient } from '@screens/OW1-Dashboard';
