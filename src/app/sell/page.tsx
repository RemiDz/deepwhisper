'use client';

export default function SellPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-8 overflow-y-auto h-full text-[var(--text-primary)]">
      <h1 className="text-xl font-bold mb-6">Galactic Blueprint — Sales Playbook</h1>

      {/* Product overview */}
      <Section title="Product Overview">
        <p>The <strong>Galactic Blueprint</strong> is a personalised 15-25 page PDF report that reveals a person&apos;s cosmic identity through the Dreamspell 13 Moon calendar system.</p>
        <h4 className="font-medium mt-3 text-[var(--purple)]">What&apos;s included:</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Complete solar seal analysis (power, action, essence, meaning)</li>
          <li>Galactic tone deep-dive with personal pulse question</li>
          <li>Fifth Force Oracle breakdown (guide, analog, antipode, occult)</li>
          <li>Wavespell position and 13-day cycle journey</li>
          <li>Castle, Earth family, and colour family analysis</li>
          <li><strong>Sonic healing protocol</strong> — personalised frequency, instrument, duration, and body focus</li>
          <li>Galactic year context</li>
        </ul>
        <h4 className="font-medium mt-3 text-[var(--purple)]">Why it&apos;s unique:</h4>
        <p className="text-sm">No other Dreamspell app combines galactic signature analysis with sound healing protocols. The sonic healing section is the key differentiator — it gives people a physical, actionable practice tied to their cosmic identity.</p>
      </Section>

      {/* Pricing */}
      <Section title="Pricing">
        <div className="p-3 rounded-lg border text-center" style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-card)' }}>
          <div className="text-[var(--seal-yellow)] text-sm font-medium">Price TBD — currently in preview</div>
        </div>
        <h4 className="font-medium mt-3 text-[var(--text-secondary)]">Suggested tiers:</h4>
        <div className="space-y-2 mt-2">
          <Tier name="Basic Blueprint" price="£9.99" desc="Kin analysis + oracle" />
          <Tier name="Full Blueprint + Sonic Healing" price="£19.99" desc="Everything including sound protocol" />
          <Tier name="Couples Blueprint" price="£29.99" desc="Two people + relationship analysis" />
        </div>
      </Section>

      {/* Talking points */}
      <Section title="TikTok Talking Points">
        <div className="space-y-2">
          {[
            'Did you know your birthday gives you a galactic signature?',
            'Your Kin has a personal sound healing frequency',
            'The Dreamspell calendar reveals your cosmic identity',
            'Get your personalised Galactic Blueprint at deepwhisper.app',
            'There are 260 unique galactic signatures — which one are you?',
            'Your galactic signature has a specific healing frequency and chakra alignment',
          ].map((point, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-[var(--purple)] shrink-0">•</span>
              <span>&ldquo;{point}&rdquo;</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Testimonials */}
      <Section title="Testimonials">
        <div className="text-center py-8 text-[var(--text-tertiary)] text-sm italic">
          Space for testimonials once sales begin
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-sm font-semibold text-[var(--purple)] mb-3 tracking-wider uppercase">{title}</h2>
      <div className="text-sm text-[var(--text-secondary)] space-y-2">{children}</div>
    </section>
  );
}

function Tier({ name, price, desc }: { name: string; price: string; desc: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--bg-card)', border: '0.5px solid var(--border-subtle)' }}>
      <div>
        <div className="text-sm font-medium text-[var(--text-primary)]">{name}</div>
        <div className="text-[10px] text-[var(--text-tertiary)]">{desc}</div>
      </div>
      <div className="text-sm font-bold text-[var(--seal-yellow)]">{price}</div>
    </div>
  );
}
