import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import TabBar from '@/components/layout/TabBar';
import StarField from '@/components/layout/StarField';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Deep Whisper — 13 Moon Galactic Calendar',
  description: 'Navigate cosmic time with the Dreamspell 13 Moon calendar. Discover your Galactic Signature, track moon phases, and align with the Tzolkin.',
  openGraph: {
    title: 'Deep Whisper — 13 Moon Galactic Calendar',
    description: 'Navigate cosmic time with the Dreamspell 13 Moon calendar.',
    siteName: 'Deep Whisper',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#080812',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased dark`}>
      <body className="h-[100dvh] flex flex-col overflow-hidden font-[var(--font-geist-sans)]">
        <StarField />
        <main className="flex-1 overflow-y-auto pb-[72px]" style={{ paddingBottom: 'calc(72px + env(safe-area-inset-bottom))' }}>
          {children}
        </main>
        <TabBar />
      </body>
    </html>
  );
}
