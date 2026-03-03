import type { Metadata, Viewport } from 'next';
import { Instrument_Serif, DM_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const instrumentSerif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Deep Whisper — Subliminal Creation Studio',
  description: 'Create real subliminal audio, visual flash sessions, and hidden-message wallpapers. Record your affirmations, process with speed/reverse/ultrasonic techniques, and export. Free web tool.',
  keywords: ['subliminal maker', 'subliminal audio', 'subliminal generator', 'create subliminals', 'subliminal messages', 'visual subliminal', 'subliminal wallpaper', 'affirmations'],
  openGraph: {
    title: 'Deep Whisper — Subliminal Creation Studio',
    description: 'Create real subliminal audio, visual flash sessions, and hidden-message wallpapers. Free.',
    url: 'https://deepwhisper.app',
    siteName: 'Deep Whisper',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#4A3AFF',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${dmSans.variable} ${ibmPlexMono.variable}`}>
      <head>
        <script defer data-domain="deepwhisper.app" src="https://plausible.io/js/script.js" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
