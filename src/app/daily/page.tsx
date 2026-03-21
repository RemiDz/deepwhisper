'use client';

import { useMemo } from 'react';
import { getKinForDateFull } from '@/lib/dreamspell/kin';
import { getOracle } from '@/lib/dreamspell/oracle';
import { getWavespellPosition, getWavespellSeal } from '@/lib/dreamspell/wavespell';
import { SEALS } from '@/lib/dreamspell/seals';
import { TONES } from '@/lib/dreamspell/tones';
import { SEAL_DESCRIPTIONS, TONE_DESCRIPTIONS } from '@/lib/dreamspell/descriptions';
import { getDeclaration } from '@/lib/galactic-content';
import { getSealSoundPrescription, getToneSoundPrescription } from '@/data/soundHealing';
import { getSealYogaPrescription, getToneYogaPrescription } from '@/data/yogaPractice';

const FIVE_PHASES = [
  { name: 'Re-awakening', seals: 'Dragon, Wind, Night, Seed', description: 'The first phase of self-mastery. You are remembering who you truly are — waking up to the cosmic codes written in your being. This is the birth of awareness, the return to source, the first breath of the galactic journey.' },
  { name: 'Reconnecting', seals: 'Serpent, Worldbridger, Hand, Star', description: 'The second phase links you back to the web of life. You are reconnecting your body, your relationships, and your creative power to the larger pattern. Death and healing walk together here — what you release, you also restore.' },
  { name: 'Integrating', seals: 'Moon, Dog, Monkey, Human', description: 'The third phase weaves all parts of yourself into one. Emotions, love, play, and wisdom merge. Integration is not about perfection — it is about wholeness. Every fragment of who you are belongs.' },
  { name: 'Expanding', seals: 'Skywalker, Wizard, Eagle, Warrior', description: 'The fourth phase stretches your consciousness beyond known borders. You explore, enchant, envision, and question. Expansion demands courage — you cannot grow without stepping into the unknown.' },
  { name: 'Re-generating', seals: 'Earth, Mirror, Storm, Sun', description: 'The fifth phase completes and renews the cycle. You navigate, reflect, transform, and illuminate. Re-generation is not repetition — each cycle spirals higher. You end as the Sun: radiant, whole, ready to begin again.' },
];

export default function DailyPage() {
  const today = useMemo(() => new Date(), []);
  const kin = useMemo(() => getKinForDateFull(today), [today]);
  const oracle = useMemo(() => kin ? getOracle(kin) : null, [kin]);

  if (!kin || !oracle) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="text-[var(--purple)] text-lg font-medium">0.0 Hunab Ku</div>
        <p className="text-[var(--text-secondary)] text-sm mt-2">
          Today is the Day Out of Time — a day beyond the count.
        </p>
      </div>
    );
  }

  const seal = kin.seal;
  const tone = kin.tone;
  const sealIndex = seal.number;
  const toneNumber = tone.number;
  const accentColour = seal.colourHex;
  const declaration = getDeclaration(kin.number);
  const sealDesc = SEAL_DESCRIPTIONS[sealIndex] || '';
  const toneDesc = TONE_DESCRIPTIONS[toneNumber] || '';
  const wsPosition = getWavespellPosition(kin.number);
  const wsSeal = getWavespellSeal(kin.number);
  const phaseIndex = Math.floor(sealIndex / 4);
  const phase = FIVE_PHASES[phaseIndex];
  const soundSeal = getSealSoundPrescription(sealIndex);
  const soundTone = getToneSoundPrescription(toneNumber);
  const yogaSeal = getSealYogaPrescription(sealIndex);
  const yogaTone = getToneYogaPrescription(toneNumber);
  const tzolkinPct = Math.round((kin.number / 260) * 100);

  return (
    <div className="max-w-md mx-auto px-5 pt-4 pb-24 overflow-y-auto h-full" style={{ WebkitOverflowScrolling: 'touch' }}>

      {/* ===== 1. HEADLINE BLOCK ===== */}
      <div className="text-center mb-6">
        <div className="flex justify-center mb-3">
          <img
            src={seal.iconPath}
            alt={seal.name}
            className="w-12 h-12 rounded-lg"
            style={{ boxShadow: `0 0 12px ${accentColour}40` }}
          />
        </div>
        <div className="text-[10px] tracking-[0.2em] text-[var(--text-tertiary)] uppercase mb-1">
          Kin {kin.number}
        </div>
        <h1 className="text-2xl font-bold" style={{ color: accentColour }}>
          {kin.title}
        </h1>
        <div className="mx-auto mt-3" style={{ width: 60, height: 2, background: accentColour, borderRadius: 1 }} />
      </div>

      {/* ===== 2. SEAL ENERGY ===== */}
      <section className="mb-8">
        <SectionHeading>Seal Energy</SectionHeading>
        <Prose>
          Today carries the energy of <Accent colour={accentColour}>{seal.colour} {seal.name}</Accent> — {seal.power.toLowerCase()}, {seal.action.toLowerCase()}, and {seal.essence.toLowerCase()}.{' '}
          {sealDesc}
        </Prose>
      </section>

      {/* ===== 3. TONE ENERGY ===== */}
      <section className="mb-8">
        <SectionHeading>Tone Energy</SectionHeading>
        <Prose>
          The tone shaping this energy is <Accent colour="#c084fc">{tone.name}</Accent> — tone {tone.number}, the power of {tone.power.toLowerCase()}.{' '}
          {toneDesc}
        </Prose>
      </section>

      {/* ===== 4. DECLARATION ===== */}
      {declaration && (
        <section className="mb-8">
          <SectionHeading>Today&apos;s Declaration</SectionHeading>
          <blockquote
            className="text-[14px] italic leading-[1.8] whitespace-pre-line"
            style={{
              color: 'var(--text-secondary)',
              borderLeft: `3px solid ${accentColour}`,
              paddingLeft: 16,
              marginLeft: 0,
              background: `linear-gradient(90deg, ${accentColour}08, transparent)`,
              borderRadius: '0 4px 4px 0',
              padding: '12px 12px 12px 16px',
            }}
          >
            {declaration.declaration}
          </blockquote>
        </section>
      )}

      {/* ===== 5. ORACLE ===== */}
      <section className="mb-8">
        <SectionHeading>The Oracle</SectionHeading>

        <Prose>
          Your guide today is <Accent colour={oracle.guide.colourHex}>{oracle.guide.colour} {oracle.guide.name}</Accent> — {oracle.guide.power.toLowerCase()}, {oracle.guide.action.toLowerCase()}.{' '}
          {oracle.guide.number === seal.number
            ? 'When a seal guides itself, the energy is amplified and undiluted.'
            : `${oracle.guide.name} lights the path forward, showing you where to direct today's energy.`}
        </Prose>

        <Prose>
          Your support comes from <Accent colour={oracle.analog.colourHex}>{oracle.analog.colour} {oracle.analog.name}</Accent> — {oracle.analog.power.toLowerCase()}, {oracle.analog.essence.toLowerCase()}.{' '}
          This is your ally energy. It strengthens and complements what {seal.name} brings.
        </Prose>

        <Prose>
          Your challenge is <Accent colour={oracle.antipode.colourHex}>{oracle.antipode.colour} {oracle.antipode.name}</Accent> — {oracle.antipode.power.toLowerCase()}, {oracle.antipode.action.toLowerCase()}.{' '}
          This is the energy that stretches you. Can you hold both {seal.name} and {oracle.antipode.name} in balance?
        </Prose>

        <Prose>
          Your hidden power is <Accent colour={oracle.occult.colourHex}>{oracle.occult.colour} {oracle.occult.name}</Accent> — {oracle.occult.power.toLowerCase()}, {oracle.occult.essence.toLowerCase()}.{' '}
          Beneath the surface, this energy grows. It is the unexpected gift that reveals itself when you least expect it.
        </Prose>
      </section>

      {/* ===== 6. CYCLE POSITION ===== */}
      <section className="mb-8">
        <SectionHeading>Where You Are in the Cycle</SectionHeading>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-[var(--text-secondary)] mb-3">
          <div>
            <span className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider block">Wavespell</span>
            {wsSeal.name} · Day {wsPosition} of 13
          </div>
          <div>
            <span className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider block">Castle</span>
            {kin.castle.name}
          </div>
          <div>
            <span className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider block">Tzolkin</span>
            Kin {kin.number} of 260 ({tzolkinPct}%)
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${tzolkinPct}%`, background: '#c084fc' }}
          />
        </div>
        {kin.isGAP && (
          <div className="text-[11px] text-[#a78bfa] mt-2">
            ✦ Today is a Galactic Activation Portal — an intensified gateway day.
          </div>
        )}
      </section>

      {/* ===== 7. FIVE PHASES ===== */}
      <section className="mb-8">
        <SectionHeading>Phase of Self-Mastery</SectionHeading>
        <div className="text-[13px] text-[var(--text-secondary)] mb-1">
          <span style={{ color: accentColour }} className="font-semibold">Phase {phaseIndex + 1}: {phase.name}</span>
          <span className="text-[var(--text-tertiary)] text-[11px] ml-2">({phase.seals})</span>
        </div>
        <Prose>{phase.description}</Prose>
      </section>

      {/* ===== 8. SOUND HEALING ===== */}
      <section className="mb-8">
        <SectionHeading>Sound Healing</SectionHeading>
        <Prose>
          {soundSeal.description} {soundTone.description}
        </Prose>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {soundSeal.instruments.map((inst) => (
            <Pill key={inst}>{inst}</Pill>
          ))}
          <Pill accent>{soundTone.style}</Pill>
        </div>
        <div className="text-[10px] text-[var(--text-tertiary)] mt-2">
          Focus: {soundSeal.bodyFocus}
        </div>
      </section>

      {/* ===== 9. YOGA PRACTICE ===== */}
      <section className="mb-4">
        <SectionHeading>Yoga Practice</SectionHeading>
        <Prose>
          {yogaSeal.description} {yogaTone.description}
        </Prose>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {yogaSeal.poses.map((pose) => (
            <Pill key={pose}>{pose}</Pill>
          ))}
          <Pill accent>{yogaTone.style}</Pill>
        </div>
        <div className="text-[10px] text-[var(--text-tertiary)] mt-2">
          Focus: {yogaSeal.bodyFocus}
        </div>
      </section>

    </div>
  );
}

// ===================== Shared Components =====================

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-[12px] font-semibold tracking-[1.5px] uppercase mb-3"
      style={{ color: 'var(--text-tertiary)' }}
    >
      {children}
    </h2>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[15px] leading-[1.7] mb-3"
      style={{ color: 'var(--text-primary)' }}
    >
      {children}
    </p>
  );
}

function Accent({ children, colour }: { children: React.ReactNode; colour: string }) {
  return (
    <span
      className="font-semibold"
      style={{
        color: colour,
        background: `${colour}12`,
        padding: '1px 4px',
        borderRadius: 3,
      }}
    >
      {children}
    </span>
  );
}

function Pill({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span
      className="text-[10px] font-medium px-2.5 py-1 rounded-full"
      style={{
        background: accent ? 'rgba(192,132,252,0.12)' : 'rgba(255,255,255,0.06)',
        color: accent ? '#c084fc' : 'var(--text-secondary)',
        border: '0.5px solid ' + (accent ? 'rgba(192,132,252,0.2)' : 'rgba(255,255,255,0.06)'),
      }}
    >
      {children}
    </span>
  );
}
