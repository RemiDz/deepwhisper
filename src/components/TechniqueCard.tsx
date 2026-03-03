'use client';

import { ProcessingTechnique } from '@/types';

interface TechniqueCardProps {
  technique: ProcessingTechnique;
  title: string;
  description: string;
  icon: React.ReactNode;
  selected: boolean;
  recommended?: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}

export default function TechniqueCard({
  title,
  description,
  icon,
  selected,
  recommended,
  onToggle,
  children,
}: TechniqueCardProps) {
  return (
    <div
      className={`studio-card cursor-pointer transition-all duration-200 ${selected ? 'studio-card-selected' : ''}`}
      onClick={onToggle}
    >
      <div className="flex items-start gap-3">
        <div
          className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-lg"
          style={{ background: selected ? 'var(--accent-soft)' : 'var(--bg-surface)' }}
        >
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{title}</h4>
            {recommended && (
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--accent-soft)', color: 'var(--accent-glow)' }}>
                Recommended
              </span>
            )}
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{description}</p>
        </div>
        <div
          className="shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 transition-all"
          style={{
            borderColor: selected ? 'var(--accent)' : 'var(--border)',
            background: selected ? 'var(--accent)' : 'transparent',
          }}
        >
          {selected && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 4l2.5 3L9 1" />
            </svg>
          )}
        </div>
      </div>
      {selected && children && (
        <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }} onClick={e => e.stopPropagation()}>
          {children}
        </div>
      )}
    </div>
  );
}
