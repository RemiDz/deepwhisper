'use client';

import { useState, useMemo } from 'react';
import { getSealDescription } from '@/lib/galactic-content';

interface SoulEssenceProps {
  sealName: string;
  sealColourHex: string;
}

export default function SoulEssence({ sealName, sealColourHex }: SoulEssenceProps) {
  const [expanded, setExpanded] = useState(false);
  const description = useMemo(() => getSealDescription(sealName), [sealName]);

  if (!description) return null;

  const previewLength = 280;
  const needsTruncation = description.length > previewLength;
  const preview = needsTruncation ? description.slice(0, previewLength).replace(/\s\S*$/, '') + '...' : description;

  return (
    <div
      className="rounded-lg p-3"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '0.5px solid var(--border-subtle)',
      }}
    >
      <div className="text-[9px] font-semibold tracking-[0.12em] text-[var(--text-tertiary)] uppercase mb-2">
        Soul Essence
      </div>
      <p
        className="text-[13px] leading-[1.6] transition-all duration-300"
        style={{ color: '#b8b5ad' }}
      >
        {expanded ? description : preview}
      </p>
      {needsTruncation && !expanded && (
        <button
          onClick={(e) => { e.stopPropagation(); setExpanded(true); }}
          className="text-[11px] mt-1.5"
          style={{ color: sealColourHex }}
        >
          Read more
        </button>
      )}
      {expanded && needsTruncation && (
        <button
          onClick={(e) => { e.stopPropagation(); setExpanded(false); }}
          className="text-[11px] mt-1.5 text-[var(--text-tertiary)]"
        >
          Show less
        </button>
      )}
    </div>
  );
}
