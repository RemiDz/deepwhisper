import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
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
  description: 'Your daily galactic signature. Dreamspell 13 Moon calendar with real-time moon phase, zodiac sign, and personalised sound healing.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'DeepWhisper',
  },
  openGraph: {
    title: 'Deep Whisper — 13 Moon Galactic Calendar',
    description: 'Discover your galactic signature. Dreamspell calendar with real-time moon data and sound healing.',
    url: 'https://deepwhisper.app',
    siteName: 'Deep Whisper',
    type: 'website',
  },
  icons: {
    icon: '/icon-192.svg',
    apple: '/icon-192.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
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
      <head>
        <Script defer data-domain="deepwhisper.app" src="https://plausible.io/js/script.js" strategy="afterInteractive" />
      </head>
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
