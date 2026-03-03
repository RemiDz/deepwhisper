'use client';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = ['Intention', 'Affirmations', 'Voice', 'Soundscape', 'Duration'];

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="flex flex-col items-center gap-1">
            <div
              className="w-3 h-3 rounded-full transition-all duration-300"
              style={{
                background: i <= currentStep ? 'var(--conscious)' : 'var(--whisper)',
                boxShadow: i === currentStep ? '0 0 12px rgba(196, 161, 255, 0.5)' : 'none',
                transform: i === currentStep ? 'scale(1.3)' : 'scale(1)',
              }}
            />
            <span
              className="text-xs hidden md:block"
              style={{
                color: i <= currentStep ? 'var(--conscious)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-body)',
              }}
            >
              {stepLabels[i]}
            </span>
          </div>
          {i < totalSteps - 1 && (
            <div
              className="w-8 h-px hidden sm:block"
              style={{ background: i < currentStep ? 'var(--conscious)' : 'var(--whisper)' }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
