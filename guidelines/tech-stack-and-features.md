# Tech Stack and Features Implementation Guide

This document outlines the technology stack and feature implementation details for the `@stayflo/owner-web` and `@stayflo/portfolio-web` applications within the Stayflo monorepo.

## 1. Global Architecture

The project is structured as a Monorepo using **npm workspaces**. It is separated into `apps` (front-end web applications) and `packages` (shared resources).

### Packages
- `@stayflo/ui`: Shared UI components (e.g., `Avatar`, `Badge`, `Button`, `Card`).
- `@stayflo/utils`: Shared utility functions.
- `@stayflo/types`: Shared TypeScript definitions.

---

## 2. Technology Stack

Both the `owner-web` and `portfolio-web` apps have recently been migrated to a modern Next.js architecture:

- **Framework**: [Next.js 16](https://nextjs.org/) (specifically using the App Router `src/app`)
- **UI Library**: [React 18.3.1](https://react.dev/)
- **Styling**: [TailwindCSS 4.1.12](https://tailwindcss.com/) (integrated via `@tailwindcss/postcss`)
- **Language**: [TypeScript 5.2.2](https://www.typescriptlang.org/)
- **Validation**: [Zod](https://zod.dev/) (v3.23.8) for strict schema validation.
- **Icons**: [Lucide React](https://lucide.dev/) (v0.487.0)
- **Charts/Data Viz** (specifically in `owner-web`): [Recharts](https://recharts.org/) (v2.15.2)

---

## 3. App-Specific Implementation Details

### A. Owner Web (`@stayflo/owner-web`)

**Purpose**: The administrative dashboard for PG/Hostel owners to manage their properties, tenants, rent collections, and operations.

**Implementation Highlights**:
- **Routing**: Driven by Next.js App Router within `src/app/`. Nested routes like `/dashboard` are handled natively by the folder structure. Server Components (e.g., `src/app/layout.tsx`) are used for root layouts and font injection.

**Feature Breakdowns**:
1. **Website Builder (`src/screens/OW5-WebsiteBuilder.tsx`)**:
   - **Interactive 2D Canvas**: Implements a complex drag-and-drop floor plan builder using native mouse event listeners (`mousemove`, `mouseup`) and CSS Grid mathematics. Allows owners to place rooms, beds, doors, and windows (rendered dynamically via SVG).
   - **State Synchronization**: Uses a debounced `useEffect` hook to serialize the entire builder state (rooms, amenities, menus, pricing) to `localStorage` under the key `'stayflo_builder_state'`. It emits a custom window event (`stayflo_website_update`) to allow real-time cross-tab synchronization.
   - **Error Handling**: Implements a custom class-based `ErrorBoundary` to catch rendering crashes in the complex canvas and provides a "Clear Storage & Reset App" fallback.

2. **Dashboard (`src/screens/OW1-Dashboard.tsx`)**:
   - Integrates high-level metrics, pending dues monitoring, and recent activity logs.
   - Utilizes `Recharts` for "Revenue & Utility Tracking" through Stacked Bar Charts.

3. **Other Core Screens**:
   - **Tenants Management (`OW2-Tenants.tsx`)**: Listing and managing individual tenant details.
   - **Rent Collection (`OW3-RentCollection.tsx`)**: Detailed monitoring of tenant dues and payment history.
   - **Food Management (`OW4-Food.tsx`)**: Interface for tracking meal bookings to prevent food waste.
   - **Leads & Operations (`OW6-Leads.tsx`, `OW7-Operations.tsx`)**: Captures prospective tenant inquiries and tracks daily utility billing and maintenance requests.

---

### B. Portfolio Web (`@stayflo/portfolio-web`)

**Purpose**: The public-facing promotional website for individual PG/Hostel properties. It acts as a marketing funnel to attract and capture tenant leads.

**Implementation Highlights**:
- **Routing**: Driven by Next.js App Router. Dynamic routing is implemented through the folder structure (e.g., `src/app/portfolio/[pgId]`).

**Feature Breakdowns**:
1. **Hero & Dynamic Real-time Preview (`src/screens/PW2-Hero.tsx`)**:
   - **Live Syncing**: The component continuously listens to the `'stayflo_builder_state'` in `localStorage`. As the owner edits the Website Builder in `owner-web`, the portfolio site updates instantly (e.g., pricing, amenities, room layouts).
   - **SVG Rendering**: It renders realistic room floorplans, swing doors, and window frames using custom SVG logic based on the owner's configurations.
   - **Lead Capture API Integration**: Features an aggressive lead generation popup that sends `POST` requests to `http://localhost:3000/api/leads` using native `fetch`.
   - **External API Integration**: Uses the OpenStreetMap Nominatim API for debounced, dynamic address searching and suggestions (`dynamicSuggestions`).
   - **Media Lightbox**: Includes a custom-built, immersive photo/video carousel lightbox for showcasing property images and virtual tours.

---

## 4. Design Aesthetics & Best Practices Used
- **Rich Aesthetics**: Heavy reliance on tailored Tailwind utility classes and curated color palettes (e.g., `#1D9E75` for positive actions, dark slate themes for sleek components).
- **Component-Driven**: Maximum reuse of base components from the `@stayflo/ui` package to maintain consistency across both apps.
- **Dynamic Feedback**: Use of micro-animations and interactive layout elements, fully leveraging Server/Client components boundaries in Next.js for optimized performance.
