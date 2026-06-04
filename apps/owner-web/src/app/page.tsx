/**
 * src/app/page.tsx — Root Redirect
 *
 * Redirects the root "/" path to the dashboard.
 * Replacing the old React Router: <Route path="/" element={<Navigate to="/owner-web" replace />}
 */
import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/dashboard');
}
