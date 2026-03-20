'use client';

import { useState, useMemo } from 'react';
import { getDeclaration } from '@/lib/galactic-content';

interface DeclarationCardProps {
  kinNumber: number;
  sealColourHex: string;
}

interface ParsedLine {
  text: string;
  type: 'be' | 'do' | 'have' | 'guide';
}

function parseDeclaration(text: string): ParsedLine[] {
  return text.split('\n').filter(l => l.trim()).map(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('I am guided by')) return { text: trimmed, type: 'guide' };
    if (trimmed.startsWith('in order to')) return { text: trimmed, type: 'have' };
    if (trimmed.startsWith('I am ')) return { text: trimmed, type: 'be' };
    return { text: trimmed, type: 'do' };
  });
}

const TYPE_STYLES: Record<string, string> = {
  be: 'font-medium',
  do: 'text-[var(--text-primary)]',
  have: 'text-[#a78bfa]',
  guide: 'text-[#eab308] italic',
};

export default function DeclarationCard({ kinNumber, sealColourHex }: DeclarationCardProps) {
  const [expanded, setExpanded] = useState(false);
  const declaration = useMemo(() => getDeclaration(kinNumber), [kinNumber]);

  if (!declaration) return null;

  const lines = useMemo(() => parseDeclaration(declaration.declaration), [declaration]);
  const firstBeLine = lines.find(l => l.type === 'be');

  return (
    <div
      className="mx-3 rounded-lg cursor-pointer transition-all duration-300 overflow-hidden"
      style={{
        background: 'var(--bg-card)',
        border: `0.5px solid ${sealColourHex}25`,
        boxShadow: expanded ? `0 0 12px ${sealColourHex}10` : 'none',
      }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="px-3 py-2">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-semibold tracking-[0.12em] text-[var(--text-tertiary)] uppercase">
            Today&apos;s Declaration
          </span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className={`text-[var(--text-tertiary)] transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>

        {/* Preview (collapsed) */}
        {!expanded && firstBeLine && (
          <p className="text-[13px] mt-1 leading-tight" style={{ color: sealColourHex }}>
            {firstBeLine.text}
          </p>
        )}

        {/* Full declaration (expanded) */}
        {expanded && (
          <div className="mt-2 space-y-0.5">
            {lines.map((line, i) => {
              const prevType = i > 0 ? lines[i - 1].type : null;
              const showDivider = prevType && prevType !== line.type && line.type !== 'guide';

              return (
                <div key={i}>
                  {showDivider && (
                    <div className="h-px my-1.5" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  )}
                  <p
                    className={`text-[13px] leading-[1.5] ${TYPE_STYLES[line.type]}`}
                    style={line.type === 'be' ? { color: sealColourHex } : undefined}
                  >
                    {line.text}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Full declaration display with colour coding — for My Kin result page.
 */
export function DeclarationFull({ kinNumber, sealColourHex }: DeclarationCardProps) {
  const declaration = useMemo(() => getDeclaration(kinNumber), [kinNumber]);

  if (!declaration) return null;

  const lines = useMemo(() => parseDeclaration(declaration.declaration), [declaration]);

  return (
    <div
      className="rounded-lg p-3"
      style={{
        background: `linear-gradient(145deg, ${sealColourHex}08, rgba(255,255,255,0.02))`,
        border: `0.5px solid ${sealColourHex}18`,
      }}
    >
      <div className="text-[9px] font-semibold tracking-[0.12em] text-[var(--text-tertiary)] uppercase mb-2">
        Your Galactic Declaration
      </div>
      <div className="space-y-0.5">
        {lines.map((line, i) => (
          <p
            key={i}
            className={`text-[13px] leading-[1.6] ${TYPE_STYLES[line.type]}`}
            style={line.type === 'be' ? { color: sealColourHex } : undefined}
          >
            {line.text}
          </p>
        ))}
      </div>
    </div>
  );
}
