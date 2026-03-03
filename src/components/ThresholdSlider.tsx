'use client';

interface ThresholdSliderProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export default function ThresholdSlider({ value, onChange, className = '' }: ThresholdSliderProps) {
  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full"
      />
      <div className="flex justify-between mt-2 text-xs" style={{ fontFamily: 'var(--font-body)' }}>
        <span style={{ color: 'var(--awake)' }}>Conscious</span>
        <span style={{ color: 'var(--text-secondary)' }}>Subliminal</span>
      </div>
    </div>
  );
}
