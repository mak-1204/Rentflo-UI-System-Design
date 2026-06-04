# Stayflo Next.js Enterprise Guidelines

This document outlines the strict production-grade standards for writing Next.js App Router applications in the Stayflo monorepo. All code written must adhere to these architectural, security, and quality practices.

## 1. Enterprise Architecture & Directory Structure
As the codebase scales, we must avoid the legacy pattern of throwing everything into global `components/` or `hooks/` folders. Instead, we use a **Feature-First Architecture**.

### The Golden Rule: The `app/` Directory is Only for Routing
Keep files inside `app/` as thin as possible. `page.tsx` and `layout.tsx` should only handle routing, params, and composing top-level layouts. All complex business logic and UI should be abstracted.

### Scalable Directory Blueprint
```text
src/
├── app/              # Routing & Layouts ONLY
│   ├── (dashboard)/  # Route Groups (parenthesis) for organization
│   │   ├── leads/
│   │   │   ├── _components/  # Strictly collocated components for this route
│   │   │   ├── page.tsx
│   │   │   └── actions.ts    # Route-specific Server Actions
├── components/       # Global UI only (Buttons, Inputs, Modals)
├── features/         # 🟢 CORE BUSINESS LOGIC (Domain-driven)
│   ├── leads/
│   │   ├── components/       # Reusable lead components
│   │   ├── services/         # Database/API logic (e.g. leads.service.ts)
│   │   └── schema.ts         # Zod schemas
├── lib/              # Shared infra (Supabase client, utils)
```

## 2. Server Components vs. Client Components
**Default to Server Components.**
- Every component is a Server Component (`async function`) by default.
- Never use `'use client'` at the top of a page layout or massive wrapper unless absolutely necessary.
- **Client Components** must be pushed down as far into the tree as possible (e.g., instead of making an entire table a Client Component, make only the `StatusDropdown` inside the table a Client Component).

## 3. Server Actions Security (Critical)
Server Actions are public API endpoints. They can be invoked by malicious actors outside of the browser. Treat every Server Action with the same security rigor as a REST API.

### 1. Always Authenticate & Authorize
Never assume a Server Action is safe just because the UI button is hidden.
```typescript
// ❌ BAD: No auth check
export async function updateLead(data) {
  await db.update(...)
}

// ✅ GOOD: Verify session inside the action
export async function updateLead(data) {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");
  // ...
}
```

### 2. Strict Input Validation (Fail Fast)
Always parse the incoming `FormData` or payload using a **Zod schema**. Never trust client input.
```typescript
const LeadSchema = z.object({ id: z.string(), status: z.string() });

export async function updateLead(payload: unknown) {
  const result = LeadSchema.safeParse(payload);
  if (!result.success) return { error: "Invalid data" };
  // ...
}
```

### 3. Prevent Data Leaks (The Server/Client Boundary)
- Use `import 'server-only'` in any file containing sensitive logic (like `services/leads.service.ts`) to guarantee it can never accidentally be bundled into the client JavaScript.
- Only return the exact fields the client needs. Do not return full database rows if they contain sensitive metadata.

## 4. Performance & UX Standards
- **Mutations:** Always call `revalidatePath('/dashboard/leads')` at the end of a Server Action so Next.js purges its cache and the user sees the updated data instantly without a full page reload.
- **Loading States:** Use `loading.tsx` for route transitions and `useFormStatus` (or `useTransition`) inside Client Components to show pending states on buttons when Server Actions are executing.
