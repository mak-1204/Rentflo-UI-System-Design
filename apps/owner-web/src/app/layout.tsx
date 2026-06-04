/**
 * src/app/layout.tsx — Root Layout (React Server Component)
 *
 * Replaces Vite's index.html + main.tsx entry point.
 * Responsibilities:
 *  - Provides the HTML/body shell
 *  - Injects Google Fonts via next/font (zero layout shift, no external network
 *    request at render time)
 *  - Loads global Tailwind CSS
 *  - Sets default <head> metadata (overridden per-page via export const metadata)
 */

import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';
import '@/styles/globals.css';

// ─── Fonts ──────────────────────────────────────────────────────────────────────
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

// ─── Default Metadata ──────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: 'Stayflo — Owner Portal',
    template: '%s | Stayflo',
  },
  description:
    'Manage your PG properties, tenants, rent collections, food management, and leads — all in one place.',
  keywords: ['PG management', 'paying guest', 'property owner', 'rent collection', 'Stayflo'],
  robots: { index: false, follow: false }, // Owner portal is private
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
 };

// ─── Root Layout ───────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
