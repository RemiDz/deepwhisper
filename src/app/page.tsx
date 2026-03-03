'use client';

import ToolCard from '@/components/ToolCard';
import EcosystemBadge from '@/components/EcosystemBadge';
import Link from 'next/link';

function WaveformIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="1" y="6" width="2" height="8" rx="1" fill="var(--accent)" />
      <rect x="5" y="3" width="2" height="14" rx="1" fill="var(--accent)" />
      <rect x="9" y="5" width="2" height="10" rx="1" fill="var(--accent)" />
      <rect x="13" y="2" width="2" height="16" rx="1" fill="var(--accent)" />
      <rect x="17" y="7" width="2" height="6" rx="1" fill="var(--accent)" />
    </svg>
  );
}

function FlashIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="3" width="14" height="10" rx="2" stroke="var(--success)" strokeWidth="1.5" />
      <path d="M10 8l-2 4h4l-2 4" stroke="var(--success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="7" y1="16" x2="13" y2="16" stroke="var(--success)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function WallpaperIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="5" y="2" width="10" height="16" rx="2" stroke="var(--sacred)" strokeWidth="1.5" />
      <line x1="7" y1="6" x2="13" y2="6" stroke="var(--sacred)" strokeWidth="0.5" opacity="0.4" />
      <line x1="7" y1="8" x2="13" y2="8" stroke="var(--sacred)" strokeWidth="0.5" opacity="0.3" />
      <line x1="7" y1="10" x2="13" y2="10" stroke="var(--sacred)" strokeWidth="0.5" opacity="0.2" />
      <line x1="7" y1="12" x2="13" y2="12" stroke="var(--sacred)" strokeWidth="0.5" opacity="0.15" />
      <line x1="7" y1="14" x2="11" y2="14" stroke="var(--sacred)" strokeWidth="0.5" opacity="0.1" />
    </svg>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20" style={{ background: 'var(--bg-deep)' }}>
      {/* Hero */}
      <div className="text-center mb-16 max-w-2xl">
        <h1
          className="text-5xl md:text-7xl mb-4 leading-tight"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          Create real subliminals.
        </h1>
        <p className="text-lg md:text-xl" style={{ color: 'var(--text-secondary)' }}>
          Record. Process. Programme your subconscious.
        </p>
      </div>

      {/* Tool Cards */}
      <div className="w-full max-w-2xl space-y-4 mb-16">
        <ToolCard
          title="Audio Lab"
          description="Record affirmations in your voice. Speed them up, layer beneath soundscapes, shift to ultrasonic. Export real subliminal audio."
          cta="Open Audio Lab →"
          href="/audio"
          accentColor="var(--accent)"
          icon={<WaveformIcon />}
          delay={0}
        />
        <ToolCard
          title="Visual Flash"
          description="Flash affirmations on screen faster than you can read. Your subconscious catches every word."
          cta="Open Visual Flash →"
          href="/flash"
          accentColor="var(--success)"
          icon={<FlashIcon />}
          delay={0.1}
        />
        <ToolCard
          title="Subliminal Wallpaper"
          description="Embed hidden affirmations into sacred geometry art. Download as your phone wallpaper."
          cta="Create Wallpaper →"
          href="/wallpaper"
          accentColor="var(--sacred)"
          icon={<WallpaperIcon />}
          delay={0.2}
        />
      </div>

      {/* Footer links */}
      <div className="flex flex-col items-center gap-4">
        <Link
          href="/learn"
          className="text-sm no-underline transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          How do subliminals work?
        </Link>
        <EcosystemBadge />
        <p className="text-xs mt-8" style={{ color: 'var(--text-dim)' }}>
          deepwhisper.app
        </p>
      </div>
    </main>
  );
}
