# Tech Stack and Features Implementation Guide

This document outlines the technology stack, feature implementations, and the current architectural state of the `@stayflo/owner-web` and `@stayflo/portfolio-web` applications within the Stayflo monorepo. 

> [!NOTE]
> This is a living document. It has been recently updated to reflect the successful migration to a strict, Zero-Trust Architecture using Next.js Server Actions, HTTP-Only Cookies, and Supabase RLS.

---

## 1. Global Architecture

The project is structured as a Monorepo using **npm workspaces**. It is separated into `apps` (front-end web applications) and `packages` (shared UI/Utils).

### Current Tech Stack
- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router, using Turbopack for local dev)
- **Database / Backend**: [Supabase](https://supabase.com/) (PostgreSQL with Row Level Security)
- **Authentication**: `@supabase/ssr` (HTTP-Only Secure Cookies)
- **UI Library**: [React 18/19](https://react.dev/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 2. Zero-Trust Security & Database Schema (Supabase)

Our architecture relies entirely on secure Next.js Server Actions. We have eliminated all arbitrary `fetch()` calls and Express-style proxy routes. The database is strictly protected by **Row Level Security (RLS)** which matches the authenticated `user.id` against the `owner_id` column on every table. All permissive prototype policies have been purged.

1. **`pg_owners` / `auth.users`**:
   - **Purpose**: Authenticated PG operators.
2. **`pg_properties`**: 
   - **Purpose**: Core configuration for the PG.
   - **Key Columns**: `layout_data` (JSONB containing the Website Builder canvas state), `due_day` (Int), `late_fee` (Int).
3. **`leads`**: 
   - **Purpose**: Tracks prospective tenants.
   - **Key Columns**: `invite_code` (unique short URL generator), `name`, `phone`, `preferredSharing`, `moveInDate`.
4. **`tenants`**: 
   - **Purpose**: Active tenant directory.
   - **Key Columns**: `name`, `room`, `floor`, `rent`, `status` (Paid/Overdue), `moveIn`.
5. **`rent_bills`**: 
   - **Purpose**: Monthly rent and utility tracking.
   - **Key Columns**: `tenant_id` (FK to tenants), `month` (e.g. "2026-06"), `rent`, `utilities`, `lateFee`, `status` (Paid/Overdue/Delay Approved).
6. **`food_bookings`**: 
   - **Purpose**: Daily meal tracking to prevent food waste.
   - **Key Columns**: `tenant_id` (FK), `date`, `breakfast`, `lunch`, `dinner` (booleans for booking), and `_served` booleans for tracking consumption.
7. **`complaints` / `operations`**: 
   - **Purpose**: Maintenance ticketing system.
   - **Key Columns**: `tenant_id` (FK), `title`, `description`, `status` (Open/In Progress/Resolved).

---

## 3. Detailed Implementation Status

### A. Owner Web (`@stayflo/owner-web`)
The administrative dashboard for PG/Hostel owners to manage their properties, tenants, operations, and public-facing websites. **All features are fully secured and bound to the authenticated owner's session.**

#### Core Feature: The Custom Website Builder (`/website-builder`)
- **Interactive 2D Grid Canvas**: Drag, drop, and resize rooms on a pixel grid. It handles multi-floor layouts and precise coordinate mapping for beds, doors, and windows.
- **Supabase Integration**: The canvas state is serialized into a highly efficient `JSONB` object and saved to `pg_properties.layout_data`. 
- **Secure Auto-Save**: LocalStorage has been completely eradicated. The builder utilizes a 1.5s debounced `startTransition` to securely stream state updates directly to the Supabase Postgres instance via the `saveWebsiteData` Server Action.

#### Core Feature: Personalized Lead Generation (`/leads`)
- **The WhatsApp Invite Flow**: Owners enter lead details which safely executes `createLeadAction`. This validates inputs via Zod and generates a unique `invite_code`.
- **Dynamic Portfolio Linking**: A dynamic WhatsApp URL linking to the personalized Portfolio (e.g., `rentflo.com/portfolio/sunrise?invite=v8kP2x`) is auto-generated.

#### Operational Features
- **Tenants Directory (`/tenants`)**: Secure CRUD operations for managing active tenant profiles. Joins with `pg_properties` to fetch PG context securely.
- **Rent Collection (`/rent-collection`)**: 
  - Dynamically calculates prorated rent based on the tenant's exact move-in date.
  - Automatically calculates late fees based on the PG's `due_day` and `late_fee` settings.
- **Food Management (`/food`)**: Provides a daily view of tenant meal bookings (Breakfast, Lunch, Dinner). Staff can click to mark individual meals as "Served" using Server Actions.
- **Operations & Complaints (`/operations`)**: Fully migrated to Server Actions. The legacy `api-client.ts` was permanently deleted.

---

### B. Portfolio Web (`@stayflo/portfolio-web`)
The highly-optimized, public-facing promotional website designed to convert leads into confirmed tenants.

#### Core Feature: Server-Driven Personalization
- **Next.js Server Components (`page.tsx`)**: Fetches `layout_data` directly from Supabase at render time.
- **Dynamic Greeting & Preferences**: Parses the `?invite=...` parameter to fetch personalized `leadData`. Greets the lead by name and defaults their view to their preferred room sharing type.
- **Real-Time Interactive Floor Plans (`InteractiveFloorPlans.tsx`)**: Renders the SVG floor plan using the JSON data. Beds marked as "Occupied" by the owner instantly appear in Red on the Portfolio site.

---

## 4. Project Plan & Future Roadmap

With the successful migration of our entire architecture to a strict Zero-Trust Server Action model, our core administrative data loop is complete and secure. The next phases focus on expansion and monetization:

### Immediate Next Steps
1. **Checkout & Booking Pipeline**: Implement Razorpay to allow prospective leads to select a green (Vacant) bed on the Portfolio site, pay the security deposit directly, and instantly transform from a Lead to an Active Tenant.
2. **True Modularization of the Builder**: Wrap the massive 2500-line `BuilderCanvas.tsx` in a React `Context API` (`BuilderProvider`) to cleanly split the Grid, Palette, and Settings into smaller files.
3. **Automated Tenant Onboarding**: Auto-generate digital rental agreements and KYC forms upon successful Razorpay deposits.
