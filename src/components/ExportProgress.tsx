'use client';

interface ExportProgressProps {
  progress: number;
  isExporting: boolean;
}

export default function ExportProgress({ progress, isExporting }: ExportProgressProps) {
  if (!isExporting) return null;

  return (
    <div className="studio-card">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Rendering audio...</span>
        <span className="text-sm" style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>
          {Math.round(progress)}%
        </span>
      </div>
      <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, var(--accent), var(--accent-glow))`,
          }}
        />
      </div>
    </div>
  );
}
