import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Outfit, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Deep Whisper — Subliminal Audio Intelligence',
  description: 'Create, visualise, and share personalised subliminal affirmation sessions with binaural beats, healing frequencies, and sacred geometry. Free web app by Harmonic Waves.',
  keywords: ['subliminal messages', 'subliminal audio', 'affirmations', 'binaural beats', 'healing frequencies', 'sound healing', 'manifestation', 'subconscious mind'],
  authors: [{ name: 'Harmonic Waves' }],
  openGraph: {
    title: 'Deep Whisper — Subliminal Audio Intelligence',
    description: 'Whisper your intentions into being. Create personalised subliminal sessions with binaural beats and sacred geometry.',
    url: 'https://deepwhisper.app',
    siteName: 'Deep Whisper',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Deep Whisper — Subliminal Audio Intelligence',
    description: 'Whisper your intentions into being.',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#7B5EA7',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${outfit.variable} ${jetbrains.variable}`}>
      <head>
        <script defer data-domain="deepwhisper.app" src="https://plausible.io/js/script.js" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
