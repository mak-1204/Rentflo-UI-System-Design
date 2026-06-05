import type { Metadata, Viewport } from 'next';
import { Hanken_Grotesk } from 'next/font/google';
import '@/styles/globals.css';

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'stayfloww Property Explorer',
  description: 'Explore active rooms, interactive floor blueprints, and live amenities.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={hankenGrotesk.variable}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen bg-surface font-sans text-on-surface">
        {children}
      </body>
    </html>
  );
}
