import Link from 'next/link';
import EcosystemBadge from '@/components/EcosystemBadge';

export default function LearnPage() {
  return (
    <main className="min-h-screen px-6 py-20" style={{ background: 'var(--bg-deep)' }}>
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-sm no-underline mb-8 inline-block" style={{ color: 'var(--text-dim)' }}>
          ← Back
        </Link>

        <h1
          className="text-4xl md:text-5xl mb-12"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          How Subliminals Work
        </h1>

        {/* Section 1 */}
        <section className="mb-12">
          <h2 className="text-xl font-medium mb-4" style={{ color: 'var(--text-primary)' }}>What is a subliminal?</h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
            A subliminal message is any signal delivered below the threshold of conscious perception. The word comes from Latin: <em>sub</em> (below) + <em>limen</em> (threshold).
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            There are three primary types: <strong style={{ color: 'var(--text-primary)' }}>audio subliminals</strong> (messages hidden beneath music or ambient sound), <strong style={{ color: 'var(--text-primary)' }}>visual subliminals</strong> (text flashed faster than conscious reading speed), and <strong style={{ color: 'var(--text-primary)' }}>embedded image subliminals</strong> (text hidden within artwork at near-invisible opacity).
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-12">
          <h2 className="text-xl font-medium mb-4" style={{ color: 'var(--text-primary)' }}>Audio techniques</h2>

          <div className="space-y-6">
            <div className="studio-card">
              <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--accent-glow)' }}>Speed Layering</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Affirmations sped up 4-8x. Sounds like rapid chittering — your conscious mind can&apos;t decode it, but research suggests the subconscious can process compressed speech.
              </p>
            </div>
            <div className="studio-card">
              <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--accent-glow)' }}>Volume Reduction</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Affirmations mixed at -20 to -35dB beneath ambient sound. Present in the recording but imperceptible to the conscious ear.
              </p>
            </div>
            <div className="studio-card">
              <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--accent-glow)' }}>Reverse Audio</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Played backwards under forward-playing music or ambient. A debated but popular technique — your subconscious doesn&apos;t need words in order.
              </p>
            </div>
            <div className="studio-card">
              <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--accent-glow)' }}>Ultrasonic / Silent</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Affirmations modulated onto a carrier frequency above 17kHz — completely inaudible. Pioneered by Oliver Lowery (US Patent 5,159,703, 1992).
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="mb-12">
          <h2 className="text-xl font-medium mb-4" style={{ color: 'var(--text-primary)' }}>Visual techniques</h2>
          <div className="space-y-6">
            <div className="studio-card">
              <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--success)' }}>Flash</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Text shown for less than 50ms — below conscious reading speed but registered by the visual cortex. Used in research settings since the 1980s.
              </p>
            </div>
            <div className="studio-card">
              <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--sacred)' }}>Embedded Image</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Text hidden within artwork at near-invisible opacity (2-5%). Invisible at normal viewing distance but encoded in the image data.
              </p>
            </div>
          </div>
          <p className="text-sm leading-relaxed mt-4" style={{ color: 'var(--text-secondary)' }}>
            Historical context: the famous 1957 &quot;Drink Coca-Cola&quot; experiment by James Vicary was later revealed to be fabricated. However, genuine subliminal priming research conducted since then has shown measurable short-term effects on perception and preference.
          </p>
        </section>

        {/* Section 4 */}
        <section className="mb-12">
          <h2 className="text-xl font-medium mb-4" style={{ color: 'var(--text-primary)' }}>The honest take</h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
            Subliminal priming has some research support for short-term effects on perception and behaviour. It is not a magic bullet and should not replace conscious effort, therapy, or medical treatment.
          </p>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
            Subliminals are most effective when: you know exactly what&apos;s being programmed (hence the &quot;reveal&quot; features in Deep Whisper), you&apos;re consistent with practice, and you combine subliminal exposure with conscious intention and action.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Think of it as one tool in a broader practice — not the whole practice.
          </p>
        </section>

        {/* Section 5 */}
        <section className="mb-12">
          <h2 className="text-xl font-medium mb-6" style={{ color: 'var(--text-primary)' }}>Tools in Deep Whisper</h2>
          <div className="space-y-3">
            <Link href="/audio" className="studio-card block no-underline group" style={{ borderLeftWidth: 3, borderLeftColor: 'var(--accent)' }}>
              <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Audio Lab</h3>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Record, process, and export real subliminal audio files.</p>
            </Link>
            <Link href="/flash" className="studio-card block no-underline group" style={{ borderLeftWidth: 3, borderLeftColor: 'var(--success)' }}>
              <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Visual Flash</h3>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Flash affirmations at subliminal speeds over animated backgrounds.</p>
            </Link>
            <Link href="/wallpaper" className="studio-card block no-underline group" style={{ borderLeftWidth: 3, borderLeftColor: 'var(--sacred)' }}>
              <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Subliminal Wallpaper</h3>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Generate sacred geometry artwork with hidden affirmation text.</p>
            </Link>
          </div>
        </section>

        <div className="text-center pt-8" style={{ borderTop: '1px solid var(--border)' }}>
          <EcosystemBadge />
        </div>
      </div>
    </main>
  );
}
